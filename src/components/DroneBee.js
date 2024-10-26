"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DroneBee = void 0;
const Bee_js_1 = require("./Bee.js");
const BeeTypes_js_1 = require("../models/BeeTypes.js");
const constants_js_1 = require("../utils/constants.js");
class DroneBee extends Bee_js_1.Bee {
    constructor() {
        super(constants_js_1.DRONE_HEALTH, constants_js_1.DRONE_DAMAGE_AMOUNT, false, BeeTypes_js_1.BeeTypes.DRONE);
    }
}
exports.DroneBee = DroneBee;
