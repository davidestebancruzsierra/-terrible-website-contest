const SECRET_CODE = "1989";
const PIN_LENGHT = SECRET_CODE.length;
const game = document.getElementById("game");
const message = document.getElementById("message");
const pinDisplay = document.getElementById("pin-display");
const tries = document.getElementById("tries");
const buttons = document.querySelectorAll(".key");
const sound = document.getElementById("horrible-sound");

let currentInput = "";
let triesShow = 0;
let soundStarted = false;
let codeSolved = false;

function updatePinDisplay() {
  const chars = currentInput.padEnd(PIN_LENGHT, "-").split("");
  pinDisplay.innerHTML = "";
  chars.forEach((c) => {
    const span = document.createElement("span");
    span.textContent = c;
    pinDisplay.appendChild(span);
  });
}
function startHorribleSound() {
  if (soundStarted || codeSolved) return;
  soundStarted = true;
  sound.currentTime = 0;
  sound.play().catch(() => {
    console.warn(
      "autoplay blocked, touch another button if the sound does not play"
    );
  });
}
function stopHorribleSound() {
  codeSolved = true;
  sound.pause();
  sound.currentTime = 0;
}
function setMessage(text, type) {
  message.textContent = text;
  message.classList.remove("success", "error");
  if (type) {
    message.classList.add(type);
  }
}
function checkCode() {
  triesShow++;
  tries.textContent = triesShow;
  if (currentInput === SECRET_CODE) {
    setMessage("CORRECT CODE!", "success");
    stopHorribleSound();
  } else {
    setMessage("INCORRECT CODE :C", "error");
    game.classList.add("shake");
    setTimeout(() => game.classList.remove("shake"), 300);
    setTimeout(() => {
      currentInput = "";
      updatePinDisplay();
      if (!codeSolved) {
        sendMessage("TRY AGAIN!");
      }
    }, 500);
  }
}
function handleKey(key) {
  if (codeSolved) return;
  if (key === "clear") {
    currentInput = "";
    updatePinDisplay();
    setMessage("ENTER PIN CODE");
    return;
  }
  if (key === "delete") {
    currentInput = currentInput.slice(0, -1);
    updatePinDisplay();
    return;
  }
  startHorribleSound();
  if (currentInput.length < PIN_LENGHT) {
    currentInput += key;
    updatePinDisplay();
    if (currentInput.length === PIN_LENGHT) {
      setTimeout(checkCode, 150);
    }
  }
}

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.key;
    handleKey(key);
  });
});

window.addEventListener("keydown", (e) => {
  const key = e.key;
  if (key >= "0" && key <= "9") {
    handleKey(key);
  } else if (key === "Backspace") {
    handleKey("delete");
  } else if (key === "Escape") {
    handleKey("clear");
  }
});
updatePinDisplay();
