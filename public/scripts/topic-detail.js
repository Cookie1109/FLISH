const buttons = document.querySelectorAll("[data-view-card]");

async function markViewed(cardId) {
  const token = localStorage.getItem("flish_id_token");
  if (!token) {
    alert("Missing auth token. Please sign in again.");
    return;
  }

  try {
    const response = await fetch(`/api/flashcards/${cardId}/view`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      alert("Failed to mark viewed.");
    }
  } catch (error) {
    alert("Failed to mark viewed.");
  }
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const cardId = button.dataset.viewCard;
    if (cardId) {
      markViewed(cardId);
    }
  });
});
