import express from "express";
import {
  MentorUpdateMentorProfile1,
  MentorUpdateMentorProfile2,
  MentorUpdateMentorProfile3,
  MentorUpdateMentorProfile4,
  UpdateMentorProfilePicture,
} from "../../Controllers/MentorControllers/MentorDashboardUpdateControllers.js";
import { verifyUserToken } from "../../Middleware/Authentication.js";

const router = express.Router();
// updating the mentor profile 1
router.post("/profile-1", verifyUserToken, MentorUpdateMentorProfile1);

router.post("/profile-2", verifyUserToken, MentorUpdateMentorProfile2);

router.post("/profile-3", verifyUserToken, MentorUpdateMentorProfile3);

router.post("/profile-4", verifyUserToken, MentorUpdateMentorProfile4);

router.post("/profile-picture", verifyUserToken, UpdateMentorProfilePicture);

export default router;
