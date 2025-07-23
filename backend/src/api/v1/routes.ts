import { Router } from "express";

import type { RouteControllers } from "./controllers";

export const apiRoutes = (ctrl: RouteControllers) =>
    Router({ mergeParams: true })
        .use(
            "/shows",
            Router({ mergeParams: true })
                .post("/", ctrl.shows.search)
                .get(`/:showId`, ctrl.shows.getShow)
        )