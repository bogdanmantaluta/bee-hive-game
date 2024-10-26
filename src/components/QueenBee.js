"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueenBee = void 0;
const Bee_js_1 = require("./Bee.js");
const BeeTypes_js_1 = require("../models/BeeTypes.js");
const constants_js_1 = require("../utils/constants.js");
class QueenBee extends Bee_js_1.Bee {
    constructor() {
        super(constants_js_1.QUEEN_HEALTH, constants_js_1.QUEEN_DAMAGE_AMOUNT, true, BeeTypes_js_1.BeeTypes.QUEEN);
    }
}
exports.QueenBee = QueenBee;
