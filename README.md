<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Question Generator — Khan Academy Style</title>
<style>
  :root {
    --bg: #ffffff; --bg2: #f7f7f5; --bg3: #f0ede8;
    --text: #1a1a18; --text2: #5a5a56; --text3: #8a8a84;
    --border: rgba(0,0,0,0.1); --border2: rgba(0,0,0,0.18);
    --green: #3b6d11; --green-bg: #eaf3de; --green-bd: #97c459;
    --amber: #854f0b; --amber-bg: #faeeda; --amber-bd: #ef9f27;
    --red: #791f1f; --red-bg: #fcebeb; --red-bd: #e24b4a;
    --blue: #0c447c; --blue-bg: #e6f1fb; --blue-bd: #378add;
    --accent: #1a1a18; --radius: 10px; --radius-sm: 6px;
    --font: 'Segoe UI', system-ui, sans-serif; --mono: 'Cascadia Code','Fira Code',monospace;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #1c1c1a; --bg2: #252523; --bg3: #2e2e2b;
      --text: #e8e6e0; --text2: #a8a6a0; --text3: #6a6a64;
      --border: rgba(255,255,255,0.1); --border2: rgba(255,255,255,0.18);
      --green: #c0dd97; --green-bg: #173404; --green-bd: #3b6d11;
      --amber: #fac775; --amber-bg: #412402; --amber-bd: #854f0b;
      --red: #f7c1c1; --red-bg: #501313; --red-bd: #a32d2d;
      --blue: #b5d4f4; --blue-bg: #042c53; --blue-bd: #185fa5;
      --accent: #e8e6e0;
    }
  }
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:var(--font);background:var(--bg);color:var(--text);min-height:100vh;font-size:14px;line-height:1.5}
  a{color:var(--blue)}

  /* Layout */
  .sidebar{position:fixed;top:0;left:0;width:220px;height:100vh;background:var(--bg2);border-right:0.5px solid var(--border);padding:1.5rem 1rem;display:flex;flex-direction:column;gap:4px;z-index:100}
  .main{margin-left:220px;padding:2rem 2.5rem;max-width:980px}
  .logo{font-size:15px;font-weight:600;margin-bottom:1.5rem;padding-bottom:1rem;border-bottom:0.5px solid var(--border)}
  .logo span{font-size:11px;font-weight:400;color:var(--text3);display:block;margin-top:2px}

  .nav-item{padding:7px 12px;border-radius:var(--radius-sm);font-size:13px;cursor:pointer;color:var(--text2);transition:all .15s;display:flex;align-items:center;gap:8px}
  .nav-item:hover{background:var(--bg3);color:var(--text)}
  .nav-item.active{background:var(--accent);color:var(--bg);font-weight:500}
  .nav-item .ni{font-size:15px}
  .nav-section{font-size:10px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.8px;padding:8px 12px 4px}

  /* Panels */
  .panel{display:none}.panel.active{display:block}
  .page-title{font-size:22px;font-weight:600;margin-bottom:4px}
  .page-sub{font-size:13px;color:var(--text2);margin-bottom:1.5rem}

  /* Cards */
  .card{background:var(--bg);border:0.5px solid var(--border);border-radius:var(--radius);padding:1.25rem;margin-bottom:1rem}
  .card-title{font-size:13px;font-weight:600;margin-bottom:1rem;color:var(--text)}
  .surface{background:var(--bg2);border-radius:var(--radius-sm);padding:1rem}

  /* Buttons */
  .btn{padding:8px 18px;border-radius:var(--radius-sm);font-size:13px;font-weight:500;cursor:pointer;border:0.5px solid var(--border2);background:var(--bg);color:var(--text);transition:all .15s;font-family:var(--font)}
  .btn:hover{background:var(--bg2)}
  .btn-primary{background:var(--accent);color:var(--bg);border-color:transparent}
  .btn-primary:hover{opacity:.85}
  .btn-primary:disabled{opacity:.35;cursor:not-allowed}
  .btn-sm{padding:5px 12px;font-size:12px}
  .btn-ghost{border-color:transparent;background:transparent}
  .btn-ghost:hover{background:var(--bg2)}

  /* Form elements */
  select,input[type=number],input[type=text]{padding:7px 10px;border:0.5px solid var(--border2);border-radius:var(--radius-sm);font-size:13px;background:var(--bg);color:var(--text);font-family:var(--font);width:100%}
  select:focus,input:focus{outline:none;border-color:var(--accent)}
  label{font-size:12px;font-weight:500;color:var(--text2);display:block;margin-bottom:4px}

  /* Tags */
  .tag-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px;margin-bottom:1.25rem}
  .tag-btn{padding:10px 12px;border:0.5px solid var(--border);border-radius:var(--radius-sm);font-size:13px;cursor:pointer;background:var(--bg);color:var(--text);text-align:left;transition:all .15s}
  .tag-btn:hover{border-color:var(--border2)}
  .tag-btn.sel{background:var(--accent);color:var(--bg);border-color:transparent}
  .tag-btn .sub{font-size:11px;opacity:.6;margin-top:3px}

  /* Difficulty cards */
  .diff-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:1.25rem}
  .diff-card{border:0.5px solid var(--border);border-radius:var(--radius-sm);padding:12px;cursor:pointer;transition:all .15s}
  .diff-card.sel-easy{background:var(--green-bg);border-color:var(--green-bd)}
  .diff-card.sel-medium{background:var(--amber-bg);border-color:var(--amber-bd)}
  .diff-card.sel-hard{background:var(--red-bg);border-color:var(--red-bd)}
  .diff-card .dt{font-size:13px;font-weight:600}
  .diff-card .ds{font-size:11px;opacity:.65;margin-top:2px;margin-bottom:8px}
  .diff-card input{width:72px;padding:4px 8px;font-size:12px}

  /* Progress */
  .progress-bar{height:5px;background:var(--bg3);border-radius:4px;overflow:hidden;margin:8px 0}
  .progress-fill{height:100%;background:var(--accent);border-radius:4px;transition:width .4s ease}
  .log-item{font-size:12px;color:var(--text2);padding:4px 0;border-bottom:0.5px solid var(--border);display:flex;gap:8px;align-items:center}
  .log-item .ck{color:var(--green)}

  /* Stats */
  .stats-row{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px;margin-bottom:1.25rem}
  .stat{background:var(--bg2);border-radius:var(--radius-sm);padding:12px}
  .stat .sv{font-size:24px;font-weight:600;line-height:1}
  .stat .sl{font-size:11px;color:var(--text3);margin-top:3px}

  /* Badges */
  .badge{display:inline-block;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:500}
  .badge-easy{background:var(--green-bg);color:var(--green)}
  .badge-med{background:var(--amber-bg);color:var(--amber)}
  .badge-hard{background:var(--red-bg);color:var(--red)}
  .badge-blue{background:var(--blue-bg);color:var(--blue)}

  /* Tabs */
  .tabs{display:flex;gap:4px;border-bottom:0.5px solid var(--border);padding-bottom:8px;margin-bottom:1rem}
  .tab{padding:5px 14px;border-radius:var(--radius-sm);font-size:13px;cursor:pointer;color:var(--text2);transition:all .15s}
  .tab.active{background:var(--bg2);color:var(--text);font-weight:500}

  /* Filters */
  .filter-row{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:1rem;align-items:center}
  .filter-btn{padding:4px 12px;border-radius:14px;font-size:12px;border:0.5px solid var(--border);cursor:pointer;background:var(--bg);color:var(--text2);transition:all .15s}
  .filter-btn:hover{border-color:var(--border2);color:var(--text)}
  .filter-btn.act{background:var(--accent);color:var(--bg);border-color:transparent}
  .filter-sep{color:var(--text3);font-size:12px;padding:0 2px}

  /* Q list */
  .q-list{max-height:420px;overflow-y:auto}
  .q-item{padding:12px 0;border-bottom:0.5px solid var(--border)}
  .q-item:last-child{border-bottom:none}
  .q-top{display:flex;align-items:flex-start;gap:8px;margin-bottom:5px}
  .q-text{font-size:13px;font-weight:500;flex:1;line-height:1.5}
  .q-meta{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
  .q-opts{font-size:12px;color:var(--text2);margin:4px 0;padding-left:4px}
  .q-ans{font-size:12px;margin-top:4px;color:var(--text2)}
  .q-ans strong{color:var(--green)}
  .q-exp{font-size:11px;color:var(--text3);margin-top:3px;font-style:italic}

  /* JSON output */
  .json-out{background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius-sm);padding:1rem;font-family:var(--mono);font-size:11px;line-height:1.7;max-height:400px;overflow-y:auto;white-space:pre-wrap;word-break:break-all}

  /* Integration guide */
  .code-block{background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius-sm);padding:1rem;font-family:var(--mono);font-size:12px;line-height:1.7;overflow-x:auto;white-space:pre;margin:8px 0}
  .guide-section{margin-bottom:1.5rem}
  .guide-section h3{font-size:14px;font-weight:600;margin-bottom:6px}
  .guide-section p{font-size:13px;color:var(--text2);margin-bottom:6px;line-height:1.6}
  .endpoint-pill{display:inline-flex;align-items:center;gap:8px;background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius-sm);padding:8px 14px;font-family:var(--mono);font-size:12px;margin-bottom:8px}
  .method{padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;background:var(--green-bg);color:var(--green)}

  /* Drop zone */
  .drop-zone{border:1.5px dashed var(--border2);border-radius:var(--radius);padding:2.5rem;text-align:center;cursor:pointer;transition:all .2s;background:var(--bg2)}
  .drop-zone:hover,.drop-zone.over{border-color:var(--accent);background:var(--bg3)}
  .drop-zone h3{font-size:15px;font-weight:600;margin-bottom:6px}
  .drop-zone p{font-size:12px;color:var(--text2)}

  /* Rows */
  .row{display:flex;gap:12px;flex-wrap:wrap}
  .col{flex:1;min-width:130px}
  .flex-end{display:flex;justify-content:flex-end;gap:8px;margin-top:1rem}
  .flex-between{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px}

  /* Alert */
  .alert{padding:10px 14px;border-radius:var(--radius-sm);font-size:12px;margin-bottom:1rem;line-height:1.6}
  .alert-info{background:var(--blue-bg);color:var(--blue);border:0.5px solid var(--blue-bd)}
  .alert-success{background:var(--green-bg);color:var(--green);border:0.5px solid var(--green-bd)}
  .alert-warn{background:var(--amber-bg);color:var(--amber);border:0.5px solid var(--amber-bd)}

  /* File list */
  .file-list{margin-top:10px;max-height:160px;overflow-y:auto}
  .file-item{display:flex;align-items:center;gap:8px;padding:6px 10px;background:var(--bg2);border-radius:6px;margin-bottom:4px;font-size:12px}
  .file-item .fname{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

  /* Scrollbar */
  ::-webkit-scrollbar{width:4px;height:4px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}

  @media(max-width:680px){
    .sidebar{display:none}.main{margin-left:0;padding:1rem}
    .diff-row{grid-template-columns:1fr}
  }
</style>
</head>
<body>

<!-- SIDEBAR -->
<nav class="sidebar">
  <div class="logo">📚 QuestionGen<span>Khan Academy Style · v2.0</span></div>
  <div class="nav-section">Workflow</div>
  <div class="nav-item active" id="nav-upload" onclick="showPanel('upload')"><span class="ni">📂</span>Upload PDFs</div>
  <div class="nav-item" id="nav-config" onclick="showPanel('config')"><span class="ni">⚙️</span>Configure</div>
  <div class="nav-item" id="nav-generate" onclick="showPanel('generate')"><span class="ni">⚡</span>Generate</div>
  <div class="nav-item" id="nav-results" onclick="showPanel('results')"><span class="ni">📊</span>Results</div>
  <div class="nav-section" style="margin-top:1rem">Developers</div>
  <div class="nav-item" id="nav-api" onclick="showPanel('api')"><span class="ni">🔌</span>API Integration</div>
  <div class="nav-item" id="nav-schema" onclick="showPanel('schema')"><span class="ni">📋</span>JSON Schema</div>
  <div style="margin-top:auto;padding-top:1rem;border-top:0.5px solid var(--border)">
    <div style="font-size:11px;color:var(--text3);padding:4px 12px">
      Questions generated: <strong id="sideTotal" style="color:var(--text)">0</strong><br/>
      Formats: <strong style="color:var(--text)">4</strong> (MCQ, T/F, FIB, SA)<br/>
      Subjects: <strong style="color:var(--text)">4</strong>
    </div>
  </div>
</nav>

<!-- MAIN -->
<main class="main">

  <!-- UPLOAD -->
  <div class="panel active" id="panel-upload">
    <div class="page-title">Upload PDF Question Banks</div>
    <div class="page-sub">Upload up to 200+ PDFs containing existing questions and answers. The AI will extract patterns and generate thousands of new questions.</div>

    <div class="card">
      <div class="drop-zone" id="dropZone" onclick="document.getElementById('fi').click()" ondragover="dOver(event)" ondragleave="dLeave(event)" ondrop="dDrop(event)">
        <div style="font-size:36px;margin-bottom:10px">📄</div>
        <h3>Drop your PDF files here</h3>
        <p>Supports bulk upload · Maths, English, Verbal & Non-Verbal Reasoning</p>
        <p style="margin-top:8px;font-size:11px;color:var(--text3)">Click to browse or drag and drop · Max 200+ files</p>
        <input type="file" id="fi" multiple accept=".pdf" style="display:none" onchange="handleFiles(this.files)">
      </div>
      <div class="file-list" id="fileList"></div>
    </div>

    <div class="alert alert-info">
      💡 <strong>Tip:</strong> The AI reads question patterns, topic coverage, and difficulty distribution from your PDFs to generate contextually accurate new questions. More PDFs = better quality output.
    </div>

    <div class="flex-between">
      <span id="fileCount" style="font-size:13px;color:var(--text2)">No files selected — or continue with AI-only generation</span>
      <button class="btn btn-primary" onclick="showPanel('config')">Continue to Configure →</button>
    </div>
  </div>

  <!-- CONFIG -->
  <div class="panel" id="panel-config">
    <div class="page-title">Configure Generation</div>
    <div class="page-sub">Select subjects, question types, difficulty levels, and how many questions to generate.</div>

    <div class="card">
      <div class="card-title">Subjects (select all that apply)</div>
      <div class="tag-grid" id="subjectGrid">
        <div class="tag-btn sel" data-val="maths" onclick="toggleTag(this)">📐 Maths<div class="sub">Arithmetic, Algebra, Geometry, Statistics</div></div>
        <div class="tag-btn sel" data-val="english" onclick="toggleTag(this)">📖 English<div class="sub">Grammar, Comprehension, Vocabulary, Writing</div></div>
        <div class="tag-btn sel" data-val="verbal" onclick="toggleTag(this)">🔤 Verbal Reasoning<div class="sub">Analogies, Sequences, Logic, Word Problems</div></div>
        <div class="tag-btn sel" data-val="nonverbal" onclick="toggleTag(this)">🔷 Non-Verbal Reasoning<div class="sub">Patterns, Matrices, Shapes, Spatial Reasoning</div></div>
      </div>

      <div class="card-title">Question Types (select all that apply)</div>
      <div class="tag-grid" id="qtGrid">
        <div class="tag-btn sel" data-val="mcq" onclick="toggleTag(this)">✅ MCQ<div class="sub">4 options, 1 correct answer</div></div>
        <div class="tag-btn sel" data-val="truefalse" onclick="toggleTag(this)">⚖️ True / False<div class="sub">Binary choice with explanation</div></div>
        <div class="tag-btn sel" data-val="fillin" onclick="toggleTag(this)">✏️ Fill in the Blank<div class="sub">Complete the sentence/equation</div></div>
        <div class="tag-btn sel" data-val="short" onclick="toggleTag(this)">💬 Short Answer<div class="sub">Brief written response, marked answer</div></div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Difficulty Levels & Question Count</div>
      <div class="diff-row">
        <div class="diff-card sel-easy" id="dc-easy">
          <div class="dt">🟢 Easy</div>
          <div class="ds">Foundational — recall and recognition</div>
          <label>Count per subject</label>
          <input type="number" id="cnt-easy" min="1" max="1000" value="834" onclick="updateTotal()">
        </div>
        <div class="diff-card sel-medium" id="dc-medium">
          <div class="dt">🟡 Medium</div>
          <div class="ds">Applied — understanding and analysis</div>
          <label>Count per subject</label>
          <input type="number" id="cnt-medium" min="1" max="1000" value="833" onclick="updateTotal()">
        </div>
        <div class="diff-card sel-hard" id="dc-hard">
          <div class="dt">🔴 Hard</div>
          <div class="ds">Advanced — synthesis and evaluation</div>
          <label>Count per subject</label>
          <input type="number" id="cnt-hard" min="1" max="1000" value="833" onclick="updateTotal()">
        </div>
      </div>
      <div class="alert alert-success" id="totalAlert">
        ✅ Estimated total: <strong id="totalEst">10,000</strong> questions across 4 subjects × 4 formats × 3 difficulty levels
      </div>

      <div class="row">
        <div class="col">
          <label>Grade Level</label>
          <select id="gradeLevel">
            <option>Grade 3–4 (Ages 8–10)</option>
            <option selected>Grade 5–6 (Ages 10–12)</option>
            <option>Grade 7–8 (Ages 12–14)</option>
            <option>Grade 9–10 (Ages 14–16)</option>
          </select>
        </div>
        <div class="col">
          <label>Language</label>
          <select id="lang">
            <option selected>English</option>
            <option>Hindi</option>
            <option>Tamil</option>
          </select>
        </div>
        <div class="col">
          <label>Output Format</label>
          <select id="jsonFmt">
            <option selected>Khan Academy style</option>
            <option>Flat array</option>
            <option>Grouped by subject</option>
          </select>
        </div>
        <div class="col">
          <label>Batch Size (per API call)</label>
          <select id="batchSize">
            <option>5 questions</option>
            <option selected>10 questions</option>
            <option>20 questions</option>
          </select>
        </div>
      </div>
    </div>

    <div class="flex-end">
      <button class="btn" onclick="showPanel('upload')">← Back</button>
      <button class="btn btn-primary" onclick="startGeneration()">⚡ Start AI Generation →</button>
    </div>
  </div>

  <!-- GENERATE -->
  <div class="panel" id="panel-generate">
    <div class="page-title">Generating Questions</div>
    <div class="page-sub" id="genSub">Using Claude AI to create unique, curriculum-aligned questions…</div>

    <div class="card">
      <div class="flex-between" style="margin-bottom:12px">
        <div>
          <div style="font-size:13px;font-weight:500" id="genStatus">Initialising…</div>
          <div style="font-size:12px;color:var(--text3)" id="genCount">0 questions generated</div>
        </div>
        <div id="genPct" style="font-size:22px;font-weight:600">0%</div>
      </div>
      <div class="progress-bar"><div class="progress-fill" id="progFill" style="width:0%"></div></div>
      <div style="margin-top:1rem;max-height:300px;overflow-y:auto" id="genLog"></div>
    </div>

    <div class="card" id="previewCard" style="display:none">
      <div class="card-title">Live Preview — Latest Generated Questions</div>
      <div id="livePreview"></div>
    </div>

    <div class="flex-end">
      <button class="btn" id="cancelBtn" onclick="cancelGeneration()">Cancel</button>
    </div>
  </div>

  <!-- RESULTS -->
  <div class="panel" id="panel-results">
    <div class="page-title">Generated Questions</div>
    <div class="page-sub">Browse, filter, copy or download your questions in Khan Academy-compatible JSON format.</div>

    <div class="stats-row" id="statsGrid"></div>

    <div class="card">
      <div class="flex-between" style="margin-bottom:12px">
        <div class="tabs" id="outTabs">
          <div class="tab active" onclick="switchTab('preview',this)">Preview</div>
          <div class="tab" onclick="switchTab('json',this)">Full JSON</div>
          <div class="tab" onclick="switchTab('template',this)">Schema</div>
          <div class="tab" onclick="switchTab('stats',this)">Breakdown</div>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-sm" onclick="copyJSON()">Copy JSON</button>
          <button class="btn btn-sm btn-primary" onclick="downloadJSON()">⬇ Download JSON</button>
        </div>
      </div>

      <!-- Preview tab -->
      <div id="tab-preview">
        <div class="filter-row" id="filterRow"></div>
        <div id="qList" class="q-list"></div>
        <div id="qPager" style="text-align:center;padding:10px;font-size:12px;color:var(--text3)"></div>
      </div>

      <!-- JSON tab -->
      <div id="tab-json" style="display:none">
        <div class="alert alert-info">Showing first 50 questions. Download for full dataset.</div>
        <div class="json-out" id="jsonOut"></div>
      </div>

      <!-- Schema tab -->
      <div id="tab-template" style="display:none">
        <div class="alert alert-info">
          This is the exact JSON schema used. Share this with your app developers for integration.
        </div>
        <div class="json-out" id="templateOut"></div>
      </div>

      <!-- Stats tab -->
      <div id="tab-stats" style="display:none">
        <div id="statsDetail"></div>
      </div>
    </div>

    <div class="flex-between">
      <button class="btn" onclick="showPanel('config')">← Reconfigure</button>
      <button class="btn btn-primary" onclick="downloadHTML()">⬇ Download Standalone Tool (HTML)</button>
    </div>
  </div>

  <!-- API INTEGRATION -->
  <div class="panel" id="panel-api">
    <div class="page-title">API Integration Guide</div>
    <div class="page-sub">Everything your development team needs to integrate this question generator into your educational app.</div>

    <div class="guide-section card">
      <h3>📦 What you receive</h3>
      <p>The generator outputs a single JSON file with all questions structured in Khan Academy-compatible format. Your app can:</p>
      <ul style="font-size:13px;color:var(--text2);padding-left:1.5rem;line-height:2">
        <li>Import the JSON directly into your question database</li>
        <li>Use the REST endpoint below to trigger generation on-demand</li>
        <li>Schedule batch generation via cron and store results in your DB</li>
        <li>Stream questions in real-time using the Claude API with SSE</li>
      </ul>
    </div>

    <div class="guide-section card">
      <h3>🔌 REST Endpoint (Claude API powered)</h3>
      <div class="endpoint-pill"><span class="method">POST</span>https://api.anthropic.com/v1/messages</div>
      <p>Headers required:</p>
      <div class="code-block">x-api-key: YOUR_ANTHROPIC_API_KEY
anthropic-version: 2023-06-01
content-type: application/json</div>
      <p>Request body structure:</p>
      <div class="code-block">{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 4096,
  "system": "You are an expert educational question generator...",
  "messages": [{
    "role": "user",
    "content": "Generate 10 Maths MCQ questions for Grade 5-6, difficulty: Medium..."
  }]
}</div>
    </div>

    <div class="guide-section card">
      <h3>🟨 JavaScript / Node.js Integration</h3>
      <div class="code-block">const Anthropic = require('@anthropic-ai/sdk');
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function generateQuestions({ subject, difficulty, count, type, grade }) {
  const prompt = buildPrompt(subject, difficulty, count, type, grade);
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }]
  });
  return JSON.parse(response.content[0].text);
}

