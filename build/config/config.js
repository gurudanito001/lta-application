"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Parsing the env file.
dotenv_1.default.config();
// Loading process.env as ENV interface
const getConfig = () => {
    return {
        environment: process.env.environment,
        DATABASE_URL: process.env.DATABASE_URL,
        SECRET: process.env.SECRET,
        SERVER_PORT: Number(process.env.SERVER_PORT),
        ACCESS_TOKEN_EXPIRY: Number(process.env.ACCESS_TOKEN_EXPIRY),
        cloudinary_cloud_name: process.env.cloudinary_cloud_name,
        cloudinary_api_key: process.env.cloudinary_api_key,
        cloudinary_api_secret: process.env.cloudinary_api_secret,
        email_username: process.env.email_username,
        email_password: process.env.email_password,
    };
};
// Throwing an Error if any field was undefined we don't 
// want our app to run if it can't connect to DB and ensure 
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type 
// definition.
const getSanitzedConfig = (config) => {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error(`Missing key ${key} in config.env`);
        }
    }
    return config;
};
const config = getConfig();
const sanitizedConfig = getSanitzedConfig(config);
exports.default = sanitizedConfig;
