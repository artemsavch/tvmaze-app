import type { NextFunction, Request, Response } from "express";
export type MiddlewareV1 = ReturnType<typeof initializeMiddlewareV1>;

export const initializeMiddlewareV1 = () => {
    const asyncHandler =
        (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
            (req: Request, res: Response, next: NextFunction) => {
                Promise.resolve()
                    .then(() => fn(req, res, next))
                    .catch(next);
            };

    const validateSearchRequest =
        () => (req: Request, res: Response, next: NextFunction) => {
            const searchQuery = req.body.query as string;
            if (!searchQuery) {
                throw new Error(
                    "Search query required",
                );
            }
            next();
        }
    return {
        asyncHandler,
        validateSearchRequest,
    };
};
