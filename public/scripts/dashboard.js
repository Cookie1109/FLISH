import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const config = window.__FIREBASE_CONFIG__ || {};
const logoutBtn = document.querySelector("[data-logout]");

if (config.apiKey && config.authDomain && config.appId) {
  const app = initializeApp(config, "dashboard");
  const auth = getAuth(app);

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      logoutBtn.disabled = true;
      logoutBtn.textContent = "Đang đăng xuất...";
      try {
        await signOut(auth);
      } catch (e) {
        // Ignore Firebase sign-out errors (already signed out, network, etc.)
      }
      localStorage.removeItem("flish_id_token");
      await fetch("/auth/logout", { method: "POST" });
      window.location.href = "/auth/login";
    });
  }
}
