import type {NextFunction, Request, Response} from "express";
import {ControllerDependencies} from "~/api/v1/controllers/index";
import * as process from "node:process";

interface Show {
    id: number;
    url: string;
    name: string;
    type: string;
    genres: string[];
    summary: string;
}

export const initShowController = ({
      middleware: {asyncHandler, validateSearchRequest},
  }: ControllerDependencies) => {
    const search = [
        validateSearchRequest(),
        asyncHandler(
            async (
                req: Request,
                res: Response,
                next: NextFunction,
            ) => {
                try {
                    const { query } = req.body;

                    console.info(
                        `Received search request with query: ${query}`
                    );

                    const tvmazeResponse = await fetch(`${process.env.TVMAZE_API_BASE_URL}/search/shows?q=${query}`);
                    const response = await tvmazeResponse.json() as { score: number , show: Show }[];

                    res.status(200).send( { shows: response.map((item) => item.show) } );
                } catch (err) {
                    next(err);
                }
            },
        ),
    ];

    const getShow = [
        asyncHandler(
            async (
                req: Request,
                res: Response,
                next: NextFunction,
            ) => {
                try {
                    const { showId } = req.params;

                    console.info(
                        `Received get show request with show ID: ${showId}`
                    );

                    const tvmazeResponse = await fetch(`${process.env.TVMAZE_API_BASE_URL}/shows/${showId}`);
                    const response = await tvmazeResponse.json() as Show;
                    res.status(200).send( { show: response } );
                } catch (err) {
                    next(err);
                }
            },
        ),
    ];

    return {
        search,
        getShow,
    };
};
