// --- Theme toggle button: sun/moon only ---
const themeToggle = document.getElementById('theme-toggle');
function setTheme(isDark) {
  if (isDark) {
    document.body.classList.add('dark-theme');
    themeToggle.innerHTML = '☀️';
    themeToggle.title = 'Switch to light mode';
  } else {
    document.body.classList.remove('dark-theme');
    themeToggle.innerHTML = '🌙';
    themeToggle.title = 'Switch to dark mode';
  }
  localStorage.setItem('clickCircleTheme', isDark ? 'dark' : 'light');
}
themeToggle.addEventListener('click', () => {
  setTheme(!document.body.classList.contains('dark-theme'));
});
window.addEventListener('DOMContentLoaded', () => {
  setTheme(localStorage.getItem('clickCircleTheme') === 'dark');
});

// --- Mode sidebar logic ---
const modeBtns = document.querySelectorAll('.mode-btn');
let currentMode = "classic"; // default
modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    modeBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    currentMode = btn.getAttribute('data-mode');
    updateModeUI();
    saveSettings();
  });
});
function updateModeUI() {
  // You can expand this function for advanced mode-specific UI
  // For now, nothing to update
}

let settingRandomSize = false; // will be overridden by mode or settings
let persistentSettingsKey = "clickCircleSettingsV3";

// --- Game logic variables ---
const circle = document.getElementById('circle');
const powerupCircle = document.getElementById('powerup-circle');
const timerDisplay = document.getElementById('timer');
const timerBarFill = document.getElementById('timer-bar-fill');
const timerBarText = document.getElementById('timer-bar-text');
const scoreDisplay = document.getElementById('score');
const bestScoreDisplay = document.getElementById('best-score');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resumeBtn = document.getElementById('resume-btn');
const modal = document.getElementById('game-modal');
const modalMsg = document.getElementById('final-score-msg');
const closeModalBtn = document.getElementById('close-modal-btn');
const countdownOverlay = document.getElementById('countdown-overlay');
const countdownText = document.getElementById('countdown-text');
const settingRoundLength = document.getElementById('setting-round-length');
const settingCircleSize = document.getElementById('setting-circle-size');
const settingDifficulty = document.getElementById('setting-difficulty');

let score = 0;
let timeLeft = 30;
let roundLength = 30;
let circleSize = 60;
let difficulty = 'medium';
let bestScore = 0;
let timerInterval;
let gameActive = false;
let gamePaused = false;
let countdown = 3;
let countdownInterval;
let circleTimeout = null;
let powerupTimeout = null;
let powerupActive = false;
let doublePointsActive = false;
let doublePointsTimer = null;
let timerFrozen = false;
let freezeTimerTimeout = null;

const difficultyMoveDelay = {
  easy: 1100,
  medium: 750,
  hard: 450
};

