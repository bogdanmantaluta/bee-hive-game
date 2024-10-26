"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../utils/constants");
const BeeTypes_1 = require("../models/BeeTypes");
const Swarm_1 = require("../components/Swarm");
const Bee_1 = require("../components/Bee");
const mockMath = Object.create(global.Math);
mockMath.random = () => 0.5;
global.Math = mockMath;
const createMockBee = (initialHealth, damage, isBoss, type, isAliveValue = true) => {
    let health = initialHealth;
    return {
        get health() {
            return health;
        },
        set health(value) {
            health = value;
        },
        damage,
        isBoss,
        type,
        isAlive: jest.fn(() => health > 0),
        takeDamage: jest.fn().mockImplementation(() => {
            health -= damage;
            if (health < 0)
                health = 0;
        })
    };
};
jest.mock('../components/QueenBee', () => ({
    QueenBee: jest.fn().mockImplementation(() => createMockBee(100, constants_1.QUEEN_DAMAGE_AMOUNT, true, BeeTypes_1.BeeTypes.QUEEN))
}));
jest.mock('../components/WorkerBee', () => ({
    WorkerBee: jest.fn().mockImplementation(() => createMockBee(75, constants_1.WORKER_DAMAGE_AMOUNT, false, BeeTypes_1.BeeTypes.WORKER))
}));
jest.mock('../components/DroneBee', () => ({
    DroneBee: jest.fn().mockImplementation(() => createMockBee(50, constants_1.DRONE_DAMAGE_AMOUNT, false, BeeTypes_1.BeeTypes.DRONE))
}));
jest.mock('../components/Bee', () => ({
    Bee: jest.fn().mockImplementation((health, damage, isBoss, type) => createMockBee(health, damage, isBoss, type))
}));
describe('Swarm', () => {
    let swarm;
    beforeEach(() => {
        jest.clearAllMocks();
        swarm = new Swarm_1.Swarm();
    });
    describe('initializeSwarm', () => {
        test('should initialize swarm with correct number of bees', () => {
            swarm.initializeSwarm();
            expect(swarm.bees.length).toBe(1 + constants_1.NUMBER_OF_WORKER_BEES + constants_1.NUMBER_OF_DRONE_BEES);
            expect(swarm.bossBeeHealth).toBe(100);
            expect(swarm.workerBeesHealth).toBe(75 * constants_1.NUMBER_OF_WORKER_BEES);
            expect(swarm.droneBeesHealth).toBe(50 * constants_1.NUMBER_OF_DRONE_BEES);
        });
    });
    describe('getSwarmState', () => {
        test('should return current bees array', () => {
            swarm.initializeSwarm();
            const state = swarm.getSwarmState();
            expect(state).toBe(swarm.bees);
        });
    });
    describe('setSwarmState', () => {
        test('should correctly set swarm state from bee array', () => {
            const mockBees = [
                createMockBee(100, 10, true, BeeTypes_1.BeeTypes.QUEEN),
                createMockBee(75, 10, false, BeeTypes_1.BeeTypes.WORKER),
                createMockBee(50, 10, false, BeeTypes_1.BeeTypes.DRONE)
            ];
            swarm.setSwarmState(mockBees);
            expect(swarm.bossBeeHealth).toBe(100);
            expect(swarm.workerBeesHealth).toBe(75);
            expect(swarm.droneBeesHealth).toBe(50);
            expect(swarm.bees.length).toBe(3);
        });
    });
    describe('calculateSwarmHealth', () => {
        beforeEach(() => {
            swarm.initializeSwarm();
        });
        test('should calculate worker bee health correctly', () => {
            const workerBee = createMockBee(75, constants_1.WORKER_DAMAGE_AMOUNT, false, BeeTypes_1.BeeTypes.WORKER);
            const initialHealth = swarm.workerBeesHealth;
            swarm.calculateSwarmHealth(workerBee);
            expect(swarm.workerBeesHealth).toBe(initialHealth - constants_1.WORKER_DAMAGE_AMOUNT);
            const lowHealthWorker = createMockBee(5, 10, false, BeeTypes_1.BeeTypes.WORKER);
            const healthBeforeLowHealth = swarm.workerBeesHealth;
            swarm.calculateSwarmHealth(lowHealthWorker);
            expect(swarm.workerBeesHealth).toBe(healthBeforeLowHealth - 5);
        });
        test('should calculate drone bee health correctly', () => {
            const droneBee = createMockBee(50, constants_1.DRONE_DAMAGE_AMOUNT, false, BeeTypes_1.BeeTypes.DRONE);
            const initialHealth = swarm.droneBeesHealth;
            swarm.calculateSwarmHealth(droneBee);
            expect(swarm.droneBeesHealth).toBe(initialHealth - constants_1.DRONE_DAMAGE_AMOUNT);
            const lowHealthDrone = createMockBee(5, 10, false, BeeTypes_1.BeeTypes.DRONE);
            const healthBeforeLowHealth = swarm.droneBeesHealth;
            swarm.calculateSwarmHealth(lowHealthDrone);
            expect(swarm.droneBeesHealth).toBe(healthBeforeLowHealth - 5);
        });
        test('should calculate queen bee health correctly', () => {
            const queenBee = createMockBee(100, constants_1.QUEEN_DAMAGE_AMOUNT, true, BeeTypes_1.BeeTypes.QUEEN);
            const initialHealth = swarm.bossBeeHealth;
            swarm.calculateSwarmHealth(queenBee);
            expect(swarm.bossBeeHealth).toBe(initialHealth - constants_1.QUEEN_DAMAGE_AMOUNT);
            const lowHealthQueen = createMockBee(5, 10, true, BeeTypes_1.BeeTypes.QUEEN);
            const healthBeforeLowHealth = swarm.bossBeeHealth;
            swarm.calculateSwarmHealth(lowHealthQueen);
            expect(swarm.bossBeeHealth).toBe(healthBeforeLowHealth - 5);
        });
    });
    describe('hitRandomBee', () => {
        beforeEach(() => {
            swarm.initializeSwarm();
        });
        test('should hit a random bee and return correct game state when game continues', () => {
            const result = swarm.hitRandomBee();
            expect(result.gameOver).toBe(false);
            expect(result.message).toMatch(/hit for \d+ damage/);
        });
        test('should end game when queen dies', () => {
            const mockQueen = createMockBee(5, constants_1.QUEEN_DAMAGE_AMOUNT, true, BeeTypes_1.BeeTypes.QUEEN, true);
            const mockWorker = createMockBee(5, constants_1.WORKER_DAMAGE_AMOUNT, false, BeeTypes_1.BeeTypes.WORKER, true);
            swarm.bees = [mockWorker, mockQueen];
            const result = swarm.hitRandomBee();
            expect(result.gameOver).toBe(true);
            expect(result.message).toBe('Queen is dead. All bees are dead. Game over.');
        });
        test('should end game when all non-queen bees are dead', () => {
            const mockDeadWorker = createMockBee(0, constants_1.WORKER_DAMAGE_AMOUNT, false, BeeTypes_1.BeeTypes.WORKER, true);
            const mockQueen = createMockBee(100, constants_1.QUEEN_DAMAGE_AMOUNT, true, BeeTypes_1.BeeTypes.QUEEN, true);
            swarm.bees = [mockQueen, mockDeadWorker];
            const result = swarm.hitRandomBee();
            expect(result.gameOver).toBe(true);
            expect(result.message).toBe('All non-queen bees are dead. Game over');
        });
    });
    describe('healthOperations', () => {
        test('should set health to zero if damage exceeds current health', () => {
            const bee = createMockBee(2, constants_1.WORKER_DAMAGE_AMOUNT, false, BeeTypes_1.BeeTypes.WORKER, true);
            bee.takeDamage();
            expect(bee.health).toBe(0);
        });
        test('should reduce health correctly when damage is less than current health', () => {
            const bee = new Bee_1.Bee(15, 10, false, 'worker');
            bee.takeDamage();
            expect(bee.health).toBe(5);
        });
        test('should return true for isAlive if health is above zero', () => {
            const bee = new Bee_1.Bee(10, 5, false, 'worker');
            expect(bee.isAlive()).toBe(true);
        });
        test('should return false for isAlive if health is zero', () => {
            const bee = new Bee_1.Bee(0, 5, false, 'worker');
            expect(bee.isAlive()).toBe(false);
        });
    });
});
