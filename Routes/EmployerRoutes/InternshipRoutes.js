import express from "express";
import {
  CreateInternshipPost,
  fetchAllInternshipPosts,
  fetchSingleInternshipPost,
} from "../../Controllers/EmployerControllers/InternshipsControllers.js";
import { verifyUserToken } from "../../Middleware/Authentication.js";

const router = express.Router();

// registering of the employer in to users table
router.post("/create-post", verifyUserToken, CreateInternshipPost);

router.post("/fetch-internship-listing", fetchAllInternshipPosts);

router.post("/fetch-internship-post", fetchSingleInternshipPost);
export default router;
