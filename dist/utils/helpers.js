const GAME_STATE_KEY = 'gameState';
export function setGameState(state) {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(GAME_STATE_KEY, serializedState);
    }
    catch (error) {
        console.error('Error saving game state:', error);
    }
}
export function getGameState() {
    try {
        const serializedState = localStorage.getItem(GAME_STATE_KEY);
        if (serializedState === null) {
            return null;
        }
        return JSON.parse(serializedState);
    }
    catch (error) {
        console.error('Error loading game state:', error);
        return null;
    }
}
export function removeGameState() {
    try {
        localStorage.removeItem(GAME_STATE_KEY);
    }
    catch (error) {
        console.error('Error removing game state:', error);
    }
}
