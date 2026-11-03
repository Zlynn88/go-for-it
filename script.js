(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const screens = ["welcome-screen","time-screen","countdown-screen","game-screen","result-screen"];
  const praise = [
    { text: "Terrific!", image: "assets/ui/result_message_1.svg" },
    { text: "Wonderful!", image: "assets/ui/result_message_2.svg" },
    { text: "Excellent!", image: "assets/ui/result_message_3.svg" },
    { text: "You are a genius!", image: "assets/ui/result_message_4.svg" }
  ];
  let mode = "multiply";
  let duration = 30;
  let remaining = duration;
  let score = 0;
  let question = null;
  let typed = "";
  let timerId = null;
  let countdownId = null;
  let locked = false;
  let questionToken = 0;

  function showScreen(id) {
    screens.forEach(name => $(name).classList.toggle("active", name === id));
  }
  function stopTimers() {
    if (timerId) clearInterval(timerId);
    if (countdownId) clearInterval(countdownId);
    timerId = countdownId = null;
  }
  function chooseMode(next) {
    mode = next;
    document.querySelectorAll(".mode-button").forEach(btn => {
      const selected = btn.dataset.mode === mode;
      btn.classList.toggle("selected", selected);
      btn.setAttribute("aria-pressed", String(selected));
    });
  }
  function chooseTime(next) {
    duration = Number(next);
    document.querySelectorAll(".time-button").forEach(btn => {
      const selected = Number(btn.dataset.time) === duration;
      btn.classList.toggle("selected", selected);
      btn.setAttribute("aria-pressed", String(selected));
    });
  }
  function startCountdown() {
    stopTimers();
    showScreen("countdown-screen");
    let n = 3;
    $("countdown-number").textContent = n;
    $("countdown-number").classList.remove("go");
    countdownId = setInterval(() => {
      n -= 1;
      if (n > 0) $("countdown-number").textContent = n;
      else if (n === 0) $("countdown-number").textContent = "GO!";
      else {
        clearInterval(countdownId);
        countdownId = null;
        startGame();
      }
    }, 750);
  }
  function startGame() {
    stopTimers();
    score = 0;
    remaining = duration;
    $("score-value").textContent = score;
    updateTimer();
    showScreen("game-screen");
    nextQuestion();
    timerId = setInterval(() => {
      remaining -= 1;
      updateTimer();
      if (remaining <= 0) finishGame();
    }, 1000);
  }
  function updateTimer() {
    $("time-value").textContent = remaining;
    $("timer").classList.toggle("urgent", remaining <= 10 && remaining > 0);
  }
  function makeQuestion() {
    const a = 2 + Math.floor(Math.random() * 8);
    const b = 2 + Math.floor(Math.random() * 8);
    if (mode === "multiply") return { text: `${a} × ${b} = ?`, answer: String(a*b) };
    const product = a * b;
    return Math.random() < .5
      ? { text: `${product} ÷ ${a} = ?`, answer: String(b) }
      : { text: `${product} ÷ ${b} = ?`, answer: String(a) };
  }
  function nextQuestion() {
    questionToken += 1;
    question = makeQuestion();
    typed = "";
    locked = false;
    $("question").textContent = question.text;
    $("feedback").textContent = "Tap the numbers to answer";
    $("game-mascot").src = "assets/mascot/02_thinking.png";
    renderAnswer();
  }
  function renderAnswer() {
    const chars = typed.split("");
    ["answer-box-1","answer-box-2"].forEach((id,i) => {
      const box = $(id);
      box.textContent = chars[i] || "";
      box.classList.toggle("filled", Boolean(chars[i]));
      box.classList.remove("correct");
    });
  }
  function pressDigit(digit) {
    if (!question || locked || remaining <= 0 || typed.length >= 2) return;
    typed += digit;
    renderAnswer();
    const expectedLength = question.answer.length;
    if (typed.length >= expectedLength) checkAnswer();
  }
  function checkAnswer() {
    if (typed === question.answer) {
      locked = true;
      const token = questionToken;
      $("answer-box-1").classList.add("correct");
      if (typed.length > 1) $("answer-box-2").classList.add("correct");
      $("feedback").textContent = "Correct! Great job!";
      $("game-mascot").src = "assets/mascot/03_happy.png";
      score += 1;
      $("score-value").textContent = score;
      setTimeout(() => {
        if (token === questionToken && remaining > 0) nextQuestion();
      }, 260);
    } else {
      // Wrong answers clear automatically, without red styling or penalty.
      typed = "";
      renderAnswer();
      $("feedback").textContent = "Try again!";
      $("game-mascot").src = "assets/mascot/05_encouragement.png";
    }
  }
  function finishGame() {
    stopTimers();
    locked = true;
    $("final-score").textContent = score;
    const praiseChoice = praise[Math.floor(Math.random()*praise.length)];
    $("praise-message").textContent = praiseChoice.text;
    $("result-message-art").src = praiseChoice.image;
    $("result-message-art").alt = praiseChoice.text;
    showScreen("result-screen");
    launchConfetti();
  }
  function launchConfetti() {
    const layer = $("confetti-layer");
    layer.innerHTML = "";
    layer.classList.add("show");
    const colors = ["#B9DDF0","#FFF4DF","#E8DFF2","#F5DDD5","#DCEBDD"];
    for (let i=0;i<46;i++) {
      const piece = document.createElement("i");
      piece.className = "confetti-piece";
      piece.style.left = `${Math.random()*100}%`;
      piece.style.background = colors[i % colors.length];
      piece.style.animationDelay = `${Math.random()*1.1}s`;
      piece.style.animationDuration = `${2.2+Math.random()*1.3}s`;
      piece.style.transform = `rotate(${Math.random()*180}deg)`;
      layer.appendChild(piece);
    }
    setTimeout(() => layer.classList.remove("show"), 4200);
  }

  document.querySelectorAll(".mode-button").forEach(btn => btn.addEventListener("click", () => chooseMode(btn.dataset.mode)));
  document.querySelectorAll(".time-button").forEach(btn => btn.addEventListener("click", () => chooseTime(btn.dataset.time)));
  document.querySelectorAll(".number-key").forEach(btn => btn.addEventListener("click", () => pressDigit(btn.dataset.digit)));
  $("start-button").addEventListener("click", () => { showScreen("time-screen"); });
  $("back-home").addEventListener("click", () => showScreen("welcome-screen"));
  $("begin-countdown").addEventListener("click", startCountdown);
  $("play-again").addEventListener("click", () => {
    stopTimers();
    $("confetti-layer").classList.remove("show");
    chooseMode("multiply");
    chooseTime(30);
    showScreen("welcome-screen");
  });
  document.addEventListener("keydown", (event) => {
    if (!$("game-screen").classList.contains("active")) return;
    if (/^[0-9]$/.test(event.key)) pressDigit(event.key);
  });
  chooseMode("multiply");
  chooseTime(30);
})();