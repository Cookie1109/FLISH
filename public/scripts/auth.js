import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const config = window.__FIREBASE_CONFIG__ || {};
const messageEl = document.querySelector("[data-auth-message]");
const form = document.querySelector("[data-auth-form]");

function showMessage(message) {
  if (messageEl) {
    messageEl.textContent = message;
  }
}

if (!config.apiKey || !config.authDomain || !config.appId) {
  showMessage("Missing Firebase client config. Check .env values.");
} else if (form) {
  const app = initializeApp(config);
  const auth = getAuth(app);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    showMessage("");

    const email = form.elements.email.value.trim();
    const password = form.elements.password.value;
    const mode = form.dataset.mode;

    try {
      const credential =
        mode === "register"
          ? await createUserWithEmailAndPassword(auth, email, password)
          : await signInWithEmailAndPassword(auth, email, password);

      const token = await credential.user.getIdToken();
      localStorage.setItem("flish_id_token", token);
      await fetch("/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      window.location.href = "/dashboard";
    } catch (error) {
      showMessage(error.message || "Authentication failed");
    }
  });
}
