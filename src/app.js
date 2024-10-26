"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_js_1 = require("./utils/helpers.js");
const constants_js_1 = require("./utils/constants.js");
const newGameButton = document.getElementById('new-game-button');
const continueGameButton = document.getElementById('continue-game-button');
const playerNameInput = document.getElementById('player-name');
const gameState = (0, helpers_js_1.getGameState)();
document.addEventListener('DOMContentLoaded', () => {
    if (gameState) {
        continueGameButton === null || continueGameButton === void 0 ? void 0 : continueGameButton.removeAttribute('disabled');
        playerNameInput.value = gameState.playerName;
    }
});
newGameButton === null || newGameButton === void 0 ? void 0 : newGameButton.addEventListener('click', () => {
    const playerName = playerNameInput.value;
    (0, helpers_js_1.setGameState)({
        bees: [],
        playerName: playerName === '' ? constants_js_1.GUEST_NAME : playerName
    });
    window.location.href = `game.html`;
});
continueGameButton === null || continueGameButton === void 0 ? void 0 : continueGameButton.addEventListener('click', () => {
    window.location.href = `game.html`;
});
