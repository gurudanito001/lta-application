"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserController = exports.updateListeningPreferencesController = exports.createListeningPreferencesController = exports.updateUserController = exports.createUserController = exports.getUserByIdController = exports.getListenersController = exports.getUsersController = exports.checkUsernameAvailability = exports.setProfileImageController = exports.setAvailabilityController = exports.getLanguagesController = exports.setFeelingController = exports.setTopicsController = exports.getMoodsController = void 0;
const users_models_1 = require("../models/users.models");
const fileService_1 = require("../services/fileService");
const getMoodsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /* await prisma.email.deleteMany();
        await prisma.user.deleteMany();
        await prisma.listeningPreferences.deleteMany();
        await prisma.recommendation.deleteMany(); */
        const moods = yield (0, users_models_1.getAllMoods)();
        res.status(200).json({ message: "Moods fetched successfully", payload: moods });
    }
    catch (error) {
        res.status(500).json({ message: `Something went wrong ${error === null || error === void 0 ? void 0 : error.message}` });
    }
});
exports.getMoodsController = getMoodsController;
const setTopicsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.user.userId;
        const updateData = req.body;
        const updatedUser = yield (0, users_models_1.updateUser)(id, updateData);
        res.status(200).json({ message: "User topics updated successfully", payload: updatedUser });
    }
    catch (error) {
        res.status(500).json({ message: `Something went wrong ${error === null || error === void 0 ? void 0 : error.message}` });
    }
});
exports.setTopicsController = setTopicsController;
const setFeelingController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.user.userId;
        const updateData = req.body;
        const updatedUser = yield (0, users_models_1.updateUser)(id, updateData);
        res.status(200).json({ message: "User feeling updated successfully", payload: updatedUser });
    }
    catch (error) {
        res.status(500).json({ message: `Something went wrong ${error === null || error === void 0 ? void 0 : error.message}` });
    }
});
exports.setFeelingController = setFeelingController;
const getLanguagesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const languages = yield (0, users_models_1.getAllLanguages)();
        res.status(200).json({ message: "Languages fetched successfully", payload: languages });
    }
    catch (error) {
        res.status(500).json({ message: `Something went wrong ${error === null || error === void 0 ? void 0 : error.message}` });
    }
});
exports.getLanguagesController = getLanguagesController;
const setAvailabilityController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.user.userId;
        const updateData = req.body;
        const updatedUser = yield (0, users_models_1.updateUser)(id, updateData);
        res.status(200).json({ message: "User availability updated successfully", payload: updatedUser });
    }
    catch (error) {
        res.status(500).json({ message: `Something went wrong ${error === null || error === void 0 ? void 0 : error.message}` });
    }
});
exports.setAvailabilityController = setAvailabilityController;
const setProfileImageController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.user.userId;
        const updateData = req.body;
        if (!(updateData === null || updateData === void 0 ? void 0 : updateData.profileImage.includes("data:image"))) {
            return res.status(400).json({ message: "Base 64 image is required", status: "error" });
        }
        let result = yield (0, fileService_1.uploadImage)({ data: updateData === null || updateData === void 0 ? void 0 : updateData.profileImage });
        const updatedUser = yield (0, users_models_1.updateUser)(id, { profileImage: result === null || result === void 0 ? void 0 : result.url });
        res.status(200).json({ message: "User updated successfully", payload: updatedUser });
    }
    catch (error) {
        res.status(500).json({ message: `Something went wrong ${error === null || error === void 0 ? void 0 : error.message}` });
    }
});
exports.setProfileImageController = setProfileImageController;
const checkUsernameAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.body;
        const user = yield (0, users_models_1.getUserByUsername)(username);
        if (user) {
            res.status(400).json({ message: "Username has been taken", payload: { available: false } });
        }
        else {
            res.status(200).json({ message: "Username is available", payload: { available: true } });
        }
    }
    catch (error) {
        res.status(500).json({ message: `Something went wrong ${error === null || error === void 0 ? void 0 : error.message}` });
    }
});
exports.checkUsernameAvailability = checkUsernameAvailability;
const getUsersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userType, country, gender, online, topics } = req.query;
    try {
        const users = yield (0, users_models_1.getAllUsers)({ userType, country, gender, online, topics });
        res.status(200).json({ message: "Users fetched successfully", payload: users });
    }
    catch (error) {
        res.status(500).json({ message: `Something went wrong ${error === null || error === void 0 ? void 0 : error.message}` });
    }
});
exports.getUsersController = getUsersController;
const getListenersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user.userId;
    const { mood, gender, language, country } = req.query;
    try {
        const listeners = yield (0, users_models_1.getAllListeners)(id, { mood, gender, language, country });
        res.status(200).json({ message: "Listeners fetched successfully", payload: listeners });
    }
    catch (error) {
        res.status(500).json({ message: `Something went wrong ${error === null || error === void 0 ? void 0 : error.message}` });
    }
});
exports.getListenersController = getListenersController;
const getUserByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield (0, users_models_1.getUserById)(id);
        if (user) {
            res.status(200).json({ message: "User fetched successfully", payload: user });
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: `Something went wrong ${error === null || error === void 0 ? void 0 : error.message}` });
    }
});
exports.getUserByIdController = getUserByIdController;
const createUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const user = yield (0, users_models_1.createUser)(data);
        res.status(200).json({ message: "User created successfully", payload: user });
    }
    catch (error) {
        res.status(500).json({ message: `Something went wrong ${error === null || error === void 0 ? void 0 : error.message}` });
    }
});
exports.createUserController = createUserController;
const updateUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.user.userId;
        const updateData = req.body;
        const updatedUser = yield (0, users_models_1.updateUser)(id, updateData);
        res.status(200).json({ message: "User updated successfully", payload: updatedUser });
    }
    catch (error) {
        res.status(500).json({ message: `Something went wrong ${error === null || error === void 0 ? void 0 : error.message}` });
    }
});
exports.updateUserController = updateUserController;
const createListeningPreferencesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.user.userId;
        let user = yield (0, users_models_1.getUserById)(id);
        if ((user === null || user === void 0 ? void 0 : user.userType) !== "listener") {
            return res.status(400).json({ message: `Only listeners can have listening preferences` });
        }
        const data = req.body;
        data.userId = id;
        const listeningPreferences = yield (0, users_models_1.createUserListeningPreferences)(data);
        res.status(200).json({ message: "User Listening Preferences updated successfully", payload: listeningPreferences });
    }
    catch (error) {
        res.status(500).json({ message: `Something went wrong ${error === null || error === void 0 ? void 0 : error.message}` });
    }
});
exports.createListeningPreferencesController = createListeningPreferencesController;
const updateListeningPreferencesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.user.userId;
        let user = yield (0, users_models_1.getUserById)(id);
        if ((user === null || user === void 0 ? void 0 : user.userType) !== "listener") {
            return res.status(400).json({ message: `Only listeners can update listening preferences` });
        }
        const updateData = req.body;
        const listeningPreferences = yield (0, users_models_1.updateUserListeningPreferences)(id, updateData);
        res.status(200).json({ message: "User Listening Preferences updated successfully", payload: listeningPreferences });
    }
    catch (error) {
        res.status(500).json({ message: `Something went wrong ${error === null || error === void 0 ? void 0 : error.message}` });
    }
});
exports.updateListeningPreferencesController = updateListeningPreferencesController;
const deleteUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield (0, users_models_1.deleteUser)(id);
        res.status(200).json({
            message: `User with id: ${id} deleted`,
        });
    }
    catch (error) {
        res.status(500).json({ message: `Something went wrong ${error === null || error === void 0 ? void 0 : error.message}` });
    }
});
exports.deleteUserController = deleteUserController;
