const { signUp, login } = require("../controllers/auth");

const express = require("express");
const validate = require("../middlewares/validation");

const zod = require("zod");

const router = express.Router();

const signUpSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(6),
  phone: zod.string().optional(),
});

const loginSchema = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});

router.post("/login", validate(loginSchema), login);
router.post("/signup", validate(signUpSchema), signUp);

module.exports = router;
