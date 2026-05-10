/**
 * MAGI SYSTEM CORE LOGIC
 * Mode: Sequential Deliberation v3.0
 */

const DEMO_MODE = true; // Set to FALSE when you have your config.js API key ready

// --- LORE DATABASE (50 QUESTIONS) ---
let questionIndex = 0;
const evaQuestions = [
  "What is the true purpose of the Human Instrumentality Project?", "Who created the Evangelion units?", "What happened during the Second Impact?",
  "Is Rei Ayanami a human or a clone?", "What is the Lilith in Terminal Dogma?", "What are the Angels trying to achieve?",
  "Why is Shinji Ikari the only one who can pilot Unit-01?", "What is the significance of the Spear of Longinus?", "Who is the true leader of SEELE?",
  "What is the difference between an Adam and a Lilith based lifeform?", "What is an AT Field?", "What is inside the entry plug of an EVA?",
  "Why does Asuka's synchronization rate drop?", "What is the Marduk Institute?", "What happened to Shinji's mother, Yui Ikari?",
  "What is the Dead Sea Scrolls' role in the story?", "What is the S2 Engine?", "Why was Tokyo-3 built?",
  "What is the dummy plug system?", "Who is Kaworu Nagisa truly?", "What is the First Ancestral Race?",
  "Why did Misato Katsuragi join NERV?", "What is the significance of the number of Angels?", "How does an EVA move without power?",
  "What is the LCL fluid?", "What is the bridge between a pilot and the EVA?", "What is Gendo Ikari's ultimate goal?",
  "What is the role of the MAGI supercomputer?", "What is the difference between a prototype and a production model?", "What is the Beast Mode?",
  "Who is the donor for Rei's DNA?", "What is the Tree of Life in the End of Evangelion?", "Why do EVAs wear armor?",
  "What is the GeoFront?", "What is the impact of the Third Impact?", "How did Kaji die?",
  "What is the relation between Lilith and humanity?", "What is the 'Curse of the EVA'?", "Why is Unit-01 purple?",
  "What are the Shito (Angels) made of?", "What is the Nebuchadnezzar's Key?", "How many EVA units were actually built?",
  "What is the role of Ritsuko Akagi?", "What is the significance of Misato's pendant?", "Why does the sea turn red?",
  "What is the relationship between Kaworu and Adam?", "What is the 'White Moon' and 'Black Moon'?", "Why was Unit-00 unstable?",
  "What is the chamber of Guf?", "Will the cycle of Impacts ever end?"
];

// --- PERSONALITIES ---
const magiPersonalities = {
  melchior: { systemPrompt: "You are MELCHIOR-1. Perspective: Scientific logic. Precise, cold. Under 40 words.", userPrompt: q => `Analyze scientifically: ${q}` },
  balthasar: { systemPrompt: "You are BALTHASAR-2. Perspective: Motherhood and ethics. Human-centric. Under 40 words.", userPrompt: q => `Analyze ethically: ${q}` },
  casper: { systemPrompt: "You are CASPER-3. Perspective: Pragmatism and survival. Blunt. Under 40 words.", userPrompt: q => `Analyze pragmatically: ${q}` }
};

// --- BOOT SEQUENCE ---
const bootLines = ["NERV MAGI v3.0", "SYNCING NODES...", "MELCHIOR [OK]", "BALTHASAR [OK]", "CASPER [OK]", "ALL SYSTEMS NOMINAL.", "AWAITING DELIBERATION..."];
let bootIndex = 0;
function runBoot() {
  if (bootIndex < bootLines.length) {
    document.getElementById("boot-text").textContent += bootLines[bootIndex++] + "\n";
    setTimeout(runBoot, 180);
  } else {
    setTimeout(() => {
      document.getElementById("boot-screen").style.display = "none";
      document.getElementById("app").classList.remove("hidden");
    }, 800);
  }
}
runBoot();

// --- UI HELPERS ---
function toggleQuestions() {
  const input = document.getElementById("query-input");
  input.value = evaQuestions[questionIndex];
  document.getElementById("terminal-question-preview").textContent = evaQuestions[questionIndex];
  questionIndex = (questionIndex + 1) % evaQuestions.length;
}

// --- MAIN DELIBERATION ---
async function submitQuery() {
  const input = document.getElementById("query-input");
  const btn = document.getElementById("submit-btn");
  const preview = document.getElementById("terminal-question-preview");
  const query = input.value.trim();

  if (!query || btn.disabled) return;

  btn.disabled = true;
  preview.textContent = query;
  const units = ["melchior", "balthasar", "casper"];
  
  // Reset Panels
  units.forEach(u => {
    const p = document.getElementById(`unit-${u}`);
    p.classList.remove("resolved", "error", "thinking");
    document.getElementById(`response-${u}`).textContent = "...";
    document.getElementById(`stat-${u}`).textContent = "STANDBY";
  });

  // Sequential Processing with 1.5s delay
  for (const unit of units) {
    const p = document.getElementById(`unit-${unit}`);
    const s = document.getElementById(`stat-${unit}`);
    const r = document.getElementById(`response-${unit}`);
    
    p.classList.add("thinking"); 
    s.textContent = "THINKING";

    await new Promise(r => setTimeout(r, 2000)); 
    await callMagi(unit, query);
    await new Promise(r => setTimeout(r, 500)); 
  }

  btn.disabled = false;
}

async function callMagi(unit, query) {
  const p = document.getElementById(`unit-${unit}`);
  const r = document.getElementById(`response-${unit}`);
  const s = document.getElementById(`stat-${unit}`);

  p.classList.remove("thinking");

  if (DEMO_MODE) {
    const fakes = {
      melchior: "PROBABILITY REMAINS WITHIN NOMINAL DATA LIMITS. RECOMMEND PROCEEDING WITH CAUTION.",
      balthasar: "WE MUST PROTECT THE PILOT. THE HUMAN COST OUTWEIGHS THE LOGICAL GAIN.",
      casper: "ACT NOW. SURVIVAL IS THE ONLY RELEVANT METRIC. DO NOT HESITATE."
    };
    r.textContent = fakes[unit];
    p.classList.add("resolved");
    s.textContent = "RESOLVED";
    return;
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${window.MAGI_API_KEY}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: magiPersonalities[unit].systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: magiPersonalities[unit].userPrompt(query) }] }]
      })
    });
    const data = await response.json();
    if (data.error) {
        r.textContent = "QUOTA EXCEEDED.";
        p.classList.add("error");
        s.textContent = "ABORTED";
    } else {
        r.textContent = data.candidates[0].content.parts[0].text;
        p.classList.add("resolved"); 
        s.textContent = "RESOLVED";
    }
  } catch { 
    r.textContent = "OFFLINE."; 
    p.classList.add("error");
  }
}