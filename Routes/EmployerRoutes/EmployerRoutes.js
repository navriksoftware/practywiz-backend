import express from "express";
import {
  employeeRegisterController,
  GetAllApplicantsForInternship,
  getEmployeeDashboardDetails,
  UpdateEmployerOrganizationDetails,
} from "../../Controllers/EmployerControllers/EmployerControllers.js";

const router = express.Router();

// registering of the employer in to users table

router.post("/register", employeeRegisterController);
router.post("/dashboard/fetch-single-details/:id", getEmployeeDashboardDetails);
router.post("/organization-details", UpdateEmployerOrganizationDetails);
router.post("/dashboard/applicants-list", GetAllApplicantsForInternship);

export default router;
