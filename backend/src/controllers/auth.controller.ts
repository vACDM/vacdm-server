import { NextFunction, Request, Response } from "express";
import authService from "../services/auth.service";



export async function authUser(
  req: Request,
  res: Response,
  next: NextFunction
) {

    try {
        const response = await authService.authUser(req.query.code);
    
        res.cookie("vacdm_token", response, {
          secure: false,
          httpOnly: true,
        });
        res.redirect("http://localhost:3000");
      } catch (error) {
        if (error.message == 'something went wrong with auth') {
          return next();
        }
        
        next(error);
      }
    
}


export default {
    authUser
  };