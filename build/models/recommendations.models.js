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
exports.deleteRecommendation = exports.updateRecommendation = exports.createRecommendation = exports.getRecommendationById = exports.getAllRecommendations = void 0;
const prisma_1 = require("../utils/prisma");
const getAllRecommendations = () => __awaiter(void 0, void 0, void 0, function* () {
    const recommendations = yield prisma_1.prisma.recommendation.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });
    return recommendations;
});
exports.getAllRecommendations = getAllRecommendations;
const getRecommendationById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const recommendation = yield prisma_1.prisma.recommendation.findFirst({
        where: { id }
    });
    return recommendation;
});
exports.getRecommendationById = getRecommendationById;
const createRecommendation = (recommendationData) => __awaiter(void 0, void 0, void 0, function* () {
    const recommendation = yield prisma_1.prisma.recommendation.create({
        data: recommendationData
    });
    return recommendation;
});
exports.createRecommendation = createRecommendation;
const updateRecommendation = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const recommendation = yield prisma_1.prisma.recommendation.update({
        where: { id },
        data: updateData
    });
    return recommendation;
});
exports.updateRecommendation = updateRecommendation;
const deleteRecommendation = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const recommendation = yield prisma_1.prisma.recommendation.delete({
        where: { id }
    });
    return recommendation;
});
exports.deleteRecommendation = deleteRecommendation;
