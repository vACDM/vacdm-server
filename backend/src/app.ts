import Logger from '@dotfionn/logger';
const logger = new Logger('vACDM:app');

import errors from '@shared/errors';

import express from 'express';
import bodyparser from 'body-parser';
import router from './router';
import mongoose from 'mongoose';

import config from './config';
// import session from './utils/session';

(async () => {
  logger.info('starting up');

  if (!config().mongoUri) {
    throw new Error('MONGO_URI has to be set!');
  }

  await mongoose.connect(config().mongoUri);

  const app = express();

  app.use(bodyparser.json());

  app.use('/api/v1', router);

  const frontendRoot = '/opt/frontend/dist';
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
