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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserByEmail = exports.updateUser = exports.updateUserListeningPreferences = exports.createUserListeningPreferences = exports.createUser = exports.getUserByUsername = exports.getUserByEmail = exports.getUserById = exports.getAllListeners = exports.getAllUsers = exports.getAllLanguages = exports.getAllMoods = void 0;
const prisma_1 = require("../utils/prisma");
const consts_1 = __importDefault(require("../data/consts"));
const languages_1 = __importDefault(require("../data/languages"));
const getAllMoods = () => __awaiter(void 0, void 0, void 0, function* () {
    return consts_1.default;
});
exports.getAllMoods = getAllMoods;
const getAllLanguages = () => __awaiter(void 0, void 0, void 0, function* () {
    return languages_1.default;
});
exports.getAllLanguages = getAllLanguages;
const getAllUsers = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma_1.prisma.user.findMany({
        where: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, ((filters === null || filters === void 0 ? void 0 : filters.userType) && { userType: filters.userType })), ((filters === null || filters === void 0 ? void 0 : filters.country) && { country: filters.country })), ((filters === null || filters === void 0 ? void 0 : filters.gender) && { gender: filters.gender })), ((filters === null || filters === void 0 ? void 0 : filters.online) && { online: filters.online })), ((filters === null || filters === void 0 ? void 0 : filters.topics) && { topics: { hasEvery: filters === null || filters === void 0 ? void 0 : filters.topics } })),
        include: {
            preferences: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    return users;
});
exports.getAllUsers = getAllUsers;
const getAllListeners = (userId, filters) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(filters);
    const preferences = yield prisma_1.prisma.preference.findMany({
        where: {
            NOT: {
                userId: userId
            },
            topics: { has: filters === null || filters === void 0 ? void 0 : filters.mood },
            genders: { has: filters === null || filters === void 0 ? void 0 : filters.gender },
            languages: { has: filters === null || filters === void 0 ? void 0 : filters.language },
            countries: { has: filters === null || filters === void 0 ? void 0 : filters.country },
        },
        include: {
            user: true
        }
    });
    return preferences;
});
exports.getAllListeners = getAllListeners;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.user.findFirst({
        where: { id },
        include: { preferences: true }
    });
    return user;
});
exports.getUserById = getUserById;
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.user.findFirst({
        where: { email },
        include: {
            preferences: true
        }
    });
    return user;
});
exports.getUserByEmail = getUserByEmail;
const getUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.user.findFirst({
        where: { username },
        include: {
            preferences: true
        }
    });
    return user;
});
exports.getUserByUsername = getUserByUsername;
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.user.create({
        data: userData
    });
    return user;
});
exports.createUser = createUser;
const createUserListeningPreferences = (preferences) => __awaiter(void 0, void 0, void 0, function* () {
    const listeningPreferences = yield prisma_1.prisma.preference.create({
        data: preferences
    });
    return listeningPreferences;
});
exports.createUserListeningPreferences = createUserListeningPreferences;
const updateUserListeningPreferences = (userId, preferences) => __awaiter(void 0, void 0, void 0, function* () {
    const listeningPreferences = yield prisma_1.prisma.preference.update({
        where: { userId },
        data: preferences
    });
    return listeningPreferences;
});
exports.updateUserListeningPreferences = updateUserListeningPreferences;
const updateUser = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    updateData === null || updateData === void 0 ? true : delete updateData.email;
    updateData === null || updateData === void 0 ? true : delete updateData.password;
    updateData === null || updateData === void 0 ? true : delete updateData.userType;
    updateData === null || updateData === void 0 ? true : delete updateData.profileImage;
    const user = yield prisma_1.prisma.user.update({
        where: { id },
        data: updateData,
        include: {
            preferences: true
        }
    });
    return user;
});
exports.updateUser = updateUser;
const updateUserByEmail = (email, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.user.update({
        where: { email },
        data: updateData,
        include: {
            preferences: true
        }
    });
    return user;
});
exports.updateUserByEmail = updateUserByEmail;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.user.delete({
        where: { id }
    });
    return user;
});
exports.deleteUser = deleteUser;
