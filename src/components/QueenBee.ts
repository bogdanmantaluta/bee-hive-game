import { Bee } from './Bee.js';
import {BeeTypes} from '../models/BeeTypes.js';
import {QUEEN_DAMAGE_AMOUNT, QUEEN_HEALTH} from '../utils/constants.js';

export class QueenBee extends Bee {
    constructor() {
        super(QUEEN_HEALTH, QUEEN_DAMAGE_AMOUNT, true, BeeTypes.QUEEN);
    }
}
