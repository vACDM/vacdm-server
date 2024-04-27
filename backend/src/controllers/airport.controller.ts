import { AirportBlocks } from '@shared/interfaces/pilot.interface';
import { NextFunction, Request, Response } from 'express';
import { PilotDocument } from '../models/pilot.model';
import pilotService from '../services/pilot.service';
import { AirportDocument } from '../models/airport.model';
import airportService from '../services/airport.service';

export async function addAirport(req: Request, res: Response, next: NextFunction) {
  try {
    const airport: AirportDocument = await airportService.addAirport(req.body);

    res.json(airport);
  } catch (error) {
    next(error);
  }
}

export async function getAllAirports(req: Request, res: Response, next: NextFunction) {
  try {
    const airports: AirportDocument[] = await airportService.getAllAirports();

    res.json(airports);
  } catch (error) {
    next(error);
  }
}

export async function getAirport(req: Request, res: Response, next: NextFunction) {
  try {
    const airport: AirportDocument = await airportService.getAirport(req.params.icao);

    res.json(airport);
  } catch (error) {
    next(error);
  }
}

export async function getAirportBlocks(req: Request, res: Response, next: NextFunction) {
  try {
    const airport: AirportDocument = await airportService.getAirport(req.params.icao);

    if (!airport) {
      return next();
    }

    const blocksPilot: AirportBlocks = {
      icao: req.params.icao,
      rwys: {},
    };

    for (let capacity of airport.capacities) {
      let des = capacity.alias || capacity.rwy_designator;
      blocksPilot.rwys[des] = {};

      for (let i = 0; i < 144; i++) {
        blocksPilot.rwys[des][i] = [];
      }
    }

    const pilots: PilotDocument[] = await pilotService.getAllPilots({
      'vacdm.blockId': { $not: { $eq: -1 } },
      'flightplan.departure': blocksPilot.icao,
    });

    for (let pilot of pilots) {
      if (!pilot?.vacdm?.block_rwy_designator || !pilot?.vacdm?.blockId) {
        continue;
      }

      blocksPilot.rwys[pilot.vacdm.block_rwy_designator][pilot.vacdm.blockId].push(pilot);
    }

    res.json(blocksPilot);
  } catch (error) {
    next(error);
  }
}

export async function deleteAirport(req: Request, res: Response, next: NextFunction) {
  try {
    await airportService.deleteAirport(req.params.icao);

    res.json({
      msg: 'deleted airport',
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAirport(req: Request, res: Response, next: NextFunction) {
  try {
    const airport: AirportDocument = await airportService.updateAirport(req.params.icao, req.body);

    res.json(airport);
  } catch (error) {
    next(error);
  }
}

export default {
  getAllAirports,
  getAirport,
  getAirportBlocks,
  addAirport,
  deleteAirport,
  updateAirport,
};
