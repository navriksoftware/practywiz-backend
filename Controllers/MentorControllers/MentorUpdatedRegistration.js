import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";

import {
  sendEmail,
  uploadMentorPhotoToAzure,
} from "../../Middleware/AllFunctions.js";
import { InsertNotificationHandler } from "../../Middleware/NotificationFunction.js";
import {
  AccountCreatedHeading,
  AccountCreatedMessage,
  SuccessMsg,
} from "../../Messages/Messages.js";
import { MentorUserFIrstRegDtlsQuery } from "../../SQLQueries/Auth/AuthSQLqueries.js";
import {
  mentorDtlsUpdatedRegistrationQuery,
  MentorOnboardingFeedbackSqlQuery,
  MentorRegistrationStep2SqlQuery,
  MentorRegistrationStep2SqlQuery2,
  mentorDtlsUpdatedRegistrationQuery2,
} from "../../SQLQueries/MentorDashboard/MentorUpdateRegSqlQueries.js";
import {
  mentorAccountCreatedEmailTemplate,
  mentorUpdatedRegAccountCreatedEmailTemplate,
} from "../../EmailTemplates/AccountEmailTemplate/AccountEmailTemplate.js";
import moment from "moment";
import { mentorApplicationEmail } from "../../EmailTemplates/MentorEmailTemplate/MentorEmailTemplate.js";
// import { json } from "body-parser";
dotenv.config();

