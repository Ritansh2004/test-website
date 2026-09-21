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