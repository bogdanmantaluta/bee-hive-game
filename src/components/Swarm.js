"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swarm = void 0;
const QueenBee_js_1 = require("./QueenBee.js");
const WorkerBee_js_1 = require("./WorkerBee.js");
const DroneBee_js_1 = require("./DroneBee.js");
const Bee_js_1 = require("./Bee.js");
const BeeTypes_js_1 = require("../models/BeeTypes.js");
const constants_js_1 = require("../utils/constants.js");
class Swarm {
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
            if (beeData.type === BeeTypes_js_1.BeeTypes.WORKER) {
                this.workerBeesHealth += beeData.health;
            }
            if (beeData.type === BeeTypes_js_1.BeeTypes.DRONE) {
                this.droneBeesHealth += beeData.health;
            }
            if (beeData.isBoss) {
                this.bossBeeHealth += beeData.health;
            }
            return new Bee_js_1.Bee(beeData.health, beeData.damage, beeData.isBoss, beeData.type);
        });
    }
    initializeSwarm() {
        const queenBee = new QueenBee_js_1.QueenBee();
        this.bees = [queenBee];
        this.bossBeeHealth += queenBee.health;
        for (let i = 0; i < constants_js_1.NUMBER_OF_WORKER_BEES; i++) {
            const workerBee = new WorkerBee_js_1.WorkerBee();
            this.bees.push(workerBee);
            this.workerBeesHealth += workerBee.health;
        }
        for (let i = 0; i < constants_js_1.NUMBER_OF_DRONE_BEES; i++) {
            const droneBee = new DroneBee_js_1.DroneBee();
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
        if (bee.type === BeeTypes_js_1.BeeTypes.WORKER) {
            if (bee.health - bee.damage < 0) {
                this.workerBeesHealth -= bee.health;
            }
            else {
                this.workerBeesHealth -= constants_js_1.WORKER_DAMAGE_AMOUNT;
            }
        }
        if (bee.type === BeeTypes_js_1.BeeTypes.DRONE) {
            if (bee.health - bee.damage < 0) {
                this.droneBeesHealth -= bee.health;
            }
            else {
                this.droneBeesHealth -= constants_js_1.DRONE_DAMAGE_AMOUNT;
            }
        }
        if (bee.isBoss) {
            if (bee.health - bee.damage < 0) {
                this.bossBeeHealth -= bee.health;
            }
            else {
                this.bossBeeHealth -= constants_js_1.QUEEN_DAMAGE_AMOUNT;
            }
        }
    }
}
exports.Swarm = Swarm;