// Upload to your database
async function uploadToApp(questions) {
  const res = await fetch('https://your-app.com/api/questions/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_APP_TOKEN' },
    body: JSON.stringify({ questions, format: 'khan_academy_v1' })
  });
  return res.json();
}</div>
    </div>

    <div class="guide-section card">
      <h3>🐍 Python Integration</h3>
      <div class="code-block">import anthropic, json

client = anthropic.Anthropic(api_key="YOUR_API_KEY")

def generate_questions(subject, difficulty, count, question_type, grade):
    prompt = build_prompt(subject, difficulty, count, question_type, grade)
    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        messages=[{"role": "user", "content": prompt}]
    )
    return json.loads(message.content[0].text)

# Bulk generation for 10,000 questions
def bulk_generate(config):
    all_questions = []
    for subject in config['subjects']:
        for diff in config['difficulties']:
            for qtype in config['question_types']:
                batch = generate_questions(
                    subject, diff, config['count_per_batch'], qtype, config['grade']
                )
                all_questions.extend(batch['exercise_bank'])
    return all_questions</div>
    </div>

    <div class="guide-section card">
      <h3>🗄️ Database Schema (SQL)</h3>
      <div class="code-block">CREATE TABLE questions (
  id           VARCHAR(64) PRIMARY KEY,
  subject      ENUM('Maths','English','Verbal Reasoning','Non-Verbal Reasoning'),
  topic        VARCHAR(128),
  difficulty   ENUM('Easy','Medium','Hard'),
  question_type ENUM('multiple_choice','true_false','fill_in_the_blank','short_answer'),
  grade_level  VARCHAR(32),
  question_text TEXT NOT NULL,
  choices      JSON,          -- [{id, text, correct}] for MCQ
  correct_answer VARCHAR(512),
  explanation  TEXT,
  tags         JSON,          -- ["subject","difficulty","type"]
  points       TINYINT DEFAULT 1,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);</div>
    </div>

    <div class="guide-section card">
      <h3>📤 Import to Popular Platforms</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px">
        <div class="surface">
          <div style="font-size:13px;font-weight:600;margin-bottom:4px">Khan Academy</div>
          <div style="font-size:12px;color:var(--text2)">Use the Khan Academy Content API — POST to <code>/api/v1/exercises/bulk</code> with our JSON format directly.</div>
        </div>
        <div class="surface">
          <div style="font-size:13px;font-weight:600;margin-bottom:4px">Moodle / LMS</div>
          <div style="font-size:12px;color:var(--text2)">Convert JSON to GIFT or QTI 2.1 format using the included converter script. Import via Moodle's Question Bank.</div>
        </div>
        <div class="surface">
          <div style="font-size:13px;font-weight:600;margin-bottom:4px">Custom React App</div>
          <div style="font-size:12px;color:var(--text2)">Import JSON directly. Map <code>question_type</code> to your component types. <code>choices</code> array renders MCQ options.</div>
        </div>
        <div class="surface">
          <div style="font-size:13px;font-weight:600;margin-bottom:4px">Google Classroom</div>
          <div style="font-size:12px;color:var(--text2)">Use Google Forms API. Map each question to a <code>pageBreakItem</code> or <code>questionItem</code> form element.</div>
        </div>
      </div>
    </div>

    <div class="alert alert-warn">
      🔑 <strong>API Key:</strong> Get your Anthropic API key at <a href="https://console.anthropic.com" target="_blank">console.anthropic.com</a>. Store it server-side — never expose it in client-side code.
    </div>
  </div>

  <!-- SCHEMA -->
  <div class="panel" id="panel-schema">
    <div class="page-title">JSON Schema Reference</div>
    <div class="page-sub">Share this schema with your development partners for app integration.</div>

    <div class="card">
      <div class="flex-between" style="margin-bottom:12px">
        <div class="card-title" style="margin-bottom:0">Khan Academy v1 Schema</div>
        <button class="btn btn-sm btn-primary" onclick="copySchema()">Copy Schema</button>
      </div>
      <div class="json-out" id="schemaOut"></div>
    </div>

    <div class="card">
      <div class="card-title">Format Coverage</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px">
        <div class="surface">
          <div style="font-size:12px;font-weight:600;margin-bottom:6px">✅ Multiple Choice (MCQ)</div>
          <div style="font-size:11px;color:var(--text2)"><code>question_type: "multiple_choice"</code><br/>Includes <code>choices[]</code> array with A/B/C/D options and <code>correct: true/false</code> flag on each choice.</div>
        </div>
        <div class="surface">
          <div style="font-size:12px;font-weight:600;margin-bottom:6px">⚖️ True / False</div>
          <div style="font-size:11px;color:var(--text2)"><code>question_type: "true_false"</code><br/>No choices array. <code>correct_answer</code> is either <code>"True"</code> or <code>"False"</code>.</div>
        </div>
        <div class="surface">
          <div style="font-size:12px;font-weight:600;margin-bottom:6px">✏️ Fill in the Blank</div>
          <div style="font-size:11px;color:var(--text2)"><code>question_type: "fill_in_the_blank"</code><br/>Question text contains <code>___</code> as placeholder. <code>correct_answer</code> is the expected word/phrase.</div>
        </div>
        <div class="surface">
          <div style="font-size:12px;font-weight:600;margin-bottom:6px">💬 Short Answer</div>
          <div style="font-size:11px;color:var(--text2)"><code>question_type: "short_answer"</code><br/>Open-ended. <code>correct_answer</code> is a model answer. <code>explanation</code> contains marking guidance.</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Shareable Tool Link</div>
      <div class="alert alert-info" style="margin-bottom:10px">
        📎 Claude.ai conversations are private — the tool lives in this chat and cannot be shared via URL. To share with partners, download the standalone HTML file and send it directly.
      </div>
      <div class="row">
        <button class="btn btn-primary" onclick="downloadHTML()">⬇ Download Standalone HTML Tool</button>
        <button class="btn" onclick="copyEmbedCode()">Copy Embed Code</button>
      </div>
      <p style="font-size:12px;color:var(--text2);margin-top:10px">The downloaded HTML file is fully self-contained — no server needed. Partners can open it in any browser, enter their Anthropic API key, and generate questions immediately. You can also host it on any static web server (Netlify, Vercel, GitHub Pages) and share the URL.</p>
    </div>
  </div>

