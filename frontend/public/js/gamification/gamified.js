// ================= GAME STATE =================
const gameState = {
  instrument: null,
  level: null,
  gameScore: 0,
  gameTime: 0,
  currentQuestion: 0,
  correctAnswers: 0,
  gameQuestions: [],
  timerInterval: null
};

// ================= SAMPLE GAME QUESTIONS (replace with your real data) =================
const gameQuestions = {
  guitar: {
    1: [
      {
        question: "How many strings does a standard guitar have?",
        options: ["5", "6", "7", "12"],
        correct: 1
      },
      {
        question: "Which is the thinnest guitar string?",
        options: ["E (6th)", "A", "G", "E (1st)"],
        correct: 3
      }
    ]
  },
  piano: {
    1: [
      {
        question: "How many keys does a full piano have?",
        options: ["88", "76", "44", "100"],
        correct: 0
      }
    ]
  },
  theory: {
    1: [
      {
        question: "How many notes in a major scale?",
        options: ["5", "6", "7", "8"],
        correct: 2
      }
    ]
  }
};

// ================= SCREEN HANDLING =================
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(`screen-${id}`).classList.add("active");
}

// ================= GAME INSTRUCTIONS =================
function showGameInstructions() {
  const modal = document.getElementById("instruction-modal");
  const text = document.getElementById("instruction-text");

  text.innerHTML = `
    <p><strong>Welcome to ${gameState.instrument} Level ${gameState.level}</strong></p>
    <p>You will answer 5 questions. Each correct answer = 20 points.</p>
  `;

  modal.classList.add("active");
}

// ================= START GAME =================
function startGame() {
  document.getElementById("instruction-modal").classList.remove("active");

  gameState.gameScore = 0;
  gameState.gameTime = 0;
  gameState.currentQuestion = 0;
  gameState.correctAnswers = 0;

  gameState.gameQuestions =
    gameQuestions[gameState.instrument][gameState.level];

  // Timer
  gameState.timerInterval = setInterval(() => {
    gameState.gameTime++;
    document.getElementById("game-time").textContent = gameState.gameTime;
  }, 1000);

  showScreen("game");
  renderQuestion();
}

// ================= RENDER QUESTION =================
function renderQuestion() {
  const question = gameState.gameQuestions[gameState.currentQuestion];
  if (!question) return endGame();

  const container = document.getElementById("game-container");
  container.innerHTML = `
    <h3>Question ${gameState.currentQuestion + 1}</h3>
    <p>${question.question}</p>
    <div id="options"></div>
  `;

  const options = document.getElementById("options");

  question.options.forEach((opt, index) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt;
    btn.onclick = () => handleAnswer(index);
    options.appendChild(btn);
  });

  document.getElementById("game-score").textContent = gameState.gameScore;
}

// ================= ANSWER HANDLER =================
function handleAnswer(selected) {
  const q = gameState.gameQuestions[gameState.currentQuestion];
  const buttons = document.querySelectorAll(".option-btn");

  buttons.forEach(b => (b.disabled = true));

  if (selected === q.correct) {
    buttons[selected].classList.add("correct");
    gameState.correctAnswers++;
    gameState.gameScore += 20;
  } else {
    buttons[selected].classList.add("incorrect");
    buttons[q.correct].classList.add("correct");
  }

  setTimeout(() => {
    gameState.currentQuestion++;
    renderQuestion();
  }, 1200);
}

// ================= END GAME =================
function endGame() {
  clearInterval(gameState.timerInterval);

  const accuracy = Math.round(
    (gameState.correctAnswers / gameState.gameQuestions.length) * 100
  );

  document.getElementById("result-points").textContent = gameState.gameScore;
  document.getElementById("result-accuracy").textContent = accuracy + "%";

  showScreen("result");
}

// ================= DYNAMIC LEVEL LOAD =================
function loadLevels() {
  const grid = document.getElementById("selection-grid");
  grid.innerHTML = "";

  // simple: load levels 1–3
  for (let i = 1; i <= 3; i++) {
    const card = document.createElement("div");
    card.className = "level-card";
    card.dataset.level = i;
    card.innerHTML = `<h4>Level ${i}</h4>`;
    grid.appendChild(card);
  }
}

// ================= EVENT LISTENERS (THE IMPORTANT PART!) =================

// Start Game button inside modal
document.getElementById("start-game-btn").addEventListener("click", startGame);

// Mode Selection (Play / Learn)
document.querySelectorAll(".mode-card").forEach(card => {
  card.addEventListener("click", () => {
    const mode = card.dataset.mode;

    if (mode === "play") {
      showScreen("instrument");
    } else {
      showScreen("lesson");
    }
  });
});

// Instrument Selection
document.querySelectorAll(".instrument-card").forEach(card => {
  card.addEventListener("click", () => {
    gameState.instrument = card.dataset.instrument;
    showScreen("selection");
    loadLevels();
  });
});

// Level Selection
document.getElementById("selection-grid").addEventListener("click", e => {
  if (e.target.classList.contains("level-card")) {
    gameState.level = e.target.dataset.level;
    showGameInstructions();
  }
});
