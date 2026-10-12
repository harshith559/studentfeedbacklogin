// ---------------------------------------------------------------
// DEMO ONLY: these accounts live in the browser, so anyone can read them.
// For a real website, check username/password on a server (Node, PHP, etc.)
// ---------------------------------------------------------------
const students = [
  { username: "student1", password: "feedback123", name: "Asha" },
  { username: "STU2024001", password: "Pass@2024", name: "Ravi" }
];

const form = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const rememberBox = document.getElementById("remember");
const message = document.getElementById("formMessage");
const submitBtn = document.getElementById("submitBtn");
const toggleBtn = document.getElementById("togglePw");

// Fill saved username if "Remember me" was used
const savedUser = localStorage.getItem("rememberedUser");
if (savedUser) {
  usernameInput.value = savedUser;
  rememberBox.checked = true;
}

// Show / hide password
toggleBtn.addEventListener("click", () => {
  const hidden = passwordInput.type === "password";
  passwordInput.type = hidden ? "text" : "password";
  toggleBtn.textContent = hidden ? "Hide" : "Show";
  toggleBtn.setAttribute("aria-label", hidden ? "Hide password" : "Show password");
});

function setError(input, errorId, text) {
  document.getElementById(errorId).textContent = text;
  input.closest(".field").classList.toggle("invalid", Boolean(text));
}

function validate() {
  let ok = true;
  const user = usernameInput.value.trim();
  const pass = passwordInput.value;

  if (!user) { setError(usernameInput, "usernameError", "Enter your username or student ID."); ok = false; }
  else setError(usernameInput, "usernameError", "");

  if (!pass) { setError(passwordInput, "passwordError", "Enter your password."); ok = false; }
  else if (pass.length < 6) { setError(passwordInput, "passwordError", "Password must be at least 6 characters."); ok = false; }
  else setError(passwordInput, "passwordError", "");

  return ok;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  message.textContent = "";
  message.className = "message";

  if (!validate()) return;

  submitBtn.disabled = true;
  submitBtn.textContent = "Checking...";

  // Small delay to imitate a server request
  setTimeout(() => {
    const user = usernameInput.value.trim();
    const pass = passwordInput.value;
    const match = students.find(s => s.username === user && s.password === pass);

    if (match) {
      if (rememberBox.checked) localStorage.setItem("rememberedUser", user);
      else localStorage.removeItem("rememberedUser");

      sessionStorage.setItem("loggedInStudent", match.name);
      message.textContent = "Welcome, " + match.name + "! Opening your feedback form...";
      message.classList.add("ok");

      // Change this to your next page:
      // setTimeout(() => { window.location.href = "feedback.html"; }, 1000);
    } else {
      message.textContent = "Username or password is incorrect. Try again.";
      message.classList.add("fail");
      form.classList.remove("shake");
      void form.offsetWidth; // restart animation
      form.classList.add("shake");
    }

    submitBtn.disabled = false;
    submitBtn.textContent = "Log in";
  }, 600);
});

document.getElementById("forgot").addEventListener("click", (e) => {
  e.preventDefault();
  alert("Please contact your class teacher or the admin office to reset your password.");
});