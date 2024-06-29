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
exports.deleteRecommendationController = exports.updateRecommendationController = exports.createRecommendationController = exports.getRecommendationByIdController = exports.getRecommendationsController = void 0;
const recommendations_models_1 = require("../models/recommendations.models");
const fileService_1 = require("../services/fileService");
const getRecommendationsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recommendations = yield (0, recommendations_models_1.getAllRecommendations)();
        res.status(200).json({ message: "Recommendations fetched successfully", payload: recommendations });
    }
    catch (error) {
        res.status(500).json({ message: `Something went wrong ${error === null || error === void 0 ? void 0 : error.message}` });
    }
});
exports.getRecommendationsController = getRecommendationsController;
const getRecommendationByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const recommendation = yield (0, recommendations_models_1.getRecommendationById)(id);
        if (recommendation) {
            res.status(200).json({ message: "Recommendation fetched successfully", payload: recommendation });
        }
        else {
            res.status(404).json({ message: 'Recommendation not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: `Something went wrong ${error === null || error === void 0 ? void 0 : error.message}` });
    }
});
exports.getRecommendationByIdController = getRecommendationByIdController;
const createRecommendationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        let result = null;
        if (data === null || data === void 0 ? void 0 : data.image) {
            result = yield (0, fileService_1.uploadImage)({ data: data === null || data === void 0 ? void 0 : data.image });
            data.image = result === null || result === void 0 ? void 0 : result.url;
        }
        const recommendation = yield (0, recommendations_models_1.createRecommendation)(data);
        res.status(200).json({ message: "Recommendation created successfully", payload: recommendation });
    }
    catch (error) {
        res.status(500).json({ message: `Something went wrong ${error === null || error === void 0 ? void 0 : error.message}` });
    }
});
exports.createRecommendationController = createRecommendationController;
const updateRecommendationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const updateData = req.body;
        const updatedRecommendation = yield (0, recommendations_models_1.updateRecommendation)(id, updateData);
        res.status(200).json({ message: "Recommendation updated successfully", payload: updatedRecommendation });
    }
    catch (error) {
        res.status(500).json({ message: `Something went wrong ${error === null || error === void 0 ? void 0 : error.message}` });
    }
});
exports.updateRecommendationController = updateRecommendationController;
const deleteRecommendationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const recommendation = yield (0, recommendations_models_1.deleteRecommendation)(id);
        res.status(200).json({
            message: `Recommendation with id: ${id} deleted`,
        });
    }
    catch (error) {
        res.status(500).json({ message: `Something went wrong ${error === null || error === void 0 ? void 0 : error.message}` });
    }
});
exports.deleteRecommendationController = deleteRecommendationController;
