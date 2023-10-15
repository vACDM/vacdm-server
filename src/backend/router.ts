import { NextFunction, Request, Response, Router } from 'express';

import airportController from './controllers/airport.controller';
import authController from './controllers/auth.controller';
import flowController from './controllers/flow.controller';
import metaController from './controllers/meta.controller';
import miscController from './controllers/misc.controller';
import pilotController from './controllers/pilot.controller';
import authMiddleware from './middleware/auth.middleware';
import requestloggerUtils from './utils/requestlogger.utils';

import { APIError } from '@/shared/errors';

const router = Router();

router.use(requestloggerUtils);

router.get('/version', metaController.getVersion);
router.get('/config', metaController.getPluginConfig);
router.get('/config/plugin', metaController.getExtendedPluginConfig);
router.get('/config/frontend', metaController.getFrontendConfig);

router.get('/datafeed', miscController.getDataFeed);
router.get('/datafeed/:callsign', miscController.getDataFeedPilot);
router.get('/datafeed/cid/:cid', miscController.getPilotFromCid);

router.get('/pilots', pilotController.getAllPilots);
router.post('/pilots', pilotController.addPilot);
router.get('/pilots/:callsign', pilotController.getPilot);
router.get('/pilots/:callsign/logs', pilotController.getPilotLogs);
router.delete('/pilots/:callsign', pilotController.deletePilot);
router.patch('/pilots/:callsign', pilotController.updatePilot);

router.patch('/vdgs/:callsign', authMiddleware, pilotController.updatePilot);

router.get('/measures', flowController.getAllMeasures);
router.patch('/measures/:id', flowController.editMeasure);
router.get('/legacy-measures', flowController.getLegacyMeasures);

router.use('/airports', airportController.router);
router.use('/auth', authController.router);

router.use((req: Request, res: Response, next: NextFunction) =>
  next(new APIError('Not Found', null, 404)),
);

export default router;
