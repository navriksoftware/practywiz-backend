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
  ResumeUpload,
  ResumeDownload,
  GetMenteeResultSubmissionStatus,
  GetRecommendedMentors,
  GetRecommendedInternships,
} from "../../Controllers/MenteeControllers/MenteeDashboardControllers.js";
import { verifyUserToken } from "../../Middleware/Authentication.js";

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

router.post("/resume/upload", ResumeUpload);
router.get("/resume/download", ResumeDownload);

router.post("/get-result-submission-status", GetMenteeResultSubmissionStatus);

router.get(
  "/recommend-mentors/:menteeId",
  verifyUserToken,
  GetRecommendedMentors
);
router.get("/recommend-internships/:menteeId", GetRecommendedInternships);

export default router;
