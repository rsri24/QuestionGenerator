// ============================================================
// server.js — Node.js Backend Version
// ============================================================
// HOW TO USE:
// 1. mkdir question-generator-backend && cd question-generator-backend
// 2. npm init -y
// 3. npm install express cors dotenv @anthropic-ai/sdk
// 4. Create .env file with: ANTHROPIC_API_KEY=sk-ant-your-key-here
// 5. Copy this file as server.js
// 6. node server.js
// API runs at http://localhost:3001
// ============================================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk");

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({ origin: "*" })); // Lock down to your domain in production
app.use(express.json());

// ─── Anthropic Client ─────────────────────────────────────────
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // Key stays on server — never exposed
});

// ─── Prompt Builder ───────────────────────────────────────────
function buildPrompt(subject, difficulty, questionTypes, count, grade) {
  return `You are an expert educational question generator for ${subject} (${grade}).
Generate EXACTLY ${count} questions at ${difficulty} difficulty.
Distribute across these types: ${questionTypes.join(", ")}.
Return ONLY valid JSON — no markdown, no backticks:
{
  "questions": [{
    "id": "${subject.toLowerCase()}_${difficulty.toLowerCase()}_001",
    "subject": "${subject}",
    "topic": "<specific topic within ${subject}>",
    "difficulty": "${difficulty}",
    "question_type": "<multiple_choice|true_false|fill_in_the_blank|short_answer>",
    "grade_level": "${grade}",
    "question": {
      "text": "<question text>",
      "choices": [
        {"id":"A","text":"<option>","correct":false},
        {"id":"B","text":"<correct option>","correct":true},
        {"id":"C","text":"<option>","correct":false},
        {"id":"D","text":"<option>","correct":false}
      ]
    },
    "correct_answer": "<answer>",
    "explanation": "<clear explanation>",
    "tags": ["${subject.toLowerCase()}", "${difficulty.toLowerCase()}", "<topic>"],
    "points": ${difficulty === "Easy" ? 1 : difficulty === "Medium" ? 2 : 3},
    "metadata": { "source": "AI-generated", "created_at": "${new Date().toISOString()}" }
  }]
}
Note: omit "choices" for true_false, fill_in_the_blank, and short_answer types.`;
}

// ============================================================
// ROUTES
// ============================================================

// ─── Health check ─────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "QuestionGenerator API",
    version: "2.0",
    endpoints: [
      "POST /api/generate          — generate a batch of questions",
      "POST /api/generate/bulk     — generate 10,000 questions",
      "GET  /api/schema            — get the JSON schema",
      "GET  /api/health            — health check",
    ],
  });
});

// ─── Generate a single batch ──────────────────────────────────
// POST /api/generate
// Body: { subject, difficulty, questionTypes, count, grade }
app.post("/api/generate", async (req, res) => {
  const {
    subject = "Maths",
    difficulty = "Medium",
    questionTypes = ["multiple_choice", "true_false", "fill_in_the_blank", "short_answer"],
    count = 10,
    grade = "Grade 5-6 (Ages 10-12)",
  } = req.body;

  // Validation
  const validSubjects = ["Maths", "English", "Verbal Reasoning", "Non-Verbal Reasoning"];
  const validDifficulties = ["Easy", "Medium", "Hard"];

  if (!validSubjects.includes(subject)) {
    return res.status(400).json({ error: `Invalid subject. Must be one of: ${validSubjects.join(", ")}` });
  }
  if (!validDifficulties.includes(difficulty)) {
    return res.status(400).json({ error: `Invalid difficulty. Must be: Easy, Medium, or Hard` });
  }
  if (count < 1 || count > 100) {
    return res.status(400).json({ error: "Count must be between 1 and 100 per request" });
  }

  try {
    const prompt = buildPrompt(subject, difficulty, questionTypes, count, grade);

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content.map((c) => c.text || "").join("");
    const clean = text.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);

    res.json({
      success: true,
      subject,
      difficulty,
      count: result.questions.length,
      questions: result.questions,
    });
  } catch (err) {
    console.error("Generation error:", err.message);
    res.status(500).json({ error: "Failed to generate questions", details: err.message });
  }
});

