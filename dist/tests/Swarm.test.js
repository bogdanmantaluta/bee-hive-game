import { NUMBER_OF_DRONE_BEES, NUMBER_OF_WORKER_BEES } from '../utils/constants';
import { BeeTypes } from '../models/BeeTypes';
import { Swarm } from '../components/Swarm';
jest.mock('../components/QueenBee', () => {
    return {
        QueenBee: jest.fn().mockImplementation(() => ({
            health: 100,
            damage: 10,
            isBoss: true,
            type: BeeTypes.QUEEN,
            isAlive: jest.fn(() => true),
            takeDamage: jest.fn(),
        })),
    };
});
jest.mock('../components/WorkerBee', () => {
    return {
        WorkerBee: jest.fn().mockImplementation(() => ({
            health: 75,
            damage: 10,
            isBoss: false,
            type: BeeTypes.WORKER,
            isAlive: jest.fn(() => true),
            takeDamage: jest.fn(),
        })),
    };
});
jest.mock('../components/DroneBee', () => {
    return {
        DroneBee: jest.fn().mockImplementation(() => ({
            health: 50,
            damage: 10,
            isBoss: false,
            type: BeeTypes.DRONE,
            isAlive: jest.fn(() => true),
            takeDamage: jest.fn(),
        })),
    };
});
describe('Swarm', () => {
    let swarm;
    beforeEach(() => {
        swarm = new Swarm();
    });
    test('should initialize swarm with correct number of bees', () => {
        swarm.initializeSwarm();
        expect(swarm.bees.length).toBe(1 + NUMBER_OF_WORKER_BEES + NUMBER_OF_DRONE_BEES);
        expect(swarm.bossBeeHealth).toEqual(100);
        expect(swarm.workerBeesHealth).toEqual(375);
        expect(swarm.droneBeesHealth).toEqual(400);
    });
    test('should correctly calculate swarm health after hitting a bee', () => {
        swarm.initializeSwarm();
        const initialWorkerHealth = swarm.workerBeesHealth;
        const initialDroneHealth = swarm.droneBeesHealth;
        const initialBossHealth = swarm.bossBeeHealth;
        const result = swarm.hitRandomBee();
        expect(swarm.workerBeesHealth).toBeLessThanOrEqual(initialWorkerHealth);
        expect(swarm.droneBeesHealth).toBeLessThanOrEqual(initialDroneHealth);
        expect(swarm.bossBeeHealth).toBeLessThanOrEqual(initialBossHealth);
        expect(result).toHaveProperty('message');
        expect(result).toHaveProperty('gameOver');
    });
    test('should end game when queen is dead', () => {
        swarm.initializeSwarm();
        const queen = swarm.bees.find(bee => bee.isBoss);
        queen.isAlive.mockReturnValue(false);
        const result = swarm.hitRandomBee();
        expect(result.message).toBe('Queen is dead. All bees are dead. Game over.');
        expect(result.gameOver).toBe(true);
    });
    test('should end game when all non-queen bees are dead', () => {
        swarm.initializeSwarm();
        swarm.bees.forEach(bee => {
            if (!bee.isBoss) {
                const mockedBee = bee;
                mockedBee.isAlive.mockReturnValue(false); // Simulate all non-queen bees' death
            }
        });
        const result = swarm.hitRandomBee();
        expect(result.message).toBe('All non-queen bees are dead. Game over');
        expect(result.gameOver).toBe(true);
    });
});