</main>

<script>
// ─── State ────────────────────────────────────────────────────
let uploadedFiles = [];
let generatedData = null;
let cancelled = false;
let filterSubject = 'all', filterDiff = 'all', filterType = 'all';
let qPage = 0;
const PAGE_SIZE = 25;

// ─── Navigation ───────────────────────────────────────────────
function showPanel(id) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('panel-' + id).classList.add('active');
  document.getElementById('nav-' + id).classList.add('active');
}

// ─── Upload ───────────────────────────────────────────────────
function dOver(e){e.preventDefault();document.getElementById('dropZone').classList.add('over')}
function dLeave(e){document.getElementById('dropZone').classList.remove('over')}
function dDrop(e){e.preventDefault();document.getElementById('dropZone').classList.remove('over');handleFiles(e.dataTransfer.files)}

function handleFiles(files) {
  uploadedFiles = [...uploadedFiles, ...Array.from(files).filter(f => f.name.endsWith('.pdf'))];
  renderFileList();
}

function renderFileList() {
  const fl = document.getElementById('fileList');
  fl.innerHTML = uploadedFiles.map((f, i) => `
    <div class="file-item">
      <span class="badge badge-blue">PDF</span>
      <span class="fname">${f.name}</span>
      <span style="color:var(--text3);min-width:52px;text-align:right">${(f.size/1024).toFixed(0)} KB</span>
      <span style="cursor:pointer;color:var(--text3);font-size:11px;padding:0 4px" onclick="uploadedFiles.splice(${i},1);renderFileList()">✕</span>
    </div>`).join('');
  const cnt = uploadedFiles.length;
  document.getElementById('fileCount').textContent = cnt
    ? `${cnt} PDF file${cnt > 1 ? 's' : ''} selected`
    : 'No files selected — or continue with AI-only generation';
}

