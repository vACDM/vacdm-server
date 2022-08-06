import axios from "axios";
import { NextFunction, Request, Response } from "express";
import authService from "services/auth.service";



export async function authUser(
  req: Request,
  res: Response,
  next: NextFunction
) {

    try {
        const response = await authService.authUser(req.query.code);
    
        res.json(response);
      } catch (error) {
        next(error);
      }
    
}


export default {
    authUser
  };