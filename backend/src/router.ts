import { APIError } from '@shared/errors';
import miscController from './controllers/misc.controller';
import { NextFunction, Request, Response, Router } from 'express';
import pilotController from './controllers/pilot.controller';
import flowController from './controllers/flow.controller';
import airportController from './controllers/airport.controller';
import metaController from './controllers/meta.controller';
import requestloggerUtils from './utils/requestlogger.utils';

const router = Router();

router.use(requestloggerUtils);

router.get('/version', metaController.getVersion);
router.get('/config', metaController.getConfig);

router.get('/datafeed', miscController.getDataFeed);
router.get('/datafeed/:callsign', miscController.getDataFeedPilot);

router.get('/pilots', pilotController.getAllPilots);
router.post('/pilots', pilotController.addPilot);
router.get('/pilots/:callsign', pilotController.getPilot);
router.delete('/pilots/:callsign', pilotController.deletePilot);
router.patch('/pilots/:callsign', pilotController.updatePilot)

router.get('/measures', flowController.getAllMeasures)
router.get('/legacy-measures', flowController.getLegacyMeasures)

router.get('/airports', airportController.getAllAirports);
router.post('/airports', airportController.addAirport);
router.get('/airports/:icao', airportController.getAirport);
router.delete('/airports/:icao', airportController.deleteAirport);
router.patch('/airports/:icao', airportController.updateAirport)

router.use((req: Request, res: Response, next: NextFunction) =>
  next(new APIError('Not Found', null, 404))
);

export default router;
