"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bee = void 0;
class Bee {
    constructor(health, damage, isBoss, type) {
        this.health = health;
        this.damage = damage;
        this.isBoss = isBoss;
        this.type = type;
    }
    takeDamage() {
        this.health -= this.damage;
        if (this.health < 0)
            this.health = 0;
    }
    isAlive() {
        return this.health > 0;
    }
}
exports.Bee = Bee;
