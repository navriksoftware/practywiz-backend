import express from "express";
import {
  fetchSingleDashboardMenteeDetails,
  MenteeApprovedBookingAppointments,
  MenteeCompletedBookingAppointments,
  MenteeFeedbackSubmitHandler,
  MenteefetchAppliedInternships,
  MenteefetchCaseStudiesDetails,
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

router.post("/applied-internships", MenteefetchAppliedInternships);
// router.get("/applied-internships", MenteefetchAppliedInternships);
router.post("/case-studies-details", MenteefetchCaseStudiesDetails);


router.post("/notification/mark-all-read", MenteeMarkAllMessageAsRead);
router.post("/notification/mark-single-read", MenteeMarkSingleMessageAsRead);
export default router;
