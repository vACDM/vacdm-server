import { NextFunction, Request, Response } from 'express';

import { PilotDocument } from '../models/pilot.model';
import { PilotLogDocument } from '../models/pilotLog.model';
import pilotService from '../services/pilot.service';

export async function addPilot(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const pilot: PilotDocument = await pilotService.addPilot(req.body);

    res.json(pilot);
  } catch (error) {
    next(error);
  }
}

export async function getAllPilots(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { adep } = req.query;

  const filter = {};

  if (adep) {
    if (Array.isArray(adep)) {
      filter['flightplan.departure'] = {
        $in: adep.map((str: string | qs.ParsedQs) =>
          str.toString().toUpperCase(),
        ),
      };
    } else {
      filter['flightplan.departure'] = adep.toString().toUpperCase();
    }
  }

  try {
    const pilots: PilotDocument[] = await pilotService.getAllPilots(filter);

    res.json(pilots);
  } catch (error) {
    next(error);
  }
}

export async function getPilot(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const pilot: PilotDocument = await pilotService.getPilot(
      req.params.callsign,
    );

    res.json(pilot);
  } catch (error) {
    next(error);
  }
}

export async function getPilotLogs(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { callsign } = req.params;
  try {
    if (!await pilotService.doesPilotExist(callsign)) {
      // pilot does not exists, so 404
      return next();
    }


    const pilotLogs: PilotLogDocument[] = await pilotService.getPilotLogs(
      callsign,
    );

    res.json(pilotLogs);
  } catch (error) {
    next(error);
  }
}

export async function deletePilot(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await pilotService.deletePilot(req.params.callsign);

    res.json({
      msg: 'deleted pilot',
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePilot(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const pilot: PilotDocument = await pilotService.updatePilot(
      req.params.callsign,
      req.body,
    );

    res.json(pilot);
  } catch (error) {
    next(error);
  }
}

export default {
  addPilot,
  getAllPilots,
  getPilot,
  getPilotLogs,
  deletePilot,
  updatePilot,
};
