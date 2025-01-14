import routers from "express";
import {
  getAllApprovedMentorsListAdminDashboard,
  getAllMentorCompletedAdminDashboard,
  getAllMentorInCompletedAdminDashboard,
  getAllMentorUpcomingAdminDashboard,
  getAllNotApprovedMentorsListAdminDashboard,
  getAllUsersListAdminDashboard,
  sendEmailAlertForMentorDashboard,
  UpdateMentorToApprove,
  UpdateMentorToDisapprove,
} from "../../Controllers/AdminDashboardControllers/AdminDashboardControllers.js";
import { verifyAdminTokenAndAuthorization } from "../../Middleware/Authentication.js";
import { fetchSingleMentorPrivateDetails } from "../../Controllers/AdminDashboardControllers/AdminMentotPrivateProfileControllers.js";
let router = routers.Router();

//login
router.get(
  "/users/all-list",
  verifyAdminTokenAndAuthorization,
  getAllUsersListAdminDashboard
);

router.get(
  "/mentors/approved/all-list",
  verifyAdminTokenAndAuthorization,
  getAllApprovedMentorsListAdminDashboard
);

router.get(
  "/mentors/not-approved/all-list",
  verifyAdminTokenAndAuthorization,
  getAllNotApprovedMentorsListAdminDashboard
);
router.get(
  "/mentors/private-profile/:id",
  verifyAdminTokenAndAuthorization,
  fetchSingleMentorPrivateDetails
);
router.post("/mentors/update/not-approve", UpdateMentorToDisapprove);
router.post("/mentors/update/approve", UpdateMentorToApprove);

// getting the mentor booking session
router.get(
  "/mentors/booking/upcoming-session-lists",
  verifyAdminTokenAndAuthorization,
  getAllMentorUpcomingAdminDashboard
);

router.get(
  "/mentors/booking/completed-session-lists",
  verifyAdminTokenAndAuthorization,
  getAllMentorCompletedAdminDashboard
);
router.get(
  "/mentors/booking/in-completed-session-lists",
  verifyAdminTokenAndAuthorization,
  getAllMentorInCompletedAdminDashboard
);

router.post(
  "/mentors/progress/email-alert",
  verifyAdminTokenAndAuthorization,
  sendEmailAlertForMentorDashboard
);
export default router;
