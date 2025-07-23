"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeRouteControllersV1 = void 0;
const show_controller_1 = require("./show-controller");
const initializeRouteControllersV1 = (config) => ({
    shows: (0, show_controller_1.initShowController)(config),
});
exports.initializeRouteControllersV1 = initializeRouteControllersV1;
