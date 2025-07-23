"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeMiddlewareV1 = void 0;
const initializeMiddlewareV1 = () => {
    const asyncHandler = (fn) => (req, res, next) => {
        Promise.resolve()
            .then(() => fn(req, res, next))
            .catch(next);
    };
    const validateSearchRequest = () => (req, res, next) => {
        const searchQuery = req.body.query;
        if (!searchQuery) {
            throw new Error("Search query required");
        }
        next();
    };
    return {
        asyncHandler,
        validateSearchRequest,
    };
};
exports.initializeMiddlewareV1 = initializeMiddlewareV1;
