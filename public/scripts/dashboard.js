import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const config = window.__FIREBASE_CONFIG__ || {};
const statusEl = document.querySelector("[data-dashboard-status]");
const userEl = document.querySelector("[data-dashboard-user]");
const logoutBtn = document.querySelector("[data-logout]");

function setStatus(text) {
  if (statusEl) {
    statusEl.textContent = text;
  }
}

async function loadProfile(token) {
  try {
    const response = await fetch("/api/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      setStatus("Unauthorized. Please sign in again.");
      return;
    }

    const data = await response.json();
    if (userEl) {
      userEl.textContent = JSON.stringify(data, null, 2);
    }
    setStatus("Signed in.");
  } catch (error) {
    setStatus("Failed to load profile.");
  }
}

if (!config.apiKey || !config.authDomain || !config.appId) {
  setStatus("Missing Firebase client config. Check .env values.");
} else {
  const app = initializeApp(config);
  const auth = getAuth(app);
  const token = localStorage.getItem("flish_id_token");

  if (!token) {
    setStatus("Not signed in.");
  } else {
    loadProfile(token);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await signOut(auth);
      localStorage.removeItem("flish_id_token");
      window.location.href = "/auth/login";
    });
  }
}
