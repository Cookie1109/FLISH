import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const config = window.__FIREBASE_CONFIG__ || {};
const messageEl = document.querySelector("[data-auth-message]");
const form = document.querySelector("[data-auth-form]");

function showMessage(message, isError = true) {
  if (messageEl) {
    messageEl.textContent = message;
    messageEl.className = isError
      ? "text-red-500 text-sm text-center mt-4"
      : "text-green-600 text-sm text-center mt-4";
  }
}

/**
 * Gửi token mới lên server để cập nhật cookie.
 * Gọi khi đăng nhập lần đầu và khi token được refresh.
 */
async function syncTokenToServer(token) {
  localStorage.setItem("flish_id_token", token);
  await fetch("/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
}

if (!config.apiKey || !config.authDomain || !config.appId) {
  showMessage("Thiếu cấu hình Firebase. Kiểm tra lại biến môi trường.");
} else {
  const app = initializeApp(config);
  const auth = getAuth(app);

  // Tự động refresh cookie mỗi khi Firebase tự refresh token (mỗi ~55 phút)
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const freshToken = await user.getIdToken(/* forceRefresh= */ false);
        await syncTokenToServer(freshToken);
      } catch (e) {
        // Token không còn hợp lệ, xóa localStorage
        localStorage.removeItem("flish_id_token");
      }
    }
  });

  if (form) {
    const submitBtn = form.querySelector("button[type=submit]");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      showMessage("");

      const email = form.elements.email.value.trim();
      const password = form.elements.password.value;
      const mode = form.dataset.mode;

      // Disable button to prevent double-submit
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Đang xử lý...";
      }

      try {
        const credential =
          mode === "register"
            ? await createUserWithEmailAndPassword(auth, email, password)
            : await signInWithEmailAndPassword(auth, email, password);

        const token = await credential.user.getIdToken();
        await syncTokenToServer(token);
        window.location.href = "/topics";
      } catch (error) {
        // Map Firebase error codes to Vietnamese messages
        const errorMessages = {
          "auth/invalid-email": "Email không hợp lệ.",
          "auth/user-disabled": "Tài khoản đã bị vô hiệu hoá.",
          "auth/user-not-found": "Không tìm thấy tài khoản với email này.",
          "auth/wrong-password": "Mật khẩu không đúng.",
          "auth/email-already-in-use": "Email này đã được đăng ký.",
          "auth/weak-password": "Mật khẩu phải có ít nhất 6 ký tự.",
          "auth/too-many-requests": "Quá nhiều lần thử. Vui lòng thử lại sau.",
          "auth/invalid-credential": "Email hoặc mật khẩu không đúng.",
        };
        const msg = errorMessages[error.code] || error.message || "Đã có lỗi xảy ra.";
        showMessage(msg);

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = mode === "register" ? "Tạo tài khoản" : "Đăng nhập";
        }
      }
    });
  }
}
