# QuestionGenerator

AI-powered question generator for educational apps. Generates 10,000 Khan Academy-style questions across Maths, English, Verbal and Non-Verbal Reasoning.

## 🔗 Live Tool
👉 **https://rsri24.github.io/QuestionGenerator/**

Open the link in any browser — no installation needed to use the tool.

---

## 📦 What's in this repo

| File | Purpose |
|------|---------|
| `index.html` | Standalone tool — works in any browser |
| `QuestionGenerator.jsx` | React component — embed in your React app |
| `server.js` | Node.js backend — secure API with hidden key |
| `.env.example` | Environment variable template |

---

## ✨ Features

- **4 Subjects** — Maths, English, Verbal Reasoning, Non-Verbal Reasoning
- **4 Question Types** — MCQ, True/False, Fill in the Blank, Short Answer
- **3 Difficulty Levels** — Easy, Medium, Hard
- **10,000 questions** in a single run
- **Khan Academy v1 JSON format** — ready to import into your app
- **Downloadable JSON** with full explanations and answer keys

---

## 🚀 Quick Start (3 options)

### Option 1 — Use the live tool (no setup)
Open https://rsri24.github.io/QuestionGenerator/ in your browser.

### Option 2 — React component
```bash
# In your existing React project
npm install
# Copy QuestionGenerator.jsx to your src/ folder
```

```jsx
// In your App.jsx
import QuestionGenerator from './QuestionGenerator';

export default function App() {
  return <QuestionGenerator />;
}
```

### Option 3 — Node.js backend (recommended for production)
```bash
git clone https://github.com/rsri24/QuestionGenerator.git
cd QuestionGenerator
npm install express cors dotenv @anthropic-ai/sdk
cp .env.example .env
# Edit .env and add your Anthropic API key
node server.js
```

Server runs at `http://localhost:3001`

---

## 🔌 API Endpoints (Node.js server)

### Generate a batch of questions
```
POST /api/generate
```
```json
{
  "subject": "Maths",
  "difficulty": "Medium",
  "questionTypes": ["multiple_choice", "fill_in_the_blank"],
  "count": 10,
  "grade": "Grade 5-6 (Ages 10-12)"
}
```

### Generate 10,000 questions (bulk)
```
POST /api/generate/bulk
```
```json
{
  "subjects": ["Maths", "English", "Verbal Reasoning", "Non-Verbal Reasoning"],
  "difficulties": ["Easy", "Medium", "Hard"],
  "countPerBatch": 10,
  "grade": "Grade 5-6 (Ages 10-12)"
}
```

### Get JSON schema
```
GET /api/schema
```

---

## 📋 JSON Output Format (Khan Academy v1)

```json
{
  "format": "khan_academy_v1",
  "metadata": {
    "generated_at": "2025-03-14T10:00:00Z",
    "grade_level": "Grade 5-6 (Ages 10-12)",
    "total_questions": 10000
  },
  "exercise_bank": [
    {
      "id": "maths_easy_0001",
      "subject": "Maths",
      "topic": "Arithmetic",
      "difficulty": "Easy",
      "question_type": "multiple_choice",
      "grade_level": "Grade 5-6 (Ages 10-12)",
      "question": {
        "text": "What is 8 × 7?",
        "choices": [
          { "id": "A", "text": "54", "correct": false },
          { "id": "B", "text": "56", "correct": true },
          { "id": "C", "text": "58", "correct": false },
          { "id": "D", "text": "64", "correct": false }
        ]
      },
      "correct_answer": "56",
      "explanation": "8 × 7 = 56",
      "tags": ["maths", "easy", "multiple_choice"],
      "points": 1
    }
  ]
}
```

---

## 🔑 API Key Setup

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an account and generate an API key
3. For the HTML tool — enter it in the tool's API key field
4. For the Node.js server — add it to your `.env` file:
   ```
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```

> ⚠️ Never commit your `.env` file or share your API key publicly.

---

## 🗄️ Database Schema (SQL)

```sql
CREATE TABLE questions (
  id            VARCHAR(64) PRIMARY KEY,
  subject       ENUM('Maths','English','Verbal Reasoning','Non-Verbal Reasoning'),
  topic         VARCHAR(128),
  difficulty    ENUM('Easy','Medium','Hard'),
  question_type ENUM('multiple_choice','true_false','fill_in_the_blank','short_answer'),
  grade_level   VARCHAR(32),
  question_text TEXT NOT NULL,
  choices       JSON,
  correct_answer VARCHAR(512),
  explanation   TEXT,
  tags          JSON,
  points        TINYINT DEFAULT 1,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📱 Calling the API from your app

```javascript
// From your frontend or mobile app
const response = await fetch('https://your-server.com/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    subject: 'Maths',
    difficulty: 'Easy',
    count: 10,
    grade: 'Grade 5-6 (Ages 10-12)'
  })
});
const data = await response.json();
console.log(data.questions); // Array of question objects
```

---

## 🛠️ Tech Stack

- **AI** — Claude (Anthropic) via `claude-sonnet-4-20250514`
- **Frontend** — Vanilla HTML/CSS/JS or React
- **Backend** — Node.js + Express
- **Output format** — Khan Academy v1 JSON

---

## 📄 License

MIT — free to use, modify, and distribute.
