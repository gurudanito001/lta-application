"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const recommendations_controllers_1 = require("../controllers/recommendations.controllers");
// New Router instance
const router = (0, express_1.Router)();
// Users routes
router.get('/', recommendations_controllers_1.getRecommendationsController);
router.get('/:id', recommendations_controllers_1.getRecommendationByIdController);
router.post('/', recommendations_controllers_1.createRecommendationController);
;
router.patch('/:id', recommendations_controllers_1.updateRecommendationController);
router.delete('/:id', recommendations_controllers_1.deleteRecommendationController);
exports.default = router;
