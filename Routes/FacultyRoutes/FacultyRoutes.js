import express from "express";
import {
  CreateClass,
  fetchFacultyclassDetails,
  fetchFacultyDetailsDashboard,
  fetchFacultySingleclassDetails,
  BulkMenteeRegistration, UpdateclassDetails,
  fetchStudentListofClass,
  fetchAvailableCaseStudiesForfaculty, getCaseStudyData,
  getClassListData
  , fetchStudentListofClasses,assignCaseStudyToClass,
  addNonPractywizCaseStudy,
  getNonPractywizCaseStudiesByFaculty
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
router.post("/class/singledetail-Update", UpdateclassDetails);

router.post("/class/studentlist", fetchStudentListofClass);

// ==================== Notification Routes ====================

// Route to get bulk-register-mentees/student by faculty
router.post("/bulk-register-mentees", BulkMenteeRegistration);

// ==================== Case Study Routes ====================

// Route to fetch available case studies (Practiwiz and others)
router.post("/case-study/list", fetchAvailableCaseStudiesForfaculty);

// Route to add a non-Practiwiz case study
router.post("/case-study/add-external", CreateClass);


// Route to add a non-Practiwiz case study
router.post("/case-study/add-non-practywiz-case", addNonPractywizCaseStudy);

// Route to get non-Practiwiz case studies by faculty
router.post("/case-study/list-non-practywiz-case", getNonPractywizCaseStudiesByFaculty);


// Route to get the data of signle case by id  case study 
router.post("/case-studies/fetch-caseData", getCaseStudyData);
// Route to get the data of classlist by id  of faculty
router.post("/case-studies/fetch-classlist", getClassListData);
// Route to get the data of  class student by id  of classid
router.post("/Student/fetch-student", fetchStudentListofClasses);
// Route to assign a case study to a class by faculty
router.post("/case-study/assign-case-study", assignCaseStudyToClass);


// ==================== Notification Routes ====================

// Route to get dashboard notifications
router.post("/notifications", CreateClass);

export default router;
