export interface BeeModel {
    damage: number;
    health: number;
    type: string;
    isBoss: boolean;
    takeDamage: () => void;
    isAlive: () => boolean;
}
