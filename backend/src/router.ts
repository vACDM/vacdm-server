import { APIError } from '@shared/errors';
import miscController from './controllers/misc.controller';
import { NextFunction, Request, Response, Router } from 'express';

const router = Router();

router.get('/datafeed', miscController.getDataFeed);

router.get('/datafeed/:callsign', miscController.getDataFeedPilot);

router.use((req: Request, res: Response, next: NextFunction) =>
  next(new APIError('Not Found', null, 404))
);

export default router;
