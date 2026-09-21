function unlockLoveLocker() {
  const dateInput = document.getElementById('birth-date-input').value;
  const msg = document.getElementById('locker-msg');

  if (!dateInput) {
    msg.style.color = '#ff4b2b';
    msg.innerText = 'Please select a valid date! 📅';
    return;
  }

  // Success message after picking date
  msg.style.color = '#2ed573';
  msg.innerText = 'Locker Unlocked! You are the most special person! 💖✨';
}

function unlockLocker() {
  const date = document.getElementById('birth-date-input').value;
  const msg = document.getElementById('locker-msg');
  if(date) {
    msg.style.color = '#2ed573';
    msg.innerText = 'Locker Unlocked! 💖';
  } else {
    msg.style.color = '#ff4b2b';
    msg.innerText = 'Please select a date! 📅';
  }
}