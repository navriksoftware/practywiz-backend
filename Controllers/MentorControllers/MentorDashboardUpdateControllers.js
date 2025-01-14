import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";
import moment from "moment";
import { InsertNotificationHandler } from "../../Middleware/NotificationFunction.js";
import {
  InfoMsg,
  MentorProfileChangedMessage,
  MentorProfileHeading,
  SuccessMsg,
} from "../../Messages/Messages.js";
import {
  sendEmail,
  uploadMentorPhotoToAzure,
} from "../../Middleware/AllFunctions.js";
import {
  mentorProfilePicDashboardUpdateQuery,
  mentorProfilePictureDashboardUpdateQuery,
} from "../../SQLQueries/MentorDashboard/MentorDashboardUpdateSqlQueries.js";
dotenv.config();
// updation done
export async function MentorUpdateMentorProfile1(req, res) {
  const {
    social_media_profile,
    mentor_country,
    mentor_city,
    mentor_institute,
    mentor_academic_qualification,
  } = req.body.formData;
  console.log(req.body.formData);
  const { mentorUserDtlsId } = req.body;
  try {
    sql.connect(config, (err) => {
      if (err)
        return res.json({
          error: "There is some error while updating the Mentor profile",
        });
      const request = new sql.Request();
      request.input("mentorUserDtlsId", sql.Int, mentorUserDtlsId);
      request.query(
        "select mentor_user_dtls_id from mentor_dtls where mentor_user_dtls_id = @mentorUserDtlsId",
        (err, result) => {
          if (err) return res.json({ error: err.message });
          if (result.recordset.length > 0) {
            request.input("mentorCity", sql.VarChar, mentor_city);
            request.input("mentorCountry", sql.VarChar, mentor_country);
            request.input(
              "mentorLinkedinURL",
              sql.VarChar,
              social_media_profile
            );
            request.input(
              "mentorQualification",
              sql.VarChar,
              mentor_academic_qualification
            );
            request.input("mentorInstitute", sql.VarChar, mentor_institute);
            request.query(
              "update mentor_dtls set mentor_social_media_profile = @mentorLinkedinURL, mentor_country = @mentorCountry,mentor_academic_qualification = @mentorQualification,  mentor_city = @mentorCity, mentor_institute = @mentorInstitute where mentor_user_dtls_id = @mentorUserDtlsId",
              async (err, result) => {
                if (err) return res.json({ error: err.message });
                if (result) {
                  const notificationHandler = await InsertNotificationHandler(
                    mentorUserDtlsId,
                    InfoMsg,
                    MentorProfileHeading,
                    MentorProfileChangedMessage
                  );
                  return res.json({
                    success: "Successfully updated the profile details",
                  });
                }
              }
            );
          }
        }
      );
    });
  } catch (error) {
    return res.json({
      error: "There is some error while updating the Mentor profile",
    });
  }
}
//wip
export async function MentorUpdateMentorProfile2(req, res) {
  const {
    mentor_job_title,
    mentor_years_of_experience,
    mentor_company_name,
    mentor_recommended_area_of_mentorship,
    mentor_headline,
  } = req.body.formData;

  const { mentorUserDtlsId, expertiseList, mentor_domain } = req.body;
  try {
    sql.connect(config, (err) => {
      if (err)
        return res.json({
          error: "There is some error while updating the Mentor profile",
        });
      const request = new sql.Request();
      request.input("mentorUserDtlsId", sql.Int, mentorUserDtlsId);
      request.query(
        "select mentor_user_dtls_id from mentor_dtls where mentor_user_dtls_id = @mentorUserDtlsId",
        (err, result) => {
          if (err) return res.json({ error: err.message });
          if (result.recordset.length > 0) {
            request.input("companyName", sql.VarChar, mentor_company_name);
            request.input("mentorDomain", sql.Text, mentor_domain);
            request.input("headline", sql.VarChar, mentor_headline);
            request.input("jobTitle", sql.VarChar, mentor_job_title);

            request.input("mentorExpertise", sql.Text, expertiseList || "");
            request.input(
              "mentorship",
              sql.VarChar,
              mentor_recommended_area_of_mentorship || " "
            );

            request.input(
              "experience",
              sql.VarChar,
              mentor_years_of_experience
            );
            request.query(
              "update mentor_dtls set mentor_company_name = @companyName, mentor_domain = @mentorDomain,mentor_headline = @headline, mentor_job_title = @jobTitle, mentor_years_of_experience = @experience,  mentor_recommended_area_of_mentorship = @mentorship,mentor_area_expertise = @mentorExpertise  where mentor_user_dtls_id = @mentorUserDtlsId",
              async (err, result) => {
                if (err) return res.json({ error: err.message });
                if (result) {
                  const notificationHandler = await InsertNotificationHandler(
                    mentorUserDtlsId,
                    InfoMsg,
                    MentorProfileHeading,
                    MentorProfileChangedMessage
                  );
                  return res.json({
                    success: "Successfully updated the time slots",
                  });
                }
              }
            );
          }
        }
      );
    });
  } catch (error) {
    return res.json({
      error: "There is some error while updating the Mentor profile",
    });
  }
}

