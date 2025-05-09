import express from "express";
import { joinInQueuePlayer } from "../controller/player.controller";

export const playerRoute = express.Router();

playerRoute.get("/join-in-queue", joinInQueuePlayer);

// playerRoute.get("/found-player")

// export default playerRoute
