const studyData = window.__STUDY_DATA__ || {};
const allCards = Array.isArray(studyData.cards) ? studyData.cards : [];
const accentColor = window.__ACCENT_COLOR__ || "#111827";

// ── State ──────────────────────────────────────────────────────────────────
const learnedIds = new Set();
let queue = [];
let queueIndex = 0;
let isFlipped = false;
let activeTab = "learn";

// ── DOM refs ───────────────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id);
const flipInner       = $("flip-inner");
const flashcardArea   = $("flashcard-area");
const sessionDoneEl   = $("session-done");
const queueRemainingEl = $("queue-remaining");
const progressLabel   = $("progress-label");
const progressPct     = $("progress-pct");
const progressBar     = $("progress-bar");
const learnedCountEl  = $("learned-count");
const unlearnedCountEl = $("unlearned-count");
const tabLearnedLabel  = $("tab-learned-label");
const tabUnlearnedLabel = $("tab-unlearned-label");
const doneTitleEl     = $("done-title");
const doneDescEl      = $("done-desc");
const btnContinue     = $("btn-continue-unlearned");
const btnReviewLearned = $("btn-review-learned");
const btnRestartDone  = $("btn-restart-done");
const btnReset        = $("btn-reset");
const tabListEl       = $("tab-list");
const tabLearnEl      = $("tab-learn");
const listActionBar   = $("list-action-bar");
const wordListEl      = $("word-list");
const btnKnow         = $("btn-know");
const total           = allCards.length;

// Apply accent color to "Đã thuộc" button
if (btnKnow) btnKnow.style.color = accentColor;

// ── Speech ─────────────────────────────────────────────────────────────────
function speak(text) {
  if (!text || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US"; u.rate = 0.85;
  window.speechSynthesis.speak(u);
}
window.speakWord = () => { const c = currentCard(); if (c) speak(c.word); };
window.speakExample = () => { const c = currentCard(); if (c) speak(c.exampleSentence); };

// ── Card helpers ───────────────────────────────────────────────────────────
function currentCard() { return allCards.find(c => c.id === queue[queueIndex]); }
function getToken() { return localStorage.getItem("flish_id_token") || ""; }

async function apiPost(url, body) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(body),
  }).catch(() => {});
}

// ── Progress UI ────────────────────────────────────────────────────────────
function updateProgressUI() {
  const learned = learnedIds.size;
  const unlearned = total - learned;
  const pct = total > 0 ? Math.round((learned / total) * 100) : 0;

  if (progressLabel) progressLabel.textContent = `${learned}/${total} từ đã thuộc`;
  if (progressPct) {
    progressPct.textContent = pct === 100 ? "Hoàn thành ✓" : `${pct}%`;
    progressPct.className = `text-xs font-medium px-2 py-0.5 rounded-full ${pct === 100 ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`;
  }
  if (progressBar) { progressBar.style.width = `${pct}%`; progressBar.style.background = accentColor; }
  if (learnedCountEl) learnedCountEl.textContent = learned;
  if (unlearnedCountEl) unlearnedCountEl.textContent = unlearned;
  if (tabLearnedLabel) tabLearnedLabel.textContent = `Đã thuộc (${learned})`;
  if (tabUnlearnedLabel) tabUnlearnedLabel.textContent = `Chưa thuộc (${unlearned})`;
  if (btnReset) btnReset.style.display = learned > 0 ? "flex" : "none";

  const dotLearned = $("dot-learned");
  if (dotLearned) dotLearned.style.background = accentColor;
}

// ── Render flashcard ───────────────────────────────────────────────────────
function renderFlashcard() {
  const card = currentCard();
  if (!card) return;

  // Front
  $("front-word").textContent = card.word || "";
  $("front-phonetic").textContent = card.phonetic || "";
  $("front-pos").textContent = card.partOfSpeech || "";

  // Back
  $("back-word").textContent = card.word || "";
  $("back-phonetic").textContent = card.phonetic || "";
  $("back-pos").textContent = card.partOfSpeech || "";
  $("back-definition").textContent = card.definition || "(chưa có nghĩa)";
  $("back-definition").style.color = accentColor;

  const exampleEl = $("back-example");
  const translationEl = $("back-translation");
  const exampleWrap = $("example-wrap");
  const translationWrap = $("translation-wrap");
  if (exampleEl) exampleEl.textContent = card.exampleSentence ? `"${card.exampleSentence}"` : "";
  if (translationEl) translationEl.textContent = card.exampleTranslation ? `"${card.exampleTranslation}"` : "";
  if (exampleWrap) exampleWrap.style.display = card.exampleSentence ? "block" : "none";
  if (translationWrap) translationWrap.style.display = card.exampleTranslation ? "block" : "none";

  // Meaning box accent
  const meaningBox = $("meaning-box");
  if (meaningBox) {
    meaningBox.style.backgroundColor = accentColor + "15";
    meaningBox.style.borderLeft = `3px solid ${accentColor}`;
  }

  // Image
  const imgEl = $("card-img-el");
  const imageContainer = $("card-image");
  if (imgEl) {
    const src = card.imageUrl || "";
    const isPlaceholder = src.includes("default-placeholder");
    if (src && !isPlaceholder) {
      imgEl.src = src;
      imgEl.style.display = "block";
      if (imageContainer) imageContainer.style.display = "block";
    } else {
      imgEl.style.display = "none";
      if (imageContainer) imageContainer.style.display = "none";
    }
  }

  if (queueRemainingEl) queueRemainingEl.textContent = queue.length;

  // Animate card in
  if (flipInner) {
    flipInner.classList.remove("card-animate");
    void flipInner.offsetWidth; // reflow
    flipInner.classList.add("card-animate");
  }

  setFlipped(false);
  apiPost(`/api/flashcards/${card.id}/view`, {});
  lucide.createIcons();
}