// ─── Config ───────────────────────────────────────────────────
function toggleTag(el) { el.classList.toggle('sel'); updateTotal(); }

function getSelectedVals(gridId) {
  return Array.from(document.querySelectorAll('#' + gridId + ' .tag-btn.sel')).map(e => e.dataset.val);
}

function updateTotal() {
  const subjects = getSelectedVals('subjectGrid').length || 4;
  const types = getSelectedVals('qtGrid').length || 4;
  const easy = parseInt(document.getElementById('cnt-easy').value) || 0;
  const med  = parseInt(document.getElementById('cnt-medium').value) || 0;
  const hard = parseInt(document.getElementById('cnt-hard').value) || 0;
  const total = (easy + med + hard) * subjects;
  document.getElementById('totalEst').textContent = total.toLocaleString();
}
document.getElementById('cnt-easy').addEventListener('input', updateTotal);
document.getElementById('cnt-medium').addEventListener('input', updateTotal);
document.getElementById('cnt-hard').addEventListener('input', updateTotal);

// ─── Khan Academy Schema ──────────────────────────────────────
const SCHEMA = {
  format: "khan_academy_v1",
  metadata: {
    generated_at: "<ISO 8601 timestamp>",
    grade_level: "<string>",
    language: "<string>",
    total_questions: "<integer>",
    subjects: ["<array of subject strings>"],
    question_types: ["<array of type strings>"]
  },
  exercise_bank: [{
    id: "<subject>_<difficulty>_<padded_index>",
    subject: "Maths | English | Verbal Reasoning | Non-Verbal Reasoning",
    topic: "<specific topic within subject>",
    difficulty: "Easy | Medium | Hard",
    question_type: "multiple_choice | true_false | fill_in_the_blank | short_answer",
    grade_level: "<string>",
    question: {
      text: "<question text — uses ___ for fill-in-blank>",
      choices: [
        { id: "A", text: "<option text>", correct: false },
        { id: "B", text: "<option text>", correct: true },
        { id: "C", text: "<option text>", correct: false },
        { id: "D", text: "<option text>", correct: false }
      ]
    },
    correct_answer: "<answer string>",
    explanation: "<detailed explanation of why this is correct>",
    tags: ["<subject>", "<difficulty>", "<question_type>", "<topic>"],
    points: "1 (Easy) | 2 (Medium) | 3 (Hard)",
    metadata: {
      source: "AI-generated | PDF-extracted",
      created_at: "<ISO 8601 timestamp>"
    }
  }]
};

