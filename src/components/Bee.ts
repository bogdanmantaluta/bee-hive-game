import {BeeModel} from '../models/beeModel';

export class Bee implements BeeModel{
     constructor(public health: number, public damage: number, public isBoss: boolean, public type: string) {}

    takeDamage(): void {
        this.health -= this.damage;
        if (this.health < 0) this.health = 0;
    }

    isAlive(): boolean {
        return this.health > 0;
    }
}
