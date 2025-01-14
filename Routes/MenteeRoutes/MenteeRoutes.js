import express from "express";
import { MenteeRegistration } from "../../Controllers/MenteeControllers/MenteeControllers.js";

const router = express.Router();
router.post("/register", MenteeRegistration);
export default router;
