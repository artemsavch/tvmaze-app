"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.initShowController = void 0;
const process = __importStar(require("node:process"));
const initShowController = ({ middleware: { asyncHandler, validateSearchRequest }, }) => {
    const search = [
        validateSearchRequest(),
        asyncHandler(async (req, res, next) => {
            try {
                const { query } = req.body;
                console.info(`Received search request with query: ${query}`);
                const tvmazeResponse = await fetch(`${process.env.TVMAZE_API_BASE_URL}/search/shows?q=${query}`);
                const response = await tvmazeResponse.json();
                res.status(200).send({ shows: response.map((item) => item.show) });
            }
            catch (err) {
                next(err);
            }
        }),
    ];
    const getShow = [
        asyncHandler(async (req, res, next) => {
            try {
                const { showId } = req.params;
                console.info(`Received get show request with show ID: ${showId}`);
                const tvmazeResponse = await fetch(`${process.env.TVMAZE_API_BASE_URL}/shows/${showId}`);
                const response = await tvmazeResponse.json();
                res.status(200).send({ show: response });
            }
            catch (err) {
                next(err);
            }
        }),
    ];
    return {
        search,
        getShow,
    };
};
exports.initShowController = initShowController;
