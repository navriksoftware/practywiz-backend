import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";
import {
  convertTo24HourFormat,
  scheduleReminderHandler,
  sendEmail,
  uploadMentorPhotoToAzure,
} from "../../Middleware/AllFunctions.js";
import moment from "moment";
import {
  fetch10MentorQuery,
  fetchAllMentorQuery,
  fetchMentorExpertQuery,
  fetchNavbarMentorExpertQuery,
  fetchSingleMentorProfileForPublicQuery,
  fetchSingleMentorQuery,
  fetchSingleMentorQueryWithBookings,
  mentorRegistrationDtlsQuery,
  testQuery,
  userDtlsQuery,
} from "../../SQLQueries/MentorSQLQueries.js";
import { mentorApplicationEmail } from "../../EmailTemplates/MentorEmailTemplate/MentorEmailTemplate.js";
import { ShowTop10MentorsInHomeQuery } from "../../SQLQueries/Mentor/MentorSQLQueries.js";
import { InsertNotificationHandler } from "../../Middleware/NotificationFunction.js";
import {
  AccountCreatedHeading,
  AccountCreatedMessage,
  SuccessMsg,
} from "../../Messages/Messages.js";
import {
  mentorBookingRemainderEmailTemplate,
  traineeBookingRemainderEmailTemplate,
} from "../../EmailTemplates/MentorEmailTemplate/MentorSessionEmailTemplates.js";
import { MentorSessionBookingRemainderSqlQuery } from "../../SQLQueries/MentorDashboard/MentorNotificationSqlQuery.js";
dotenv.config();

