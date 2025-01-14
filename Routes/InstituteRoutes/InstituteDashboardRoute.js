import express from "express";
import { fetchInstituteDetailsDashboard } from "../../Controllers/InstituteControllers/InstituteDashboardControllers.js";

const router = express.Router();
router.post("/get-details", fetchInstituteDetailsDashboard);

export default router;
