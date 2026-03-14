// ============================================================
// QuestionGenerator.jsx — React Version
// ============================================================
// HOW TO USE:
// 1. npm create vite@latest my-app -- --template react
// 2. cd my-app && npm install
// 3. Copy this file to src/QuestionGenerator.jsx
// 4. In src/App.jsx: import QuestionGenerator from './QuestionGenerator'
//    and render <QuestionGenerator />
// 5. npm run dev
// ============================================================

import { useState, useCallback } from "react";

// ─── Constants ───────────────────────────────────────────────
const SUBJECTS = [
  { id: "maths",     label: "Maths",               desc: "Arithmetic, Algebra, Geometry" },
  { id: "english",   label: "English",              desc: "Grammar, Comprehension, Writing" },
  { id: "verbal",    label: "Verbal Reasoning",     desc: "Analogies, Sequences, Logic" },
  { id: "nonverbal", label: "Non-Verbal Reasoning", desc: "Patterns, Matrices, Shapes" },
];

const QUESTION_TYPES = [
  { id: "mcq",       label: "MCQ",             desc: "4 options, 1 correct" },
  { id: "truefalse", label: "True / False",    desc: "Binary choice" },
  { id: "fillin",    label: "Fill in the Blank", desc: "Complete the sentence" },
  { id: "short",     label: "Short Answer",    desc: "Brief written response" },
];

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const QT_API_MAP = {
  mcq: "multiple_choice",
  truefalse: "true_false",
  fillin: "fill_in_the_blank",
  short: "short_answer",
};

