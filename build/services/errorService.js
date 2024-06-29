"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServerError extends Error {
    constructor(errors, statusCode) {
        super();
        this.errors = errors;
        this.statusCode = statusCode;
        this.status = "failed";
        this.payload = null;
    }
}
exports.default = ServerError;
