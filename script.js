// User DOB -> personalized quiz -> result -> optional admin DOB locker
const SECRET_ADMIN_DOB = "2000-01-01"; // Change this to the website admin's real DOB (YYYY-MM-DD).

let userDob = "";
let currentQuestion = 0;
let quizQuestions = [];
let selectedAnswers = [];

function startExperience() {
  const music = document.getElementById("bg-music");
  const welcomeScreen = document.getElementById("welcome-screen");
  const dobScreen = document.getElementById("user-dob-screen");
  const muteBtn = document.getElementById("mute-btn");

  music.play().catch(() => {});
  welcomeScreen.style.opacity = "0";
  welcomeScreen.style.visibility = "hidden";
  setTimeout(() => welcomeScreen.style.display = "none", 500);

  dobScreen.style.display = "flex";
  muteBtn.style.display = "block";
}

let isMuted = false;
function toggleAudio() {
  const music = document.getElementById("bg-music");
  const muteBtn = document.getElementById("mute-btn");
  isMuted = !isMuted;
  music.muted = isMuted;
  muteBtn.innerText = isMuted ? "🔇" : "🔊";
}

function handleUserDobKey(event) {
  if (event.key === "Enter") submitUserDob();
}

function submitUserDob() {
  const input = document.getElementById("user-dob-input");
  const message = document.getElementById("user-dob-message");
  const dob = input.value;

  if (!dob) {
    message.textContent = "Please enter your full date of birth 💗";
    message.className = "password-message error";
    return;
  }

  userDob = dob;
  quizQuestions = getQuestionsForDob(userDob);
  selectedAnswers = [];
  currentQuestion = 0;

  message.textContent = "Got it! Let's see how well we know you. 💖";
  message.className = "password-message success";

  setTimeout(() => {
    document.getElementById("user-dob-screen").style.display = "none";
    document.getElementById("quiz-screen").style.display = "flex";
    showQuestion();
  }, 450);
}

function clearUserDobMessage() {
  const message = document.getElementById("user-dob-message");
  if (message) {
    message.textContent = "";
    message.className = "password-message";
  }
}

function specialDayForDob(dob) {
  const specialDays = {
    "01/01": "New Year's Day",
    "26/01": "Republic Day",
    "14/02": "Valentine's Day",
    "08/03": "International Women's Day",
    "01/05": "Labour Day",
    "15/08": "Independence Day",
    "05/09": "Teachers' Day",
    "02/10": "Gandhi Jayanti",
    "14/11": "Children's Day",
    "25/12": "Christmas Day"
  };
  return specialDays[dob] || null;
}

function formatDisplayDate(dob) {
  const date = new Date(`${dob}T00:00:00`);
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

function getDayName(dob) {
  const date = new Date(`${dob}T00:00:00`);
  return date.toLocaleDateString("en-IN", { weekday: "long" });
}

function getMonthName(dob) {
  const date = new Date(`${dob}T00:00:00`);
  return date.toLocaleDateString("en-IN", { month: "long" });
}

function getZodiacSign(dob) {
  const [, monthString, dayString] = dob.split("-");
  const month = Number(monthString);
  const day = Number(dayString);

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries ♈";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus ♉";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini ♊";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer ♋";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo ♌";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo ♍";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra ♎";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio ♏";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius ♐";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn ♑";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius ♒";
  return "Pisces ♓";
}

function shuffleOptions(options) {
  return [...options].sort(() => Math.random() - 0.5);
}

function getQuestionsForDob(dob) {
  const day = dob.slice(8, 10);
  const month = dob.slice(5, 7);
  const ddmm = `${day}/${month}`;
  const special = specialDayForDob(ddmm);
  const dayName = getDayName(dob);
  const monthName = getMonthName(dob);
  const zodiac = getZodiacSign(dob);

  const questions = [];

  if (special) {
    questions.push({
      type: "fixed",
      question: `Tumhare birthday (${formatDisplayDate(dob)}) par India mein kaunsa special day hota hai? 🇮🇳`,
      options: shuffleOptions([special, "Republic Day", "Independence Day", "Children's Day"]),
      answer: special
    });
  } else {
    questions.push({
      type: "fixed",
      question: `Tumhare birthday (${formatDisplayDate(dob)}) ka weekday kya tha? 📅`,
      options: shuffleOptions([dayName, "Monday", "Wednesday", "Saturday"]),
      answer: dayName
    });
  }

  questions.push({
    type: "fixed",
    question: `Tumhara birthday kis month mein aata hai? 🎂`,
    options: shuffleOptions([monthName, "January", "June", "December"]),
    answer: monthName
  });

  questions.push({
    type: "fixed",
    question: `Tumhari date of birth ke according tumhara zodiac sign kya hai? ✨`,
    options: shuffleOptions([zodiac, "Leo ♌", "Libra ♎", "Pisces ♓"]),
    answer: zodiac
  });

  // User-dependent questions: no correct/incorrect answer.
  questions.push({
    type: "open",
    question: "Agar hum dono ek perfect date par jaayein, tum kya choose karoge? 💕",
    options: ["Candlelight dinner 🕯️", "Long drive 🌙", "Beach walk 🌊", "Movie night 🎬"]
  });

  questions.push({
    type: "open",
    question: "Mere liye sabse cute surprise kya ho sakta hai? 🎁",
    options: ["Handwritten letter 💌", "Flowers 🌹", "Chocolate 🍫", "Surprise visit 🥰"]
  });

  questions.push({
    type: "open",
    question: "Ek romantic evening tumhare liye kaisi honi chahiye? ✨",
    options: ["Hours of talking 💬", "Stargazing 🌌", "Music together 🎶", "Bas saath rehna 💖"]
  });

  return questions;
}

function showQuestion() {
  const q = quizQuestions[currentQuestion];
  document.getElementById("quiz-progress").textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
  document.getElementById("quiz-question").textContent = q.question;

  const optionsWrap = document.getElementById("quiz-options");
  const message = document.getElementById("quiz-message");
  message.textContent = "";
  message.className = "quiz-message";
  optionsWrap.innerHTML = "";

  q.options.forEach(option => {
    const button = document.createElement("button");
    button.className = "quiz-option";
    button.textContent = option;
    button.onclick = () => answerQuestion(option, q, button);
    optionsWrap.appendChild(button);
  });
}

function answerQuestion(selected, question, clickedButton) {
  const message = document.getElementById("quiz-message");
  const buttons = document.querySelectorAll(".quiz-option");

  if (question.type === "open") {
    selectedAnswers.push({ question: question.question, answer: selected });
    message.textContent = "Aww, noted 💖";
    message.className = "quiz-message success";
  } else if (selected === question.answer) {
    selectedAnswers.push({ question: question.question, answer: selected });
    message.textContent = "Correct! 💖";
    message.className = "quiz-message success";
  } else {
    message.textContent = "Oops! Try again 😄";
    message.className = "quiz-message error";
    clickedButton.classList.add("wrong");
    setTimeout(() => clickedButton.classList.remove("wrong"), 450);
    return;
  }

  buttons.forEach(button => button.disabled = true);
  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < quizQuestions.length) showQuestion();
    else finishQuiz();
  }, 550);
}