// registering of the mentor application
export async function MentorRegistration(req, res, next) {
  const {
    Mentor_Domain,
    firstName,
    lastName,
    email,
    UserType,
    phoneNumber,
    password,
    sociallink,
    jobtitle,
    experience,
    companyName,
    passionateAbout,
    AreaOfexpertise,
    academicQualification,
    areaofmentorship,
    headline,
    lecturesInterest,
    caseInterest,
    freeCharge,
    Timezone,
    Language,
    Country,
    Mon,
    Tue,
    Wed,
    Thu,
    Fri,
    Sat,
    Sun,
    Pricing,
    City,
    Currency,
    Institute,
    linkedinSign,
    linkedinPhotoUrl,
  } = req.body;
  const imageData = req.files;
  const lowEmail = email.toLowerCase();
  const timestamp = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
  if (
    !lowEmail &&
    !password &&
    !firstName &&
    !lastName &&
    !UserType &&
    !phoneNumber
  ) {
    return res.json({
      required: "All details must be required",
    });
  }
  if (linkedinSign !== "linkedin") {
    const blobName = new Date().getTime() + "-" + req.files.image.name;
    var filename = `https://practiwizstorage.blob.core.windows.net/practiwizcontainer/mentorprofilepictures/${blobName}`;
    uploadMentorPhotoToAzure(imageData, blobName);
  } else {
    filename = linkedinPhotoUrl;
  }
  let saltRounds = await bcrypt.genSalt(12);
  let hashedPassword = await bcrypt.hash(password, saltRounds);

  sql.connect(config, async (err) => {
    if (err) {
      return res.json({ error: err.message });
    }
    const request = new sql.Request();
    request.input("email", sql.VarChar, lowEmail);
    // Add input parameters
    request.input("user_email", sql.VarChar, email);
    request.input("user_pwd", sql.VarChar, hashedPassword);
    request.input("user_firstname", sql.VarChar, firstName);
    request.input("user_lastname", sql.VarChar, lastName);
    request.input("user_phone_number", sql.VarChar, phoneNumber);
    request.input("user_status", sql.VarChar, "1");
    request.input("user_type", sql.VarChar, UserType);
    // Execute the query
    request.query(userDtlsQuery, (err, result) => {
      if (err) {
        return res.json({ error: err.message });
      }
      if (result && result.recordset && result.recordset.length > 0) {
        const userDtlsId = result.recordset[0].user_dtls_id;
        // Add input parameters
        request.input("mentor_user_dtls_id", sql.Int, userDtlsId);
        request.input("mentor_phone_number", sql.VarChar, phoneNumber);
        request.input("mentor_email", sql.VarChar, email);
        request.input("mentor_profile_photo", sql.VarChar, filename);
        request.input("mentor_social_media_profile", sql.VarChar, sociallink);
        request.input("mentor_job_title", sql.VarChar, jobtitle);
        request.input("mentor_company_name", sql.VarChar, companyName);
        request.input("mentor_years_of_experience", sql.Int, experience);
        request.input(
          "mentor_academic_qualification",
          sql.VarChar,
          academicQualification
        );
        request.input(
          "mentor_recommended_area_of_mentorship",
          sql.VarChar,
          areaofmentorship
        );
        request.input(
          "mentor_guest_lectures_interest",
          sql.VarChar,
          lecturesInterest
        );
        request.input(
          "mentor_curating_case_studies_interest",
          sql.VarChar,
          caseInterest
        );
        request.input(
          "mentor_sessions_free_of_charge",
          sql.VarChar,
          freeCharge
        );
        request.input("mentor_language", sql.VarChar, Language);
        request.input("mentor_timezone", sql.VarChar, Timezone);
        request.input("mentor_country", sql.VarChar, Country);
        request.input("mentor_dtls_cr_date", sql.DateTime, timestamp);
        request.input("mentor_dtls_update_date", sql.DateTime, timestamp);
        request.input("mentor_headline", sql.VarChar, headline);
        request.input("mentor_session_price", sql.VarChar, Pricing);
        request.input("mentor_currency", sql.VarChar, Currency);
        request.input("City", sql.VarChar, City);
        request.input("Institute", sql.VarChar, Institute);
        request.input("areaOfExpertise", sql.Text, AreaOfexpertise);
        request.input("passionAbout", sql.Text, passionateAbout);
        request.input("mentorDomain", sql.VarChar, Mentor_Domain);
        // Execute the query
        request.query(mentorRegistrationDtlsQuery, async (err, result) => {
          if (err) {
            console.log(
              "There is something went wrong. Please try again later.",
              err
            );
            return res.json({ err: err.message });
          }
          if (result && result.recordset && result.recordset.length > 0) {
            const mentorDtlsId = result.recordset[0].mentor_dtls_id;
            // adding area of expertise word in to table
            if (Mon !== "undefined") {
              const monDayParsedArray = JSON.parse(Mon);
              arrayFunctions(monDayParsedArray, mentorDtlsId, "Mon", timestamp);
            }
            if (Tue !== "undefined") {
              const tueDayParsedArray = JSON.parse(Tue);
              arrayFunctions(tueDayParsedArray, mentorDtlsId, "Tue", timestamp);
            }
            if (Wed !== "undefined") {
              const wedDayParsedArray = JSON.parse(Wed);
              arrayFunctions(wedDayParsedArray, mentorDtlsId, "Wed", timestamp);
            }
            if (Thu !== "undefined") {
              const thuDayParsedArray = JSON.parse(Thu);
              arrayFunctions(thuDayParsedArray, mentorDtlsId, "Wed", timestamp);
            }
            if (Fri !== "undefined") {
              const friDayParsedArray = JSON.parse(Fri);
              arrayFunctions(friDayParsedArray, mentorDtlsId, "Fri", timestamp);
            }
            if (Sat !== "undefined") {
              const satDayParsedArray = JSON.parse(Sat);
              arrayFunctions(satDayParsedArray, mentorDtlsId, "Sat", timestamp);
            }
            if (Sun !== "undefined") {
              const sunDayParsedArray = JSON.parse(Sun);
              arrayFunctions(sunDayParsedArray, mentorDtlsId, "Sun", timestamp);
            }
            const mentorNotificationHandler = InsertNotificationHandler(
              userDtlsId,
              SuccessMsg,
              AccountCreatedHeading,
              AccountCreatedMessage
            );
            const msg = mentorApplicationEmail(
              email,
              firstName + " " + lastName
            );
            const response = await sendEmail(msg);
            if (
              response === "True" ||
              response === "true" ||
              response === true
            ) {
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
          } else {
            console.error("No record inserted or returned.");
            return res.json({ err: "No record inserted or returned." });
          }
        });
      } else {
        console.error("No record inserted or returned.");
        return res.json({ err: "No record inserted or returned." });
      }
    });
  });
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
            "INSERT INTO mentor_timeslots_dtls (mentor_dtls_id,mentor_timeslot_day,mentor_timeslot_from,mentor_timeslot_to,mentor_timeslot_rec_indicator,mentor_timeslot_rec_end_timeframe,mentor_timeslot_rec_cr_date,mentor_timeslot_rec_update_date) VALUES('" +
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

// to fetch single mentor and need to pass the user id in public profile
export async function fetchSingleMentorDetails(req, res) {
  const id = req.params.id;
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
        request.input("desired_mentor_dtls_id", sql.Int, userId);
        request.query(fetchSingleMentorProfileForPublicQuery, (err, result) => {
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
              error: "mentor is not approved yet",
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
// to fetch the all mentors
export async function fetchAllMentorDetails(req, res) {
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        return res.json({
          error: err.message,
        });
      }
      if (db) {
        const request = new sql.Request();
        request.query(fetchAllMentorQuery, (err, result) => {
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
              error: "No mentor has been approved",
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
// getting the mentor details in Homepage
export async function fetch10MentorInHome(req, res, next) {
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        return res.json({
          error: err.message,
        });
      }
      if (db) {
        const request = new sql.Request();
        request.query(ShowTop10MentorsInHomeQuery, (err, result) => {
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
              error: "No mentor has been approved",
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

export async function fetchExpertMentorsInPublic(req, res, next) {
  const { expert } = req.body;
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        return res.json({
          error: err.message,
        });
      }
      if (db) {
        const request = new sql.Request();
        request.input("SearchCategory", sql.NVarChar, expert);
        request.query(fetchNavbarMentorExpertQuery, (err, result) => {
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
              error: "No mentor has been approved",
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
//
export async function test(req, res) {
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        return res.json({
          error: "There was an error while fetching the data.",
        });
      }
      if (db) {
        const request = new sql.Request();
        request.query(testQuery, (err, result) => {
          if (err) {
            return res.json({
              error: "There was an error while fetching the data.",
            });
          }
          if (result) {
            return res.json({
              success: result.recordset,
            });
          }
        });
      }
    });
  } catch (error) {
    return res.json({
      error: "There was an error while fetching the data.",
    });
  }
}

// remainder will be sent on before 10 minutes to mentor
function sentEmailRemainderToMentorAndTrainee(beforeMinutes) {
  try {
    sql.connect(config, (err) => {
      if (err) return console.log(err.message);
      const request = new sql.Request();
      request.query(
        MentorSessionBookingRemainderSqlQuery,
        async (err, result) => {
          if (err) return console.log(err.message);
          result?.recordset.forEach(async (res) => {
            const menteeEmail = res.mentee_email;
            const mentorEmail = res.mentor_email;
            const menteeName = res.mentee_firstname + " " + res.mentee_lastname;
            const mentorName = res.mentor_firstname + " " + res.mentor_lastname;
            const bookingDate = new Date(
              res.mentor_session_booking_date
            ).toDateString();
            const slotTime = res.mentor_booking_time;
            let bookingDbDate = new Date(res.mentor_session_booking_date);
            let time = await convertTo24HourFormat(
              res.mentor_booking_starts_time
            );
            let [hour, min] = time?.split(":").map(Number);
            // Set the correct hours and minutes on the booking date
            bookingDbDate.setUTCHours(hour);
            bookingDbDate.setUTCMinutes(min);
            bookingDbDate.setUTCSeconds(0);
            bookingDbDate.setUTCMilliseconds(0);
            const menteeMessage = traineeBookingRemainderEmailTemplate(
              menteeEmail,
              menteeName,
              mentorName,
              bookingDate,
              slotTime,
              beforeMinutes,
              "https://www.practiwiz.com/mentee/dashboard"
            );
            const mentorMessage = mentorBookingRemainderEmailTemplate(
              mentorEmail,
              mentorName,
              menteeName,
              bookingDate,
              slotTime,
              beforeMinutes,
              "https://www.practiwiz.com/mentor/dashboard"
            );
            scheduleReminderHandler(
              bookingDbDate,
              beforeMinutes,
              mentorMessage,
              menteeMessage
            );
          });
        }
      );
    });
  } catch (error) {
    console.log(error.message);
  }
}

//10 minutes function
sentEmailRemainderToMentorAndTrainee(40);
// 5 minutes function
sentEmailRemainderToMentorAndTrainee(35);
// started function
sentEmailRemainderToMentorAndTrainee(0);
