import express from "express";
import {
  UpdateMenteeEduWorkDetails,
  UpdateMenteeProfileDetails,
  UpdateMenteeProfilePicture,
} from "../../Controllers/MenteeControllers/MenteeProfileSettingsControllers.js";
import { verifyUserToken } from "../../Middleware/Authentication.js";

const router = express.Router();

router.post("/profile-details", verifyUserToken, UpdateMenteeProfileDetails);
router.post("/edu-work-details", verifyUserToken, UpdateMenteeEduWorkDetails);
router.post("/profile-picture", verifyUserToken, UpdateMenteeProfilePicture);

export default router;
