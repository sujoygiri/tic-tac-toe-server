import express from "express";
import { query } from "express-validator";

import {
  findPlayerById,
  joinInQueuePlayer,
} from "../controller/player.controller";

export const playerRoute = express.Router();

const playerIdValidationChain = () =>
  query("playerId")
    .trim()
    .notEmpty()
    .escape()
    .isString()
    .isLength({ min: 10, max: 10 });

playerRoute.get("/join-in-queue", joinInQueuePlayer);

playerRoute.get("/find-player-id", playerIdValidationChain(), findPlayerById);

// playerRoute.get("/found-player")

// export default playerRoute
