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