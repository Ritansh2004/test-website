// Date of Birth Locker + About You Quiz
const SECRET_DOB = "01/01"; // Change this to the correct DOB (DD/MM).

let enteredDob = "";
let currentQuestion = 0;

function startExperience() {
  const music = document.getElementById("bg-music");
  const welcomeScreen = document.getElementById("welcome-screen");
  const muteBtn = document.getElementById("mute-btn");
  music.play().catch(() => {});
  welcomeScreen.style.opacity = "0";
  welcomeScreen.style.visibility = "hidden";
  setTimeout(() => welcomeScreen.style.display = "none", 500);
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

function formatDob(input) {
  let value = input.value.replace(/\D/g, "").slice(0, 4);
  if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
  input.value = value;
  clearDobMessage();
}

function handleDobKey(event) {
  if (event.key === "Enter") checkPassword();
}

function checkPassword() {
  const input = document.getElementById("dob-input");
  const message = document.getElementById("password-message");
  const locker = document.getElementById("locker-screen");
  const quiz = document.getElementById("quiz-screen");
  const dob = input.value.trim();

  if (!/^\d{2}\/\d{2}$/.test(dob)) {
    message.textContent = "Please enter your DOB as DD/MM 💗";
    message.className = "password-message error";
    return;
  }

  if (dob === SECRET_DOB) {
    enteredDob = dob;
    message.textContent = "DOB verified! 💖";
    message.className = "password-message success";
    setTimeout(() => {
      locker.style.display = "none";
      quiz.style.display = "flex";
      currentQuestion = 0;
      showQuestion();
    }, 450);
  } else {
    message.textContent = "Wrong date of birth. Try again! 🔒";
    message.className = "password-message error";
    input.value = "";
  }
}

function clearDobMessage() {
  const message = document.getElementById("password-message");
  if (message) { message.textContent = ""; message.className = "password-message"; }
}

function specialDayForDob(dob) {
  const specialDays = {
    "01/01": "New Year's Day", "26/01": "Republic Day", "14/02": "Valentine's Day",
    "08/03": "International Women's Day", "01/05": "Labour Day", "15/08": "Independence Day",
    "05/09": "Teachers' Day", "02/10": "Gandhi Jayanti", "14/11": "Children's Day", "25/12": "Christmas"
  };
  return specialDays[dob] || null;
}

function getQuestions() {
  const special = specialDayForDob(enteredDob);
  const dayOptions = special
    ? shuffleOptions([special, "Republic Day", "Independence Day", "Children's Day"], special)
    : ["Republic Day", "Independence Day", "Children's Day", "Inmein se koi nahi"];

  return [
    { type: "fixed", question: "Tumhare janmdin par India mein kaunsa special day hota hai?", options: dayOptions, answer: special || "Inmein se koi nahi" },
    { type: "open", question: "Agar hum dono ek perfect date par jaayein, tum kya choose karoge? 💕", options: ["Candlelight dinner 🕯️", "Long drive 🌙", "Beach walk 🌊", "Movie night 🎬"] },
    { type: "open", question: "Mere liye sabse cute surprise kya ho sakta hai? 🎁", options: ["Handwritten letter 💌", "Flowers 🌹", "Chocolate 🍫", "Surprise visit 🥰"] },
    { type: "open", question: "Ek romantic evening tumhare liye kaisi honi chahiye? ✨", options: ["Hours of talking 💬", "Stargazing 🌌", "Music together 🎶", "Bas saath rehna 💖"] },
    { type: "open", question: "Agar main tumhe ek sweet message bheju, tumhara reaction kya hoga? 🥰", options: ["Smile 😊", "Blush 🙈", "Reply instantly 💬", "Screenshot karke rakh lunga 💕"] }
  ];
}

function shuffleOptions(options, correct) {
  const shuffled = [...options].sort(() => Math.random() - 0.5);
  if (!shuffled.includes(correct)) shuffled[0] = correct;
  return shuffled;
}

function showQuestion() {
  const q = getQuestions()[currentQuestion];
  document.getElementById("quiz-progress").textContent = `Question ${currentQuestion + 1} of 5`;
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
    button.onclick = () => answerQuestion(option, q);
    optionsWrap.appendChild(button);
  });
}

function answerQuestion(selected, question) {
  const message = document.getElementById("quiz-message");
  const buttons = document.querySelectorAll(".quiz-option");

  if (question.type === "open") {
    message.textContent = "Aww, noted 💖";
    message.className = "quiz-message success";
  } else if (selected === question.answer) {
    message.textContent = "Correct! 💖";
    message.className = "quiz-message success";
  } else {
    message.textContent = "Oops! Try again 😄";
    message.className = "quiz-message error";
    return;
  }

  buttons.forEach(button => button.disabled = true);
  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < getQuestions().length) showQuestion();
    else finishQuiz();
  }, 650);
}

function finishQuiz() {
  document.getElementById("quiz-screen").style.display = "none";
  document.getElementById("final-locker").style.display = "flex";
}

function unlockFinalLocker() {
  document.getElementById("final-locker").style.display = "none";
  document.getElementById("proposal-screen").style.display = "flex";
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
  for (let i = 0; i < 3; i++) {
    particles.push(new Spark(x, y));
  }
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