// updates are done
export async function MentorUpdateMentorProfile3(req, res) {
  const { dataGroup, userDtlsId } = req.body;

  const timestamp = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
  try {
    sql.connect(config, (err) => {
      if (err)
        return res.json({
          error: "There is some error while updating the Mentor profile",
        });
      const request = new sql.Request();
      request.input("userDtlsId", sql.Int, userDtlsId);
      request.query(
        "select mentor_dtls_id from mentor_dtls where mentor_user_dtls_id = @userDtlsId",
        async (err, result) => {
          if (err) return res.json({ error: err.message });
          if (result.recordset.length > 0) {
            const mentorDtlsId = result.recordset[0].mentor_dtls_id;
            request.input("timeslotMentorDtlsId", sql.Int, mentorDtlsId);
            request.query(
              "update mentor_timeslots_dtls set mentor_timeslot_status = 'archieve' where mentor_dtls_id = @timeslotMentorDtlsId",
              async (err, result) => {
                const availabilityData = JSON.parse(dataGroup);
                updateMentorTimestamp(availabilityData, mentorDtlsId);
                request.input("mentorDtlsId2", sql.Int, mentorDtlsId);
                request.input("timeslotsJson", sql.Text, dataGroup);
                request.query(
                  "update mentor_dtls set mentor_timeslots_json = @timeslotsJson where mentor_dtls_id = @mentorDtlsId2",
                  async (err, result) => {
                    if (result) {
                      const notificationHandler =
                        await InsertNotificationHandler(
                          userDtlsId,
                          InfoMsg,
                          MentorProfileHeading,
                          MentorProfileChangedMessage
                        );
                      return res.json({
                        success: "Successfully updated the time slots",
                      });
                    }
                  }
                );
              }
            );
          } else {
            return res.json({
              error:
                "Please update personal details before updating the time slots",
            });
          }
        }
      );
    });
  } catch (error) {
    return res.json({
      error: "There is some error while updating the Mentor profile",
    });
  }
}

function updateMentorTimestamp(availabilityData, mentorDtlsId) {
  sql.connect(config, (err, conn) => {
    if (err) return res.json({ error: err.message });
    if (conn) {
      availabilityData.forEach((item) => {
        item.days.forEach(async (day) => {
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
          console.log(mentorTimeSlotDuration);
          try {
            // Create a new SQL request for checking
            const checkRequest = new sql.Request();
            const checkQuery = `
              SELECT COUNT(*) AS count 
              FROM mentor_timeslots_dtls 
              WHERE mentor_dtls_id = @mentorDtlsId 
                AND mentor_timeslot_day = @day 
                AND mentor_timeslot_from = @FromTime 
                AND mentor_timeslot_to = @ToTime`;

            const checkResult = await checkRequest
              .input("mentorDtlsId", sql.Int, mentorDtlsId)
              .input("day", sql.VarChar, day)
              .input("FromTime", sql.VarChar, FromTime)
              .input("ToTime", sql.VarChar, ToTime)
              .query(checkQuery);

            if (checkResult.recordset[0].count > 0) {
              console.log("Record already exists.");
              const updateRequest = new sql.Request();
              const updateQuery = `
            UPDATE mentor_timeslots_dtls
            SET mentor_timeslot_status = 'unarchieve'
            WHERE mentor_dtls_id = @mentorDtlsId AND mentor_timeslot_day = @day
            AND mentor_timeslot_from = @FromTime AND mentor_timeslot_to = @ToTime
            AND mentor_timeslot_rec_indicator = @recurrenceType`;

              const updateResult = await updateRequest
                .input("mentorDtlsId", sql.Int, mentorDtlsId)
                .input("day", sql.VarChar, day)
                .input("FromTime", sql.VarChar, FromTime)
                .input("ToTime", sql.VarChar, ToTime)
                .input("recurrenceType", sql.VarChar, mentorRecType)
                .query(updateQuery);
              if (updateResult.rowsAffected[0] > 0) {
                console.log("Timeslot unarchived successfully.");
              } else {
                console.log("No matching record found to unarchive.");
              }
            } else {
              // Create a new SQL request for inserting
              const insertRequest = new sql.Request();
              const insertQuery = `
                INSERT INTO mentor_timeslots_dtls 
                (mentor_dtls_id, mentor_timeslot_day, mentor_timeslot_from, mentor_timeslot_to, 
                mentor_timeslot_rec_indicator, mentor_timeslot_rec_end_timeframe, mentor_timeslot_duration, mentor_timeslot_rec_start_timeframe) 
                VALUES (@mentorDtlsId, @day, @FromTime, @ToTime, @mentorRecType, @mentorRecEndDate, @mentorTimeSlotDuration, @mentorRecStartDate)`;

              await insertRequest
                .input("mentorDtlsId", sql.Int, mentorDtlsId)
                .input("day", sql.VarChar, day)
                .input("FromTime", sql.VarChar, FromTime)
                .input("ToTime", sql.VarChar, ToTime)
                .input("mentorRecType", sql.VarChar, mentorRecType)
                .input("mentorRecEndDate", sql.VarChar, mentorRecEndDate)
                .input(
                  "mentorTimeSlotDuration",
                  sql.Int,
                  mentorTimeSlotDuration
                )
                .input("mentorRecStartDate", sql.VarChar, mentorRecStartDate)
                .query(insertQuery);

              console.log("Data inserted successfully:", item);
            }
          } catch (error) {
            console.error("Error processing query:", error.message);
          }
        });
      });
    }
  });
}