// registering of the mentor application
export async function MentorUpdatedRegistration(req, res, next) {
  const {
    mentor_firstname,
    mentor_lastname,
    mentor_email,
    user_type,
    mentor_phone_number,
    mentor_password,
    mentor_linkedin_url,
    mentor_linkedin_url_check,
    linkedinSign,
    linkedinPhotoUrl,
    mentor_country,
    mentor_city,
    mentor_institute,
    mentor_academic_qualification,
    Mentor_Domain,
    jobtitle,
    experience,
    companyName,
    passionateAbout,
    AreaOfexpertise,
    areaofmentorship,
    headline,
    mentor_sessions_free_of_charge,
    mentor_guest_lectures_interest,
    mentor_curating_case_studies_interest,
    mentor_timezone,
    mentor_language,
    mentor_currency_type,
    mentor_session_price,
  } = req.body;
  const imageData = req.files;
  const lowEmail = mentor_email.toLowerCase();
  if (mentor_linkedin_url_check === true) {
    var check = 1;
  } else {
    var check = 0;
  }
  if (
    !mentor_firstname &&
    !mentor_lastname &&
    !mentor_email &&
    !user_type &&
    !mentor_phone_number &&
    !mentor_password
  ) {
    return res.json({
      required: "All details must be required",
    });
  }
  if (linkedinSign === "not_sign_linkedin" && !linkedinPhotoUrl && imageData) {
    const blobName = new Date().getTime() + "-" + req.files.image.name;
    var filename = `https://practiwizstorage.blob.core.windows.net/practiwizcontainer/mentorprofilepictures/${blobName}`;
    uploadMentorPhotoToAzure(imageData, blobName);
  } else {
    filename = linkedinPhotoUrl;
  }
  let saltRounds = await bcrypt.genSalt(12);
  let hashedPassword = await bcrypt.hash(mentor_password, saltRounds);

  sql.connect(config, async (err) => {
    if (err) {
      return res.json({ error: err.message });
    }
    const request = new sql.Request();
    request.input("email", sql.VarChar, lowEmail);
    // Add input parameters
    request.query(
      "select user_email from users_dtls where user_email = @email",
      (err, result) => {
        if (err) return res.json({ error: err.message });
        if (result.recordset.length > 0) {
          return res.json({
            error:
              "The email is all ready in use, Please use another email address or Login to dashboard for updating the mentor details",
          });
        } else {
          const request = new sql.Request();
          // Add input parameters
          request.input("user_email", sql.VarChar, lowEmail);
          request.input("user_pwd", sql.VarChar, hashedPassword);
          request.input("user_firstname", sql.VarChar, mentor_firstname);
          request.input("user_lastname", sql.VarChar, mentor_lastname);
          request.input("user_phone_number", sql.VarChar, mentor_phone_number);
          request.input("user_type", sql.VarChar, user_type);
          request.input("user_status", sql.VarChar, "1");
          // Execute the query
          request.query(MentorUserFIrstRegDtlsQuery, async (err, result) => {
            if (err) {
              return res.json({ error: err.message });
            }
            if (result && result.recordset && result.recordset.length > 0) {
              const userDtlsId = result.recordset[0].user_dtls_id;
              const user_email = mentor_email;
              const user_firstname = mentor_firstname;
              const user_lastname = mentor_lastname;
              const user_role = 0;
              request.input("mentor_user_dtls_id", sql.Int, userDtlsId);
              request.input(
                "mentor_phone_number",
                sql.VarChar,
                mentor_phone_number
              );
              request.input("mentor_email", sql.VarChar, mentor_email);
              request.input(
                "mentor_profile_photo",
                sql.VarChar,
                filename ||
                  "https://practiwizstorage.blob.core.windows.net/practiwizcontainer/blue-circle-with-white-user_78370-4707.webp"
              );
              request.input(
                "mentor_social_media_profile",
                sql.VarChar,
                mentor_linkedin_url || ""
              );
              request.input("mentor_job_title", sql.VarChar, jobtitle || "");
              request.input(
                "mentor_company_name",
                sql.VarChar,
                companyName || ""
              );
              request.input(
                "mentor_years_of_experience",
                sql.Int,
                experience || ""
              );
              request.input(
                "mentor_academic_qualification",
                sql.VarChar,
                mentor_academic_qualification || ""
              );
              request.input(
                "mentor_recommended_area_of_mentorship",
                sql.VarChar,
                areaofmentorship || ""
              );
              request.input(
                "mentor_guest_lectures_interest",
                sql.VarChar,
                mentor_guest_lectures_interest || ""
              );
              request.input(
                "mentor_curating_case_studies_interest",
                sql.VarChar,
                mentor_curating_case_studies_interest || ""
              );
              request.input(
                "mentor_sessions_free_of_charge",
                sql.VarChar,
                mentor_sessions_free_of_charge || ""
              );
              request.input(
                "mentor_language",
                sql.VarChar,
                mentor_language || ""
              );
              request.input(
                "mentor_timezone",
                sql.VarChar,
                mentor_timezone || ""
              );
              request.input(
                "mentor_country",
                sql.VarChar,
                mentor_country || ""
              );
              request.input("mentor_headline", sql.VarChar, headline || "");
              request.input(
                "mentor_session_price",
                sql.VarChar,
                mentor_session_price || "800"
              );
              request.input(
                "mentor_currency",
                sql.VarChar,
                mentor_currency_type || "INR"
              );
              request.input("City", sql.VarChar, mentor_city || "");
              request.input("Institute", sql.VarChar, mentor_institute || "");
              request.input(
                "areaOfExpertise",
                sql.Text,
                AreaOfexpertise || "[]"
              );
              request.input("passionAbout", sql.Text, passionateAbout || "[]");
              request.input("mentorDomain", sql.VarChar, Mentor_Domain || "");

              request.input("mentor_linkedin_checked_status", sql.Bit, check);
              request.query(
                mentorDtlsUpdatedRegistrationQuery,
                async (err, result) => {
                  if (err) return res.json({ error: err.message });
                  if (result) {
                    const mentorNotificationHandler = InsertNotificationHandler(
                      userDtlsId,
                      SuccessMsg,
                      AccountCreatedHeading,
                      AccountCreatedMessage
                    );
                    const msg = mentorUpdatedRegAccountCreatedEmailTemplate(
                      lowEmail,
                      mentor_firstname + " " + mentor_lastname
                    );
                    const accessToken = jwt.sign(
                      {
                        user_id: userDtlsId,
                        user_role: user_role,
                      },
                      process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
                      { expiresIn: "48h" }
                    );
                    const token = jwt.sign(
                      {
                        user_id: userDtlsId,
                        user_email: user_email,
                        user_firstname: user_firstname,
                        user_lastname: user_lastname,
                        user_type: user_type,
                        user_role: user_role,
                      },
                      process.env.JWT_LOGIN_SECRET_KEY,
                      { expiresIn: "48h" }
                    );
                    return res.json({
                      success: true,
                      token: token,
                      accessToken: accessToken,
                    });
                    // const response = await sendEmail(msg);
                    // if (
                    //   response === "True" ||
                    //   response === "true" ||
                    //   response === true
                    // ) {
                    //   return res.json({ success: "success" });
                    // }
                    // if (
                    //   response === "False" ||
                    //   response === "false" ||
                    //   response === false
                    // ) {
                    return res.json({ success: "success" });
                    // }
                  }
                }
              );
            }
          });
        }
      }
    );
  });
}

