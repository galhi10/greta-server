import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import { config } from "../config";
const getToken = (req) => {
    const auth_header = req.headers["authorization"];
    return auth_header && auth_header.split(" ")[1];
};

const decodeTokenWithBearer = (token) => {
    return jwt.verify(token && token.split(" ")[1], config.jwt.secret);
};

const decodeTokenWithoutBearer = (token) => {
    return jwt.verify(token, config.jwt.secret);
};

const generateJWT = (email, userId) => {
    return jwt.sign(
        {
            email,
            userId,
        },
        config.jwt.secret,
        {
            expiresIn: "30d",
        }
    );
};

const authorized = (token) => {
    const payload = decodeTokenWithBearer(token);
    if (!payload) return { status: "ERROR", msg: "Bad token" };
    else {
        return {
            status: "SUCCESS",
        };
    };
};

const auth = {
    required: expressjwt({
        secret: config.jwt.secret || "",
        requestProperty: "payload",
        algorithms: ["HS256"],
        getToken,
    }),
    type: {
        ADMIN: "ADMIN",
        USER: "USER",
    },
    decodeTokenWithBearer,
    decodeTokenWithoutBearer,
    authorized,
    generateJWT,
    getToken,
};

export default auth;