function randomBetween(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}
function randomPosition(size) {
  const gameArea = document.getElementById('game-area');
  const maxX = gameArea.clientWidth - size;
  const maxY = gameArea.clientHeight - size;
  return {
    x: Math.floor(Math.random() * maxX),
    y: Math.floor(Math.random() * maxY)
  };
}
function randomColor() {
  const colors = ['#e74c3c','#3498db','#f1c40f','#9b59b6','#2ecc71','#e67e22','#1abc9c','#3affb7','#ff3ad4'];
  return colors[Math.floor(Math.random() * colors.length)];
}
function getCirclePoints(size) {
  return (currentMode === 'random' && size < 60) ? 2 : 1;
}
function showCircle(anim = 'pop') {
  let size = (currentMode === 'random') ? randomBetween(30, 120) : circleSize;
  let {x, y} = randomPosition(size);
  circle.style.width = `${size}px`;
  circle.style.height = `${size}px`;
  circle.style.left = x + 'px';
  circle.style.top = y + 'px';
  circle.style.background = randomColor();
  circle.style.display = 'block';
  circle.classList.remove('fadeout', 'pop', 'bounce');
  void circle.offsetWidth;
  circle.classList.add(anim);
  circle.dataset.size = size;

  // Handle auto-move for difficulty
  if (circleTimeout) clearTimeout(circleTimeout);
  if (gameActive && !gamePaused && difficulty !== 'easy') {
    circleTimeout = setTimeout(() => {
      circle.classList.remove('pop', 'bounce');
      circle.classList.add('fadeout');
      setTimeout(() => {
        if (gameActive && !gamePaused) showCircle('bounce');
      }, 230);
    }, difficultyMoveDelay[difficulty]);
  }
}
function hideCircle() {
  circle.style.display = 'none';
  circle.classList.remove('pop', 'fadeout', 'bounce');
  if (circleTimeout) clearTimeout(circleTimeout);
}
function spawnPowerup() {
  if (!gameActive || gamePaused || powerupActive) return;
  // Powerup drop rates:
  // - 5s: 10% chance
  // - 1s: 30% chance
  // - freeze: 0.1% chance
  // - double: rest
  let roll = Math.random();
  let type, icon, color;
  if (roll < 0.001) {
    type = 'freeze';
    icon = '❄️';
    color = 'linear-gradient(135deg, #c0eaff 60%, #6ae9ff 100%)';
  } else if (roll < 0.10) {
    type = 'time';
    icon = '+5s';
    color = 'linear-gradient(135deg, #ffe53a 60%, #ffb83a 100%)';
  } else if (roll < 0.40) {
    type = 'time1';
    icon = '+1s';
    color = 'linear-gradient(135deg, #fff53a 60%, #faff3a 100%)';
  } else {
    type = 'double';
    icon = '2x';
    color = 'linear-gradient(135deg, #9cfb3a 60%, #3affb7 100%)';
  }
  let size = type === 'freeze' ? 48 : 48;
  let {x, y} = randomPosition(size);
  powerupCircle.style.width = `${size}px`;
  powerupCircle.style.height = `${size}px`;
  powerupCircle.style.left = x + 'px';
  powerupCircle.style.top = y + 'px';
  powerupCircle.style.display = 'flex';
  powerupCircle.textContent = icon;
  powerupCircle.style.background = color;
  powerupCircle.classList.remove('fadeout', 'pop', 'bounce');
  void powerupCircle.offsetWidth;
  powerupCircle.classList.add('pop');
  powerupCircle.dataset.powerup = type;
  powerupActive = true;
  if (powerupTimeout) clearTimeout(powerupTimeout);
  powerupTimeout = setTimeout(() => {
    despawnPowerup();
  }, 2200);
}
function despawnPowerup() {
  powerupCircle.style.display = 'none';
  powerupCircle.classList.remove('pop', 'fadeout', 'bounce');
  powerupActive = false;
  if (powerupTimeout) clearTimeout(powerupTimeout);
}
powerupCircle.addEventListener('click', () => {
  if (!gameActive || gamePaused || !powerupActive) return;
  let ptype = powerupCircle.dataset.powerup;
  if (ptype === 'double') {
    doublePointsActive = true;
    powerupCircle.textContent = '2x!';
    powerupCircle.style.background = 'linear-gradient(135deg, #4bff3a 60%, #19e088 100%)';
    if (doublePointsTimer) clearTimeout(doublePointsTimer);
    doublePointsTimer = setTimeout(() => {
      doublePointsActive = false;
    }, 5000);
  } else if (ptype === 'time') {
    timeLeft += 5;
    if (timeLeft > roundLength) timeLeft = roundLength;
    timerDisplay.textContent = timeLeft;
    updateTimerBar();
    powerupCircle.textContent = '+5!';
    powerupCircle.style.background = 'linear-gradient(135deg, #ffe53a 60%, #ff8c3a 100%)';
  } else if (ptype === 'time1') {
    timeLeft += 1;
    if (timeLeft > roundLength) timeLeft = roundLength;
    timerDisplay.textContent = timeLeft;
    updateTimerBar();
    powerupCircle.textContent = '+1!';
    powerupCircle.style.background = 'linear-gradient(135deg, #fff53a 60%, #fff83a 100%)';
  } else if (ptype === 'freeze') {
    timerFrozen = true;
    powerupCircle.textContent = '❄️';
    powerupCircle.style.background = 'linear-gradient(135deg, #a0edff 60%, #39cfff 100%)';
    document.getElementById('timer-bar-fill').style.opacity = 0.6;
    if (freezeTimerTimeout) clearTimeout(freezeTimerTimeout);
    freezeTimerTimeout = setTimeout(() => {
      timerFrozen = false;
      document.getElementById('timer-bar-fill').style.opacity = 1;
    }, 10000);
  }
  setTimeout(() => {
    despawnPowerup();
  }, 350);
});
function maybeSpawnPowerup() {
  if (Math.random() < 0.14 && !powerupActive) {
    setTimeout(spawnPowerup, randomBetween(200, 1100));
  }
}
function updateTimerBar() {
  let percent = Math.max(0, timeLeft) / roundLength * 100;
  timerBarFill.style.width = percent + "%";
  timerBarText.textContent = `${timeLeft}s`;
}
function saveSettings() {
  let settings = {
    roundLength,
    circleSize,
    difficulty,
    theme: document.body.classList.contains('dark-theme') ? 'dark' : 'light',
    mode: currentMode
  };
  localStorage.setItem(persistentSettingsKey, JSON.stringify(settings));
}
function loadSettings() {
  let settings = localStorage.getItem(persistentSettingsKey);
  if (settings) {
    try {
      let s = JSON.parse(settings);
      if (s.roundLength) settingRoundLength.value = s.roundLength;
      if (s.circleSize) settingCircleSize.value = s.circleSize;
      if (s.difficulty) settingDifficulty.value = s.difficulty;
      if (s.mode) {
        currentMode = s.mode;
        modeBtns.forEach(b => {
          if (b.getAttribute('data-mode') === currentMode) b.classList.add('selected');
          else b.classList.remove('selected');
        });
      }
    } catch {}
  }
  updateSettings();
}
function loadBestScore() {
  const storedBest = localStorage.getItem('bestClickCircleScore');
  bestScore = storedBest ? parseInt(storedBest, 10) : 0;
  bestScoreDisplay.textContent = bestScore;
}
function saveBestScore(newScore) {
  if (newScore > bestScore) {
    bestScore = newScore;
    localStorage.setItem('bestClickCircleScore', bestScore);
    bestScoreDisplay.textContent = bestScore;
  }
}
function updateSettings() {
  roundLength = Math.max(10, Math.min(120, parseInt(settingRoundLength.value, 10) || 30));
  circleSize = Math.max(30, Math.min(120, parseInt(settingCircleSize.value, 10) || 60));
  difficulty = settingDifficulty.value;
  timerDisplay.textContent = roundLength;
  updateTimerBar();
  saveSettings();
}
settingRoundLength.addEventListener('input', updateSettings);
settingCircleSize.addEventListener('input', updateSettings);
settingDifficulty.addEventListener('change', updateSettings);

