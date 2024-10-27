import {GameState} from '../models/gameState';
import {GUEST_NAME} from '../utils/constants';

describe('App', () => {
    let newGameButton: HTMLButtonElement;
    let continueGameButton: HTMLButtonElement;
    let playerNameInput: HTMLInputElement;

    beforeEach(() => {
        document.body.innerHTML = `
      <button id="new-game-button"></button>
      <button id="continue-game-button" disabled></button>
      <input id="player-name" type="text" />
    `;

        const locationMock = { href: '' };
        Object.defineProperty(window, 'location', {
            value: locationMock,
            writable: true,
            configurable: true,
        });

        jest.clearAllMocks();
        localStorage.clear();

        newGameButton = document.getElementById('new-game-button') as HTMLButtonElement;
        continueGameButton = document.getElementById('continue-game-button') as HTMLButtonElement;
        playerNameInput = document.getElementById('player-name') as HTMLInputElement;
    });

    afterEach(() => {
        document.body.innerHTML = '';
        jest.resetModules();
    });

    describe('Initial Load', () => {
        it('should enable continue button and set player name when game state exists', () => {
            const mockGameState: GameState = {
                bees: [],
                playerName: 'TestPlayer',
            };
            localStorage.setItem('gameState', JSON.stringify(mockGameState));

            require('../app');

            document.dispatchEvent(new Event('DOMContentLoaded'));

            expect(continueGameButton.hasAttribute('disabled')).toBe(false);
            expect(playerNameInput.value).toBe('TestPlayer');
        });

        it('should keep continue button disabled when no game state exists', () => {
            localStorage.removeItem('gameState');

            require('../app');

            document.dispatchEvent(new Event('DOMContentLoaded'));

            expect(continueGameButton.hasAttribute('disabled')).toBe(true);
            expect(playerNameInput.value).toBe('');
        });
    });

    describe('New Game Button', () => {
        beforeEach(() => {
            jest.isolateModules(() => {
                require('../app');
            });
        });

        it('should set game state with provided player name and redirect', () => {
            playerNameInput.value = 'TestPlayer';

            newGameButton.click();

            const storedState = JSON.parse(localStorage.getItem('gameState') || '{}');

            expect(storedState).toEqual({
                bees: [],
                playerName: 'TestPlayer',
            });
            expect(window.location.href).toBe('game.html');
        });

        it('should use guest name when player name is empty', () => {
            playerNameInput.value = '';

            newGameButton.click();

            const storedState = JSON.parse(localStorage.getItem('gameState') || '{}');

            expect(storedState).toEqual({
                bees: [],
                playerName: GUEST_NAME,
            });
            expect(window.location.href).toBe('game.html');
        });
    });

    describe('Continue Game Button', () => {
        beforeEach(() => {
            require('../app');
        });

        it('should redirect to game page when clicked', () => {
            continueGameButton.removeAttribute('disabled');
            continueGameButton.click();

            expect(window.location.href).toBe('game.html');
        });
    });
});
