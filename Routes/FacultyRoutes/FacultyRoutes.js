import express from "express";
import {
  CreateClass,
  fetchFacultyclassDetails,
  fetchFacultyDetailsDashboard,
  fetchFacultySingleclassDetails,
  BulkMenteeRegistration,
  UpdateclassDetails,
  fetchStudentListofClass,
  fetchAvailableCaseStudiesForfaculty,
  getCaseStudyData,
  getClassListData,
  fetchStudentListofClasses,
  assignCaseStudyToClass,
  addNonPractywizCaseStudy,
  getNonPractywizCaseStudiesByFaculty,
  fetchAssignCaseStudiesDetails,
  fetchCaseStudiesListByclassId,
  getSingleNonPractywizCaseStudy,
  fetchAssignSingleCaseStudiesDetails,
  handleDeleteClass,
  fetchStudentListofScorePage,SingleStudentAssessmentDetails,SingleStudentAssessmentUpdate
} from "../../Controllers/InstituteControllers/FacultyControllers/FacultyControllers.js";

const router = express.Router();

// ==================== Faculty Routes ====================

// Route to fetch user dashboard details
router.post("/dashboard/details", fetchFacultyDetailsDashboard);
// Route to fetch assigned case Studies
router.post("/dashboard/get-assigned-cases", fetchAssignCaseStudiesDetails);
// Route to fetch assigned Single case Studies
router.post("/dashboard/get-assigned-single-cases", fetchAssignSingleCaseStudiesDetails);
// Route to fetch Single student assessment details
router.post("/dashboard/single-assessment-details",SingleStudentAssessmentDetails);
// Route to use Single student assessment details for update
router.post("/dashboard/single-Student-assessment/update",SingleStudentAssessmentUpdate);

// ==================== Class Routes ====================

// Route to create a new class
router.post("/createClass", CreateClass);

router.post("/class/delete-class", handleDeleteClass);

// Route to fetch class data for dashboard
router.post("/class/get", fetchFacultyclassDetails);

// Route to fetch Signle class details
router.post("/class/singledetail", fetchFacultySingleclassDetails);
// Route to fetch case studies list by  class id
router.post("/class/CaseStudiesList", fetchCaseStudiesListByclassId);

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

// Route to get single non-Practiwiz case study by case study ID
router.post("/case-study/get-single-non-practywiz-case", getSingleNonPractywizCaseStudy);

// Route to get the data of signle case by id  case study
router.post("/case-studies/fetch-caseData", getCaseStudyData);
// Route to get the data of classlist by id  of faculty
router.post("/case-studies/fetch-classlist", getClassListData);
// Route to get the data of  class student by id  of classid
router.post("/Student/fetch-student", fetchStudentListofClasses);
// Route to assign a case study to a class by faculty
router.post("/case-study/assign-case-study", assignCaseStudyToClass);
// Route to fetch the student list of score page
router.post("/student-score/list", fetchStudentListofScorePage);

// ==================== Notification Routes ====================

// Route to get dashboard notifications
router.post("/notifications", CreateClass);

export default router;