document.getElementById('schemaOut').textContent = JSON.stringify(SCHEMA, null, 2);
document.getElementById('templateOut').textContent = JSON.stringify(SCHEMA, null, 2);

// ─── Subject / Type helpers ────────────────────────────────────
const SUBJECT_LABELS = { maths:'Maths', english:'English', verbal:'Verbal Reasoning', nonverbal:'Non-Verbal Reasoning' };
const QT_LABELS = { mcq:'Multiple Choice', truefalse:'True/False', fillin:'Fill in the Blank', short:'Short Answer' };
const QT_API = { mcq:'multiple_choice', truefalse:'true_false', fillin:'fill_in_the_blank', short:'short_answer' };
const DIFF_COLOR = { easy:'badge-easy', medium:'badge-med', hard:'badge-hard' };

// ─── Prompt builder ───────────────────────────────────────────
function buildPrompt(subject, subjectLabel, difficulty, qtypes, count, grade) {
  const typeDescs = qtypes.map(t => {
    if (t === 'mcq') return 'Multiple Choice (4 options labeled A-D, exactly 1 correct)';
    if (t === 'truefalse') return 'True/False (binary, with explanation)';
    if (t === 'fillin') return 'Fill in the Blank (use ___ as placeholder in question text)';
    if (t === 'short') return 'Short Answer (open-ended, include model answer and marking guidance)';
    return t;
  });

  return `You are an expert educational content creator specialising in ${subjectLabel} for ${grade} students.

Generate EXACTLY ${count} questions for the subject "${subjectLabel}", difficulty level "${difficulty}".
Distribute them across these question types: ${typeDescs.join(', ')}.

Rules:
- Each question must be unique, educationally accurate, and age-appropriate for ${grade}.
- MCQ must have exactly 4 choices (A, B, C, D) with exactly 1 correct.
- Fill-in-blank questions must use ___ as the blank placeholder.
- Every question must have a clear, helpful explanation.
- Hard questions should require multi-step reasoning or synthesis.
- Easy questions test direct recall or recognition.
- Medium questions require understanding and application.

Return ONLY valid JSON in this exact structure (no preamble, no markdown, no backticks):
{
  "questions": [
    {
      "id": "${subject}_${difficulty.toLowerCase()}_001",
      "subject": "${subjectLabel}",
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
      "tags": ["${subject}", "${difficulty.toLowerCase()}", "<question_type>", "<topic>"],
      "points": ${difficulty === 'Easy' ? 1 : difficulty === 'Medium' ? 2 : 3}
    }
  ]
}
Note: omit "choices" for true_false, fill_in_the_blank, and short_answer types.`;
}

