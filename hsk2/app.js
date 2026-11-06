"use strict";

const $ = (id) => document.getElementById(id);

// ---------- Audio (synthèse vocale chinoise) ----------
function speak(text) {
  if (!("speechSynthesis" in window) || !text) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "zh-CN";
  u.rate = 0.9;
  const zhVoice = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith("zh"));
  if (zhVoice) u.voice = zhVoice;
  window.speechSynthesis.speak(u);
}
// Précharge les voix (nécessaire sur certains navigateurs)
if ("speechSynthesis" in window) window.speechSynthesis.getVoices();

// ---------- Onglets ----------
const tabs = ["flashcards", "quiz", "list"];
tabs.forEach((t) => {
  $("tab-" + t).addEventListener("click", () => {
    tabs.forEach((x) => {
      $("tab-" + x).classList.toggle("active", x === t);
      $("view-" + x).classList.toggle("active", x === t);
    });
  });
});

// ---------- Sélecteurs de chapitre ----------
const chapters = [...new Set(WORDS.map((w) => w.c))].sort((a, b) => a - b);
function fillChapterSelect(sel) {
  sel.innerHTML = "";
  const optAll = document.createElement("option");
  optAll.value = "all";
  optAll.textContent = "Tous";
  sel.appendChild(optAll);
  chapters.forEach((c) => {
    const o = document.createElement("option");
    o.value = c;
    o.textContent = "Chapitre " + c;
    sel.appendChild(o);
  });
}
fillChapterSelect($("chapter-select"));
fillChapterSelect($("quiz-chapter-select"));

// ---------- Fiches ----------
let deck = [];
let cardIdx = 0;

function wordsFor(chapter) {
  return chapter === "all" ? WORDS.slice() : WORDS.filter((w) => w.c === Number(chapter));
}

function buildDeck() {
  deck = wordsFor($("chapter-select").value);
  cardIdx = 0;
  renderCard();
}

function renderCard() {
  if (!deck.length) return;
  const w = deck[cardIdx];
  $("card").classList.remove("flipped");
  $("card-hanzi").textContent = w.h;
  $("card-hanzi-back").textContent = w.h;
  $("card-pinyin").textContent = w.p;
  $("card-translation").textContent = w.f;
  $("card-counter").textContent = (cardIdx + 1) + " / " + deck.length;
}

$("card-speak").addEventListener("click", (e) => {
  e.stopPropagation();
  speak(deck[cardIdx] && deck[cardIdx].h);
});
$("card-speak-back").addEventListener("click", (e) => {
  e.stopPropagation();
  speak(deck[cardIdx] && deck[cardIdx].h);
});

$("card").addEventListener("click", () => $("card").classList.toggle("flipped"));
$("next-card").addEventListener("click", () => {
  if (deck.length) { cardIdx = (cardIdx + 1) % deck.length; renderCard(); }
});
$("prev-card").addEventListener("click", () => {
  if (deck.length) { cardIdx = (cardIdx - 1 + deck.length) % deck.length; renderCard(); }
});
$("shuffle-btn").addEventListener("click", () => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  cardIdx = 0;
  renderCard();
});
$("chapter-select").addEventListener("change", buildDeck);
buildDeck();

// ---------- Quiz ----------
const QUIZ_LEN = 10;
let quizQuestions = [];
let quizIdx = 0;
let quizScore = 0;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startQuiz() {
  const pool = shuffle(wordsFor($("quiz-chapter-select").value));
  if (pool.length < 4) return;
  quizQuestions = pool.slice(0, Math.min(QUIZ_LEN, pool.length));
  quizIdx = 0;
  quizScore = 0;
  $("quiz-result").classList.add("hidden");
  $("quiz-next").classList.add("hidden");
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const w = quizQuestions[quizIdx];
  $("quiz-progress").textContent = "Question " + (quizIdx + 1) + " / " + quizQuestions.length +
    " — Score : " + quizScore;
  $("quiz-question").textContent = w.h;
  $("quiz-speak").onclick = () => speak(w.h);
  $("quiz-feedback").textContent = "";
  const pool = shuffle(WORDS.filter((x) => x.h !== w.h));
  const choices = shuffle([w, ...pool.slice(0, 3)]);
  const box = $("quiz-choices");
  box.innerHTML = "";
  choices.forEach((c) => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = c.f;
    btn.addEventListener("click", () => answer(btn, c, w));
    box.appendChild(btn);
  });
}

function answer(btn, chosen, correct) {
  const buttons = document.querySelectorAll(".choice");
  buttons.forEach((b) => (b.disabled = true));
  if (chosen.h === correct.h) {
    btn.classList.add("correct");
    quizScore++;
    $("quiz-feedback").textContent = "✓ 正确 ! " + correct.h + " (" + correct.p + ") = " + correct.f;
  } else {
    btn.classList.add("wrong");
    buttons.forEach((b) => {
      if (b.textContent === correct.f) b.classList.add("correct");
    });
    $("quiz-feedback").textContent = "✗ 正确答案 : " + correct.h + " (" + correct.p + ") = " + correct.f;
  }
  $("quiz-progress").textContent = "Question " + (quizIdx + 1) + " / " + quizQuestions.length +
    " — Score : " + quizScore;
  $("quiz-next").classList.remove("hidden");
}

$("quiz-next").addEventListener("click", () => {
  quizIdx++;
  if (quizIdx < quizQuestions.length) {
    $("quiz-next").classList.add("hidden");
    renderQuizQuestion();
  } else {
    $("quiz-next").classList.add("hidden");
    $("quiz-choices").innerHTML = "";
    $("quiz-question").textContent = "";
    $("quiz-feedback").textContent = "";
    const res = $("quiz-result");
    res.classList.remove("hidden");
    const pct = Math.round((quizScore / quizQuestions.length) * 100);
    res.textContent = "Score final : " + quizScore + " / " + quizQuestions.length +
      " (" + pct + "%)";
  }
});
$("quiz-chapter-select").addEventListener("change", startQuiz);
startQuiz();

// ---------- Liste de mots ----------
function renderList() {
  const q = $("search-input").value.trim().toLowerCase();
  const rows = WORDS.filter((w) =>
    !q || w.h.includes(q) || w.p.toLowerCase().includes(q) || w.f.toLowerCase().includes(q)
  );
  const tbody = $("word-tbody");
  tbody.innerHTML = "";
  rows.forEach((w) => {
    const tr = document.createElement("tr");
    const tdS = document.createElement("td");
    const btnS = document.createElement("button");
    btnS.className = "speak-cell";
    btnS.textContent = "🔊";
    btnS.title = "Écouter";
    btnS.addEventListener("click", () => speak(w.h));
    tdS.appendChild(btnS);
    const tdH = document.createElement("td");
    tdH.textContent = w.h;
    const tdP = document.createElement("td");
    tdP.textContent = w.p;
    const tdF = document.createElement("td");
    tdF.textContent = w.f;
    const tdC = document.createElement("td");
    tdC.textContent = w.c;
    tr.append(tdS, tdH, tdP, tdF, tdC);
    tbody.appendChild(tr);
  });
}
$("search-input").addEventListener("input", renderList);
renderList();
