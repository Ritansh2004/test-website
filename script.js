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

// Canvas Setup
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

// Medium Size Sparkle Particles
class Spark {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 3 + 1.5; // Medium particle size
    this.speedX = (Math.random() - 0.5) * 4;
    this.speedY = (Math.random() - 0.5) * 4;
    this.color = `hsl(${Math.random() * 60 + 330}, 100%, 75%)`;
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
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function addPoint(x, y) {
  points.push({ x, y, time: Date.now() });
  
  // Moderate Sparkle Generation
  particles.push(new Spark(x, y));
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

  if (points.length > 1) {
    ctx.save();
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'round';

    // Balanced Tapered Blade Shape (1px -> 7px Width)
    for (let i = 0; i < points.length - 1; i++) {
      const progress = i / points.length;
      
      // Outer Pink Glow
      ctx.beginPath();
      ctx.moveTo(points[i].x, points[i].y);
      ctx.lineTo(points[i + 1].x, points[i + 1].y);
      ctx.strokeStyle = '#ff2a75';
      ctx.lineWidth = progress * 6 + 1.5;
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#ff65a3';
      ctx.stroke();

      // Inner White Core Line
      ctx.beginPath();
      ctx.moveTo(points[i].x, points[i].y);
      ctx.lineTo(points[i + 1].x, points[i + 1].y);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = progress * 3 + 0.8;
      ctx.stroke();
    }

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