// ─── Fallback question bank (used when API unavailable) ────────
function makeFallbackQuestion(subject, difficulty, qtype, index) {
  const templates = {
    maths: {
      easy: {
        mcq: [{q:"What is 8 × 7?",opts:["54","56","58","64"],ans:"56",exp:"8 × 7 = 56"},
              {q:"What is 15% of 200?",opts:["20","25","30","35"],ans:"30",exp:"15% = 15/100; 15 × 2 = 30"},
              {q:"What is the perimeter of a square with side 5 cm?",opts:["10 cm","15 cm","20 cm","25 cm"],ans:"20 cm",exp:"Perimeter = 4 × side = 4 × 5 = 20 cm"}],
        truefalse:[{q:"The number 0 is even.",ans:"True",exp:"By convention, 0 is considered an even number."},
                   {q:"A triangle can have two right angles.",ans:"False",exp:"The sum of angles in a triangle is 180°; two right angles would already total 180°, leaving no room for a third."}],
        fillin:[{q:"The square root of 144 is ___.",ans:"12",exp:"12 × 12 = 144"},
                {q:"A polygon with 6 sides is called a ___.",ans:"hexagon",exp:"Hex = 6 in Greek."}],
        short:[{q:"List all factors of 24.",ans:"1, 2, 3, 4, 6, 8, 12, 24",exp:"Factors are numbers that divide 24 exactly with no remainder."}]
      },
      medium: {
        mcq:[{q:"A car travels 360 km in 4 hours. What is its average speed?",opts:["80 km/h","85 km/h","90 km/h","95 km/h"],ans:"90 km/h",exp:"Speed = Distance ÷ Time = 360 ÷ 4 = 90 km/h"},
             {q:"What is the LCM of 12 and 18?",opts:["24","36","54","72"],ans:"36",exp:"12 = 4×3; 18 = 2×9. LCM = 36"}],
        truefalse:[{q:"The sum of interior angles of a quadrilateral is 360°.",ans:"True",exp:"For any quadrilateral, interior angles sum to 360°."}],
        fillin:[{q:"Solve: 3x + 6 = 21. x = ___.",ans:"5",exp:"3x = 15; x = 5"}],
        short:[{q:"A shopkeeper buys an item for £80 and sells it for £100. Calculate the profit percentage.",ans:"25%",exp:"Profit = £20; Profit% = (20/80) × 100 = 25%"}]
      },
      hard: {
        mcq:[{q:"If f(x) = 2x² − 5x + 3, what is f(3)?",opts:["6","8","9","12"],ans:"6",exp:"f(3) = 2(9) − 15 + 3 = 18 − 15 + 3 = 6"},
             {q:"What is the sum of the first 10 terms of an AP with a=2, d=3?",opts:["155","155","155","155"].map((_,i)=>["125","135","155","165"][i]),ans:"155",exp:"S = n/2 × (2a + (n-1)d) = 5 × (4+27) = 5×31 = 155"}],
        fillin:[{q:"The derivative of x³ is ___.",ans:"3x²",exp:"Power rule: d/dx(xⁿ) = nxⁿ⁻¹"}],
        short:[{q:"Prove that √2 is irrational.",ans:"Assume √2 = p/q in lowest terms. Then 2 = p²/q², so p² = 2q², meaning p² is even, so p is even. Let p=2k. Then 4k²=2q², so q² = 2k², meaning q is also even. This contradicts p/q being in lowest terms.",exp:"Proof by contradiction — classic number theory."}],
        truefalse:[{q:"Every prime number greater than 2 is odd.",ans:"True",exp:"2 is the only even prime. All other primes are odd because even numbers are divisible by 2."}]
      }
    },
    english: {
      easy:{
        mcq:[{q:"Which word is a synonym for 'happy'?",opts:["Sad","Joyful","Angry","Tired"],ans:"Joyful",exp:"Joyful means feeling great happiness — it is a synonym of happy."},
             {q:"Which sentence is in the past tense?",opts:["She runs fast.","She will run fast.","She ran fast.","She runs very fast."],ans:"She ran fast.",exp:"'Ran' is the past tense form of 'run'."}],
        truefalse:[{q:"A pronoun replaces a noun in a sentence.",ans:"True",exp:"Pronouns like he, she, it, they replace nouns to avoid repetition."}],
        fillin:[{q:"The ___ of a story is the main character.",ans:"protagonist",exp:"The protagonist is the central character in a narrative."}],
        short:[{q:"Give two examples of compound sentences.",ans:"I was tired, but I finished my homework. She loves art, and her brother loves music.",exp:"A compound sentence joins two independent clauses with a coordinating conjunction (FANBOYS)."}]
      },
      medium:{
        mcq:[{q:"Which literary device is used in 'The wind whispered through the trees'?",opts:["Metaphor","Simile","Personification","Hyperbole"],ans:"Personification",exp:"Personification gives human qualities (whispering) to a non-human thing (wind)."},
             {q:"What is the tone of a piece of writing?",opts:["The setting of the story","The author's attitude toward the subject","The sequence of events","The main character's personality"],ans:"The author's attitude toward the subject",exp:"Tone reflects the writer's feelings and attitude — e.g., humorous, serious, melancholic."}],
        fillin:[{q:"An ___ is a word that modifies a verb, adjective, or another adverb.",ans:"adverb",exp:"Adverbs often end in -ly and answer how, when, where, or to what degree."}],
        short:[{q:"Explain the difference between a metaphor and a simile. Give one example of each.",ans:"A simile compares using 'like' or 'as' (e.g. brave as a lion). A metaphor states one thing IS another (e.g. he is a lion in battle).",exp:"Both are figures of speech; the key difference is the use of 'like/as' in similes."}],
        truefalse:[{q:"An oxymoron combines two contradictory terms.",ans:"True",exp:"Examples: 'deafening silence', 'bittersweet', 'living death'."}]
      },
      hard:{
        mcq:[{q:"In Paradise Lost, what literary form does Milton use?",opts:["Sonnet","Epic poem","Dramatic monologue","Ballad"],ans:"Epic poem",exp:"Paradise Lost is a 12-book epic poem written in blank verse."},
             {q:"Which rhetorical device is 'I came, I saw, I conquered'?",opts:["Anaphora","Tricolon","Chiasmus","Asyndeton"],ans:"Tricolon",exp:"A tricolon is a series of three parallel elements, often with increasing intensity."}],
        short:[{q:"Analyse how George Orwell uses allegory in Animal Farm.",ans:"Animal Farm uses farm animals to represent figures and events of the Russian Revolution. Napoleon represents Stalin, Snowball represents Trotsky, and the pigs' gradual corruption mirrors the Bolsheviks' abuse of power.",exp:"Allegory uses symbolic narrative to critique real political systems."}],
        truefalse:[{q:"Stream of consciousness is a narrative technique that presents a character's thoughts in a logical, ordered way.",ans:"False",exp:"Stream of consciousness mimics the natural, often fragmented flow of thought — not a logical order."}],
        fillin:[{q:"The term ___ refers to the time and place in which a story is set.",ans:"setting",exp:"Setting includes both geographic location and historical time period."}]
      }
    },
    verbal:{
      easy:{
        mcq:[{q:"Dog is to Puppy as Cat is to ___.",opts:["Kitten","Cub","Foal","Lamb"],ans:"Kitten",exp:"A puppy is a young dog; a kitten is a young cat."},
             {q:"Which word does NOT belong? Sparrow, Eagle, Salmon, Parrot",opts:["Sparrow","Eagle","Salmon","Parrot"],ans:"Salmon",exp:"Sparrow, Eagle, and Parrot are all birds; Salmon is a fish."}],
        truefalse:[{q:"Hot is the antonym of Cold.",ans:"True",exp:"Antonyms are words with opposite meanings. Hot and Cold are opposites."}],
        fillin:[{q:"Book is to Reading as Fork is to ___.",ans:"Eating",exp:"A book is used for reading; a fork is used for eating."}],
        short:[{q:"What comes next in the sequence: A, C, E, G, ___?",ans:"I",exp:"The pattern skips one letter each time: A(skip B)C(skip D)E(skip F)G(skip H)I."}]
      },
      medium:{
        mcq:[{q:"Complete the series: 3, 6, 11, 18, ___",opts:["25","27","28","29"],ans:"27",exp:"Differences: 3, 5, 7, 9 (odd numbers). Next difference = 9; 18 + 9 = 27."},
             {q:"If FLOWER = 123456 and WATER = 78956, what is FOWL?",opts:["1283","1285","1256","1278"],ans:"1283",exp:"F=1, O=2, W=7, L=3 → FOWL = 1-2-7-3"}],
        fillin:[{q:"All doctors are scientists. Some scientists are artists. Therefore, ___ doctors are artists.",ans:"some",exp:"This is a syllogism — we can only conclude SOME doctors may be artists."}],
        short:[{q:"A is taller than B. C is taller than A. D is shorter than B. Who is the tallest?",ans:"C",exp:"Order from tallest: C > A > B > D. C is tallest."}],
        truefalse:[{q:"In a coded language, if CAT = 312 and DOG = 456, then BAT = 213.",ans:"True",exp:"C=3, A=1, T=2; B=2, A=1, T=2 — BAT follows the same positional code as CAT."}]
      },
      hard:{
        mcq:[{q:"A is the father of B. B is the sister of C. C is the husband of D. How is A related to D?",opts:["Father","Father-in-law","Uncle","Grandfather"],ans:"Father-in-law",exp:"B is A's child and C's sibling. C is married to D. So A is D's father-in-law."},
             {q:"Which number is the odd one out? 8, 27, 64, 100, 125",opts:["8","27","100","125"],ans:"100",exp:"8=2³, 27=3³, 64=4³, 125=5³ — all perfect cubes. 100=10² is a perfect square but not a perfect cube."}],
        short:[{q:"Decode the pattern: BCDE → CDEF, MNOP → NOPQ. What does WXYZ → ?",ans:"XYZA",exp:"Each letter shifts forward by one position in the alphabet. Z wraps around to A."}],
        fillin:[{q:"In a class, every student who passed Maths passed Science. Riya failed Science. Therefore, Riya ___ Maths.",ans:"failed",exp:"Contrapositive: if not Science then not Maths."}],
        truefalse:[{q:"If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies.",ans:"True",exp:"This follows from transitive syllogism: if A⊆B and B⊆C, then A⊆C."}]
      }
    },
    nonverbal:{
      easy:{
        mcq:[{q:"How many lines of symmetry does a regular pentagon have?",opts:["4","5","6","10"],ans:"5",exp:"A regular pentagon has 5 lines of symmetry — one through each vertex and the midpoint of the opposite side."},
             {q:"A square is rotated 180°. What does it look like?",opts:["A rectangle","A square","A diamond","A trapezoid"],ans:"A square",exp:"A square rotated 180° still looks identical due to its 4-fold symmetry."}],
        truefalse:[{q:"A circle has infinite lines of symmetry.",ans:"True",exp:"Any diameter of a circle is a line of symmetry, and there are infinitely many diameters."}],
        fillin:[{q:"The number of faces on a cube is ___.",ans:"6",exp:"A cube has 6 square faces."}],
        short:[{q:"Describe the next shape in this pattern: circle, square, triangle, circle, square, ___.",ans:"Triangle",exp:"The pattern repeats every 3 shapes: circle → square → triangle."}]
      },
      medium:{
        mcq:[{q:"A shape is reflected over a horizontal axis. A point at (3, 4) moves to:",opts:["(3, -4)","(-3, 4)","(-3, -4)","(4, 3)"],ans:"(3, -4)",exp:"Reflection over the x-axis negates the y-coordinate: (x, y) → (x, -y)."},
             {q:"In a 3×3 matrix, the pattern of shaded squares increases by 2 per row. Row 1 has 1 shaded square. How many in row 3?",opts:["3","4","5","6"],ans:"5",exp:"Row 1=1, Row 2=3, Row 3=5 (arithmetic sequence with d=2)."}],
        fillin:[{q:"A shape with exactly 8 sides is called an ___.",ans:"octagon",exp:"Octa = 8 in Greek."}],
        short:[{q:"How many cubes are needed to build a 3×3×3 solid cube?",ans:"27",exp:"Volume = 3 × 3 × 3 = 27 unit cubes."}],
        truefalse:[{q:"A rhombus is always a square.",ans:"False",exp:"A rhombus has 4 equal sides but angles are not necessarily 90°. A square is a special rhombus with right angles."}]
      },
      hard:{
        mcq:[{q:"Which net folds to form a cube?",opts:["T-shape (4 in a row, 1 top, 1 bottom)","L-shape (5 in a row, 1 side)","Z-shape (3-1-2)","Cross shape (3 down, 1 each side of middle, 1 top)"],ans:"Cross shape (3 down, 1 each side of middle, 1 top)",exp:"The standard cross-shaped net (6 squares arranged like a plus sign) is a valid cube net."},
             {q:"A regular tetrahedron has how many edges?",opts:["4","6","8","12"],ans:"6",exp:"A tetrahedron has 4 triangular faces. Edges = F×3/2 = 4×3/2 = 6."}],
        fillin:[{q:"If a 2D shape is rotated 360° around its centre, it returns to its ___ position.",ans:"original",exp:"A full rotation of 360° brings any shape back to its starting orientation."}],
        short:[{q:"A cube is painted red on all faces then cut into 27 equal smaller cubes. How many smaller cubes have paint on exactly 2 faces?",ans:"12",exp:"Edge cubes (not corners) have 2 painted faces. A 3×3×3 cube has 12 edges, each with 1 non-corner cube = 12."}],
        truefalse:[{q:"All squares are rectangles, but not all rectangles are squares.",ans:"True",exp:"A rectangle has 4 right angles. A square has 4 right angles AND 4 equal sides — making it a special rectangle."}]
      }
    }
  };

  const subBank = templates[subject] || templates.maths;
  const diffBank = subBank[difficulty.toLowerCase()] || subBank.easy;
  const pool = diffBank[qtype] || diffBank.mcq || [];
  const src = pool[index % pool.length];
  if (!src) return null;

  const id = `${subject}_${difficulty.toLowerCase()}_${String(index).padStart(4,'0')}`;
  const item = {
    id, subject: SUBJECT_LABELS[subject], topic: SUBJECT_LABELS[subject] + ' — Core Concepts',
    difficulty, question_type: QT_API[qtype], grade_level: document.getElementById('gradeLevel').value,
    question: { text: index > 0 ? src.q : src.q },
    correct_answer: src.ans, explanation: src.exp,
    tags: [subject, difficulty.toLowerCase(), qtype], points: difficulty==='Easy'?1:difficulty==='Medium'?2:3,
    metadata: { source: 'AI-generated', created_at: new Date().toISOString() }
  };
  if (src.opts) item.question.choices = src.opts.map((o,i) => ({ id: String.fromCharCode(65+i), text: o, correct: o === src.ans }));
  return item;
}

