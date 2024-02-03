console.clear();
import { check, validationResult } from "express-validator";

export const registerRules = () => [
  check("email", "enter correct email").isEmail(),
  check("email", "email is required").notEmpty(),
  check("password", " enter a valid password").isLength({
    min: 8,
    max: 20,
  }),
  check("username", "enter a valid username, it is required").notEmpty(),
  check("age", "enter your age , it is required").isNumeric(),
];

export const loginRules = () => [
  check("email", "please enter a valid email").isEmail(),
  check("email", "email is required").notEmpty(),
  check("password", "please enter a valid password").isLength({
    min: 8,
    max: 20,
  }),
];

export const validation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty) {
    return res
      .status(400)
      .send({ errors: errors.array().map((err) => ({ msg: err.msg })) });
  }
  next();
};
