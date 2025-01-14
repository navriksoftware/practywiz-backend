import express from "express";
import {
  fetchGuestLectures,
  RegisterInstitute,
} from "../../Controllers/InstituteControllers/InstituteControllers.js";

const router = express.Router();
router.get("/guest-lectures", fetchGuestLectures);
router.post("/register", RegisterInstitute);

export default router;
