import { NextFunction, Request, Response } from 'express';
import { AirportDocument } from '../models/airport.model';
import airportService from '../services/airport.service';

export async function addAirport(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const airport: AirportDocument = await airportService.addAirport(req.body);

    res.json(airport);
  } catch (error) {
    next(error);
  }
}

export async function getAllAirports(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const airports: AirportDocument[] = await airportService.getAllAirports();

    res.json(airports);
  } catch (error) {
    next(error);
  }
}

export async function getAirport(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const pilot: AirportDocument = await airportService.getAirport(
      req.params.icao
    );

    res.json(pilot);
  } catch (error) {
    next(error);
  }
}

export async function deleteAirport(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await airportService.deleteAirport(req.params.icao);

    res.json({
      msg: 'deleted airport',
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAirport(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const airport: AirportDocument = await airportService.updateAirport(
      req.params.icao,
      req.body
    );

    res.json(airport);
  } catch (error) {
    next(error);
  }
}

export default {
  getAllAirports,
  getAirport,
  addAirport,
  deleteAirport,
  updateAirport,
};