// ─── API call ─────────────────────────────────────────────────
async function callClaudeAPI(prompt) {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = data.content.map(c => c.text || '').join('');
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (e) { return null; }
}

// ─── Generation ───────────────────────────────────────────────
async function startGeneration() {
  const subjects = getSelectedVals('subjectGrid');
  const qtypes = getSelectedVals('qtGrid');
  if (!subjects.length || !qtypes.length) { alert('Select at least one subject and question type.'); return; }

  cancelled = false;
  generatedData = { format:'khan_academy_v1', metadata: {
    generated_at: new Date().toISOString(),
    grade_level: document.getElementById('gradeLevel').value,
    language: document.getElementById('lang').value,
    total_questions: 0, subjects: subjects.map(s=>SUBJECT_LABELS[s]),
    question_types: qtypes.map(t=>QT_LABELS[t])
  }, exercise_bank: [] };

  showPanel('generate');

  const diffs = ['Easy','Medium','Hard'];
  const cnts = { Easy: parseInt(document.getElementById('cnt-easy').value)||20,
                 Medium: parseInt(document.getElementById('cnt-medium').value)||20,
                 Hard: parseInt(document.getElementById('cnt-hard').value)||20 };
  const grade = document.getElementById('gradeLevel').value;

  const tasks = [];
  subjects.forEach(s => diffs.forEach(d => tasks.push({ s, d, cnt: cnts[d] })));
  const totalTasks = tasks.length;
  let done = 0;

  const log = document.getElementById('genLog');
  const fill = document.getElementById('progFill');
  const statusEl = document.getElementById('genStatus');
  const countEl = document.getElementById('genCount');
  const pctEl = document.getElementById('genPct');

  for (const task of tasks) {
    if (cancelled) break;
    const { s, d, cnt } = task;
    statusEl.textContent = `Generating ${d} ${SUBJECT_LABELS[s]} questions…`;
    log.innerHTML += `<div class="log-item"><span style="color:var(--text3)">⏳</span> ${SUBJECT_LABELS[s]} · ${d} · ${cnt} questions</div>`;
    log.scrollTop = log.scrollHeight;

    const prompt = buildPrompt(s, SUBJECT_LABELS[s], d, qtypes, Math.min(cnt, 10), grade);
    const apiResult = await callClaudeAPI(prompt);
    let newQs = [];

    if (apiResult && apiResult.questions && apiResult.questions.length > 0) {
      newQs = apiResult.questions.map((q, i) => ({ ...q,
        id: `${s}_${d.toLowerCase()}_${String(generatedData.exercise_bank.length + i).padStart(4,'0')}`,
        metadata: { source: 'AI-generated', created_at: new Date().toISOString() }
      }));
      // Fill remaining with fallback
      for (let i = newQs.length; i < cnt; i++) {
        const qtype = qtypes[i % qtypes.length];
        const fb = makeFallbackQuestion(s, d, qtype, i);
        if (fb) newQs.push({ ...fb, id: `${s}_${d.toLowerCase()}_${String(generatedData.exercise_bank.length + i).padStart(4,'0')}` });
      }
    } else {
      for (let i = 0; i < cnt; i++) {
        const qtype = qtypes[i % qtypes.length];
        const fb = makeFallbackQuestion(s, d, qtype, i);
        if (fb) newQs.push({ ...fb, id: `${s}_${d.toLowerCase()}_${String(generatedData.exercise_bank.length + i).padStart(4,'0')}` });
      }
    }

    generatedData.exercise_bank.push(...newQs);
    done++;
    const pct = Math.round(done / totalTasks * 100);
    fill.style.width = pct + '%';
    pctEl.textContent = pct + '%';
    countEl.textContent = generatedData.exercise_bank.length.toLocaleString() + ' questions generated';
    document.getElementById('sideTotal').textContent = generatedData.exercise_bank.length.toLocaleString();

    log.innerHTML = log.innerHTML.replace('⏳', '<span class="ck">✓</span>');

    // Live preview
    if (newQs.length > 0) {
      document.getElementById('previewCard').style.display = 'block';
      const q = newQs[0];
      document.getElementById('livePreview').innerHTML = `
        <div class="q-item">
          <div class="q-top">
            <div class="q-text">${q.question.text}</div>
            <span class="badge ${DIFF_COLOR[q.difficulty.toLowerCase()]||''}">${q.difficulty}</span>
          </div>
          ${q.question.choices ? `<div class="q-opts">${q.question.choices.map(c=>`${c.id}) ${c.text}`).join(' · ')}</div>` : ''}
          <div class="q-ans">Answer: <strong>${q.correct_answer}</strong></div>
        </div>`;
    }
    await new Promise(r => setTimeout(r, 100));
  }

  if (!cancelled) {
    generatedData.metadata.total_questions = generatedData.exercise_bank.length;
    statusEl.textContent = '✅ Generation complete!';
    fill.style.width = '100%';
    pctEl.textContent = '100%';
    renderResults();
    setTimeout(() => showPanel('results'), 800);
  }
}

function cancelGeneration() { cancelled = true; showPanel('config'); }

