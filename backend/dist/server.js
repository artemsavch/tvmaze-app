"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const node_path_1 = __importDefault(require("node:path"));
const dotenv_1 = require("dotenv");
const middleware_1 = require("./api/v1/controllers/middleware");
const controllers_1 = require("./api/v1/controllers");
const routes_1 = require("./api/v1/routes");
(0, dotenv_1.config)({ path: node_path_1.default.resolve(__dirname, '../.env') });
const app = (0, express_1.default)();
const port = process.env.API_PORT || 4000;
const connections = new Map();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(["/api/v1", "/"], (() => {
    const middleware = (0, middleware_1.initializeMiddlewareV1)();
    const controllers = (0, controllers_1.initializeRouteControllersV1)({ middleware });
    const router = express_1.default.Router({ mergeParams: true });
    // Healthcheck
    router.use("/_status", async (_req, res) => {
        // For testing Graceful showdown
        await new Promise(resolve => setTimeout(resolve, 60000));
        console.log("_status request; returning 200 OK");
        res.status(200).send("OK");
    });
    router.use((0, routes_1.apiRoutes)(controllers));
    return router;
})());
const server = app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
server.on('connection', (connection) => {
    connections.set(connection, null);
    connection.on('close', () => connections.delete(connection));
});
server.on('request', (_req, res) => {
    connections.set(res.connection, res);
});
const showConnections = () => {
    console.log('Connection:', [...connections.values()].length);
    for (const connection of connections.keys()) {
        const { remoteAddress, remotePort } = connection;
        console.log(`  ${remoteAddress}:${remotePort}`);
    }
};
const closeConnections = async () => {
    for (const [connection, res] of connections.entries()) {
        connections.delete(connection);
        res.end('Server stopped');
        connection.destroy();
    }
};
const freeResources = async () => {
    // Just to show that we can free some memory during gracefyl shotdown...
    console.log('Free resources');
};
const gracefulShutdown = async () => {
    server.close((error) => {
        if (error) {
            console.log(error);
            process.exit(1);
        }
    });
    await freeResources();
    await closeConnections();
};
process.on('SIGINT', async () => {
    console.log('Graceful shutdown');
    showConnections();
    await gracefulShutdown();
    showConnections();
    console.log('Bye');
    process.exit(0);
});