export async function MentorUpdateMentorProfile4(req, res) {
  const {
    mentor_sessions_free_of_charge,
    mentor_guest_lectures_interest,
    mentor_curating_case_studies_interest,

    mentor_language,
    mentor_currency_type,
    mentor_session_price,
  } = req.body.formData;
  console.log(req.body.formData);
  const { mentorUserDtlsId } = req.body;
  try {
    sql.connect(config, (err, db) => {
      if (err)
        return res.json({
          error: "There is some error while updating the profile details",
        });
      const request = new sql.Request();
      request.input("mentorUserDtlsId", sql.Int, mentorUserDtlsId);
      request.query(
        "select mentor_user_dtls_id from mentor_dtls where mentor_user_dtls_id = @mentorUserDtlsId",
        async (err, result) => {
          if (result.recordset.length > 0) {
            request.input(
              "caseStudies",
              sql.VarChar,
              mentor_curating_case_studies_interest
            );
            request.input(
              "guestLecture",
              sql.VarChar,
              mentor_guest_lectures_interest
            );
            request.input(
              "language",
              sql.Text,
              JSON.stringify(mentor_language)
            );
            request.input(
              "freeOfCharge",
              sql.VarChar,
              mentor_sessions_free_of_charge
            );
            request.input(
              "mentorCurrencyType",
              sql.VarChar,
              mentor_currency_type
            );
            request.input(
              "mentorSessionPrice",
              sql.VarChar,
              mentor_session_price
            );
            request.query(
              "update mentor_dtls set mentor_curating_case_studies_interest = @caseStudies , mentor_guest_lectures_interest = @guestLecture, mentor_language = @language,mentor_sessions_free_of_charge = @freeOfCharge,mentor_currency_type = @mentorCurrencyType,mentor_session_price = @mentorSessionPrice where mentor_user_dtls_id = @mentorUserDtlsId",
              async (err, result) => {
                if (err) return res.json({ error: err.message });
                if (result) {
                  const notificationHandler = await InsertNotificationHandler(
                    userDtlsId,
                    InfoMsg,
                    MentorProfileHeading,
                    MentorProfileChangedMessage
                  );
                  return res.json({
                    success: "Successfully updated the profile details",
                  });
                }
              }
            );
          }
        }
      );
    });
  } catch (error) {
    return res.json({ error: error.message });
  }

  const { userDtlsId } = req.body;
  try {
    sql.connect(config, (err) => {
      if (err)
        return res.json({
          error: "There is some error while updating the Mentor profile",
        });
      const request = new sql.Request();
      request.input("userDtlsId", sql.Int, userDtlsId);
      request.query(
        "select user_dtls_id from users_dtls where user_dtls_id = @userDtlsId",
        (err, result) => {
          if (err) return res.json({ error: err.message });
          if (result.recordset.length > 0) {
            request.input("mentorUserDtlsId", sql.Int, userDtlsId);
            request.input(
              "caseStudies",
              sql.VarChar,
              mentor_curating_case_studies_interest
            );
            request.input(
              "guestLecture",
              sql.VarChar,
              mentor_guest_lectures_interest
            );
            request.input("language", sql.VarChar, mentor_language);
            request.input(
              "freeOfCharge",
              sql.VarChar,
              mentor_sessions_free_of_charge
            );
            request.input("timezone", sql.VarChar, mentor_timezone);
            request.query(
              "update mentor_dtls set mentor_curating_case_studies_interest = @caseStudies , mentor_guest_lectures_interest = @guestLecture, mentor_language = @language,mentor_sessions_free_of_charge = @freeOfCharge,mentor_timezone = @timezone where mentor_user_dtls_id = @mentorUserDtlsId",
              async (err, result) => {
                if (err) return res.json({ error: err.message });
                if (result) {
                  const notificationHandler = await InsertNotificationHandler(
                    userDtlsId,
                    InfoMsg,
                    MentorProfileHeading,
                    MentorProfileChangedMessage
                  );
                  return res.json({
                    success: "Successfully updated the profile details",
                  });
                }
              }
            );
          }
        }
      );
    });
  } catch (error) {
    return res.json({
      error: "There is some error while updating the Mentor profile",
    });
  }
}
export async function UpdateMentorProfilePicture(req, res) {
  const {
    mentorUserDtlsId,
    mentorEmail,
    mentorPhoneNumber,
    Mentor_Domain,
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
    Pricing,
    City,
    Currency,
    Institute,
  } = req.body;
  try {
    if (!req.files.image) {
      return res.json({ error: "Please select a file to upload" });
    }
    const blobName = new Date().getTime() + "-" + req.files.image.name;
    var fileName = `https://practiwizstorage.blob.core.windows.net/practiwizcontainer/mentorprofilepictures/${blobName}`;
    uploadMentorPhotoToAzure(req.files, blobName);
    sql.connect(config, (err, db) => {
      if (err)
        return res.json({
          error: "There is some error while updating the profile details",
        });
      const request = new sql.Request();
      request.input("mentorUserDtlsId", sql.Int, mentorUserDtlsId);
      request.query(
        "select mentor_user_dtls_id from mentor_dtls where mentor_user_dtls_id = @mentorUserDtlsId",
        async (err, result) => {
          if (result.recordset.length > 0) {
            request.input("mentorProfileUrl", sql.VarChar, fileName);
            request.query(
              "update mentor_dtls set mentor_profile_photo = @mentorProfileUrl where mentor_user_dtls_id = @mentorUserDtlsId",
              async (err, result) => {
                if (err) return res.json({ error: err.message });
                if (result) {
                  const notification = await InsertNotificationHandler(
                    mentorUserDtlsId,
                    SuccessMsg,
                    MentorProfileHeading,
                    MentorProfileChangedMessage
                  );
                  return res.json({
                    success: "Successfully updated the profile",
                  });
                }
              }
            );
          } else {
            request.input("mentor_user_dtls_id", sql.Int, mentorUserDtlsId);
            request.input(
              "mentor_phone_number",
              sql.VarChar,
              mentorPhoneNumber
            );
            request.input("mentor_email", sql.VarChar, mentorEmail);
            request.input("mentor_profile_photo", sql.VarChar, fileName);
            request.input(
              "mentor_social_media_profile",
              sql.VarChar,
              sociallink || ""
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
              academicQualification || ""
            );
            request.input(
              "mentor_recommended_area_of_mentorship",
              sql.VarChar,
              areaofmentorship || ""
            );
            request.input(
              "mentor_guest_lectures_interest",
              sql.VarChar,
              lecturesInterest || ""
            );
            request.input(
              "mentor_curating_case_studies_interest",
              sql.VarChar,
              caseInterest || ""
            );
            request.input(
              "mentor_sessions_free_of_charge",
              sql.VarChar,
              freeCharge || ""
            );
            request.input("mentor_language", sql.VarChar, Language || "");
            request.input("mentor_timezone", sql.VarChar, Timezone || "");
            request.input("mentor_country", sql.VarChar, Country || "");
            request.input("mentor_headline", sql.VarChar, headline || "");
            request.input("mentor_session_price", sql.VarChar, Pricing || "");
            request.input("mentor_currency", sql.VarChar, Currency || "");
            request.input("City", sql.VarChar, City || "");
            request.input("Institute", sql.VarChar, Institute || "");
            request.input("areaOfExpertise", sql.Text, AreaOfexpertise || "[]");
            request.input("passionAbout", sql.Text, passionateAbout || "[]");
            request.input("mentorDomain", sql.VarChar, Mentor_Domain || "");
            request.query(
              mentorProfilePicDashboardUpdateQuery,
              async (err, result) => {
                if (err) return res.json({ error: err.message });
                if (result) {
                  const notification = await InsertNotificationHandler(
                    mentorUserDtlsId,
                    SuccessMsg,
                    MentorProfileHeading,
                    MentorProfileChangedMessage
                  );
                  return res.json({
                    success: "Successfully updated the profile",
                  });
                }
              }
            );
          }
        }
      );
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
}
