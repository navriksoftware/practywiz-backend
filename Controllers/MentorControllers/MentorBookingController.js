import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import {
  MentorBookingAppointmentQuery,
  MentorBookingOrderQuery,
  RazorpayBookingOrderQuery,
} from "../../SQLQueries/MentorSQLQueries.js";
import {
  FetchMentorBookingAppointmentQuery,
  MentorApprovedBookingQuery,
  MentorCompletedSessionsBookingMenteeNameQuery,
  UpdateMentorBookingAppointmentQuery,
} from "../../SQLQueries/MentorDashboard/MentorBookingQueries.js";
import { createZoomMeeting } from "../../Middleware/ZoomLinkGeneration.js";
import {
  convertISTtoUTC,
  extractDateFromISOString,
} from "../../Middleware/DateFunction.js";
import { appointmentBookedTraineeEmailTemplate } from "../../EmailTemplates/MentorEmailTemplate/MentorBookingEmailTemplate.js";
import { sendEmail } from "../../Middleware/AllFunctions.js";
import { InsertNotificationHandler } from "../../Middleware/NotificationFunction.js";
import { SuccessMsg } from "../../Messages/Messages.js";

dotenv.config();

//create razor pay order
export async function createMentorRazorPayOrder(req, res, next) {
  const { mentorId, menteeEmail, userId, mentorTimeSlotDuration } = req.body;
  try {
    sql.connect(config, (err) => {
      if (err) {
        return res.json({
          error: "There is some error while creating the order",
        });
      }
      const request = new sql.Request();
      request.input("mentorId", sql.Int, mentorId);
      request.query(
        "select * from mentor_dtls where mentor_dtls_id = @mentorId",
        (err, result) => {
          if (err)
            return res.json({
              error: "There is some error while creating the order",
            });
          if (result.recordset.length > 0) {
            const mentorPrice = result.recordset[0].mentor_session_price;
            if (mentorTimeSlotDuration === "30") {
              var updateMentorPrice = mentorPrice / 2;
            } else if (mentorTimeSlotDuration === "60") {
              var updateMentorPrice = mentorPrice;
            }
            const instance = new Razorpay({
              key_id: process.env.RAZORPAY_KEY_ID,
              key_secret: process.env.RAZORPAY_KEY_SECRET_STRING,
            });
            const options = {
              amount: updateMentorPrice * 100,
              currency: "INR",
            };
            instance.orders
              .create(options)
              .then((order) => {
                request.input("bookingMCRazDltsId", sql.Int, mentorId);
                request.input("bookingRazUserDtlsId", sql.Int, userId);
                request.input("userEmail", sql.VarChar, menteeEmail);
                request.input("amount", sql.Decimal, order.amount);
                request.input("amountDue", sql.Decimal, order.amount_due);
                request.input("amountPaid", sql.Decimal, order.amount_paid);
                request.input("attempts", sql.Int, order.attempts);
                request.input("createdAt", sql.Int, order.created_at);
                request.input("currency", sql.VarChar, order.currency);
                request.input("entity", sql.VarChar, order.entity);
                request.input("id", sql.VarChar, order.id);
                request.input("offerId", sql.VarChar, order.offer_id);
                request.input("receipt", sql.VarChar, order.receipt);
                request.input("status", sql.VarChar, order.status);
                request.input("type", sql.VarChar, "mentor booking");
                request.query(RazorpayBookingOrderQuery, (err, result) => {
                  if (err) return res.json({ error: err.message });
                  if (result) return res.json({ success: order });
                });
              })
              .catch((error) => {
                return res.json({ error: error.message });
              });
          } else {
            return res.json({
              error: "There is an error while booking the appointment",
            });
          }
        }
      );
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
}

// create the mentor booking appointment after payment
export async function createMentorBookingAppointment(req, res, next) {
  const {
    mentorId,
    userId,
    date,
    from,
    to,
    amount,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
    mentorUserDtlsId,
    mentorName,
    username,
    timeSlotId,
  } = req.body;
  const { questions, selected } = req.body.data;
  let ChangedDate = new Date(
    new Date(date).setDate(new Date(date).getDate() + 1)
  );
  try {
    sql.connect(config, (err, db) => {
      if (err) return res.json({ error: err.message });
      if (db) {
        const request = new sql.Request();
        request.input("mentorDtlsId", sql.Int, mentorId);
        request.input("menteeUserDtlsId", sql.Int, userId);
        request.input("mentorSessionBookingDate", sql.Date, ChangedDate);
        request.input(
          "mentorBookedDate",
          sql.Date,
          new Date().toISOString().substring(0, 10)
        );
        request.input("mentorBookingStartsTime", sql.VarChar, from);
        request.input("mentorBookingEndTime", sql.VarChar, to);
        request.input("mentorBookingTime", sql.VarChar, from + "-" + to);
        request.input("mentorAmount", sql.Decimal(10, 2), amount / 100);
        request.input("mentorOptions", sql.VarChar, selected);
        request.input("mentorQuestions", sql.VarChar, questions);
        request.input(
          "mentorRazorpayPaymentId",
          sql.VarChar,
          razorpayPaymentId
        );
        request.input("mentorRazorpayOrderId", sql.VarChar, razorpayOrderId);
        request.input(
          "mentorRazorpaySignature",
          sql.VarChar,
          razorpaySignature
        );
        request.input("mentorHostUrl", sql.VarChar, "Mentor host url");
        request.input("traineeJoinUrl", sql.VarChar, "trainee join url");
        request.input("mentorAmountPaidStatus", sql.VarChar, "Yes");
        request.input("mentorTimeslotId", sql.Int, timeSlotId);
        request.query(MentorBookingAppointmentQuery, async (err, result) => {
          if (err) {
            return res.json({
              error: err.message,
            });
          }
          if (result) {
            const mentorNotificationHandler = InsertNotificationHandler(
              mentorUserDtlsId,
              SuccessMsg,
              "Appointment booked by Mentee",
              "You have received the mentor session appointment with " +
                username +
                " on " +
                new Date(date).toLocaleDateString() +
                " at " +
                from +
                "-" +
                to
            );
            const menteeNotificationHandler = InsertNotificationHandler(
              userId,
              SuccessMsg,
              "Appointment is booked",
              "You have booked the session appointment with " +
                mentorName +
                " on " +
                new Date(date).toLocaleDateString() +
                " at " +
                from +
                "-" +
                to +
                " Please wait for the mentor to accept the session."
            );
            return res.json({ success: "Successfully appointment is created" });
          }
        });
      }
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
}

// get the upcoming mentor appointments
export async function MentorApprovedBookingAppointments(req, res) {
  const { userDtlsId } = req.body;
  try {
    sql.connect(config, (err, db) => {
      if (err) return res.json({ error: "There is some error while fetching" });
      const request = new sql.Request();
      request.input("mentorUserDtlsId", sql.Int, userDtlsId);
      request.query(MentorApprovedBookingQuery, (err, result) => {
        if (err) return res.json({ error: err.message });
        if (result && result.recordset && result.recordset.length > 0) {
          return res.json({ success: result.recordset });
        } else {
          return res.json({ error: "No approved bookings found" });
        }
      });
    });
  } catch (error) {
    return res.json({ error: "There is some error while fetching" });
  }
}

// update the mentor booking appointment to generate the meeting invite
export async function UpdateMentorBookingAppointment(req, res, next) {
  const { bookingId, mentorUserDtlsId, menteeUserDtlsId } = req.body;
  try {
    sql.connect(config, (err, db) => {
      if (err) return res.json({ error: "There is some error while fetching" });
      const request = new sql.Request();
      request.input("UnapprovedBookingId", sql.Int, bookingId);
      request.query(FetchMentorBookingAppointmentQuery, async (err, result) => {
        if (err) return res.json({ error: err.message });
        if (result.recordset.length > 0) {
          const menteeEmail = result.recordset[0].mentee_email;
          const menteeName =
            result.recordset[0].mentee_firstname +
            " " +
            result.recordset[0].mentee_lastname;
          const mentorEmail = result.recordset[0].mentor_email;
          const mentorName =
            result.recordset[0].mentor_firstname +
            " " +
            result.recordset[0].mentor_lastname;
          const slotTime = result.recordset[0].mentor_booking_time;
          const mentorBookingStartsTime =
            result.recordset[0].mentor_session_booking_date;
          const time = result.recordset[0].mentor_booking_starts_time;
          const updatedTime = time.replace(/([AP]M)/, " $1");
          const startDate = extractDateFromISOString(mentorBookingStartsTime);
          const MentorBookingTime = convertISTtoUTC(startDate, updatedTime);
          const { hostURL, joinURL, meetingId, meetingPassword } =
            await createZoomMeeting(MentorBookingTime, mentorName, menteeName);
          const meetingIDt = meetingId.toString();
          request.input("bookingId", sql.Int, bookingId);
          request.input("joinURL1", sql.VarChar, joinURL);
          request.input("joinURL2", sql.VarChar, joinURL);
          request.input("hostURL", sql.VarChar, hostURL);
          request.input("meetingID", sql.VarChar, meetingIDt);
          request.input("meetingPassword", sql.VarChar, meetingPassword);
          request.query(
            UpdateMentorBookingAppointmentQuery,
            async (err, result) => {
              if (err) return res.json({ error: err.message });
              if (result) {
                const msg = appointmentBookedTraineeEmailTemplate(
                  menteeEmail,
                  menteeName,
                  mentorName,
                  new Date(mentorBookingStartsTime).toLocaleDateString(),
                  slotTime,
                  joinURL
                );
                const mentorNotificationHandler = InsertNotificationHandler(
                  mentorUserDtlsId,
                  SuccessMsg,
                  "Appointment confirmed",
                  "You have confirmed your appointment with " +
                    menteeName +
                    " on " +
                    new Date(mentorBookingStartsTime).toLocaleDateString() +
                    " at " +
                    slotTime
                );
                const menteeNotificationHandler = InsertNotificationHandler(
                  menteeUserDtlsId,
                  SuccessMsg,
                  "Appointment confirmed by Mentor",
                  "Mentor has confirmed your appointment with " +
                    mentorName +
                    " on " +
                    new Date(mentorBookingStartsTime).toLocaleDateString() +
                    " at " +
                    slotTime
                );
                const emailResponse = await sendEmail(msg);
                return res.json({ success: "Appointment confirmed" });
              }
            }
          );
        }
      });
    });
  } catch (error) {
    return res.json({ error: "There is some error while fetching" });
  }
}
// get mentor completed session in the dashboard
export async function GetMentorCompletedBookingSessions(req, res, next) {
  const { userDtlsId } = req.body;
  try {
    sql.connect(config, (err, db) => {
      if (err) return res.json({ error: "There is some error while fetching" });
      const request = new sql.Request();
      request.input("mentorUserDtlsId", sql.Int, userDtlsId);
      request.query(
        MentorCompletedSessionsBookingMenteeNameQuery,
        (err, result) => {
          if (err) return res.json({ error: err.message });
          if (result && result.recordset && result.recordset.length > 0) {
            return res.json({ success: result.recordset });
          } else {
            return res.json({ error: "No bookings found" });
          }
        }
      );
    });
  } catch (error) {
    return res.json({ error: "There is some error while fetching" });
  }
}
