import bodyparser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import mongoose from 'mongoose';

import config from './config';
import logger from './logger';
import router from './router';
import cdmService from './services/cdm.service';
import ecfmpService from './services/ecfmp.service';

import errors from '@/shared/errors';

(async () => {
  logger.info('starting up');

  if (!config().mongoUri) {
    throw new Error('MONGO_URI has to be set!');
  }

  // TODO: default from mongoose7 will be false, needs to be checked
  mongoose.set('strictQuery', true);
  await mongoose.connect(config().mongoUri);

  if (config().role == 'WORKER') {
    logger.info('starting worker...');

    setInterval(async () => {
      logger.debug('running pilot cleanup');
      try {
        await cdmService.cleanupPilots();
      } catch (error) {
        logger.error('error occurred when cleaning up pilots %o', error);
      }
    }, 10000);

    setInterval(async () => {
      logger.debug('running ECFMP');
      try {
        await ecfmpService.getEcfmpDetails();
        await ecfmpService.allocateMeasuresToPilots();
      } catch (error) {
        logger.error('error occurred getting ecfmp details');
      }
    }, 60000);

    setInterval(async () => {
      logger.debug('running user cleanup');
      try {
        await cdmService.cleanupUsers();
      } catch (error) {
        logger.error('error occurred when cleaning up users %o', error);
      }
    }, 6 * 60 * 60 * 1000); /* 6h */

    // eslint-disable-next-line no-constant-condition
    while (true) {
      await (() => new Promise((res, rej) => setTimeout(res, 10000)))();

      logger.debug('running optimization');
      try {
        await cdmService.optimizeBlockAssignments();
      } catch (error) {
        logger.error('error occurred when optimizing block assignments %o', error);
      }
    }


    // return, do not initialize express app
  }

  const app = express();

  app.use(bodyparser.json());

  app.use(cookieParser());

  app.use('/api/v1', router);

  const frontendRoot = '/opt/dist/frontend';
  app.use(express.static(frontendRoot));
  app.use((req, res) => res.sendFile(`${frontendRoot}/index.html`));

  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      logger.warn(err);

      if (err instanceof errors.APIError) {
        return res.status(err.responseCode).json(err);
      }

      if (err instanceof errors.CustomError) {
        return res.status(500).json(err);
      }

      res.status(500).json({ message: err.message });
    },
  );

  const port = config().port;
  app.listen(port, () => {
    logger.info('listening on port %d', port);
  });
})();
