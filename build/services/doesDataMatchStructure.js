"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doesDataMatchStructure = void 0;
const generateDataStructure_1 = __importDefault(require("./generateDataStructure"));
const doesDataMatchStructure = (data, structure) => {
    let structureKeys = Object.keys(structure);
    let dataStructure = (0, generateDataStructure_1.default)(data);
    let dataStructureKeys = Object.keys(dataStructure);
    let result = true;
    if (dataStructureKeys.length !== structureKeys.length) {
        result = false;
    }
    for (let i = 0; i < structureKeys.length; i++) {
        if (!structureKeys.includes(dataStructureKeys[i])) {
            result = false;
        }
        else if (dataStructure[structureKeys[i]] !== structure[structureKeys[i]]) {
            result = false;
        }
    }
    return result;
};
exports.doesDataMatchStructure = doesDataMatchStructure;
