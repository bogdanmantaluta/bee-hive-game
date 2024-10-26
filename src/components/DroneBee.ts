import { Bee } from './Bee.js';
import {BeeTypes} from '../models/BeeTypes.js';
import {DRONE_DAMAGE_AMOUNT, DRONE_HEALTH} from '../utils/constants.js';

export class DroneBee extends Bee {
    constructor() {
        super(DRONE_HEALTH, DRONE_DAMAGE_AMOUNT, false, BeeTypes.DRONE);
    }
}
