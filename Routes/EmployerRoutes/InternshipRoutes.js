import express from "express";
import {
  ApplyInternship,
  CreateInternshipPost,
  EditInternshipPost,
  employerProfileSettingUpdate,
  fetch10InternshipsInHome,
  fetchAllInternshipPosts,
  fetchSingleInternshipPost,
  internshipStatusChange,
} from "../../Controllers/EmployerControllers/InternshipsControllers.js";
import { verifyUserToken } from "../../Middleware/Authentication.js";
// import EditInternshipPost from "../../../practywiz-frontend/src/Components/Employer/Internships/OtherComponents/EditInternshipPost.js";

const router = express.Router();

// registering of the employer in to users table
router.post("/create-post", verifyUserToken, CreateInternshipPost);

router.post("/fetch-internship-listing", fetchAllInternshipPosts);

router.post("/fetch-internship-post", fetchSingleInternshipPost);

router.get("/fetch-10-internships", fetch10InternshipsInHome);

//employer routes for profile settings update
router.post("/employer-profileSettings", employerProfileSettingUpdate);

router.post("/apply-internship", ApplyInternship);

router.post("/status-internship", internshipStatusChange);

router.put("/edit-internship-post", EditInternshipPost);
export default router;
