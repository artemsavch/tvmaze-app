import { MiddlewareV1 } from "./middleware";
import { initShowController } from "./show-controller";

export interface ControllerDependencies{
    middleware: MiddlewareV1;
}

export type RouteControllers = ReturnType<typeof initializeRouteControllersV1>;
export const initializeRouteControllersV1 = ( config: ControllerDependencies) => ({
    shows: initShowController(config),
});
