import Logger from '@dotfionn/logger';
const logger = new Logger('vACDM:app');

import errors from '@shared/errors';

import express from 'express';
import bodyparser from 'body-parser';
import router from './router';
import mongoose from 'mongoose';

import config from './config';
import cdmService from './services/cdm.service';
// import session from './utils/session';

(async () => {
  logger.info('starting up');

  if (!config().mongoUri) {
    throw new Error('MONGO_URI has to be set!');
  }

  await mongoose.connect(config().mongoUri);

  if (config().role == 'WORKER') {
    setInterval(async () => {
      try {
        await cdmService.cleanupPilots();
      } catch (error) {
        logger.error('error occurred when cleaning up pilots');
      }
    }, 10000);

    while (true) {
      try {
        await cdmService.optimizeBlockAssignments();
      } catch (error) {
        logger.error('error occurred when optimizing block assignments');
      }
      await cdmService.cleanupPilots();
    }

    // return, do not initialize express app
  }

  const app = express();

  app.use(bodyparser.json());

  app.use('/api/v1', router);

  const frontendRoot = '/opt/frontend/build';
  app.use(express.static(frontendRoot));
  app.use((req, res) => res.sendFile(`${frontendRoot}/index.html`));

  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      console.log(err);

      if (err instanceof errors.APIError) {
        return res.status(err.responseCode).json(err);
      }

      if (err instanceof errors.CustomError) {
        return res.status(500).json(err);
      }

      res.status(500).json({ message: err.message });
    }
  );

  const port = config().port;
  app.listen(port, () => {
    logger.info('listening on port', port);
  });
})();
