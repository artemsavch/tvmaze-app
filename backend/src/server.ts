import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import path from 'node:path'
import { config } from 'dotenv'
import { initializeMiddlewareV1 } from "./api/v1/controllers/middleware";
import {initializeRouteControllersV1} from "./api/v1/controllers";
import {apiRoutes} from "./api/v1/routes";

config({ path: path.resolve(__dirname, '../.env') })

const app = express();
const port = process.env.API_PORT || 4000;

const connections = new Map();

app.use(cors());
app.use(express.json());

app.use(
    ["/api/v1", "/"],
    (() => {
        const middleware = initializeMiddlewareV1();
        const controllers = initializeRouteControllersV1( { middleware });

        const router = express.Router({ mergeParams: true });
        // Healthcheck
        router.use("/_status", async (_req: Request, res: Response<string>) => {
            // For testing Graceful showdown
            await new Promise(resolve => setTimeout(resolve, 60000))
            console.log("_status request; returning 200 OK");
            res.status(200).send("OK");
        });

        router.use(apiRoutes(controllers));

        return router;
    })(),
)

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