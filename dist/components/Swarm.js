import { QueenBee } from './QueenBee.js';
import { WorkerBee } from './WorkerBee.js';
import { DroneBee } from './DroneBee.js';
import { Bee } from './Bee.js';
import { BeeTypes } from '../models/BeeTypes.js';
import { DRONE_DAMAGE_AMOUNT, NUMBER_OF_DRONE_BEES, NUMBER_OF_WORKER_BEES, QUEEN_DAMAGE_AMOUNT, WORKER_DAMAGE_AMOUNT } from '../utils/constants.js';
export class Swarm {
    constructor() {
        this.bees = [];
        this.workerBeesHealth = 0;
        this.droneBeesHealth = 0;
        this.bossBeeHealth = 0;
    }
    getSwarmState() {
        return this.bees;
    }
    setSwarmState(beesFromState) {
        this.bees = beesFromState.map(beeData => {
            if (beeData.type === BeeTypes.WORKER) {
                this.workerBeesHealth += beeData.health;
            }
            if (beeData.type === BeeTypes.DRONE) {
                this.droneBeesHealth += beeData.health;
            }
            if (beeData.isBoss) {
                this.bossBeeHealth += beeData.health;
            }
            return new Bee(beeData.health, beeData.damage, beeData.isBoss, beeData.type);
        });
    }
    initializeSwarm() {
        const queenBee = new QueenBee();
        this.bees = [queenBee];
        this.bossBeeHealth += queenBee.health;
        for (let i = 0; i < NUMBER_OF_WORKER_BEES; i++) {
            const workerBee = new WorkerBee();
            this.bees.push(workerBee);
            this.workerBeesHealth += workerBee.health;
        }
        for (let i = 0; i < NUMBER_OF_DRONE_BEES; i++) {
            const droneBee = new DroneBee();
            this.bees.push(droneBee);
            this.droneBeesHealth += droneBee.health;
        }
    }
    hitRandomBee() {
        const aliveBees = this.bees.filter(bee => bee.isAlive());
        const randomIndex = Math.floor(Math.random() * aliveBees.length);
        const bee = aliveBees[randomIndex];
        this.calculateSwarmHealth(bee);
        bee.takeDamage();
        if (bee.isBoss && !bee.isAlive()) {
            this.bees.forEach(b => (b.health = 0));
            return {
                message: 'Queen is dead. All bees are dead. Game over.',
                gameOver: true
            };
        }
        const aliveNonQueenBees = this.bees.filter(bee => bee.isAlive() && !bee.isBoss);
        if (aliveNonQueenBees.length === 0) {
            return {
                message: 'All non-queen bees are dead. Game over',
                gameOver: true
            };
        }
        return {
            message: `${bee.type} hit for ${bee.damage} damage`,
            gameOver: false
        };
    }
    calculateSwarmHealth(bee) {
        if (bee.type === BeeTypes.WORKER) {
            if (bee.health - bee.damage < 0) {
                this.workerBeesHealth -= bee.health;
            }
            else {
                this.workerBeesHealth -= WORKER_DAMAGE_AMOUNT;
            }
        }
        if (bee.type === BeeTypes.DRONE) {
            if (bee.health - bee.damage < 0) {
                this.droneBeesHealth -= bee.health;
            }
            else {
                this.droneBeesHealth -= DRONE_DAMAGE_AMOUNT;
            }
        }
        if (bee.isBoss) {
            if (bee.health - bee.damage < 0) {
                this.bossBeeHealth -= bee.health;
            }
            else {
                this.bossBeeHealth -= QUEEN_DAMAGE_AMOUNT;
            }
        }
    }
}