// ─── API Call ─────────────────────────────────────────────────
async function callClaudeAPI(apiKey, prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  const text = data.content.map((c) => c.text || "").join("");
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

// ─── Prompt Builder ───────────────────────────────────────────
function buildPrompt(subject, difficulty, qtypes, count, grade) {
  return `You are an expert educational question generator for ${subject} (${grade}).
Generate EXACTLY ${count} questions at ${difficulty} difficulty.
Use these types: ${qtypes.join(", ")}.
Return ONLY valid JSON — no markdown, no backticks:
{
  "questions": [{
    "id": "${subject.toLowerCase()}_${difficulty.toLowerCase()}_001",
    "subject": "${subject}",
    "topic": "<specific topic>",
    "difficulty": "${difficulty}",
    "question_type": "<multiple_choice|true_false|fill_in_the_blank|short_answer>",
    "grade_level": "${grade}",
    "question": {
      "text": "<question text>",
      "choices": [{"id":"A","text":"...","correct":false},{"id":"B","text":"...","correct":true},{"id":"C","text":"...","correct":false},{"id":"D","text":"...","correct":false}]
    },
    "correct_answer": "<answer>",
    "explanation": "<explanation>",
    "tags": ["${subject.toLowerCase()}", "${difficulty.toLowerCase()}"],
    "points": ${difficulty === "Easy" ? 1 : difficulty === "Medium" ? 2 : 3}
  }]
}
Note: omit "choices" for true_false, fill_in_the_blank, short_answer types.`;
}

// ─── Main Component ───────────────────────────────────────────
export default function QuestionGenerator() {
  // State
  const [step, setStep] = useState(1); // 1=config, 2=generating, 3=results
  const [apiKey, setApiKey] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState(["maths", "english", "verbal", "nonverbal"]);
  const [selectedTypes, setSelectedTypes] = useState(["mcq", "truefalse", "fillin", "short"]);
  const [counts, setCounts] = useState({ Easy: 20, Medium: 20, Hard: 20 });
  const [grade, setGrade] = useState("Grade 5-6 (Ages 10-12)");
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [questions, setQuestions] = useState([]);
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterDiff, setFilterDiff] = useState("all");

  // Toggle helpers
  const toggleItem = (list, setList, id) =>
    setList((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  // Generation
  const startGeneration = useCallback(async () => {
    if (!apiKey) { alert("Please enter your Anthropic API key."); return; }
    if (!selectedSubjects.length || !selectedTypes.length) {
      alert("Select at least one subject and question type.");
      return;
    }

    setStep(2);
    setProgress(0);
    const allQuestions = [];
    const tasks = selectedSubjects.flatMap((s) =>
      DIFFICULTIES.map((d) => ({ subject: s, difficulty: d }))
    );
    const total = tasks.length;

    for (let i = 0; i < tasks.length; i++) {
      const { subject, difficulty } = tasks[i];
      const subjectLabel = SUBJECTS.find((s) => s.id === subject)?.label || subject;
      setStatusMsg(`Generating ${difficulty} ${subjectLabel} questions…`);

      try {
        const prompt = buildPrompt(
          subjectLabel,
          difficulty,
          selectedTypes.map((t) => QT_API_MAP[t]),
          counts[difficulty],
          grade
        );
        const result = await callClaudeAPI(apiKey, prompt);
        if (result?.questions) {
          allQuestions.push(
            ...result.questions.map((q, idx) => ({
              ...q,
              id: `${subject}_${difficulty.toLowerCase()}_${String(allQuestions.length + idx).padStart(4, "0")}`,
            }))
          );
        }
      } catch (err) {
        console.error(`Failed for ${subject} ${difficulty}:`, err);
      }

      setProgress(Math.round(((i + 1) / total) * 100));
    }

    setQuestions(allQuestions);
    setStep(3);
  }, [apiKey, selectedSubjects, selectedTypes, counts, grade]);

  // Download JSON
  const downloadJSON = () => {
    const output = {
      format: "khan_academy_v1",
      metadata: {
        generated_at: new Date().toISOString(),
        grade_level: grade,
        total_questions: questions.length,
      },
      exercise_bank: questions,
    };
    const blob = new Blob([JSON.stringify(output, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `questions_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  // Filtered questions
  const filtered = questions.filter((q) => {
    if (filterSubject !== "all" && q.subject !== filterSubject) return false;
    if (filterDiff !== "all" && q.difficulty !== filterDiff) return false;
    return true;
  });

  // ─── Render ─────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 4 }}>Question Generator</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>
        Khan Academy-style · 10,000 questions · 4 subjects · 4 formats
      </p>

      {/* ── STEP 1: Configure ── */}
      {step === 1 && (
        <div>
          {/* API Key */}
          <div style={cardStyle}>
            <label style={labelStyle}>Anthropic API Key</label>
            <input
              type="password"
              placeholder="sk-ant-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={inputStyle}
            />
            <p style={{ fontSize: 12, color: "#888", marginTop: 6 }}>
              Get your key at console.anthropic.com — never shared or stored
            </p>
          </div>

          {/* Subjects */}
          <div style={cardStyle}>
            <div style={labelStyle}>Subjects</div>
            <div style={gridStyle}>
              {SUBJECTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => toggleItem(selectedSubjects, setSelectedSubjects, s.id)}
                  style={tagStyle(selectedSubjects.includes(s.id))}
                >
                  <div style={{ fontWeight: 500 }}>{s.label}</div>
                  <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>{s.desc}</div>
                </button>
              ))}
            </div>

            <div style={{ ...labelStyle, marginTop: 16 }}>Question Types</div>
            <div style={gridStyle}>
              {QUESTION_TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => toggleItem(selectedTypes, setSelectedTypes, t.id)}
                  style={tagStyle(selectedTypes.includes(t.id))}
                >
                  <div style={{ fontWeight: 500 }}>{t.label}</div>
                  <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty counts */}
          <div style={cardStyle}>
            <div style={labelStyle}>Questions per subject per difficulty</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {DIFFICULTIES.map((d) => (
                <div key={d} style={diffCardStyle(d)}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
                    {d === "Easy" ? "🟢" : d === "Medium" ? "🟡" : "🔴"} {d}
                  </div>
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={counts[d]}
                    onChange={(e) => setCounts((p) => ({ ...p, [d]: parseInt(e.target.value) || 0 }))}
                    style={{ ...inputStyle, width: 80, padding: "4px 8px", fontSize: 12 }}
                  />
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "#666", marginTop: 10 }}>
              Total: <strong>{Object.values(counts).reduce((a, b) => a + b, 0) * selectedSubjects.length}</strong> questions
            </p>
          </div>

          {/* Grade */}
          <div style={cardStyle}>
            <label style={labelStyle}>Grade Level</label>
            <select value={grade} onChange={(e) => setGrade(e.target.value)} style={inputStyle}>
              <option>Grade 3–4 (Ages 8–10)</option>
              <option>Grade 5–6 (Ages 10–12)</option>
              <option>Grade 7–8 (Ages 12–14)</option>
              <option>Grade 9–10 (Ages 14–16)</option>
            </select>
          </div>

          <button onClick={startGeneration} style={primaryBtnStyle}>
            ⚡ Generate Questions
          </button>
        </div>
      )}

      {/* ── STEP 2: Generating ── */}
      {step === 2 && (
        <div style={cardStyle}>
          <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>Generating…</h2>
          <p style={{ color: "#666", fontSize: 13, marginBottom: 12 }}>{statusMsg}</p>
          <div style={{ height: 6, background: "#eee", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "#111", borderRadius: 4, transition: "width .4s" }} />
          </div>
          <p style={{ fontSize: 13, color: "#888", marginTop: 8 }}>{progress}% · {questions.length} questions so far</p>
        </div>
      )}

      {/* ── STEP 3: Results ── */}
      {step === 3 && (
        <div>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))", gap: 8, marginBottom: 16 }}>
            {[
              ["Total", questions.length],
              ["Easy", questions.filter((q) => q.difficulty === "Easy").length],
              ["Medium", questions.filter((q) => q.difficulty === "Medium").length],
              ["Hard", questions.filter((q) => q.difficulty === "Hard").length],
              ["MCQ", questions.filter((q) => q.question_type === "multiple_choice").length],
              ["True/False", questions.filter((q) => q.question_type === "true_false").length],
            ].map(([label, val]) => (
              <div key={label} style={{ background: "#f7f7f5", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 22, fontWeight: 600 }}>{val.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            {["all", ...SUBJECTS.map((s) => s.label)].map((s) => (
              <button key={s} onClick={() => setFilterSubject(s)} style={filterBtnStyle(filterSubject === s)}>
                {s === "all" ? "All Subjects" : s}
              </button>
            ))}
            <span style={{ color: "#ccc", padding: "0 4px" }}>|</span>
            {["all", ...DIFFICULTIES].map((d) => (
              <button key={d} onClick={() => setFilterDiff(d)} style={filterBtnStyle(filterDiff === d)}>
                {d === "all" ? "All Levels" : d}
              </button>
            ))}
          </div>

          {/* Question list */}
          <div style={cardStyle}>
            {filtered.slice(0, 20).map((q) => (
              <div key={q.id} style={{ padding: "12px 0", borderBottom: "0.5px solid #eee" }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                  <span style={{ flex: 1, fontWeight: 500, fontSize: 13 }}>{q.question.text}</span>
                  <span style={{ ...badgeStyle, ...diffBadge(q.difficulty) }}>{q.difficulty}</span>
                  <span style={{ fontSize: 10, color: "#aaa", whiteSpace: "nowrap" }}>
                    {q.question_type.replace(/_/g, " ")}
                  </span>
                </div>
                {q.question.choices && (
                  <div style={{ fontSize: 12, color: "#666", paddingLeft: 4 }}>
                    {q.question.choices.map((c) => `${c.id}) ${c.text}${c.correct ? " ✓" : ""}`).join("  ·  ")}
                  </div>
                )}
                <div style={{ fontSize: 12, marginTop: 4 }}>
                  Answer: <strong style={{ color: "#3b6d11" }}>{q.correct_answer}</strong>
                </div>
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 2, fontStyle: "italic" }}>
                  {q.explanation}
                </div>
              </div>
            ))}
            {filtered.length > 20 && (
              <p style={{ textAlign: "center", fontSize: 12, color: "#aaa", padding: 10 }}>
                Showing 20 of {filtered.length.toLocaleString()} questions. Download JSON for full set.
              </p>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button onClick={downloadJSON} style={primaryBtnStyle}>⬇ Download JSON</button>
            <button onClick={() => setStep(1)} style={secondaryBtnStyle}>← Reconfigure</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────
const cardStyle = { background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 10, padding: "1.25rem", marginBottom: "1rem" };
const labelStyle = { fontSize: 12, fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: ".5px", display: "block", marginBottom: 8 };
const inputStyle = { padding: "7px 10px", border: "0.5px solid #ccc", borderRadius: 6, fontSize: 13, width: "100%", fontFamily: "inherit", boxSizing: "border-box" };
const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))", gap: 8 };
const tagStyle = (sel) => ({
  padding: "10px 12px", border: sel ? "none" : "0.5px solid #e0e0e0",
  borderRadius: 8, fontSize: 13, cursor: "pointer", textAlign: "left",
  background: sel ? "#111" : "#fff", color: sel ? "#fff" : "#111", transition: "all .15s",
});
const diffCardStyle = (d) => ({
  border: "0.5px solid " + (d === "Easy" ? "#97c459" : d === "Medium" ? "#ef9f27" : "#e24b4a"),
  borderRadius: 8, padding: 12,
  background: d === "Easy" ? "#eaf3de" : d === "Medium" ? "#faeeda" : "#fcebeb",
});
const primaryBtnStyle = { padding: "9px 20px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", border: "none", background: "#111", color: "#fff" };
const secondaryBtnStyle = { padding: "9px 20px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", border: "0.5px solid #ccc", background: "#fff", color: "#111" };
const filterBtnStyle = (active) => ({
  padding: "4px 12px", borderRadius: 14, fontSize: 12, cursor: "pointer",
  border: active ? "none" : "0.5px solid #e0e0e0",
  background: active ? "#111" : "#fff", color: active ? "#fff" : "#666",
});
const badgeStyle = { display: "inline-block", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 500, whiteSpace: "nowrap" };
const diffBadge = (d) => d === "Easy"
  ? { background: "#eaf3de", color: "#3b6d11" }
  : d === "Medium" ? { background: "#faeeda", color: "#854f0b" }
  : { background: "#fcebeb", color: "#791f1f" };
