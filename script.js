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

  if (clickCount === 1) {
    character.src = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnZxaDdxNW9vYzRmMjdveGFndnR6NWtqZmt0NWFpOHY5MGtqczB3ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MDJ9IbxxvDUQM/giphy.gif"; 
    greeting.innerText = "Oh, hi! You clicked. 😊";
    btn.innerText = "Really? ✨";
  } else if (clickCount === 2) {
    character.src = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbTNpdTZ4cDh5bGN6NG9vNWNldzU3c3h2NXlndG5mZ3ZzcWhua256OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l41Yfxk5398UvNOiY/giphy.gif";
    greeting.innerText = "Yes, I mean it! 💖";
    btn.innerText = "Okay, what's next? 😉";
  } else {
    greeting.innerText = "This is live now! 🎉";
    btn.style.display = 'none';
  }
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

/* Default Main Typewriter Loop */
const phrases = [
  "You make my world so much brighter! ✨",
  "I made this special page for you 💖",
  "Keep smiling always! 😊",
  "Are you ready for the magic? 🎉"
];

let pIndex = 0;
let charIndex = 0;
let isDeleting = false;
const speed = 90;

function typeEffect() {
  const target = document.getElementById("typewriter");
  if (!target) return;

  const currentPhrase = phrases[pIndex];
  
  if (isDeleting) {
    target.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    target.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 45 : speed;

  if (!isDeleting && charIndex === currentPhrase.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    pIndex = (pIndex + 1) % phrases.length;
    delay = 400;
  }

  setTimeout(typeEffect, delay);
}

/* 2nd Custom Separate Typewriter Loop Logic */
let customPhrases = [];
let customPIndex = 0;
let customCharIndex = 0;
let customIsDeleting = false;
let customLoopStarted = false;

function customTypeEffect() {
  const target = document.getElementById("custom-typewriter");
  if (!target || customPhrases.length === 0) return;

  const currentPhrase = customPhrases[customPIndex];
  
  if (customIsDeleting) {
    target.textContent = currentPhrase.substring(0, customCharIndex - 1);
    customCharIndex--;
  } else {
    target.textContent = currentPhrase.substring(0, customCharIndex + 1);
    customCharIndex++;
  }

  let delay = customIsDeleting ? 45 : speed;

  if (!customIsDeleting && customCharIndex === currentPhrase.length) {
    delay = 1800;
    customIsDeleting = true;
  } else if (customIsDeleting && customCharIndex === 0) {
    customIsDeleting = false;
    customPIndex = (customPIndex + 1) % customPhrases.length;
    delay = 400;
  }

  setTimeout(customTypeEffect, delay);
}

function addCustomPhrase() {
  const input = document.getElementById("custom-text-input");
  const text = input.value.trim();

  if (text !== "") {
    customPhrases.push(text);
    input.value = "";

    const wrap = document.getElementById("custom-type-wrap");
    if (wrap) wrap.style.display = "flex";

    if (!customLoopStarted) {
      customLoopStarted = true;
      customTypeEffect();
    }
  }
}

document.addEventListener("DOMContentLoaded", typeEffect);