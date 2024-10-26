var _a, _b;
import { Swarm } from './components/Swarm.js';
import { getGameState, removeGameState, setGameState } from './utils/helpers.js';
import { GUEST_NAME } from './utils/constants.js';
const gameState = getGameState();
const swarm = new Swarm();
document.addEventListener('DOMContentLoaded', () => {
    if (gameState) {
        const playerName = gameState.playerName;
        const playerNameElement = document.getElementById('player-name');
        if (playerName && playerNameElement) {
            playerNameElement.textContent = `Player: ${decodeURIComponent(playerName)}`;
        }
        else if (playerNameElement) {
            playerNameElement.textContent = `Player: ${decodeURIComponent(GUEST_NAME)}`;
        }
    }
    createBees();
    initializeGame(gameState);
    updateHealthBars(swarm.workerBeesHealth, swarm.droneBeesHealth, swarm.bossBeeHealth);
});
(_a = document.getElementById('hit-button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    const result = swarm.hitRandomBee();
    updateHealthBars(swarm.workerBeesHealth, swarm.droneBeesHealth, swarm.bossBeeHealth);
    animateBear();
    updateStateBees();
    displaySwarmStatistics(result.message);
    if (result.gameOver) {
        alert(result.message);
        removeGameState();
        window.location.href = `index.html`;
    }
});
(_b = document.getElementById('back-menu-button')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
    window.location.href = `index.html`;
});
function animateBear() {
    const bear = document.getElementById('player');
    if (bear) {
        bear.classList.remove('shake-animation');
        bear.offsetWidth;
        bear.classList.add('shake-animation');
    }
}
function displaySwarmStatistics(statistic) {
    const statisticsContainer = document.getElementById('game-statistics');
    const statisticRow = document.createElement('div');
    statisticRow.classList.add('statistic-row');
    statisticRow.textContent = `${statistic}`;
    if (statisticsContainer) {
        statisticsContainer.appendChild(statisticRow);
        statisticsContainer.scrollTop = statisticsContainer.scrollHeight;
    }
}
function updateStateBees() {
    if (gameState === null || gameState === void 0 ? void 0 : gameState.playerName) {
        setGameState(Object.assign(Object.assign({}, gameState), { bees: swarm.getSwarmState() }));
    }
}
function updateHealthBars(workerHealth, droneHealth, bossHealth) {
    const workerHealthBar = document.getElementById('worker-health');
    const droneHealthBar = document.getElementById('drone-health');
    const bossHealthBar = document.getElementById('boss-health');
    workerHealthBar.value = workerHealth;
    droneHealthBar.value = droneHealth;
    bossHealthBar.value = bossHealth;
}
function createBees() {
    const droneContainer = document.querySelector('.drone-container');
    const workerContainer = document.querySelector('.worker-container');
    function addRandomBees(container, min, max) {
        const beeCount = Math.floor(Math.random() * (max - min + 1)) + min;
        for (let i = 0; i < beeCount; i++) {
            const beeImg = document.createElement('img');
            beeImg.src = '/assets/bee.png';
            beeImg.alt = 'bee';
            beeImg.classList.add('bee');
            const delay = Math.random() * 2;
            beeImg.style.animationName = Math.random() < 0.5 ? 'float' : 'floatOpposite';
            beeImg.style.animationDelay = `${delay}s`;
            const randomTop = Math.random() * 20;
            const randomLeft = Math.random() * 20;
            beeImg.style.position = 'relative';
            beeImg.style.top = `${randomTop}px`;
            beeImg.style.left = `${randomLeft}px`;
            container === null || container === void 0 ? void 0 : container.appendChild(beeImg);
        }
    }
    addRandomBees(droneContainer, 4, 5);
    addRandomBees(workerContainer, 4, 5);
}
export function initializeGame(gameState) {
    if (gameState === null || gameState === void 0 ? void 0 : gameState.bees.length) {
        swarm.setSwarmState(gameState.bees);
    }
    else {
        swarm.initializeSwarm();
        if (gameState === null || gameState === void 0 ? void 0 : gameState.playerName) {
            updateStateBees();
        }
    }
    //updateUI(); adica initializare statistici si alte nebunii ( cred );
}