export async function MentorUpdateAdditionalDetails(req, res, next) {
  const {
    jobtitle,
    experience,
    companyName,
    mentorDomain,
    Skills,
    headline,
    areaofmentorship,
    Currency,
    Pricing,
    guestLectures,
    CaseStudies,
    sessionsFreeOfCharge,
    InstituteName,
    CountryName,
    CityName,
    Timezone,
    Availability,
    userDtlsId,
    mentorDtlsId,
    mentorEmail,
    mentorName,
  } = req.body;
  const timestamp = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

  try {
    sql.connect(config, (err, db) => {
      if (err) return res.json({ error: "There is some error while applying" });
      const request = new sql.Request();
      request.input("jobtitle", sql.VarChar, jobtitle);
      request.input("experience", sql.VarChar, experience);
      request.input("companyName", sql.VarChar, companyName);
      request.input("MentorDomain", sql.VarChar, mentorDomain);
      request.input("AreaOfexpertise", sql.VarChar, Skills || "[]");
      request.input("passionateAbout", sql.VarChar, " ");
      request.input("headline", sql.VarChar, headline);
      request.input("areaofmentorship", sql.VarChar, areaofmentorship || "");
      request.input("Timezone", sql.VarChar, Timezone);
      request.input("currency", sql.VarChar, Currency);
      request.input("sessionprice", sql.Int, Pricing);
      request.input("guestlecturesinterest", sql.VarChar, guestLectures);
      request.input("casestudiesinterest", sql.VarChar, CaseStudies);
      request.input("sessionsfreecharge", sql.VarChar, sessionsFreeOfCharge);
      request.input("Institute", sql.VarChar, InstituteName || "");
      request.input("country", sql.VarChar, CountryName || "");
      request.input("City", sql.VarChar, CityName || "");
      request.input("timeslotJson", sql.Text, Availability);
      request.input("mentor_dtls_id", sql.Int, mentorDtlsId);
      request.query(MentorRegistrationStep2SqlQuery2, async (err, result) => {
        if (err)
          return res.json({
            error: err.message,
          });
        if (result) {
          // adding area of expertise word in to table
          const availabilityData = JSON.parse(Availability);
          updateMentorTimestamp(availabilityData, mentorDtlsId);
          const mentorNotificationHandler = InsertNotificationHandler(
            userDtlsId,
            SuccessMsg,
            AccountCreatedHeading,
            AccountCreatedMessage
          );
          const msg = mentorApplicationEmail(mentorEmail, mentorName);
          const response = await sendEmail(msg);
          if (response === "True" || response === "true" || response === true) {
            return res.json({
              success: "Thank you for applying the mentor application",
            });
          }
          if (
            response === "False" ||
            response === "false" ||
            response === false
          ) {
            return res.json({
              success: "Thank you for applying the mentor application",
            });
          }
        }
      });
    });
  } catch (error) {
    if (error) return res.json({ error: "There is some error while applying" });
  }
}