// ─── Bulk generate (10,000 questions) ────────────────────────
// POST /api/generate/bulk
// Body: { subjects, difficulties, questionTypes, countPerBatch, grade }
// Returns a streaming JSON response or chunked results
app.post("/api/generate/bulk", async (req, res) => {
  const {
    subjects = ["Maths", "English", "Verbal Reasoning", "Non-Verbal Reasoning"],
    difficulties = ["Easy", "Medium", "Hard"],
    questionTypes = ["multiple_choice", "true_false", "fill_in_the_blank", "short_answer"],
    countPerBatch = 10,
    grade = "Grade 5-6 (Ages 10-12)",
  } = req.body;

  const allQuestions = [];
  const errors = [];
  const tasks = subjects.flatMap((s) => difficulties.map((d) => ({ subject: s, difficulty: d })));

  console.log(`Starting bulk generation: ${tasks.length} batches × ${countPerBatch} questions`);

  for (const { subject, difficulty } of tasks) {
    try {
      const prompt = buildPrompt(subject, difficulty, questionTypes, countPerBatch, grade);

      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      });

      const text = message.content.map((c) => c.text || "").join("");
      const clean = text.replace(/```json|```/g, "").trim();
      const result = JSON.parse(clean);

      const tagged = result.questions.map((q, i) => ({
        ...q,
        id: `${subject.toLowerCase().replace(/\s+/g, "_")}_${difficulty.toLowerCase()}_${String(allQuestions.length + i).padStart(4, "0")}`,
        metadata: { source: "AI-generated", created_at: new Date().toISOString() },
      }));

      allQuestions.push(...tagged);
      console.log(`✓ ${subject} ${difficulty}: ${tagged.length} questions (total: ${allQuestions.length})`);

    } catch (err) {
      console.error(`✗ ${subject} ${difficulty}: ${err.message}`);
      errors.push({ subject, difficulty, error: err.message });
    }

    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 200));
  }

  res.json({
    success: true,
    format: "khan_academy_v1",
    metadata: {
      generated_at: new Date().toISOString(),
      grade_level: grade,
      total_questions: allQuestions.length,
      subjects,
      question_types: questionTypes,
      errors: errors.length > 0 ? errors : undefined,
    },
    exercise_bank: allQuestions,
  });
});

// ─── Get JSON schema ──────────────────────────────────────────
app.get("/api/schema", (req, res) => {
  res.json({
    format: "khan_academy_v1",
    description: "Schema for questions generated by QuestionGenerator",
    exercise_bank_item: {
      id: "string — subject_difficulty_index e.g. maths_easy_0001",
      subject: "Maths | English | Verbal Reasoning | Non-Verbal Reasoning",
      topic: "string — specific topic within subject",
      difficulty: "Easy | Medium | Hard",
      question_type: "multiple_choice | true_false | fill_in_the_blank | short_answer",
      grade_level: "string",
      question: {
        text: "string — question text, uses ___ for fill-in-blank",
        choices: "[{id, text, correct}] — only for multiple_choice",
      },
      correct_answer: "string",
      explanation: "string — detailed explanation",
      tags: "string[]",
      points: "1 (Easy) | 2 (Medium) | 3 (Hard)",
      metadata: { source: "string", created_at: "ISO timestamp" },
    },
  });
});

// ─── Health ────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Start server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅ QuestionGenerator API running at http://localhost:${PORT}`);
  console.log(`\nEndpoints:`);
  console.log(`  GET  http://localhost:${PORT}/`);
  console.log(`  POST http://localhost:${PORT}/api/generate`);
  console.log(`  POST http://localhost:${PORT}/api/generate/bulk`);
  console.log(`  GET  http://localhost:${PORT}/api/schema`);
  console.log(`\nExample request:`);
  console.log(`  curl -X POST http://localhost:${PORT}/api/generate \\`);
  console.log(`    -H "Content-Type: application/json" \\`);
  console.log(`    -d '{"subject":"Maths","difficulty":"Easy","count":5}'`);
});

// ============================================================
// HOW YOUR APP CALLS THIS SERVER
// ============================================================
//
// From your React/Vue/Angular frontend:
//
//   const res = await fetch('http://localhost:3001/api/generate', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       subject: 'Maths',
//       difficulty: 'Medium',
//       questionTypes: ['multiple_choice', 'fill_in_the_blank'],
//       count: 10,
//       grade: 'Grade 5-6 (Ages 10-12)'
//     })
//   });
//   const data = await res.json();
//   console.log(data.questions); // Array of question objects
//
// For bulk 10,000 questions:
//
//   const res = await fetch('http://localhost:3001/api/generate/bulk', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       subjects: ['Maths', 'English', 'Verbal Reasoning', 'Non-Verbal Reasoning'],
//       difficulties: ['Easy', 'Medium', 'Hard'],
//       countPerBatch: 10,
//       grade: 'Grade 5-6 (Ages 10-12)'
//     })
//   });
//   const data = await res.json();
//   // data.exercise_bank contains all questions
//   // data.metadata.total_questions shows the count
// ============================================================
