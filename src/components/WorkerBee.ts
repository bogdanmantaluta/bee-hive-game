import { Bee } from './Bee.js';
import {BeeTypes} from '../models/BeeTypes.js';
import {WORKER_DAMAGE_AMOUNT, WORKER_HEALTH} from '../utils/constants.js';

export class WorkerBee extends Bee {
    constructor() {
        super(WORKER_HEALTH, WORKER_DAMAGE_AMOUNT, false, BeeTypes.WORKER);
    }
}
