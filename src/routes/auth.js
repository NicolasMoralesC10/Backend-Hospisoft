import express from "express";
import { celebrate, Joi, Segments } from "celebrate";
const router = express.Router();
import { login } from "../controllers/Auth/auth.js";

router.post(
  "/login",
  celebrate({
    [Segments.BODY]: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    }),
  }),
  async (req, res) => {
    try {
      const response = await login(req.body);
      res.status(200).json(response);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
);

export default router;
