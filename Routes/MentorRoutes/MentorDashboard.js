import express from "express";
import {
  fetchNotifictions,
  fetchSingleDashboardMentorDetails,
  InsertBankDetails,
  MarkAllMessageAsRead,
  MarkSingleMessageAsRead,
} from "../../Controllers/MentorControllers/MentorDashboardController.js";

const router = express.Router();
// fetching single mentor profile details from dashboard whethter it is approved or not approved.
router.post("/fetch-single-details/:id", fetchSingleDashboardMentorDetails);

// entrying the bank details into db
router.post("/bank-details", InsertBankDetails);

router.get("/notification/fetch-all/:userId", fetchNotifictions);
router.post("/notification/mark-all-read", MarkAllMessageAsRead);
router.post("/notification/mark-single-read", MarkSingleMessageAsRead);
export default router;