function startCountdown() {
  countdown = 3;
  countdownOverlay.style.display = 'flex';
  countdownText.textContent = countdown;
  countdownText.style.animation = 'pop 0.38s';
  countdownInterval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      countdownText.textContent = countdown;
      countdownText.style.animation = 'pop 0.38s';
    } else if (countdown === 0) {
      countdownText.textContent = 'GO!';
      countdownText.style.animation = 'bounce 0.38s';
    } else {
      clearInterval(countdownInterval);
      countdownOverlay.style.display = 'none';
      startGameNow();
    }
  }, 850);
}
function startGame() {
  if (gameActive || gamePaused) return;
  updateSettings();
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  resumeBtn.disabled = true;
  hideCircle();
  despawnPowerup();
  score = 0;
  timeLeft = roundLength;
  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;
  updateTimerBar();
  startCountdown();
}
function startGameNow() {
  gameActive = true;
  gamePaused = false;
  doublePointsActive = false;
  timerFrozen = false;
  document.getElementById('timer-bar-fill').style.opacity = 1;

  // --- Mode logic hooks ---
  if (currentMode === 'classic' || currentMode === 'random') {
    showCircle('pop');
    timerInterval = setInterval(() => {
      if (!gamePaused && !timerFrozen) {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        updateTimerBar();
        if (timeLeft <= 0) {
          endGame();
        }
      }
    }, 1000);
  } else if (currentMode === 'survival') {
    timeLeft = 5;
    timerDisplay.textContent = timeLeft;
    updateTimerBar();
    showCircle('pop');
    timerInterval = setInterval(() => {
      if (!gamePaused && !timerFrozen) {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        updateTimerBar();
        if (timeLeft <= 0) endGame();
      }
    }, 1000);
  } else if (currentMode === 'precision') {
    showCircle('pop');
    timerInterval = setInterval(() => {
      if (!gamePaused && !timerFrozen) {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        updateTimerBar();
        if (timeLeft <= 0) endGame();
      }
    }, 1000);
  } else if (currentMode === 'memory') {
    alert("Memory mode coming soon!");
    endGame();
  }
}
function endGame() {
  gameActive = false;
  hideCircle();
  despawnPowerup();
  clearInterval(timerInterval);
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  resumeBtn.disabled = true;
  saveBestScore(score);
  modalMsg.innerHTML = `
    <span>Your score: <b>${score}</b></span><br>
    <span>Best score: <b>${bestScore}</b></span>
  `;
  modal.style.display = "flex";
}

