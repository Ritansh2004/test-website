let clickCount = 0;
let isMuted = false;

function startExperience() {
  const music = document.getElementById('bg-music');
  const welcomeScreen = document.getElementById('welcome-screen');
  const muteBtn = document.getElementById('mute-btn');

  // Play audio on Enter click
  music.play().catch(e => console.log("Audio play error:", e));

  // Hide welcome screen and show mute button
  welcomeScreen.style.opacity = '0';
  welcomeScreen.style.visibility = 'hidden';
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
  const message = document.getElementById('message');
  const btn = document.getElementById('main-btn');

  clickCount++;

  if (clickCount === 1) {
    character.src = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnZxaDdxNW9vYzRmMjdveGFndnR6NWtqZmt0NWFpOHY5MGtqczB3ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MDJ9IbxxvDUQM/giphy.gif"; 
    greeting.innerText = "Oh, hi! You clicked. 😊";
    message.innerText = "You know, seeing you smile makes my entire day so much better.";
    btn.innerText = "Really? ✨";
  } else if (clickCount === 2) {
    character.src = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbTNpdTZ4cDh5bGN6NG9vNWNldzU3c3h2NXlndG5mZ3ZzcWhua256OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l41Yfxk5398UvNOiY/giphy.gif";
    greeting.innerText = "Yes, I mean it! 💖";
    message.innerText = "I made this whole website just to tell you how amazing I think you are.";
    btn.innerText = "Okay, what's next? 😉";
  } else {
    greeting.innerText = "This is live now! 🎉";
    message.innerText = "Aap isse check kar rahe ho directly mere unique address par!";
    btn.style.display = 'none';
  }
}

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

// Sparkle Particle Constructor
class Spark {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 4 + 2;
    this.speedX = (Math.random() - 0.5) * 5;
    this.speedY = (Math.random() - 0.5) * 5;
    this.color = `hsl(${Math.random() * 60 + 330}, 100%, 75%)`; // Pink/White glowing shades
    this.life = 1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= 0.04;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function addPoint(x, y) {
  points.push({ x, y, time: Date.now() });
  
  // Sparks emit karne ke liye
  for (let i = 0; i < 2; i++) {
    particles.push(new Spark(x, y));
  }
}

// Event Listeners (Mouse & Mobile Touch)
document.addEventListener('mousemove', (e) => addPoint(e.clientX, e.clientY));
document.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  addPoint(touch.clientX, touch.clientY);
});

function animateTrail() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const now = Date.now();
  
  // 180ms tak points active rahenge
  points = points.filter(p => now - p.time < 180);

  // 1. Draw Smooth Glowing Blade Trail
  if (points.length > 2) {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Outer Neon Glow Layer
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    ctx.strokeStyle = '#ff2a75';
    ctx.lineWidth = 10;
    ctx.shadowBlur = 18;
    ctx.shadowColor = '#ff65a3';
    ctx.stroke();

    // Inner White Light Core Layer (Fruit Ninja Blade Effect)
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ffffff';
    ctx.stroke();

    ctx.restore();
  }

  // 2. Draw & Update Spark Particles
  particles.forEach((p, index) => {
    p.update();
    p.draw();
    if (p.life <= 0) particles.splice(index, 1);
  });

  requestAnimationFrame(animateTrail);
}

animateTrail();