function arrayFunctions(array, mentorDtlsId, day, timestamp) {
  try {
    sql.connect(config, (err, conn) => {
      if (conn) {
        const request = new sql.Request();
        array.forEach((item) => {
          const FromHour = item.from.hours;
          const FromMinute = item.from.minutes;
          const FromMeridian = item.from.ampm;
          const ToHour = item.to.hours;
          const ToMinute = item.to.minutes;
          const ToMeridian = item.to.ampm;
          let mentorRecType = item.recurring.mentor_timeslot_rec_indicator;
          const mentorRecEndDate = item.date.Mentor_timeslot_rec_end_date;
          const mentorTimeSlotDuration = item.slotDuration.slotDuration;
          const FromTime = FromHour + ":" + FromMinute + FromMeridian;
          const ToTime = ToHour + ":" + ToMinute + ToMeridian;
          if (
            mentorRecType === "" ||
            mentorRecType === "undefined" ||
            mentorRecType === null
          ) {
            mentorRecType = "Daily";
          }
          request.query(
            "INSERT INTO mentor_timeslots_dtls (mentor_dtls_id,mentor_timeslot_day,mentor_timeslot_from,mentor_timeslot_to,mentor_timeslot_rec_indicator,mentor_timeslot_rec_end_timeframe,mentor_timeslot_rec_cr_date,mentor_timeslot_rec_update_date,mentor_timeslot_duration) VALUES('" +
              mentorDtlsId +
              "','" +
              day +
              "','" +
              FromTime +
              "','" +
              ToTime +
              "','" +
              mentorRecType +
              "','" +
              mentorRecEndDate +
              "','" +
              timestamp +
              "','" +
              timestamp +
              "','" +
              mentorTimeSlotDuration +
              "')",
            (err, success) => {
              if (err) {
                console.log(err.message);
              }
              if (success) {
                console.log("Data inserted successfully" + item);
              }
            }
          );
        });
      }
    });
  } catch (error) {
    console.log(error.message);
  }
}

function updateMentorTimestamp(availabilityData, mentorDtlsId) {
  sql.connect(config, (err, conn) => {
    if (err) return res.json({ error: err.message });
    if (conn) {
      const request = new sql.Request();
      availabilityData.forEach((item) => {
        item.days.forEach((day) => {
          console.log(`Day: ${day}`);
          let FromTime = `${item.startHour}:${item.startMinute.substring(
            0,
            2
          )}${item.startPeriod}`;
          let ToTime = `${item.endHour}:${item.endMinute.substring(0, 2)}${
            item.endPeriod
          }`;
          let mentorRecStartDate = `${item.fromDate}`;
          let mentorRecEndDate = `${item.toDate}`;
          let mentorTimeSlotDuration = `${item.duration}`;
          let mentorRecType = "Daily";
          request.query(
            "INSERT INTO mentor_timeslots_dtls (mentor_dtls_id,mentor_timeslot_day,mentor_timeslot_from,mentor_timeslot_to,mentor_timeslot_rec_indicator,mentor_timeslot_rec_end_timeframe,mentor_timeslot_duration,mentor_timeslot_rec_start_timeframe) VALUES('" +
              mentorDtlsId +
              "','" +
              day +
              "','" +
              FromTime +
              "','" +
              ToTime +
              "','" +
              mentorRecType +
              "','" +
              mentorRecEndDate +
              "','" +
              mentorTimeSlotDuration +
              "','" +
              mentorRecStartDate +
              "')",
            (err, success) => {
              if (err) {
                console.log(err.message);
              }
              if (success) {
                console.log("Data inserted successfully");
              }
            }
          );
        });
      });
    }
  });
}
export async function MentorOnboardingFeedbackController(req, res, next) {
  const { feedback, rating, userDtlsId, username } = req.body;
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        return res.json({ error: err.message });
      }
      const request = new sql.Request();
      request.input("UserDtlsID", sql.Int, userDtlsId);
      request.input("FeedbackName", sql.VarChar, username);
      request.input("FeedbackRating", sql.Int, rating || "");
      request.input("FeedbackDescription", sql.Text, feedback);
      request.query(
        "select user_website_feedback_user_dtls_id from users_website_feedback_dtls where user_website_feedback_user_dtls_id = @UserDtlsID ",
        (err, result) => {
          if (err) return res.json({ error: err.message });
          if (result.recordset.length > 0) {
            return res.json({ success: "success" });
          } else {
            request.query(MentorOnboardingFeedbackSqlQuery, (err, result) => {
              if (err) {
                return res.json({ error: err.message });
              }
              if (result) {
                return res.json({ success: "success" });
              }
            });
          }
        }
      );
    });
  } catch (error) {
    return res.json({ error: err.message });
  }
}

