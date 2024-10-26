import {getGameState, setGameState} from './utils/helpers.js';
import {GameState} from './models/gameState.js';
import {GUEST_NAME} from './utils/constants.js';

const newGameButton = document.getElementById('new-game-button');
const continueGameButton = document.getElementById('continue-game-button');
const playerNameInput = (document.getElementById('player-name') as HTMLInputElement);
const gameState: GameState | null = getGameState();

document.addEventListener('DOMContentLoaded', (): void => {
    if (gameState) {
        continueGameButton?.removeAttribute('disabled');
        playerNameInput.value = gameState.playerName;
    }
});

newGameButton?.addEventListener('click', (): void => {
    const playerName = playerNameInput.value;
    setGameState({
        bees: [],
        playerName: playerName === '' ? GUEST_NAME : playerName
    })
    window.location.href = `game.html`;
});

continueGameButton?.addEventListener('click', (): void => {
    window.location.href = `game.html`;
});
