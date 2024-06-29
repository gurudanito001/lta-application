"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controllers_1 = require("../controllers/auth.controllers");
// New Router instance
const router = (0, express_1.Router)();
// Users routes
router.post('/verifyEmail', auth_controllers_1.verifyEmailController);
router.post('/confirmVerification', auth_controllers_1.confirmVerificationCodeController);
router.post('/register', auth_controllers_1.registerController);
router.post('/login', auth_controllers_1.loginController);
router.post('/forgotPassword', auth_controllers_1.forgotPasswordController);
router.post('/resetPassword', auth_controllers_1.resetPasswordController);
router.get('/getCountries', auth_controllers_1.getCountriesController);
exports.default = router;
