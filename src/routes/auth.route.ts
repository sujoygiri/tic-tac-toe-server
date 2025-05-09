import { Router } from "express";
import { body } from "express-validator";
import { handelSignUp } from "../controller/auth.controller";

export const authRouter = Router();

const playerNameValidationChain = () =>
  body("player_name")
    .trim()
    .notEmpty()
    .escape()
    .isString()
    .isLength({ min: 3 });
const emailValidationChain = () =>
  body("email").trim().notEmpty().escape().isEmail();
const passwordValidationChain = () =>
  body("password").trim().notEmpty().escape().isStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  });

authRouter.post(
  "/signup",
  playerNameValidationChain(),
  emailValidationChain(),
  passwordValidationChain(),
  handelSignUp
);
