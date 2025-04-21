import express from "express";
import { fetchInstituteDetailsDashboard,fetchInstituteFacultyDetailsDashboard,fetchInstituteSingleFacultyDetails } from "../../Controllers/InstituteControllers/InstituteDashboardControllers.js";

const router = express.Router();
router.post("/get-details", fetchInstituteDetailsDashboard);
router.post("/faculty-list", fetchInstituteFacultyDetailsDashboard);
router.post("/Single-facultyDetails", fetchInstituteSingleFacultyDetails);


export default router;
