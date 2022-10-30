import { NextFunction, Request, Response } from 'express';
import datafeedService from '../services/datafeed.service';

export async function getDataFeed(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const datafeed = await datafeedService.getRawDatafeed();

    res.json(datafeed);
  } catch (error) {
    next(error);
  }
}

export async function getDataFeedPilot(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const flight = await datafeedService.getFlight(req.params.callsign);

    res.json(flight);
  } catch (error) {
    if (error.message == 'requested flight not online') {
      return next();
    }
    
    next(error);
  }
}

export async function getPilotFromCid(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const pilot = await datafeedService.getFlightByCid(req.params.cid);

    res.json(pilot);
  } catch (error) {
    if (error.message == 'requested flight not online') {
      return next();
    }
    
    next(error);
  }
}


export default {
  getDataFeed,
  getDataFeedPilot,
  getPilotFromCid
};
