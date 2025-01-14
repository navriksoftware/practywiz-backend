import express from "express";
import {
  fetchSingleDashboardMenteeDetails,
  MenteeApprovedBookingAppointments,
  MenteeCompletedBookingAppointments,
  MenteeFeedbackSubmitHandler,
  MenteeMarkAllMessageAsRead,
  MenteeMarkSingleMessageAsRead,
} from "../../Controllers/MenteeControllers/MenteeDashboardControllers.js";

const router = express.Router();
router.post("/fetch-single-details/:id", fetchSingleDashboardMenteeDetails);

router.post("/appointments/upcoming", MenteeApprovedBookingAppointments);
// to get the mentee completed sessions
router.post("/appointments/completed", MenteeCompletedBookingAppointments);

// submitting the mentor feedback
router.post("/appointments/feedback/submit", MenteeFeedbackSubmitHandler);

router.post("/notification/mark-all-read", MenteeMarkAllMessageAsRead);
router.post("/notification/mark-single-read", MenteeMarkSingleMessageAsRead);
export default router;