function finishQuiz() {
  document.getElementById("quiz-screen").style.display = "none";
  document.getElementById("result-screen").style.display = "flex";
  renderResults();
}

function renderResults() {
  const resultList = document.getElementById("result-list");
  resultList.innerHTML = "";

  selectedAnswers.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "result-item";
    row.innerHTML = `<div class="result-question">${index + 1}. ${item.question}</div><div class="result-answer">${item.answer}</div>`;
    resultList.appendChild(row);
  });
}

function openSecretLocker() {
  document.getElementById("result-screen").style.display = "none";
  document.getElementById("final-locker").style.display = "flex";
  document.getElementById("admin-dob-input").value = "";
  clearAdminDobMessage();
}

function handleAdminDobKey(event) {
  if (event.key === "Enter") unlockFinalLocker();
}

function unlockFinalLocker() {
  const input = document.getElementById("admin-dob-input");
  const message = document.getElementById("admin-dob-message");
  const dob = input.value;

  if (!dob) {
    message.textContent = "Please enter the full admin date of birth 💗";
    message.className = "password-message error";
    return;
  }

  if (dob === SECRET_ADMIN_DOB) {
    message.textContent = "Secret unlocked! 💖";
    message.className = "password-message success";
    setTimeout(() => {
      document.getElementById("final-locker").style.display = "none";
      document.getElementById("proposal-screen").style.display = "flex";
    }, 450);
  } else {
    message.textContent = "Wrong admin date of birth. Try again! 🔒";
    message.className = "password-message error";
    input.value = "";
  }
}

function clearAdminDobMessage() {
  const message = document.getElementById("admin-dob-message");
  if (message) {
    message.textContent = "";
    message.className = "password-message";
  }
}

function moveNoButton() {
  const noBtn = document.getElementById("no-btn");
  const xMoves = [-90, -70, 70, 90, -110, 110];
  const yMoves = [-60, 60, -70, 70, -50];
  noBtn.style.transform = `translate(${xMoves[Math.floor(Math.random() * xMoves.length)]}px, ${yMoves[Math.floor(Math.random() * yMoves.length)]}px)`;
}

function acceptProposal() {
  document.querySelector(".letter-box").innerHTML = `
    <button class="close-btn" onclick="closeProposal()">×</button>
    <h2 style="color:#ff4b2b;margin-bottom:15px;margin-top:10px;">Yay! 🎉💖</h2>
    <p style="font-size:1rem;color:#444;line-height:1.5;">You just made me the happiest person ever! 🥰<br>Our journey begins now. ✨</p>`;
}

function closeProposal() {
  document.getElementById("proposal-screen").style.display = "none";
}

/* Canvas Trail */
const canvas = document.getElementById('trail-canvas');
const ctx = canvas.getContext('2d');

let points = [];
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Spark {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 1.6 + 1.2;
    this.speedX = (Math.random() - 0.5) * 3;
    this.speedY = (Math.random() - 0.5) * 3;
    this.color = `hsl(${Math.random() * 360}, 100%, 75%)`;
    this.life = 1;
    this.rotation = Math.random() * Math.PI;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= 0.035;
    this.rotation += 0.12;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      ctx.lineTo(Math.cos((i * Math.PI) / 2) * this.size * 2, Math.sin((i * Math.PI) / 2) * this.size * 2);
      ctx.lineTo(Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (this.size * 0.5), Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (this.size * 0.5));
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

function addPoint(x, y) {
  points.push({ x, y, time: Date.now() });
  for (let i = 0; i < 3; i++) particles.push(new Spark(x, y));
}

document.addEventListener('mousemove', (e) => addPoint(e.clientX, e.clientY));
document.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  addPoint(touch.clientX, touch.clientY);
});

function animateTrail() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const now = Date.now();
  points = points.filter(p => now - p.time < 150);

  if (points.length > 2) {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    ctx.strokeStyle = '#ff2a75';
    ctx.lineWidth = 6;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff65a3';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();
  }

  particles.forEach((p, index) => {
    p.update();
    p.draw();
    if (p.life <= 0) particles.splice(index, 1);
  });
  requestAnimationFrame(animateTrail);
}

animateTrail();
