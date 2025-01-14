import routers from "express";
import { verifyAdminTokenAndAuthorization } from "../../Middleware/Authentication.js";
import { getAllMentorsCaseStudiesListAdminDashboard } from "../../Controllers/AdminDashboardControllers/AdminDashboardCaseStudiesControllers.js";
let router = routers.Router();

//login
router.get(
  "/all-case-studies",
  verifyAdminTokenAndAuthorization,
  getAllMentorsCaseStudiesListAdminDashboard
);

export default router;