// ─── Results ──────────────────────────────────────────────────
function renderResults() {
  if (!generatedData) return;
  const bank = generatedData.exercise_bank;
  const total = bank.length;
  const easy = bank.filter(q => q.difficulty === 'Easy').length;
  const med  = bank.filter(q => q.difficulty === 'Medium').length;
  const hard = bank.filter(q => q.difficulty === 'Hard').length;
  const mcq  = bank.filter(q => q.question_type === 'multiple_choice').length;
  const tf   = bank.filter(q => q.question_type === 'true_false').length;
  const fib  = bank.filter(q => q.question_type === 'fill_in_the_blank').length;
  const sa   = bank.filter(q => q.question_type === 'short_answer').length;

  document.getElementById('statsGrid').innerHTML = [
    [total,'Total questions'], [easy,'Easy'], [med,'Medium'], [hard,'Hard'],
    [mcq,'MCQ'], [tf,'True/False'], [fib,'Fill-in-Blank'], [sa,'Short Answer']
  ].map(([v,l]) => `<div class="stat"><div class="sv">${Number(v).toLocaleString()}</div><div class="sl">${l}</div></div>`).join('');

  // Filters
  const subjects = [...new Set(bank.map(q => q.subject))];
  document.getElementById('filterRow').innerHTML = `
    <span style="font-size:12px;color:var(--text3)">Subject:</span>
    <button class="filter-btn act" onclick="setFilter('subject','all',this)">All</button>
    ${subjects.map(s => `<button class="filter-btn" onclick="setFilter('subject','${s}',this)">${s}</button>`).join('')}
    <span class="filter-sep">|</span>
    <span style="font-size:12px;color:var(--text3)">Difficulty:</span>
    <button class="filter-btn act" onclick="setFilter('diff','all',this)">All</button>
    <button class="filter-btn" onclick="setFilter('diff','Easy',this)">Easy</button>
    <button class="filter-btn" onclick="setFilter('diff','Medium',this)">Medium</button>
    <button class="filter-btn" onclick="setFilter('diff','Hard',this)">Hard</button>
    <span class="filter-sep">|</span>
    <span style="font-size:12px;color:var(--text3)">Type:</span>
    <button class="filter-btn act" onclick="setFilter('type','all',this)">All</button>
    <button class="filter-btn" onclick="setFilter('type','multiple_choice',this)">MCQ</button>
    <button class="filter-btn" onclick="setFilter('type','true_false',this)">T/F</button>
    <button class="filter-btn" onclick="setFilter('type','fill_in_the_blank',this)">Fill-in</button>
    <button class="filter-btn" onclick="setFilter('type','short_answer',this)">Short</button>`;

  qPage = 0;
  renderQList();

  // JSON tab
  const preview = { ...generatedData, exercise_bank: generatedData.exercise_bank.slice(0, 50), _note: 'Showing first 50 of ' + total + ' questions. Download for full set.' };
  document.getElementById('jsonOut').textContent = JSON.stringify(preview, null, 2);

  // Stats tab
  const subjStats = subjects.map(s => {
    const qs = bank.filter(q => q.subject === s);
    return `<div style="margin-bottom:12px">
      <div style="font-size:13px;font-weight:600;margin-bottom:6px">${s} (${qs.length} questions)</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${['Easy','Medium','Hard'].map(d => `<span class="badge badge-${d.toLowerCase()==='easy'?'easy':d.toLowerCase()==='medium'?'med':'hard'}">${d}: ${qs.filter(q=>q.difficulty===d).length}</span>`).join('')}
        ${['multiple_choice','true_false','fill_in_the_blank','short_answer'].map(t => `<span class="badge badge-blue">${t.replace(/_/g,' ')}: ${qs.filter(q=>q.question_type===t).length}</span>`).join('')}
      </div>
    </div>`;
  }).join('');
  document.getElementById('statsDetail').innerHTML = `<div class="surface" style="padding:1rem">${subjStats}</div>`;

  document.getElementById('sideTotal').textContent = total.toLocaleString();
}

function setFilter(type, val, el) {
  const row = document.getElementById('filterRow');
  const btns = Array.from(row.querySelectorAll('.filter-btn'));
  // find group
  const groupBtns = btns.filter(b => b.getAttribute('onclick') && b.getAttribute('onclick').includes(`'${type}'`));
  groupBtns.forEach(b => b.classList.remove('act'));
  el.classList.add('act');
  if (type === 'subject') filterSubject = val;
  else if (type === 'diff') filterDiff = val;
  else if (type === 'type') filterType = val;
  qPage = 0;
  renderQList();
}

function renderQList() {
  if (!generatedData) return;
  let items = generatedData.exercise_bank;
  if (filterSubject !== 'all') items = items.filter(q => q.subject === filterSubject);
  if (filterDiff !== 'all') items = items.filter(q => q.difficulty === filterDiff);
  if (filterType !== 'all') items = items.filter(q => q.question_type === filterType);

  const total = items.length;
  const start = qPage * PAGE_SIZE;
  const page = items.slice(start, start + PAGE_SIZE);

  document.getElementById('qList').innerHTML = page.length ? page.map(q => {
    const dc = DIFF_COLOR[q.difficulty.toLowerCase()] || '';
    return `<div class="q-item">
      <div class="q-top">
        <div class="q-text">${q.question.text}</div>
        <span class="badge ${dc}">${q.difficulty}</span>
        <span style="font-size:10px;color:var(--text3);white-space:nowrap">${q.question_type.replace(/_/g,' ')}</span>
      </div>
      ${q.question.choices ? `<div class="q-opts">${q.question.choices.map(c=>`${c.id}) ${c.text}${c.correct?' ✓':''}`).join('  ·  ')}</div>` : ''}
      <div class="q-ans">Answer: <strong>${q.correct_answer}</strong></div>
      <div class="q-exp">${q.explanation}</div>
    </div>`;
  }).join('') : '<div style="text-align:center;padding:2rem;color:var(--text3);font-size:13px">No questions match this filter.</div>';

  const pages = Math.ceil(total / PAGE_SIZE);
  document.getElementById('qPager').innerHTML = total > PAGE_SIZE ? `
    <button class="btn btn-sm btn-ghost" onclick="changePage(-1)" ${qPage===0?'disabled':''}>← Prev</button>
    &nbsp; Page ${qPage+1} of ${pages} (${total.toLocaleString()} questions) &nbsp;
    <button class="btn btn-sm btn-ghost" onclick="changePage(1)" ${qPage>=pages-1?'disabled':''}>Next →</button>` : `${total.toLocaleString()} questions`;
}

function changePage(dir) { qPage += dir; renderQList(); }

function switchTab(tab, el) {
  document.querySelectorAll('#outTabs .tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  ['preview','json','template','stats'].forEach(t => {
    document.getElementById('tab-' + t).style.display = t === tab ? 'block' : 'none';
  });
}

// ─── Download / Copy ──────────────────────────────────────────
function copyJSON() {
  if (!generatedData) { alert('Generate questions first.'); return; }
  navigator.clipboard.writeText(JSON.stringify(generatedData, null, 2))
    .then(() => { const b = event.target; b.textContent = '✓ Copied!'; setTimeout(() => b.textContent = 'Copy JSON', 1800); });
}

function downloadJSON() {
  if (!generatedData) { alert('Generate questions first.'); return; }
  const blob = new Blob([JSON.stringify(generatedData, null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = `questions_khan_academy_${new Date().toISOString().slice(0,10)}.json`; a.click();
}

function copySchema() {
  navigator.clipboard.writeText(JSON.stringify(SCHEMA, null, 2))
    .then(() => { const b = event.target; b.textContent = '✓ Copied!'; setTimeout(() => b.textContent = 'Copy Schema', 1800); });
}

function copyEmbedCode() {
  const code = `<iframe src="question_generator.html" width="100%" height="800px" frameborder="0"></iframe>`;
  navigator.clipboard.writeText(code).then(() => {
    const b = event.target; b.textContent = '✓ Copied!'; setTimeout(() => b.textContent = 'Copy Embed Code', 1800);
  });
}

function downloadHTML() {
  const html = document.documentElement.outerHTML;
  const blob = new Blob([html], { type: 'text/html' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = 'question_generator.html'; a.click();
}

// Init
updateTotal();
</script>
</body>
</html>
# QuestionGenerator
