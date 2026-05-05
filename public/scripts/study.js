const studyData = window.__STUDY_DATA__ || {};
const cards = Array.isArray(studyData.cards) ? studyData.cards : [];

const cardEl = document.querySelector("[data-study-card]");
const wordEl = document.querySelector("[data-study-word]");
const detailEl = document.querySelector("[data-study-detail]");
const exampleEl = document.querySelector("[data-study-example]");
const statusEl = document.querySelector("[data-study-status]");
const progressEl = document.querySelector("[data-study-progress]");
const flipBtn = document.querySelector("[data-study-flip]");
const knownBtn = document.querySelector("[data-study-known]");
const unknownBtn = document.querySelector("[data-study-unknown]");
const nextBtn = document.querySelector("[data-study-next]");

let index = 0;

function updateProgress() {
  if (progressEl) {
    progressEl.textContent = `${index + 1} / ${cards.length}`;
  }
}

function updateStatus(card) {
  if (!statusEl) return;
  const level = card?.masteryLevel || "new";
  statusEl.textContent = `Status: ${level}`;
}

async function markViewed(cardId) {
  const token = localStorage.getItem("flish_id_token");
  if (!token) return;
  try {
    await fetch(`/api/flashcards/${cardId}/view`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

async function markStudyAnswer(cardId, isCorrect) {
  const token = localStorage.getItem("flish_id_token");
  if (!token) return;
  try {
    await fetch(`/api/study/flashcards/${cardId}/answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isCorrect }),
    });
  } catch (error) {
    console.error(error);
  }
}

function renderCard() {
  const card = cards[index];
  if (!card) return;

  if (wordEl) wordEl.textContent = card.word || "";
  if (detailEl) {
    detailEl.textContent = card.definition || "";
  }
  if (exampleEl) {
    exampleEl.textContent = card.exampleSentence || "";
  }

  if (cardEl) {
    cardEl.classList.remove("is-flipped");
  }

  updateProgress();
  updateStatus(card);
  markViewed(card.id);
}

function flipCard() {
  if (cardEl) {
    cardEl.classList.toggle("is-flipped");
  }
}

function nextCard() {
  index += 1;
  if (index >= cards.length) {
    index = 0;
  }
  renderCard();
}

if (flipBtn) flipBtn.addEventListener("click", flipCard);
if (nextBtn) nextBtn.addEventListener("click", nextCard);
if (knownBtn) {
  knownBtn.addEventListener("click", () => {
    const card = cards[index];
    if (!card) return;
    markStudyAnswer(card.id, true);
    nextCard();
  });
}
if (unknownBtn) {
  unknownBtn.addEventListener("click", () => {
    const card = cards[index];
    if (!card) return;
    markStudyAnswer(card.id, false);
    nextCard();
  });
}

renderCard();
