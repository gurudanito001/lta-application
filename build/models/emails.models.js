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
exports.deleteEmail = exports.updateEmail = exports.createEmail = exports.getEmailByName = exports.getAllEmails = void 0;
const prisma_1 = require("../utils/prisma");
const getAllEmails = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const emails = yield prisma_1.prisma.email.findMany({
        where: Object.assign({}, ((filters === null || filters === void 0 ? void 0 : filters.verified) && { verified: filters.verified })),
        orderBy: {
            createdAt: "desc"
        }
    });
    return emails;
});
exports.getAllEmails = getAllEmails;
const getEmailByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const email = yield prisma_1.prisma.email.findFirst({
        where: { email: name }
    });
    return email;
});
exports.getEmailByName = getEmailByName;
const createEmail = (emailData) => __awaiter(void 0, void 0, void 0, function* () {
    const email = yield prisma_1.prisma.email.create({
        data: emailData
    });
    return email;
});
exports.createEmail = createEmail;
const updateEmail = (name, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const email = yield prisma_1.prisma.email.update({
        where: { email: name },
        data: updateData
    });
    return email;
});
exports.updateEmail = updateEmail;
const deleteEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma_1.prisma.email.delete({
        where: { email }
    });
    return data;
});
exports.deleteEmail = deleteEmail;
