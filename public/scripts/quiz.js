const quizData = window.__QUIZ_DATA__ || {};
const cards = Array.isArray(quizData.cards) ? quizData.cards : [];
const sessionId = quizData.sessionId;

const cardTitle = document.querySelector("[data-quiz-word]");
const cardDefinition = document.querySelector("[data-quiz-definition]");
const cardExample = document.querySelector("[data-quiz-example]");
const progressEl = document.querySelector("[data-quiz-progress]");
const form = document.querySelector("[data-quiz-form]");
const answerInput = document.querySelector("[data-quiz-answer]");
const feedbackEl = document.querySelector("[data-quiz-feedback]");
const nextButton = document.querySelector("[data-quiz-next]");

let index = 0;
let answered = false;

function setFeedback(text) {
  if (feedbackEl) {
    feedbackEl.textContent = text;
  }
}

function renderCard() {
  const card = cards[index];
  if (!card) return;

  if (cardTitle) cardTitle.textContent = `Card ${index + 1}`;
  if (cardDefinition) cardDefinition.textContent = card.definition || "";
  if (cardExample) cardExample.textContent = card.exampleSentence || "";
  if (progressEl) {
    progressEl.textContent = `${index + 1} / ${cards.length}`;
  }

  if (answerInput) answerInput.value = "";
  answered = false;
  setFeedback("");
}

async function submitAnswer(event) {
  event.preventDefault();
  if (answered) return;

  const card = cards[index];
  if (!card || !sessionId) return;

  const token = localStorage.getItem("flish_id_token");
  if (!token) {
    setFeedback("Missing auth token. Please sign in again.");
    return;
  }

  const userAnswer = answerInput?.value || "";

  try {
    const response = await fetch(`/quiz/${sessionId}/answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        flashcardId: card.id,
        userAnswer,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      setFeedback(data.error || "Submit failed");
      return;
    }

    answered = true;
    if (data.isCorrect) {
      setFeedback("Correct!");
    } else {
      setFeedback(`Incorrect. Answer: ${data.correctAnswer}`);
    }

    if (data.completed) {
      window.location.href = `/quiz/${sessionId}/result`;
      return;
    }

    if (nextButton) {
      nextButton.disabled = false;
    }
  } catch (error) {
    setFeedback("Submit failed");
  }
}

function nextCard() {
  if (!answered) return;
  index += 1;
  if (index >= cards.length) {
    index = cards.length - 1;
  }
  if (nextButton) nextButton.disabled = true;
  renderCard();
}

if (form) {
  form.addEventListener("submit", submitAnswer);
}

if (nextButton) {
  nextButton.addEventListener("click", nextCard);
}

renderCard();
