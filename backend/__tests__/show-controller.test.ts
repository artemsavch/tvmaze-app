import { initShowController } from '../src/api/v1/controllers/show-controller';
import type { Request, Response, NextFunction } from 'express';

describe('ShowController', () => {
    const mockAsyncHandler = (fn: any) => fn;
    const mockValidateSearchRequest = () => (_req: Request, _res: Response, next: NextFunction) => next();

    const controller = initShowController({
        middleware: {
            asyncHandler: mockAsyncHandler,
            validateSearchRequest: mockValidateSearchRequest
        }
    });

    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        next = jest.fn();

        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('search', () => {
        it('returns matching shows from TVMaze', async () => {
            const mockTVMazeResponse = [
                {
                    score: 1,
                    show: {
                        id: 1,
                        name: 'Breaking Bad',
                        genres: ['Drama', 'Crime'],
                        url: '',
                        type: '',
                        summary: 'A high school chemistry teacher turned methamphetamine producer.'
                    }
                }
            ];

            (global.fetch as jest.Mock).mockResolvedValue({
                json: async () => mockTVMazeResponse
            });

            req.body = { query: 'Breaking' };

            await controller.search[1](req as Request, res as Response, next);

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/search/shows?q=Breaking')
            );

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                shows: mockTVMazeResponse.map(item => item.show)
            });

            expect(next).not.toHaveBeenCalled();
        });

        it('calls next with error if fetch fails', async () => {
            (global.fetch as jest.Mock).mockRejectedValue(new Error('API error'));

            req.body = { query: 'Breaking' };

            await controller.search[1](req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('getShow', () => {
        it('returns show details by ID from TVMaze', async () => {
            const mockShow = {
                id: 123,
                name: 'Single Show',
                genres: ['Drama'],
                url: '',
                type: '',
                summary: 'Some summary'
            };

            (global.fetch as jest.Mock).mockResolvedValue({
                json: async () => mockShow
            });

            req.params = { showId: '123' };

            await controller.getShow[0](req as Request, res as Response, next);

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/shows/123')
            );

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ show: mockShow });

            expect(next).not.toHaveBeenCalled();
        });

        it('calls next with error if fetch fails', async () => {
            (global.fetch as jest.Mock).mockRejectedValue(new Error('API error'));

            req.params = { showId: '123' };

            await controller.getShow[0](req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });
});