circle.addEventListener('click', () => {
  if (!gameActive || gamePaused) return;
  let size = parseInt(circle.dataset.size, 10) || circleSize;
  let basePoints = getCirclePoints(size);
  let points = doublePointsActive ? basePoints * 2 : basePoints;

  if (currentMode === 'classic' || currentMode === 'random') {
    score += points;
    scoreDisplay.textContent = score;
    circle.classList.remove('pop', 'bounce');
    void circle.offsetWidth;
    circle.classList.add('pop');
    if (difficulty === 'easy') {
      showCircle('pop');
      maybeSpawnPowerup();
    }
  } else if (currentMode === 'survival') {
    score += points;
    scoreDisplay.textContent = score;
    timeLeft += 2;
    timerDisplay.textContent = timeLeft;
    updateTimerBar();
    showCircle('pop');
    maybeSpawnPowerup();
  } else if (currentMode === 'precision') {
    // Only award points if click is within 0.5s of circle appearance
    let now = Date.now();
    if (!circle.dataset.spawn) circle.dataset.spawn = now;
    let appeared = parseInt(circle.dataset.spawn, 10);
    if (now - appeared <= 500) {
      score += points;
      scoreDisplay.textContent = score;
    }
    showCircle('pop');
    maybeSpawnPowerup();
  }
});
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', () => {
  if (!gameActive || gamePaused) return;
  gamePaused = true;
  pauseBtn.disabled = true;
  resumeBtn.disabled = false;
  hideCircle();
  despawnPowerup();
  if (circleTimeout) clearTimeout(circleTimeout);
  if (powerupTimeout) clearTimeout(powerupTimeout);
  if (doublePointsTimer) clearTimeout(doublePointsTimer);
});
resumeBtn.addEventListener('click', () => {
  if (!gameActive || !gamePaused) return;
  gamePaused = false;
  pauseBtn.disabled = false;
  resumeBtn.disabled = true;
  showCircle('pop');
  maybeSpawnPowerup();
});
closeModalBtn.addEventListener('click', () => {
  modal.style.display = "none";
});

// ---- Powerup spawn for non-easy difficulties ----
function afterCircleShowForPowerup() {
  if (!gameActive || gamePaused) return;
  maybeSpawnPowerup();
}
circle.addEventListener('animationend', (e) => {
  if (e.animationName === "pop" || e.animationName === "bounce") {
    afterCircleShowForPowerup();
  }
});

// ---- On Page Load ----
hideCircle();
despawnPowerup();
loadBestScore();
loadSettings();
setTheme(localStorage.getItem('clickCircleTheme') === 'dark');
updateTimerBar();