// Date of Birth Locker + About You Quiz
const SECRET_DOB = "01/01"; // Change this to the correct DOB (DD/MM).

let enteredDob = "";
let currentQuestion = 0;

function formatDob(input) {
  let value = input.value.replace(/\D/g, "").slice(0, 4);
  if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
  input.value = value;
  clearDobMessage();
}

function handleDobKey(event) {
  if (event.key === "Enter") {
    checkPassword();
  }
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
    message.textContent = "Unlocked! Let's see how well you know me 💖";
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
  if (message) {
    message.textContent = "";
    message.className = "password-message";
  }
}

function specialDayForDob(dob) {
  const day = dob.slice(0, 2);
  const month = dob.slice(3, 5);
  const key = `${day}/${month}`;
  const specialDays = {
    "01/01": { name: "New Year's Day", answer: "New Year's Day" },
    "26/01": { name: "Republic Day", answer: "Republic Day" },
    "14/02": { name: "Valentine's Day", answer: "Valentine's Day" },
    "08/03": { name: "International Women's Day", answer: "International Women's Day" },
    "01/05": { name: "May Day / Labour Day", answer: "May Day / Labour Day" },
    "15/08": { name: "Independence Day", answer: "Independence Day" },
    "05/09": { name: "Teachers' Day", answer: "Teachers' Day" },
    "02/10": { name: "Gandhi Jayanti", answer: "Gandhi Jayanti" },
    "14/11": { name: "Children's Day", answer: "Children's Day" },
    "25/12": { name: "Christmas", answer: "Christmas" }
  };
  return specialDays[key] || null;
}

function getQuestions() {
  const special = specialDayForDob(enteredDob);
  const dayQuestion = special
    ? `Tumhare janmdin par India mein kaunsa special day hota hai?`
    : `Tumhare janmdin (${enteredDob}) ke aas-paas India mein kaunsa special occasion hota hai?`;

  const dayAnswer = special ? special.answer : "It depends on the date";
  const dayOptions = special
    ? shuffleOptions([special.answer, "Republic Day", "Independence Day", "Children's Day"], special.answer)
    : ["It depends on the date", "Republic Day", "Independence Day", "Children's Day"];

  return [
    { question: dayQuestion, options: dayOptions, answer: dayAnswer },
    { question: "Agar hum dono ek romantic date par jaayein, tum kya choose karoge? 💕", options: ["Candlelight dinner 🕯️", "Long drive 🌙", "Beach walk 🌊", "Movie night 🎬"], answer: "Candlelight dinner 🕯️" },
    { question: "Mere liye sabse cute surprise kya ho sakta hai? 🎁", options: ["Handwritten letter 💌", "Flowers 🌹", "Chocolate 🍫", "Surprise visit 🥰"], answer: "Handwritten letter 💌" },
    { question: "Agar main tumhe ek special message bheju, tum kya karoge? 💖", options: ["Smile 😊", "Blush 🙈", "Reply instantly 💬", "All of these 💕"], answer: "All of these 💕" },
    { question: "Perfect romantic evening tumhare liye kya hai? ✨", options: ["Talking for hours 💬", "Stargazing 🌌", "Music together 🎶", "All of these 💖"], answer: "All of these 💖" }
  ];
}

function shuffleOptions(options, correct) {
  const shuffled = [...options].sort(() => Math.random() - 0.5);
  if (!shuffled.includes(correct)) shuffled[0] = correct;
  return shuffled;
}

function showQuestion() {
  const questions = getQuestions();
  const q = questions[currentQuestion];
  document.getElementById("quiz-progress").textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  document.getElementById("quiz-question").textContent = q.question;
  const optionsWrap = document.getElementById("quiz-options");
  const message = document.getElementById("quiz-message");
  message.textContent = "";
  optionsWrap.innerHTML = "";

  q.options.forEach(option => {
    const button = document.createElement("button");
    button.className = "quiz-option";
    button.textContent = option;
    button.onclick = () => answerQuestion(option, q.answer);
    optionsWrap.appendChild(button);
  });
}

function answerQuestion(selected, correct) {
  const message = document.getElementById("quiz-message");
  const buttons = document.querySelectorAll(".quiz-option");

  if (selected === correct) {
    message.textContent = "Correct! 💖";
    message.className = "quiz-message success";
    buttons.forEach(button => button.disabled = true);
    setTimeout(() => {
      currentQuestion++;
      if (currentQuestion < getQuestions().length) {
        showQuestion();
      } else {
        finishQuiz();
      }
    }, 650);
  } else {
    message.textContent = "Oops! Try again 😄";
    message.className = "quiz-message error";
  }
}

function finishQuiz() {
  const quiz = document.getElementById("quiz-screen");
  const mainCard = document.getElementById("main-card");
  quiz.innerHTML = `
    <div class="quiz-badge">💖</div>
    <h1>You know me pretty well! 🥰</h1>
    <p class="quiz-subtitle">But there is still one more little surprise waiting for you...</p>
    <button onclick="openMainSurprise()">Open My Surprise 💌</button>
  `;
  quiz.style.display = "flex";
  mainCard.style.display = "none";
}

function openMainSurprise() {
  document.getElementById("quiz-screen").style.display = "none";
  document.getElementById("main-card").style.display = "flex";
}

let clickCount = 0;
let isMuted = false;

