"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRoutes = void 0;
const express_1 = require("express");
const apiRoutes = (ctrl) => (0, express_1.Router)({ mergeParams: true })
    .use("/shows", (0, express_1.Router)({ mergeParams: true })
    .post("/", ctrl.shows.search)
    .get(`/:showId`, ctrl.shows.getShow));
exports.apiRoutes = apiRoutes;