// ── Flip ───────────────────────────────────────────────────────────────────
function setFlipped(val) {
  isFlipped = val;
  if (flipInner) {
    if (val) flipInner.classList.add("flipped");
    else flipInner.classList.remove("flipped");
  }
}
window.flipCard = () => setFlipped(!isFlipped);

// ── Session done screen ────────────────────────────────────────────────────
function showSessionDone() {
  if (flashcardArea) flashcardArea.style.display = "none";
  if (sessionDoneEl) { sessionDoneEl.style.display = "block"; sessionDoneEl.classList.add("fade-in"); }

  const learned = learnedIds.size;
  const unlearned = total - learned;
  const allDone = learned === total;

  if (doneTitleEl) doneTitleEl.textContent = allDone ? "Hoàn thành! 🎉" : "Xong lượt này!";
  if (doneDescEl) doneDescEl.textContent = allDone
    ? `Bạn đã thuộc tất cả ${total} từ trong chủ đề này.`
    : `Đã thuộc ${learned}/${total} từ. Còn ${unlearned} từ chưa thuộc.`;

  if (btnContinue) { btnContinue.style.display = unlearned > 0 ? "block" : "none"; btnContinue.textContent = `Tiếp tục học ${unlearned} từ còn lại`; }
  if (btnReviewLearned) { btnReviewLearned.style.display = learned > 0 ? "block" : "none"; btnReviewLearned.textContent = `Ôn lại ${learned} từ đã thuộc`; }
}

function startQueue(ids) {
  queue = [...ids];
  queueIndex = 0;
  if (sessionDoneEl) sessionDoneEl.style.display = "none";
  if (flashcardArea) flashcardArea.style.display = "block";
  if (queue.length === 0) { showSessionDone(); return; }
  renderFlashcard();
}

// ── Actions ────────────────────────────────────────────────────────────────
window.handleKnow = () => {
  const card = currentCard();
  if (!card) return;
  setFlipped(false);
  learnedIds.add(card.id);
  apiPost(`/api/study/flashcards/${card.id}/answer`, { isCorrect: true });
  const newQueue = queue.filter((_, i) => i !== queueIndex);
  queue = newQueue;
  updateProgressUI();
  if (newQueue.length === 0) { showSessionDone(); return; }
  queueIndex = queueIndex >= newQueue.length ? 0 : queueIndex;
  setTimeout(() => renderFlashcard(), 120);
};

window.handleAgain = () => {
  const card = currentCard();
  if (!card) return;
  setFlipped(false);
  apiPost(`/api/study/flashcards/${card.id}/answer`, { isCorrect: false });
  const newQueue = [...queue.filter((_, i) => i !== queueIndex), card.id];
  queue = newQueue;
  queueIndex = queueIndex >= newQueue.length - 1 ? 0 : queueIndex;
  setTimeout(() => renderFlashcard(), 120);
};

function handleRestart() {
  learnedIds.clear();
  updateProgressUI();
  startQueue(allCards.map(c => c.id));
}
function handleContinueUnlearned() { startQueue(allCards.filter(c => !learnedIds.has(c.id)).map(c => c.id)); }
function handleReviewLearned()     { startQueue(allCards.filter(c => learnedIds.has(c.id)).map(c => c.id)); }

if (btnReset) btnReset.addEventListener("click", handleRestart);
if (btnRestartDone) btnRestartDone.addEventListener("click", handleRestart);
if (btnContinue) btnContinue.addEventListener("click", handleContinueUnlearned);
if (btnReviewLearned) btnReviewLearned.addEventListener("click", handleReviewLearned);

// ── Tabs ───────────────────────────────────────────────────────────────────
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const tab = btn.dataset.tab;
    activeTab = tab;
    document.querySelectorAll(".tab-btn").forEach(b => {
      const active = b === btn;
      b.className = `tab-btn flex items-center gap-1.5 px-4 py-2.5 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors ${
        active ? "border-gray-900 text-gray-900 font-medium" : "border-transparent text-gray-400 hover:text-gray-700"
      }`;
    });
    if (tab === "learn") {
      if (tabLearnEl) tabLearnEl.style.display = "block";
      if (tabListEl) tabListEl.style.display = "none";
    } else {
      if (tabLearnEl) tabLearnEl.style.display = "none";
      if (tabListEl) tabListEl.style.display = "block";
      renderWordList(tab);
    }
    lucide.createIcons();
  });
});