function startExperience() {
  const music = document.getElementById('bg-music');
  const welcomeScreen = document.getElementById('welcome-screen');
  const muteBtn = document.getElementById('mute-btn');

  music.play().catch(e => console.log("Audio play error:", e));

  welcomeScreen.style.opacity = '0';
  welcomeScreen.style.visibility = 'hidden';
  setTimeout(() => {
    welcomeScreen.style.display = 'none';
  }, 500);
  muteBtn.style.display = 'block';
}

function toggleAudio() {
  const music = document.getElementById('bg-music');
  const muteBtn = document.getElementById('mute-btn');

  if (isMuted) {
    music.muted = false;
    muteBtn.innerText = '🔊';
    isMuted = false;
  } else {
    music.muted = true;
    muteBtn.innerText = '🔇';
    isMuted = true;
  }
}

function firstInteraction() {
  const character = document.getElementById('live-character');
  const greeting = document.getElementById('greeting');
  const btn = document.getElementById('main-btn');

  clickCount++;

  // Fade out effect
  character.style.opacity = 0;
  greeting.style.opacity = 0;
  setTimeout(() => {
    if (clickCount === 1) {
      character.src = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnZxaDdxNW9vYzRmMjdveGFndnR6NWtqZmt0NWFpOHY5MGtqczB3ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MDJ9IbxxvDUQM/giphy.gif"; 
      greeting.innerText = "Oh, hi! You clicked. 😊";
      btn.innerText = "Really? ✨";
    } else if (clickCount === 2) {
      character.src = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbTNpdTZ4cDh5bGN6NG9vNWNldzU3c3h2NXlndG5mZ3ZzcWhua256OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l41Yfxk5398UvNOiY/giphy.gif";
      greeting.innerText = "Yes, I mean it! 💖";
      btn.innerText = "Open Secret Letter 💌";
    } else {
      // Show Secret Love Letter Proposal Card
      document.getElementById('proposal-screen').style.display = 'flex';
    }

    // Fade in effect
    character.style.opacity = 1;
    greeting.style.opacity = 1;
  }, 500);
}

// Non-overlapping "No" button escape logic
function moveNoButton() {
  const noBtn = document.getElementById('no-btn');
  
  // Directions array taaki button hamesha alag-alag jagah bhaage
  const xMoves = [-90, -70, 70, 90, -110, 110];
  const yMoves = [-60, 60, -70, 70, -50];
  
  const randomX = xMoves[Math.floor(Math.random() * xMoves.length)];
  const randomY = yMoves[Math.floor(Math.random() * yMoves.length)];

  noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
}

// "Yes" button celebration
function acceptProposal() {
  const letterBox = document.querySelector('.letter-box');
  letterBox.innerHTML = `
    <button class="close-btn" onclick="closeProposal()">×</button>
    <h2 style="color: #ff4b2b; margin-bottom: 15px; margin-top: 10px;">Yay! 🎉💖</h2>
    <p style="font-size: 1rem; color: #444; line-height: 1.5;">
      You just made me the happiest person ever! 🥰<br>Our journey begins now. ✨
    </p>
  `;
}

// Close Proposal Popup function
function closeProposal() {
  document.getElementById('proposal-screen').style.display = 'none';
  // Reset click count if they want to open it again via main button
  clickCount = 0;
  const greeting = document.getElementById('greeting');
  const btn = document.getElementById('main-btn');
  greeting.innerText = "Hi there! 😊";
  btn.style.display = 'block';
  btn.innerText = "Click Me! ✨";
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

/* Default Main Typewriter Phrases */
const phrases = [
  "You make my world so much brighter! ✨",
  "I made this special page for you 💖",
  "Keep smiling always! 😊",
  "Are you ready for the magic? 🎉"
];

/* Custom Phrases Pool */
let customPhrases = [];

let pIndex = 0;
let charIndex = 0;
let isDeleting = false;
const speed = 90;

let customPIndex = 0;
let customCharIndex = 0;

/* Synchronized Frame Loop Engine */
function syncTypeEffect() {
  const mainTarget = document.getElementById("typewriter");
  const customTarget = document.getElementById("custom-typewriter");

  if (!mainTarget) return;

  const currentPhrase = phrases[pIndex];

  if (isDeleting) {
    mainTarget.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;

    if (customPhrases.length > 0 && customTarget) {
      const currentCustomPhrase = customPhrases[customPIndex];
      customTarget.textContent = currentCustomPhrase.substring(0, customCharIndex - 1);
      customCharIndex--;
    }
  } else {
    mainTarget.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;

    if (customPhrases.length > 0 && customTarget) {
      const currentCustomPhrase = customPhrases[customPIndex];
      customTarget.textContent = currentCustomPhrase.substring(0, customCharIndex + 1);
      customCharIndex++;
    }
  }

  let delay = isDeleting ? 45 : speed;

  // Synced Sentence Completion Pause
  if (!isDeleting && charIndex === currentPhrase.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    pIndex = (pIndex + 1) % phrases.length;
    
    if (customPhrases.length > 0) {
      customPIndex = (customPIndex + 1) % customPhrases.length;
    }
    customCharIndex = 0;
    delay = 400;
  }

  setTimeout(syncTypeEffect, delay);
}

function addCustomPhrase() {
  const input = document.getElementById("custom-text-input");
  const text = input.value.trim();

  if (text !== "") {
    customPhrases.push(text);
    input.value = "";

    const wrap = document.getElementById("custom-type-wrap");
    if (wrap) wrap.style.display = "flex";
  }
}

document.addEventListener("DOMContentLoaded", syncTypeEffect);