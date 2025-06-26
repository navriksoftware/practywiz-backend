import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";
import {
  sendEmail,
  uploadMenteeResumeToAzure,
  calculateMentorScore,
} from "../../Middleware/AllFunctions.js";
import moment from "moment";

import {
  fetchMenteeSingleDashboardQuery,
  GetCaseDetailsByMenteeIdSqlQuery,
  GetMenteeAppliedInternshipsSqlQuery,
  IsFeedbackSubmittedQuery,
  MarkMenteeAllMessagesAsReadQuery,
  MarkMenteeSingleMessageAsReadQuery,
  MenteeApprovedBookingQuery,
  MenteeCompletedBookingQuery,
  MenteeFeedbackSubmitHandlerQuery,
  GetMenteeResultSubmissionStatusSqlQuery,
} from "../../SQLQueries/Mentee/MenteeDashboardSQlQueries.js";
import { format } from "path";
dotenv.config();

// Helper function to safely parse JSON strings
const safeJSONParse = (jsonString, defaultValue = "[]") => {
  try {
    if (!jsonString || jsonString === "undefined" || jsonString === "null") {
      return JSON.parse(defaultValue);
    }
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn(
      `Failed to parse JSON: ${jsonString}, using default value: ${defaultValue}`
    );
    return JSON.parse(defaultValue);
  }
};

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
          console.log("by");
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

export async function MenteefetchAppliedInternships(req, res) {
  const { menteeId } = req.body;
  if (!menteeId) {
    return res
      .status(400)
      .json({ success: false, message: "Mentee ID is required" });
  }
  try {
    sql.connect(config, (err, db) => {
      if (err) return res.json({ error: "There is some error while fetching" });
      const request = new sql.Request();
      request.input("mentee_user_dtls_id", sql.Int, menteeId);
      request.query(
        GetMenteeAppliedInternshipsSqlQuery,

        (err, result) => {
          if (err) return res.json({ error: err.message });
          if (result && result.recordset && result.recordset.length > 0) {
            return res.json({ success: result.recordset });
          } else {
            return res.json({ error: "No record found" });
          }
        }
      );
    });
  } catch (error) {
    return res.json({ error: "There is some error while fetching" });
  }
}

export async function ResumeUpload(req, res) {
  let dbConn = null;

  try {
    // Validate required request parameters
    const { name, id } = req.body;

    if (!name || !id) {
      return res
        .status(400)
        .json({ error: "Missing required parameters: name and id" });
    }

    // Validate file upload
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "No resume file was uploaded" });
    }

    const file = req.files.file;

    // Optional: Validate file type if needed
    // if (file.mimetype !== "application/pdf") {
    //   return res.status(400).json({ error: "Only PDF files are accepted" });
    // }

    // Generate blob name and URL
    const blobName = `${id}-${name}`;
    const mentee_resume_url = `https://practiwizstorage.blob.core.windows.net/practiwizcontainer/menteeresume/${blobName}`;

    try {
      // Upload file to Azure
      await uploadMenteeResumeToAzure(file.data, blobName);
    } catch (uploadError) {
      console.error("Azure upload failed:", uploadError);
      return res
        .status(500)
        .json({ error: "Failed to upload resume to storage" });
    }

    // Connect to database
    try {
      dbConn = await sql.connect(config);
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
      return res.status(500).json({ error: "Failed to connect to database" });
    }

    // Update database record
    try {
      const request = new sql.Request(dbConn);
      request.input("mentee_resume_url", sql.VarChar, mentee_resume_url);
      request.input("mentee_user_dtls_id", sql.Int, parseInt(id, 10));

      const result = await request.query(
        `UPDATE [dbo].[mentee_dtls] 
         SET [mentee_resume_url] = @mentee_resume_url
         WHERE mentee_user_dtls_id = @mentee_user_dtls_id`
      );

      // Check if any rows were affected
      if (result.rowsAffected[0] === 0) {
        return res
          .status(404)
          .json({ error: "No mentee record found with the provided ID" });
      }

      return res.status(200).json({
        message: "Resume uploaded successfully",
        url: mentee_resume_url,
      });
    } catch (queryError) {
      console.error("Database query failed:", queryError);
      return res
        .status(500)
        .json({ error: "Failed to update database record" });
    }
  } catch (error) {
    console.error("ResumeUpload error:", error);
    return res.status(500).json({
      error: "An unexpected error occurred while processing your request",
    });
  } finally {
    // Close database connection if it was opened
    if (dbConn) {
      try {
        await dbConn.close();
      } catch (closeError) {
        console.error("Error closing database connection:", closeError);
      }
    }
  }
}

