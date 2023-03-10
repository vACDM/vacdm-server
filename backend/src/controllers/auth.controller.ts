import { UserDocument } from "./../models/user.model";
import config from "../config";
import { NextFunction, Request, Response } from "express";
import authService from "../services/auth.service";
import { APIError } from "@shared/errors";
import datafeedService from "../services/datafeed.service";

export async function authUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let { code } = req.query;
    if (Array.isArray(code) || !code) {
      throw new Error("code must be a string, no array");
    }

    const response = await authService.authUser(code.toString());

    res.cookie("vacdm_token", response, {
      secure: false,
      httpOnly: true,
    });

    const user: UserDocument = await authService.getUserFromToken(response);
    console.log("User is: ", user);

    if (user.vacdm.atc || user.vacdm.admin) {
      return res.redirect("/atc");
    }

    res.redirect("/vdgs/");
    } catch (error) {
    if (error.message == "something went wrong with auth") {
      return next();
    }

    next(error);
  }
}

export async function getProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.user) {
    req.user.access_token = "";
    req.user.refresh_token = "";
  }
  res.json(req.user ?? {});
}

export async function logoutUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.clearCookie("vacdm_token");
  res.json({ success: true });
}

export default {
  authUser,
  getProfile,
  logoutUser,
};
