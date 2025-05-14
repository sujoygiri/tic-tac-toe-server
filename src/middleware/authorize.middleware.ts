import { Request, Response, NextFunction } from "express";

import { PlayerSessionData } from "../types/global.type";

export const checkAuthorization = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const playerData: PlayerSessionData | undefined = req.session.playerData;
    if (playerData && playerData.player_id) {
      next();
    } else {
      const error = new Error("Session not found!");
      next(error);
    }
  } catch (error) {
    console.log({ file: module.filename, error });
    error = new Error("Internal server error");
    next(error);
  }
};
