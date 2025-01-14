import express from "express";
import { createMentorCaseInput } from "../../Controllers/MentorControllers/MentorCaseStudyControllers.js";
import { verifyUserToken } from "../../Middleware/Authentication.js";

const router = express.Router();

router.post("/create-case-study", verifyUserToken, createMentorCaseInput);

export default router;
