const form = document.querySelector("[data-card-form]");
const lookupButton = document.querySelector("[data-lookup]");
const messageEl = document.querySelector("[data-lookup-message]");

const fieldMap = {
  phonetic: "phonetic",
  audioUrl: "audioUrl",
  partOfSpeech: "partOfSpeech",
  definition: "definition",
  exampleSentence: "exampleSentence",
  exampleTranslation: "exampleTranslation",
  imageUrl: "imageUrl",
};

function setMessage(text) {
  if (messageEl) {
    messageEl.textContent = text;
  }
}

function fillField(name, value) {
  const input = form?.querySelector(`[name="${name}"]`);
  if (!input || !value) return;
  if (input.value && input.value.trim().length) return;
  input.value = value;
}

async function lookupWord() {
  const wordInput = form?.querySelector("[name=word]");
  const word = wordInput?.value.trim();
  if (!word) {
    setMessage("Enter a word first.");
    return;
  }

  const token = localStorage.getItem("flish_id_token");
  if (!token) {
    setMessage("Missing auth token. Please sign in again.");
    return;
  }

  setMessage("Looking up word...");

  try {
    const response = await fetch(`/api/lookup/${encodeURIComponent(word)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      setMessage("Lookup failed.");
      return;
    }

    const data = await response.json();
    Object.keys(fieldMap).forEach((key) => {
      fillField(fieldMap[key], data[key]);
    });

    setMessage("Auto-fill complete.");
  } catch (error) {
    setMessage("Lookup failed.");
  }
}

if (lookupButton && form) {
  lookupButton.addEventListener("click", lookupWord);
}
