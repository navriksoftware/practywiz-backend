import express from "express";
import {
  createMentorBookingAppointment,
  createMentorRazorPayOrder,
  GetMentorCompletedBookingSessions,
  MentorApprovedBookingAppointments,
  UpdateMentorBookingAppointment,
} from "../../Controllers/MentorControllers/MentorBookingController.js";

const router = express.Router();

router.post("/create-order", createMentorRazorPayOrder);
router.post("/create-booking-appointment", createMentorBookingAppointment);
// in the dashboard
router.post("/upcoming", MentorApprovedBookingAppointments);
// updating the mentor appointment
router.post("/update", UpdateMentorBookingAppointment);
// mentor completed session in the dashboard
router.post("/completed", GetMentorCompletedBookingSessions);

export default router;
