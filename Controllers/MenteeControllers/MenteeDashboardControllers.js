import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";
import { sendEmail } from "../../Middleware/AllFunctions.js";
import moment from "moment";
import {
  fetchMenteeSingleDashboardQuery,
  IsFeedbackSubmittedQuery,
  MarkMenteeAllMessagesAsReadQuery,
  MarkMenteeSingleMessageAsReadQuery,
  MenteeApprovedBookingQuery,
  MenteeCompletedBookingQuery,
  MenteeFeedbackSubmitHandlerQuery,
} from "../../SQLQueries/Mentee/MenteeDashboardSQlQueries.js";
dotenv.config();
// get all mentee user details in the dashboard after login
// to fetch single mentor and need to pass the user id
export async function fetchSingleDashboardMenteeDetails(req, res) {
  const { userId } = req.body;
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        return res.json({
          error: err.message,
        });
      }
      if (db) {
        const request = new sql.Request();
        request.input("desired_mentee_dtls_id", sql.Int, userId);
        request.query(fetchMenteeSingleDashboardQuery, (err, result) => {
          if (err) {
            return res.json({
              error: err.message,
            });
          }
          if (result.recordset.length > 0) {
            return res.json({
              success: result.recordset,
            });
          } else {
            return res.json({
              error: "No mentee found",
            });
          }
        });
      }
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
}
// get mentor approved or not approved booking appointments using the userid
export async function MenteeApprovedBookingAppointments(req, res) {
  const { userDtlsId } = req.body;
  try {
    sql.connect(config, (err, db) => {
      if (err) return res.json({ error: "There is some error while fetching" });
      const request = new sql.Request();
      request.input("menteeUserDtlsId", sql.Int, userDtlsId);
      request.query(MenteeApprovedBookingQuery, (err, result) => {
        if (err) return res.json({ error: err.message });
        if (result && result.recordset && result.recordset.length > 0) {
          return res.json({ success: result.recordset });
        } else {
          return res.json({ error: "No record found" });
        }
      });
    });
  } catch (error) {
    return res.json({ error: "There is some error while fetching" });
  }
}

// get mentor approved or not approved booking appointments using the userid
export async function MenteeCompletedBookingAppointments(req, res) {
  const { userDtlsId } = req.body;
  try {
    sql.connect(config, (err, db) => {
      if (err) return res.json({ error: "There is some error while fetching" });
      const request = new sql.Request();
      request.input("menteeUserDtlsId", sql.Int, userDtlsId);
      request.query(MenteeCompletedBookingQuery, (err, result) => {
        if (err) return res.json({ error: err.message });
        if (result && result.recordset && result.recordset.length > 0) {
          return res.json({ success: result.recordset });
        } else {
          return res.json({ error: "no bookings found" });
        }
      });
    });
  } catch (error) {
    return res.json({ error: "There is some error while fetching" });
  }
}

export async function MenteeFeedbackSubmitHandler(req, res) {
  const {
    platformExperience,
    contentRelevance,
    mentorCommunication,
    sessionPace,
    sessionFeedback,
    anotherSession,
    detailedSessionFeedback,
    mentorUserId,
    mentorDtlsId,
    menteeUserId,
    bookingId,
    overallRating,
  } = req.body;
  const timestamp = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

  try {
    sql.connect(config, (err, db) => {
      if (err) return res.json({ error: err.message });
      const request = new sql.Request();
      request.input("mentorBookingID", sql.Int, bookingId);
      request.query(IsFeedbackSubmittedQuery, (err, result) => {
        if (err) return res.json({ error: err.message });
        if (result.recordset.length === 0) {
          request.input("mentorDtlsId", sql.Int, mentorDtlsId);
          request.input("mentorUserDtlsId", sql.Int, mentorUserId);
          request.input("mentorApptBookingDtlsId", sql.Int, bookingId);
          request.input("menteeUserDtlsId", sql.Int, menteeUserId);
          request.input("sessionRelevant", sql.Int, contentRelevance);
          request.input("commSkills", sql.Int, mentorCommunication);
          request.input("sessionAppropriate", sql.Int, sessionPace);
          request.input("detailedFb", sql.Text, detailedSessionFeedback);
          request.input("fbSugg", sql.Text, sessionFeedback);
          request.input("anotherSession", sql.VarChar(10), anotherSession);
          request.input("overallRating", sql.Int, overallRating);
          request.input("platformRating", sql.Int, platformExperience);
          request.input("mentorFeedbackDtlsCrDate", sql.Date, timestamp);
          request.query(MenteeFeedbackSubmitHandlerQuery, (err, result) => {
            if (err) return res.json({ error: err.message });
            if (result) {
              return res.json({ success: "Thank you for your feedback" });
            }
          });
        } else {
          return res.json({
            success: "You have all ready submitted the feedback. Thank you",
          });
        }
      });
    });
  } catch (error) {
    return res.json({ error: "There is some error while fetching" });
  }
}

export async function MenteeMarkAllMessageAsRead(req, res) {
  const { userId } = req.body;
  const timestamp = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        return res.json({
          error: err.message,
        });
      }
      if (db) {
        const request = new sql.Request();
        request.input("menteeUserDtlsId", sql.Int, userId);
        request.input("timestamp", sql.DateTime, timestamp);
        request.query(MarkMenteeAllMessagesAsReadQuery, (err, result) => {
          if (err) {
            return res.json({
              error: err.message,
            });
          }
          if (result) {
            return res.json({
              success: "success",
            });
          } else {
            return res.json({
              error: "error",
            });
          }
        });
      }
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
}
export async function MenteeMarkSingleMessageAsRead(req, res) {
  const { userId, notificationId } = req.body;
  const timestamp = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        return res.json({
          error: err.message,
        });
      }
      if (db) {
        const request = new sql.Request();
        request.input("menteeUserDtlsId", sql.Int, userId);
        request.input("menteeNotificationId", sql.Int, notificationId);
        request.input("timestamp", sql.DateTime, timestamp);
        request.query(MarkMenteeSingleMessageAsReadQuery, (err, result) => {
          if (err) {
            return res.json({
              error: err.message,
            });
          }
          if (result) {
            return res.json({
              success: "success",
            });
          } else {
            return res.json({
              error: "error",
            });
          }
        });
      }
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
}