// ── Word list ──────────────────────────────────────────────────────────────
function renderWordList(tab) {
  let cards = allCards;
  if (tab === "learned") cards = allCards.filter(c => learnedIds.has(c.id));
  if (tab === "unlearned") cards = allCards.filter(c => !learnedIds.has(c.id));

  if (listActionBar) {
    if (tab === "learned" && learnedIds.size > 0) {
      listActionBar.innerHTML = `<button onclick="handleReviewLearned();document.querySelector('[data-tab=learn]').click()"
        class="flex items-center gap-2 text-sm font-medium text-white px-4 py-2 rounded-lg transition-colors mb-3"
        style="background:${accentColor}">
        <i data-lucide="credit-card" class="w-4 h-4"></i> Ôn lại ${learnedIds.size} từ bằng Flash Card
      </button>`;
    } else if (tab === "unlearned") {
      const uids = allCards.filter(c => !learnedIds.has(c.id));
      listActionBar.innerHTML = uids.length > 0
        ? `<button onclick="handleContinueUnlearned();document.querySelector('[data-tab=learn]').click()"
          class="flex items-center gap-2 text-sm font-medium text-white px-4 py-2 rounded-lg transition-colors mb-3"
          style="background:${accentColor}">
          <i data-lucide="credit-card" class="w-4 h-4"></i> Học ${uids.length} từ chưa thuộc
        </button>` : "";
    } else {
      listActionBar.innerHTML = "";
    }
  }

  if (!wordListEl) return;
  if (cards.length === 0) {
    wordListEl.innerHTML = `<div class="text-center py-12 text-gray-400 text-sm">${
      tab === "learned" ? "Bạn chưa thuộc từ nào. Hãy bắt đầu học!" : "Tuyệt vời! Bạn đã thuộc hết các từ."
    }</div>`;
    lucide.createIcons(); return;
  }

  wordListEl.innerHTML = cards.map((card, idx) => {
    const learned = learnedIds.has(card.id);
    const isPlaceholder = !card.imageUrl || card.imageUrl.includes("default-placeholder");
    const imgHtml = isPlaceholder
      ? `<div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"><i data-lucide="book-open" class="w-4 h-4 text-gray-400"></i></div>`
      : `<img src="${card.imageUrl}" alt="${card.word}" class="w-10 h-10 rounded-lg object-cover shrink-0" />`;

    return `<details class="group bg-white border border-gray-200 rounded-xl overflow-hidden">
      <summary class="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors" style="list-style:none">
        <span class="text-xs text-gray-300 w-5 shrink-0 text-right">${idx + 1}</span>
        ${imgHtml}
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-semibold text-gray-900 text-sm">${card.word}</span>
            ${card.phonetic ? `<span class="text-gray-400 text-xs font-mono">${card.phonetic}</span>` : ""}
          </div>
          <p class="text-xs mt-0.5 font-medium text-gray-600 truncate">${card.definition || ""}</p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          ${learned
            ? `<span class="text-xs bg-green-50 px-2 py-0.5 rounded-full font-medium hidden sm:inline" style="color:${accentColor}">Đã thuộc</span>`
            : `<span class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full hidden sm:inline">Chưa thuộc</span>`}
          <i data-lucide="chevron-down" class="w-4 h-4 text-gray-300 group-open:rotate-180 transition-transform"></i>
        </div>
      </summary>
      <div class="px-4 pb-4 pt-0 border-t border-gray-100 space-y-3" style="margin-left:60px">
        <div class="space-y-2 pt-3">
          ${card.exampleSentence ? `<div><p class="text-xs text-gray-400 uppercase tracking-widest mb-0.5">Câu ví dụ</p><p class="text-sm text-gray-700 italic">"${card.exampleSentence}"</p></div>` : ""}
          ${card.exampleTranslation ? `<div><p class="text-xs text-gray-400 uppercase tracking-widest mb-0.5">Dịch nghĩa</p><p class="text-sm text-gray-500">"${card.exampleTranslation}"</p></div>` : ""}
        </div>
        <div class="flex items-center gap-3">
          <button onclick="event.stopPropagation();(function(){var u=new SpeechSynthesisUtterance('${card.word.replace(/'/g,"\\'")}');u.lang='en-US';u.rate=0.85;speechSynthesis.cancel();speechSynthesis.speak(u);})()"
            class="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 border border-gray-200 rounded-lg px-2.5 py-1.5 transition-colors">
            <i data-lucide="volume-2" class="w-3.5 h-3.5"></i> Phát âm
          </button>
        </div>
      </div>
    </details>`;
  }).join("");
  lucide.createIcons();
}

// ── Init ───────────────────────────────────────────────────────────────────
const urlParams = new URLSearchParams(window.location.search);
const startCardId = urlParams.get('card');

if (allCards.length > 0) {
  updateProgressUI();
  let initialQueue = allCards.map(c => c.id);
  
  if (startCardId && initialQueue.includes(startCardId)) {
    initialQueue = [startCardId, ...initialQueue.filter(id => id !== startCardId)];
  }
  
  startQueue(initialQueue);
}
