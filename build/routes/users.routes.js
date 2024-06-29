"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controllers_1 = require("../controllers/users.controllers");
const auth_validators_1 = __importDefault(require("../utils/validators/auth.validators"));
// New Router instance
const router = (0, express_1.Router)();
// Users routes
router.get('/', auth_validators_1.default, users_controllers_1.getUsersController);
router.get('/listeners', auth_validators_1.default, users_controllers_1.getListenersController);
router.get('/:id', auth_validators_1.default, users_controllers_1.getUserByIdController);
router.patch('/profile', auth_validators_1.default, users_controllers_1.updateUserController);
router.post('/listeningPreferences', auth_validators_1.default, users_controllers_1.createListeningPreferencesController);
router.patch('/listeningPreferences', auth_validators_1.default, users_controllers_1.updateListeningPreferencesController);
router.delete('/:id', auth_validators_1.default, users_controllers_1.deleteUserController);
router.get('/moods/all', users_controllers_1.getMoodsController);
router.get('/languages/all', users_controllers_1.getLanguagesController);
router.patch('/topics', auth_validators_1.default, users_controllers_1.setTopicsController);
router.patch('/feeling', auth_validators_1.default, users_controllers_1.setFeelingController);
router.patch('/availability', auth_validators_1.default, users_controllers_1.setAvailabilityController);
router.patch('/profileImage', auth_validators_1.default, users_controllers_1.setProfileImageController);
router.post('/username/availability', users_controllers_1.checkUsernameAvailability);
exports.default = router;
