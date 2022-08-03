import { APIError } from '@shared/errors';
import miscController from './controllers/misc.controller';
import { NextFunction, Request, Response, Router } from 'express';
import pilotController from './controllers/pilot.controller';

const router = Router();

router.get('/datafeed', miscController.getDataFeed);
router.get('/datafeed/:callsign', miscController.getDataFeedPilot);

router.get('/pilots', pilotController.getAllPilots);
router.post('/pilots', pilotController.addPilot);
router.get('/pilots/:callsign', pilotController.getPilot);
router.delete('/pilots/:callsign', pilotController.deletePilot);
router.patch('/pilots/:callsign', pilotController.updatePilot)

router.use((req: Request, res: Response, next: NextFunction) =>
  next(new APIError('Not Found', null, 404))
);

export default router;
