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
const feedbackBox = document.getElementById("feedback-box");
const feedbackIcon = document.getElementById("feedback-icon");
const nextButton = document.getElementById("btn-next");
const submitButton = document.getElementById("btn-submit");

let index = 0;
let answered = false;

function setFeedback(state, text, correctAnswer) {
  if (!feedbackBox || !feedbackEl) return;
  
  // Reset
  feedbackBox.className = "hidden rounded-xl p-4 text-sm transition-all mt-4";
  answerInput.classList.remove("border-green-500", "ring-green-500", "border-red-500", "ring-red-500");
  if (feedbackIcon) feedbackIcon.classList.add("hidden");

  if (!state) return; // 'none'

  feedbackBox.classList.remove("hidden");
  if (feedbackIcon) feedbackIcon.classList.remove("hidden");

  if (state === "correct") {
    feedbackBox.classList.add("bg-green-50", "text-green-800", "border", "border-green-200");
    feedbackEl.innerHTML = `🎉 <strong>Chính xác!</strong> Bạn làm rất tốt.`;
    if (feedbackIcon) feedbackIcon.innerHTML = `<i data-lucide="check-circle" class="w-6 h-6 text-green-500"></i>`;
    answerInput.classList.add("border-green-500", "ring-green-500");
  } else if (state === "incorrect") {
    feedbackBox.classList.add("bg-red-50", "text-red-800", "border", "border-red-200");
    feedbackEl.innerHTML = `❌ <strong>Chưa chính xác!</strong> Đáp án đúng là: <span class="font-bold text-red-900 ml-1 bg-red-100 px-2 py-0.5 rounded">${correctAnswer}</span>`;
    if (feedbackIcon) feedbackIcon.innerHTML = `<i data-lucide="x-circle" class="w-6 h-6 text-red-500"></i>`;
    answerInput.classList.add("border-red-500", "ring-red-500");
  } else if (state === "error") {
    feedbackBox.classList.add("bg-orange-50", "text-orange-800", "border", "border-orange-200");
    feedbackEl.innerHTML = `⚠️ <strong>Lỗi:</strong> ${text}`;
  }
  
  if (window.lucide) lucide.createIcons();
}

function renderCard() {
  const card = cards[index];
  if (!card) return;

  if (cardTitle) cardTitle.textContent = `Thẻ ${index + 1}`;
  if (cardDefinition) cardDefinition.textContent = card.definition || "";
  if (cardExample) {
    if (card.exampleSentence) {
      cardExample.textContent = `"${card.exampleSentence}"`;
      cardExample.style.display = "block";
    } else {
      cardExample.style.display = "none";
    }
  }
  
  if (progressEl) {
    progressEl.textContent = `Tiến độ: ${index + 1} / ${cards.length}`;
  }

  if (answerInput) {
    answerInput.value = "";
    answerInput.disabled = false;
    answerInput.focus();
  }
  
  answered = false;
  setFeedback(null);
  
  if (submitButton) submitButton.style.display = "block";
  if (nextButton) {
    nextButton.style.display = "none";
    nextButton.disabled = true;
  }
}

async function submitAnswer(event) {
  event.preventDefault();
  
  // If already answered, pressing Enter in the form should go to the next card
  if (answered) {
    nextCard();
    return;
  }

  const card = cards[index];
  if (!card || !sessionId) return;

  const token = localStorage.getItem("flish_id_token");
  if (!token) {
    setFeedback("error", "Vui lòng đăng nhập lại để tiếp tục.");
    return;
  }

  const userAnswer = answerInput?.value.trim() || "";
  if (!userAnswer) return;

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.innerHTML = '<div class="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin mx-auto"></div>';
  }

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
      setFeedback("error", data.error || "Không thể nộp bài. Vui lòng thử lại.");
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Nộp bài";
      }
      return;
    }

    answered = true;
    answerInput.disabled = true; // Lock input

    if (data.isCorrect) {
      setFeedback("correct");
    } else {
      setFeedback("incorrect", "", data.correctAnswer);
    }

    if (data.completed) {
      if (nextButton) {
        nextButton.textContent = "Xem kết quả";
        nextButton.classList.remove("bg-white", "text-gray-700");
        nextButton.classList.add("bg-indigo-600", "text-white", "hover:bg-indigo-700", "border-indigo-600");
      }
    }

    if (submitButton) submitButton.style.display = "none";
    if (nextButton) {
      nextButton.style.display = "block";
      nextButton.disabled = false;
      nextButton.focus(); // Auto focus next button so they can just hit Enter
    }
  } catch (error) {
    setFeedback("error", "Lỗi kết nối mạng.");
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "Nộp bài";
    }
  }
}

function nextCard() {
  if (!answered) return;
  index += 1;
  
  const card = cards[index - 1]; // Current card
  // Check if we just completed the last card
  if (index >= cards.length) {
    window.location.href = `/quiz/${sessionId}/result`;
    return;
  }
  
  if (submitButton) {
    submitButton.disabled = false;
    submitButton.textContent = "Nộp bài";
  }
  
  renderCard();
}

if (form) {
  form.addEventListener("submit", submitAnswer);
}

if (nextButton) {
  nextButton.addEventListener("click", nextCard);
}

renderCard();
