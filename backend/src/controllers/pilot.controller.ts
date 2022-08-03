import { NextFunction, Request, Response } from 'express';
import { PilotDocument } from '../models/pilot.model';
import pilotService from '../services/pilot.service';

export async function addPilot(
  req: Request,
  res: Response,
  next: NextFunction
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
  next: NextFunction
) {
  const { adep } = req.query;

  let filter = {};

  if (adep) {
    if (Array.isArray(adep)) {
      filter['flightplan.departure'] = {
        $in: adep.map((str: string | qs.ParsedQs) =>
          str.toString().toUpperCase()
        ),
      };
    } else {
      filter['flightplan.departure'] = adep.toString().toUpperCase();
    }
  }

  try {
    let pilots: PilotDocument[] = await pilotService.getAllPilots(filter);

    if (!req.query.debug) {
      pilots = pilots.map((pilot: PilotDocument) => {
        pilot.log = [];
        return pilot;
      });
    }

    res.json(pilots);
  } catch (error) {
    next(error);
  }
}

export async function getPilot(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const pilot: PilotDocument = await pilotService.getPilot(
      req.params.callsign
    );

    if (!req.query.debug) {
      pilot.log = [];
    }

    res.json(pilot);
  } catch (error) {
    next(error);
  }
}

export async function deletePilot(
  req: Request,
  res: Response,
  next: NextFunction
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
  next: NextFunction
) {
  try {
    const pilot: PilotDocument = await pilotService.updatePilot(
      req.params.callsign,
      req.body
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
  deletePilot,
  updatePilot,
};
