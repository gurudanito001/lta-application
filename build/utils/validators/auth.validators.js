"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokenService_1 = require("../../services/tokenService");
function authValidation(req, res, next) {
    try {
        const { authorization } = req.headers;
        let token = authorization === null || authorization === void 0 ? void 0 : authorization.split(" ")[1];
        let user = (0, tokenService_1.decodeToken)(token || "");
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({
            message: `UnAuthorized!! ${error}`,
            status: "error",
            statusCode: 401,
        });
    }
}
exports.default = authValidation;
