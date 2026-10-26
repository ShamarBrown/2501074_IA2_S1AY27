const STORAGE_KEY = "codingConfTicket";
const MAX_SIZE = 500 * 1024;                
const ALLOWED_TYPES = ["image/jpeg", "image/png"];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
const GITHUB_REGEX = /^@[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/; 

/* documents references to the form and its input fields */
const form = document.getElementById("reg-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const githubInput = document.getElementById("github");
const avatarInput = document.getElementById("avatar");
const dropzone = document.getElementById("dropzone");
const dropEmpty = document.getElementById("drop-empty");
const dropPreview = document.getElementById("drop-preview");
const previewImg = document.getElementById("preview-img");

/* Avatar stored as a data URL once it has passed validation */
let avatarData = "";

/* Shows an error under a field and flag the input as invalid. */
function showError(input, hintId, message) {
  const hint = document.getElementById(hintId);
  hint.textContent = message;
  hint.hidden = false;
  input.setAttribute("aria-invalid", "true");
}

/* Clear any error under a field and unflag the input as invalid. */
function clearError(input, hintId) {
  const hint = document.getElementById(hintId);
  hint.textContent = "";
  hint.hidden = true;
  input.removeAttribute("aria-invalid");
}
/* Each validation function returns true when the value is valid */
function validateName() {
  if (nameInput.value.trim() === "") {
    showError(nameInput, "name-hint", "Please enter your full name.");
    return false;
  }
  clearError(nameInput, "name-hint");
  return true;
}

function validateEmail() {
  if (!EMAIL_REGEX.test(emailInput.value.trim())) {
    showError(emailInput, "email-hint", "Please enter a valid email address.");
    return false;
  }
  clearError(emailInput, "email-hint");
  return true;
}

function validateGithub() {
  if (!GITHUB_REGEX.test(githubInput.value.trim())) {
    showError(githubInput, "github-hint", "Enter a GitHub username starting with @ (e.g. @yourusername).");
    return false;
  }
  clearError(githubInput, "github-hint");
  return true;
}
/* Validate the avatar file input. Returns true if valid, false otherwise. */
function validateAvatar() {
  const hint = document.getElementById("avatar-hint");
  const file = avatarInput.files[0];
  let message = "";

  if (!file && !avatarData) message = "Please upload an avatar image.";
  else if (file && !ALLOWED_TYPES.includes(file.type)) message = "Invalid file type. Please upload a JPG or PNG.";
  else if (file && file.size > MAX_SIZE) message = "File too large. Please upload a photo under 500KB.";

  hint.classList.toggle("error", message !== "");
  hint.setAttribute("role", message ? "alert" : "status");
  if (message) {
    hint.textContent = message;
    dropzone.setAttribute("aria-invalid", "true");
    return false;
  }
  hint.textContent = "Upload your photo (JPG or PNG, max size: 500KB).";
  dropzone.removeAttribute("aria-invalid");
  return true;
}
/* Switch between the empty dropzone and the image preview. */
function showPreview(src) {
  previewImg.src = src;
  dropEmpty.hidden = src === "";
  dropPreview.hidden = src === "";
}
/* Validate a chosen file, then read it as a data URL for preview */
function handleFile(file) {
  avatarData = "";
  showPreview("");
  if (!file) return;
  if (!validateAvatar()) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    avatarData = reader.result;
    showPreview(avatarData);
  });
  reader.readAsDataURL(file);
}

avatarInput.addEventListener("change", () => handleFile(avatarInput.files[0]));

document.getElementById("remove-btn").addEventListener("click", () => {
  avatarInput.value = "";
  avatarData = "";
  showPreview("");
});
document.getElementById("change-btn").addEventListener("click", () => avatarInput.click());

dropzone.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropzone.classList.add("is-dragover");
});
dropzone.addEventListener("dragleave", () => dropzone.classList.remove("is-dragover"));
dropzone.addEventListener("drop", (event) => {
  event.preventDefault();
  dropzone.classList.remove("is-dragover");
  avatarInput.files = event.dataTransfer.files;
  handleFile(avatarInput.files[0]);
});

nameInput.addEventListener("blur", validateName);
emailInput.addEventListener("blur", validateEmail);
githubInput.addEventListener("blur", validateGithub);

form.addEventListener("submit", (event) => {
  event.preventDefault(); 
  const results = [validateAvatar(), validateName(), validateEmail(), validateGithub()];
  if (results.includes(false)) {
    form.querySelector("[aria-invalid='true']")?.focus();
    return;
  }

  const ticket = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    github: githubInput.value.trim(),
    avatar: avatarData,
    serial: "#" + String(Math.floor(Math.random() * 99999) + 1).padStart(5, "0")
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ticket));
    window.location.href = "/2501074_IA2_S1AY27/HTML/ticket.html";
  } catch (error) {
    /* Storage can fail if the browser is full or blocked */
    showError(githubInput, "github-hint", "Could not save your details. Please try again.");
  }
});
