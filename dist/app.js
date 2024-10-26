import { getGameState, setGameState } from './utils/helpers.js';
import { GUEST_NAME } from './utils/constants.js';
const newGameButton = document.getElementById('new-game-button');
const continueGameButton = document.getElementById('continue-game-button');
const playerNameInput = document.getElementById('player-name');
const gameState = getGameState();
document.addEventListener('DOMContentLoaded', () => {
    if (gameState) {
        continueGameButton === null || continueGameButton === void 0 ? void 0 : continueGameButton.removeAttribute('disabled');
        playerNameInput.value = gameState.playerName;
    }
});
newGameButton === null || newGameButton === void 0 ? void 0 : newGameButton.addEventListener('click', () => {
    const playerName = playerNameInput.value;
    setGameState({
        bees: [],
        playerName: playerName === '' ? GUEST_NAME : playerName
    });
    window.location.href = `game.html`;
});
continueGameButton === null || continueGameButton === void 0 ? void 0 : continueGameButton.addEventListener('click', () => {
    window.location.href = `game.html`;
});