export async function ResumeDownload(req, res) {
  let dbConn = null;
  const { user_id } = req.query;
  // GET RESUME FROM DB
  try {
    dbConn = await sql.connect(config);
  } catch (dbError) {
    console.error("Database connection failed:", dbError);
    return res.status(500).json({ error: "Failed to connect to database" });
  }

  try {
    const request = new sql.Request(dbConn);
    request.input("mentee_user_dtls_id", sql.Int, user_id);
    const result = await request.query(
      `select mentee_resume_url from [dbo].[mentee_dtls] 
         WHERE mentee_user_dtls_id = @mentee_user_dtls_id`
    );
    return res.status(200).json({
      message: "Got Resume URL Successfully",
      url: `${result.recordset[0].mentee_resume_url}`,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Internal server error" });
  }
}
export async function MenteefetchCaseStudiesDetails(req, res) {
  const { menteeId } = req.body;
  if (!menteeId) {
    return res
      .status(400)
      .json({ success: false, message: "Mentee ID is required" });
  }
  try {
    sql.connect(config, (err, db) => {
      if (err) return res.json({ error: "There is some error while fetching" });
      const request = new sql.Request();
      request.input("menteeId", sql.Int, menteeId);
      request.query(
        GetCaseDetailsByMenteeIdSqlQuery,

        (err, result) => {
          if (err) return res.json({ error: err.message });
          if (result && result.recordset && result.recordset.length > 0) {
            return res.json({ success: result.recordset });
          } else {
            return res.json({ error: "No record found" });
          }
        }
      );
    });
  } catch (error) {
    return res.json({ error: "There is some error while fetching" });
  }
}

// Add this function to the existing MenteeDashboardControllers.js file

export async function GetMenteeResultSubmissionStatus(req, res) {
  const { menteeId, facultyCaseAssignId } = req.body;

  if (!menteeId || !facultyCaseAssignId) {
    return res.status(400).json({
      success: false,
      message: "Mentee ID and Faculty Case Assign ID are required",
    });
  }
  // Get the current time in India Standard Time (IST)
  // let currentTime = new Date(
  //   new Date().toLocaleString("en-US", {
  //     timeZone: "Asia/Kolkata",
  //   })
  // );
  // currentTime = currentTime.toString();
  // console.log("Current server time:", currentTime);
  let currentTime = new Date(new Date().getTime() + 19800000); // 5.5 hours in milliseconds

  try {
    sql.connect(config, (err, db) => {
      if (err)
        return res.json({
          error: "There is some error while fetching submission status",
        });

      const request = new sql.Request();
      request.input("menteeId", sql.Int, menteeId);
      request.input("facultyCaseAssignId", sql.Int, facultyCaseAssignId);

      request.query(GetMenteeResultSubmissionStatusSqlQuery, (err, result) => {
        if (err) return res.json({ error: err.message });

        if (result && result.recordset && result.recordset.length > 0) {
          const submissionData = result.recordset[0];

          // Check if each question type has been submitted
          const submissionStatus = {
            factBasedQuestions:
              submissionData.mentee_result_fact_details !== null,
            analysisBasedQuestions:
              submissionData.mentee_result_analysis_details !== null,
            researchBasedQuestions:
              submissionData.mentee_result_research_details !== null,
          };

          return res.json({ success: true, submissionStatus, currentTime });
        } else {
          // No submission found, all are false

          return res.json({
            success: true,
            submissionStatus: {
              factBasedQuestions: false,
              analysisBasedQuestions: false,
              researchBasedQuestions: false,
            },
            currentTime: currentTime,
          });
        }
      });
    });
  } catch (error) {
    return res.json({
      error: "There is some error while fetching submission status",
    });
  }
}

export const GetRecommendedMentors = async (req, res) => {
  const { menteeId } = req.params;
  console.log("Mentee ID:", menteeId);

  if (!menteeId)
    return res.status(400).json({ error: "Mentee ID is required" });

  try {
    const pool = await sql.connect();
    console.log("Connected to the database debug");
    // Fetch mentee
    const menteeResult = await pool
      .request()
      .input("menteeId", sql.Int, menteeId)
      .query(`SELECT * FROM mentee_dtls WHERE mentee_dtls_id = @menteeId`);

    if (menteeResult.recordset.length === 0) {
      return res.status(404).json({ error: "Mentee not found" });
    }
    const mentee = menteeResult.recordset[0];

    // Parse JSON fields
    mentee.mentee_skills = safeJSONParse(mentee.mentee_skills);
    mentee.mentee_language = safeJSONParse(mentee.mentee_language);
    mentee.mentee_institute_details = safeJSONParse(
      mentee.mentee_institute_details
    ); // Fetch mentors with user details
    const mentorResult = await pool.request().query(`
        SELECT m.*, 
               CONCAT(u.user_firstname, ' ', u.user_lastname) AS mentor_name
        FROM mentor_dtls m
        INNER JOIN users_dtls u ON m.mentor_user_dtls_id = u.user_dtls_id
        WHERE m.mentor_approved_status = 'Yes'
      `);

    const mentors = mentorResult.recordset.map((mentor) => ({
      ...mentor,
      mentor_language: safeJSONParse(mentor.mentor_language),
      mentor_institute: safeJSONParse(mentor.mentor_institute),
      mentor_area_expertise: safeJSONParse(mentor.mentor_area_expertise),
      mentor_timeslots_json: safeJSONParse(mentor.mentor_timeslots_json),
      mentor_domain: safeJSONParse(mentor.mentor_domain),
    }));

    // Score and sort
    const scoredMentors = mentors
      .map((mentor) => ({
        mentor,
        score: calculateMentorScore(mentee, mentor),
      }))
      .sort((a, b) => b.score - a.score);
    const topMentors = scoredMentors.slice(0, 10).map((m) => ({
      mentor_id: m.mentor.mentor_dtls_id,
      mentor_name: m.mentor.mentor_name,
      mentor_company: m.mentor.mentor_company_name,
      matched_score: m.score,
      matched_skills: m.mentor.mentor_area_expertise,
      matched_languages: m.mentor.mentor_language,
      linkedin: m.mentor.mentor_social_media_profile,
      profile_photo: m.mentor.mentor_profile_photo,
      mentor_domain: m.mentor.mentor_domain,
      mentor_titile: m.mentor.mentor_job_title,
    }));

    return res.json({ menteeId, recommendedMentors: topMentors });
  } catch (err) {
    console.error("Recommendation Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const GetRecommendedInternships = async (req, res) => {
  const countMatchedElements = (arr1, arr2) => {
    const set2 = new Set(arr2);
    return arr1.filter((item) => set2.has(item)).length;
  };

  const { menteeId } = req.params;
  console.log("Mentee ID:", menteeId);

  if (!menteeId) {
    return res.status(400).json({ error: "Mentee ID is required" });
  }

  try {
    const pool = await sql.connect();

    // Fetch mentee details
    const menteeResult = await pool
      .request()
      .input("menteeId", sql.Int, menteeId)
      .query("SELECT * FROM mentee_dtls WHERE mentee_dtls_id = @menteeId");

    if (menteeResult.recordset.length === 0) {
      return res.status(404).json({ error: "Mentee not found" });
    }

    const mentee = menteeResult.recordset[0];
    mentee.mentee_skills = safeJSONParse(mentee.mentee_skills);
    console.log("mentee skills", mentee.mentee_skills);

    // Fetch open internships
    const internshipResult = await pool.request().query(`
        SELECT * FROM employer_internship_posts_dtls
        WHERE employer_internship_post_status = 'open'
      `);

    // Transform and filter internships based on skill matches
    const matchedInternships = internshipResult.recordset
      .map((internship) => {
        const internshipSkills =
          safeJSONParse(internship.employer_internship_post_skills) || [];
        const skillsCount = countMatchedElements(
          internshipSkills,
          mentee.mentee_skills
        );

        return {
          internship_id: internship.employer_internship_post_dtls_id,
          internship_title: internship.employer_internship_post_domain,
          internship_location: internship.employer_internship_post_location,
          internship_amount: internship.employer_internship_post_stipend_amount,
          internship_duration: internship.employer_internship_post_cr_date,
          internship_domain: internship.employer_internship_post_domain,
          internship_skills: internshipSkills,
          skillsCount,
        };
      })
      .filter((internship) => internship.skillsCount > 0)
      .sort((a, b) => b.skillsCount - a.skillsCount)
      .map(({ skillsCount, ...internship }) => internship);

    console.log("internships", matchedInternships);
    return res.json({ msg: matchedInternships });
  } catch (err) {
    console.error("Recommendation Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
