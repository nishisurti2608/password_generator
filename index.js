// Charcter Array
const passwords = [];

function generatePasswords() {
  passwords.length = 0;
  // Get user inputs
  const numPassword = parseInt(
    document.getElementById("numPassword").value,
    10
  );
  const lenPassword = parseInt(
    document.getElementById("lenPassword").value,
    10
  );
  const includeNumbers = document.getElementById("toggleNumbers").checked;
  const includeSpecialChars =
    document.getElementById("toggleSpecialChars").checked;

  // Validate inputs
  if (!numPassword || numPassword < 1 || numPassword > 20) {
    alert("Please enter a valid number between 1 and 20 for password count.");
    return;
  }
  if (!lenPassword || lenPassword < 1 || lenPassword > 20) {
    alert("Please enter a valid number between 1 and 20 for password length.");
    return;
  }

  // Build character set
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const specialChars = "~`!@#$%^&*()-_+={}[]|:;<>,.?/";

  let charSet = letters;
  if (includeNumbers) charSet += numbers;
  if (includeSpecialChars) charSet += specialChars;

  // Generate passwords

  for (let i = 0; i < numPassword; i++) {
    let password = "";
    for (let j = 0; j < lenPassword; j++) {
      const randomIndex = Math.floor(Math.random() * charSet.length);
      password += charSet[randomIndex];
    }
    passwords.push(password);
  }

  function escapeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  // Display passwords
  const passwordContainer = document.getElementById("passwordContainer");
  const buttonContainer = document.getElementById("buttonContainer");
  passwordContainer.innerHTML = " ";
  passwordContainer.innerHTML = passwords
    .map(
      (pw) =>
        `<div class="password" onclick="copyToClipboard('${escapeHTML(
          pw
        )}')">${escapeHTML(pw)}</div>`
    )
    .join("");

  // Add the "Copy All" button dynamically
  buttonContainer.innerHTML = `
    <button onclick="copyAllPasswords()" class="btn">Copy All Passwords</button>
      <button onclick="exportPasswordsAsPDF()" class="btn">Export As PDF</button>
  `;
}
// Function to copy all passwords
function copyAllPasswords() {
  const allPasswords = passwords.join("\n");
  navigator.clipboard
    .writeText(allPasswords)
    .then(() => {
      alert("All passwords copied!");
    })
    .catch((err) => {
      console.error("Failed to copy passwords: ", err);
    });
}
// copy to clip-board
function copyToClipboard(password) {
  navigator.clipboard.writeText(password).then(() => {
    alert(`Password "${password}" copied to clipboard!`);
  });
}

// Function to export passwords as PDF
async function exportPasswordsAsPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(12);

  // Add each password to the PDF
  passwords.forEach((pw, index) => {
    doc.text(`${index + 1}. ${pw}`, 10, 10 + index * 10);
  });

  // Save the PDF
  doc.save("passwords.pdf");
}

/**
 * Utility function to calculate the current theme setting.
 * Look for a local storage value.
 * Fall back to system setting.
 * Fall back to light mode.
 */
function calculateSettingAsThemeString({
  localStorageTheme,
  systemSettingDark,
}) {
  if (localStorageTheme !== null) {
    return localStorageTheme;
  }

  if (systemSettingDark.matches) {
    return "dark";
  }

  return "light";
}

/**
 * Utility function to update the button text and aria-label.
 */
function updateButton({ buttonEl, isDark }) {
  const newCta = isDark ? "🔆" : "🌙";

  buttonEl.setAttribute("aria-label", newCta);
  buttonEl.innerText = newCta;
}

/**
 * Utility function to update the theme setting on the html tag
 */
function updateThemeOnHtmlEl({ theme }) {
  document.querySelector("html").setAttribute("data-theme", theme);
}

/**
 * On page load:
 */

/**
 * 1. Grab what we need from the DOM and system settings on page load
 */
const button = document.querySelector("[data-theme-toggle]");
const localStorageTheme = localStorage.getItem("theme");
const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");

/**
 * 2. Work out the current site settings
 */
let currentThemeSetting = calculateSettingAsThemeString({
  localStorageTheme,
  systemSettingDark,
});

/**
 * 3. Update the theme setting and button text accoridng to current settings
 */
updateButton({ buttonEl: button, isDark: currentThemeSetting === "dark" });
updateThemeOnHtmlEl({ theme: currentThemeSetting });

/**
 * 4. Add an event listener to toggle the theme
 */
button.addEventListener("click", (event) => {
  const newTheme = currentThemeSetting === "dark" ? "light" : "dark";

  localStorage.setItem("theme", newTheme);
  updateButton({ buttonEl: button, isDark: newTheme === "dark" });
  updateThemeOnHtmlEl({ theme: newTheme });

  currentThemeSetting = newTheme;
});
