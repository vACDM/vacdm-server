import express from 'express';

import messageService from '../services/message.service';

async function incomingMessageHandler(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const response = await messageService.handleInboundMessage(req.body);

    res.json(response);
  } catch (e) {
    next(e);
  }
}

export default {
  incomingMessageHandler,
};
