import {BeeModel} from './beeModel';

export interface GameState {
    playerName: string;
    bees: BeeModel[];
}