// export async function MentorUpdateAdditionalDetails(req, res, next) {
//   const {
//     mentorDomain,
//     jobtitle,
//     experience,
//     companyName,
//     passionateAbout,
//     AreaOfexpertise,
//     areaofmentorship,
//     headline,
//     Timezone,
//     Mon,
//     Tue,
//     Wed,
//     Thu,
//     Fri,
//     Sat,
//     Sun,
//     userDtlsId,
//     mentorDtlsId,
//     mentorEmail,
//     mentorName,
//   } = req.body;
//   const timestamp = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
//   try {
//     sql.connect(config, (err, db) => {
//       if (err) return res.json({ error: "There is some error while applying" });
//       const request = new sql.Request();
//       request.input("Mentor_Domain", sql.VarChar, mentorDomain);
//       request.input("jobtitle", sql.VarChar, jobtitle);
//       request.input("experience", sql.VarChar, experience);
//       request.input("companyName", sql.VarChar, companyName);
//       request.input("passionateAbout", sql.VarChar, passionateAbout);
//       request.input("AreaOfexpertise", sql.VarChar, AreaOfexpertise);
//       request.input("areaofmentorship", sql.VarChar, areaofmentorship || "");
//       request.input("headline", sql.VarChar, headline);
//       request.input("Timezone", sql.VarChar, Timezone);
//       request.input("mentor_dtls_id", sql.Int, mentorDtlsId);
//       request.query(MentorRegistrationStep2SqlQuery, async (err, result) => {
//         if (err)
//           return res.json({
//             error: err.message,
//           });
//         if (result) {
//           // adding area of expertise word in to table
//           if (Mon !== "undefined") {
//             const monDayParsedArray = JSON.parse(Mon);
//             arrayFunctions(monDayParsedArray, mentorDtlsId, "Mon", timestamp);
//           }
//           if (Tue !== "undefined") {
//             const tueDayParsedArray = JSON.parse(Tue);
//             arrayFunctions(tueDayParsedArray, mentorDtlsId, "Tue", timestamp);
//           }
//           if (Wed !== "undefined") {
//             const wedDayParsedArray = JSON.parse(Wed);
//             arrayFunctions(wedDayParsedArray, mentorDtlsId, "Wed", timestamp);
//           }
//           if (Thu !== "undefined") {
//             const thuDayParsedArray = JSON.parse(Thu);
//             arrayFunctions(thuDayParsedArray, mentorDtlsId, "Wed", timestamp);
//           }
//           if (Fri !== "undefined") {
//             const friDayParsedArray = JSON.parse(Fri);
//             arrayFunctions(friDayParsedArray, mentorDtlsId, "Fri", timestamp);
//           }
//           if (Sat !== "undefined") {
//             const satDayParsedArray = JSON.parse(Sat);
//             arrayFunctions(satDayParsedArray, mentorDtlsId, "Sat", timestamp);
//           }
//           if (Sun !== "undefined") {
//             const sunDayParsedArray = JSON.parse(Sun);
//             arrayFunctions(sunDayParsedArray, mentorDtlsId, "Sun", timestamp);
//           }
//           const mentorNotificationHandler = InsertNotificationHandler(
//             userDtlsId,
//             SuccessMsg,
//             AccountCreatedHeading,
//             AccountCreatedMessage
//           );
//           const msg = mentorApplicationEmail(mentorEmail, mentorName);
//           const response = await sendEmail(msg);
//           if (response === "True" || response === "true" || response === true) {
//             return res.json({
//               success: "Thank you for applying the mentor application",
//             });
//           }
//           if (
//             response === "False" ||
//             response === "false" ||
//             response === false
//           ) {
//             return res.json({
//               success: "Thank you for applying the mentor application",
//             });
//           }
//         }
//       });
//     });
//   } catch (error) {}
// }
