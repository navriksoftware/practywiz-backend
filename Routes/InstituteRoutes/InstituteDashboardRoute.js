import express from "express";
import { fetchCaseStudiesListInstitute, fetchInstituteDetailsDashboard,fetchInstituteFacultyDetailsDashboard,fetchInstituteSingleFacultyDetails,AssignCaseStudyToFaculty } from "../../Controllers/InstituteControllers/InstituteDashboardControllers.js";

const router = express.Router();
router.post("/get-details", fetchInstituteDetailsDashboard);
router.post("/faculty-list", fetchInstituteFacultyDetailsDashboard);
router.post("/Single-facultyDetails", fetchInstituteSingleFacultyDetails);
router.post("/case-Studies-List", fetchCaseStudiesListInstitute);
router.post("/assignCase-ToFaculty", AssignCaseStudyToFaculty);



export default router;
