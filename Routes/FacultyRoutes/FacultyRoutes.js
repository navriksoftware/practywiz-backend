import express from "express";
import {
  CreateClass,
  fetchFacultyclassDetails,
  fetchFacultyDetailsDashboard,
  fetchFacultySingleclassDetails,
  BulkMenteeRegistration,
  fetchStudentListofClass,
} from "../../Controllers/InstituteControllers/FacultyControllers/FacultyControllers.js";

const router = express.Router();

// ==================== Faculty Routes ====================

// Route to fetch user dashboard details
router.post("/dashboard/details", fetchFacultyDetailsDashboard);

// ==================== Class Routes ====================

// Route to create a new class
router.post("/createClass", CreateClass);

// Route to fetch class data for dashboard
router.post("/class/get", fetchFacultyclassDetails);

// Route to fetch Signle class details
router.post("/class/singledetail", fetchFacultySingleclassDetails);

// Route to update existing class details
router.post("/class/update", CreateClass);

router.post("/class/studentlist", fetchStudentListofClass);

// ==================== Notification Routes ====================

// Route to get bulk-register-mentees/student by faculty
router.post("/bulk-register-mentees", BulkMenteeRegistration);

// ==================== Case Study Routes ====================

// Route to fetch available case studies (Practiwiz and others)
router.post("/case-study/list", CreateClass);

// Route to add a non-Practiwiz case study
router.post("/case-study/add-external", CreateClass);

// ==================== Profile Routes ====================

// Route to update or fetch mentor profile details
router.post("/profile/details", CreateClass);

// ==================== Notification Routes ====================

// Route to get dashboard notifications
router.post("/notifications", CreateClass);

export default router;
