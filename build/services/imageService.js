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
exports.getAssetInfo = exports.uploadImage = void 0;
const cloudinary = require('cloudinary').v2;
const config_1 = __importDefault(require("../config/config"));
// Configuration 
cloudinary.config({
    cloud_name: config_1.default.cloudinary_cloud_name,
    api_key: config_1.default.cloudinary_api_key,
    api_secret: config_1.default.cloudinary_api_secret,
    secure: true,
});
const uploadImage = (_a) => __awaiter(void 0, [_a], void 0, function* ({ publicId = "on8x0w6l", data }) {
    // Use the uploaded file's name as the asset's public ID and 
    // allow overwriting the asset with new versions
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        publicId
    };
    try {
        // Upload the image
        const result = yield cloudinary.uploader.upload(data, options);
        //console.log(result);
        return result;
    }
    catch (error) {
        console.error(error);
    }
});
exports.uploadImage = uploadImage;
// Generate 
const getAssetInfo = (publicId) => __awaiter(void 0, void 0, void 0, function* () {
    // Return colors in the response
    const options = {
        colors: true,
    };
    try {
        // Get details about the asset
        const result = yield cloudinary.api.resource(publicId, options);
        //console.log(result);
        return result.colors;
    }
    catch (error) {
        console.error(error);
    }
});
exports.getAssetInfo = getAssetInfo;
// The output url
// console.log(url);
// https://res.cloudinary.com/<cloud_name>/image/upload/h_150,w_100/olympic_flag
