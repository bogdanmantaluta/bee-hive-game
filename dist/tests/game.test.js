import { Swarm } from '../components/Swarm';
import { getGameState, removeGameState } from '../utils/helpers';
jest.mock('../components/Swarm');
jest.mock('../utils/helpers', () => ({
    getGameState: jest.fn(),
    removeGameState: jest.fn(),
    setGameState: jest.fn(),
}));
describe('Game', () => {
    let swarmMock;
    beforeEach(() => {
        document.body.innerHTML = `
      <div id="player-name"></div>
      <div class="drone-container"></div>
      <div class="worker-container"></div>
      <progress id="worker-health"></progress>
      <progress id="drone-health"></progress>
      <progress id="boss-health"></progress>
      <button id="hit-button"></button>
      <button id="back-menu-button"></button>
      <div id="game-statistics"></div>
      <div id="player"></div>
    `;
        const locationMock = { href: '' };
        Object.defineProperty(window, 'location', {
            value: locationMock,
            writable: true,
            configurable: true,
        });
        swarmMock = new Swarm();
        jest.clearAllMocks();
        localStorage.clear();
    });
    it('should display player name on DOMContentLoaded', (done) => {
        const mockGameState = {
            bees: [],
            playerName: 'TestPlayer',
        };
        localStorage.setItem('gameState', JSON.stringify(mockGameState));
        getGameState.mockReturnValue(mockGameState);
        require('../app');
        document.dispatchEvent(new Event('DOMContentLoaded'));
        setTimeout(() => {
            const playerNameElement = document.getElementById('player-name');
            expect(playerNameElement === null || playerNameElement === void 0 ? void 0 : playerNameElement.textContent).toBe('Player: TestPlayer');
            done();
        }, 0);
    });
    it('should initialize swarm and update health bars', () => {
        require('../app');
        document.dispatchEvent(new Event('DOMContentLoaded'));
        expect(swarmMock.initializeSwarm).toHaveBeenCalled();
        expect(document.getElementById('worker-health').value).toBe(swarmMock.workerBeesHealth);
        expect(document.getElementById('drone-health').value).toBe(swarmMock.droneBeesHealth);
        expect(document.getElementById('boss-health').value).toBe(swarmMock.bossBeeHealth);
    });
    it('should handle hit button click', () => {
        var _a, _b;
        require('../app');
        const result = { message: 'Hit!', gameOver: false };
        swarmMock.hitRandomBee.mockReturnValue(result);
        (_a = document.getElementById('hit-button')) === null || _a === void 0 ? void 0 : _a.click();
        expect(swarmMock.hitRandomBee).toHaveBeenCalled();
        expect((_b = document.getElementById('game-statistics')) === null || _b === void 0 ? void 0 : _b.textContent).toContain('Hit!');
    });
    it('should redirect to index on game over', () => {
        var _a;
        require('../app');
        const result = { message: 'Game Over!', gameOver: true };
        swarmMock.hitRandomBee.mockReturnValue(result);
        (_a = document.getElementById('hit-button')) === null || _a === void 0 ? void 0 : _a.click();
        expect(removeGameState).toHaveBeenCalled();
        expect(window.location.href).toBe('index.html');
    });
    it('should redirect to index on back menu button click', () => {
        var _a;
        require('../app');
        (_a = document.getElementById('back-menu-button')) === null || _a === void 0 ? void 0 : _a.click();
        expect(window.location.href).toBe('index.html');
    });
});
