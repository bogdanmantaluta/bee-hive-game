import {Swarm} from './components/Swarm.js';
import {getGameState, removeGameState, setGameState} from './utils/helpers.js';
import {GameState} from './models/gameState.js';
import {GUEST_NAME} from './utils/constants.js';

const gameState: GameState | null = getGameState();
const swarm = new Swarm();

document.addEventListener('DOMContentLoaded', (): void => {
    if (gameState) {
        const playerName = gameState.playerName;
        const playerNameElement = document.getElementById('player-name');
        if (playerName && playerNameElement) {
            playerNameElement.textContent = `Player: ${decodeURIComponent(playerName)}`;
        } else if (playerNameElement) {
            playerNameElement.textContent = `Player: ${decodeURIComponent(GUEST_NAME)}`;
        }
    }
    createBees();
    initializeGame(gameState);
    updateHealthBars(swarm.workerBeesHealth, swarm.droneBeesHealth, swarm.bossBeeHealth)
});

document.getElementById('hit-button')?.addEventListener('click', (): void => {
    const result = swarm.hitRandomBee();
    updateHealthBars(swarm.workerBeesHealth, swarm.droneBeesHealth, swarm.bossBeeHealth)
    animateBear();
    updateStateBees();
    displaySwarmStatistics(result.message);
    if (result.gameOver) {
        alert(result.message);
        removeGameState();
        window.location.href = `index.html`;
    }
});

document.getElementById('back-menu-button')?.addEventListener('click', (): void => {
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

function displaySwarmStatistics(statistic: string) {
    const statisticsContainer = document.getElementById('game-statistics');
    const statisticRow = document.createElement('div');
    statisticRow.classList.add('statistic-row');
    statisticRow.textContent = `${statistic}`;
    if (statisticsContainer) {
        statisticsContainer.appendChild(statisticRow);
        statisticsContainer.scrollTop = statisticsContainer.scrollHeight;
    }
}


function updateStateBees(): void {
    if (gameState?.playerName) {
        setGameState({
            ...gameState,
            bees: swarm.getSwarmState()
        })
    }
}

function updateHealthBars(workerHealth: number, droneHealth: number, bossHealth: number) {
    const workerHealthBar = document.getElementById('worker-health') as HTMLProgressElement;
    const droneHealthBar = document.getElementById('drone-health') as HTMLProgressElement;
    const bossHealthBar = document.getElementById('boss-health') as HTMLProgressElement;
    workerHealthBar.value = workerHealth;
    droneHealthBar.value = droneHealth;
    bossHealthBar.value = bossHealth;
}

function createBees(): void {
    const droneContainer = document.querySelector('.drone-container');
    const workerContainer = document.querySelector('.worker-container');

    function addRandomBees(container: Element | null, min: number, max: number) {
        const beeCount = Math.floor(Math.random() * (max - min + 1)) + min;
        for (let i = 0; i < beeCount; i++) {
            const beeImg = document.createElement('img');
            const baseUrl = window.location.pathname.split('/').slice(0, -1).join('/');
            console.log(baseUrl)
            beeImg.src = `${baseUrl}/../assets/bee.png`;
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
            container?.appendChild(beeImg);
        }
    }

    addRandomBees(droneContainer, 4, 5);
    addRandomBees(workerContainer, 4, 5);
}

export function initializeGame(gameState: GameState | null): void {
    if (gameState?.bees.length) {
        swarm.setSwarmState(gameState.bees);
    } else {
        swarm.initializeSwarm();
        if (gameState?.playerName) {
            updateStateBees();
        }
    }
}
