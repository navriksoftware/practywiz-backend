import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";
import { sendEmail } from "../../Middleware/AllFunctions.js";
import moment from "moment";
import { InsertNotificationHandler } from "../../Middleware/NotificationFunction.js";
import {
  InfoMsg,
  SuccessMsg,
  CaseAssignedByInstituteHeading,
  CaseAssignedByInstituteMessage,
  InstituteCaseAssignedToFacultyHeading,
} from "../../Messages/Messages.js";
import {
  fetchCaseStudiesListForInstituteQuery,
  fetchfacultyDetailsDashboardQuery,
  fetchInstituteSingleDashboardQuery,
  fetchSinglefacultyDetailsQuery,
  assignCaseStudyToFacultyQuery,
} from "../../SQLQueries/Institute/InstituteDashboardSqlQueries.js";
dotenv.config();

export async function fetchInstituteDetailsDashboard(req, res, next) {
  const { instituteUserId } = req.body;
  console.log(instituteUserId);
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        console.log(err.message);
        return res.json({ error: err.message });
      }
      const request = new sql.Request();
      request.input("instituteUserId", sql.Int, instituteUserId);
      request.query(fetchInstituteSingleDashboardQuery, (err, result) => {
        if (err) return res.json({ error: err.message });
        if (result) {
          return res.json({ success: result.recordset });
        }
      });
    });
  } catch (error) {}
}
export async function fetchInstituteFacultyDetailsDashboard(req, res, next) {
  const { instituteCode } = req.body;
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        console.log(err.message);
        return res.json({ error: err.message });
      }
      const request = new sql.Request();
      request.input("institute_Code", sql.VarChar, instituteCode);
      request.query(fetchfacultyDetailsDashboardQuery, (err, result) => {
        if (err) return res.json({ error: err.message });
        if (result) {
          return res.json({ success: result.recordset });
        }
      });
    });
  } catch (error) {}
}
export async function fetchInstituteSingleFacultyDetails(req, res, next) {
  const { facultyid } = req.body;
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        console.log(err.message);
        return res.json({ error: err.message });
      }
      const request = new sql.Request();
      request.input("faculty_id", sql.Int, facultyid);
      request.query(fetchSinglefacultyDetailsQuery, (err, result) => {
        if (err) return res.json({ error: err.message });
        if (result) {
          return res.json({ success: result.recordset });
        }
      });
    });
  } catch (error) {}
}
export async function fetchCaseStudiesListInstitute(req, res, next) {
  const { instituteId } = req.body;
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        console.log(err.message);
        return res.json({ error: err.message });
      }
      const request = new sql.Request();
      request.input("institute_Id", sql.Int, instituteId);
      request.query(fetchCaseStudiesListForInstituteQuery, (err, result) => {
        if (err) return res.json({ error: err.message });
        if (result) {
          return res.json({ success: result.recordset });
        }
      });
    });
  } catch (error) {}
}
//this function use to assign the case study to the faculty by instituite
export async function AssignCaseStudyToFaculty(req, res, next) {
  const { InstituteId, FacultyIds, CaseStudyId } = req.body;

  if (!Array.isArray(FacultyIds) || FacultyIds.length === 0) {
    return res
      .status(400)
      .json({ error: "FacultyIds must be a non-empty array" });
  }

  if (!CaseStudyId) {
    return res.status(400).json({ error: "CaseStudyId is required" });
  }
  try {
    const pool = await sql.connect(config);

    for (const facultyId of FacultyIds) {
      await pool
        .request()
        .input("faculty_Id", sql.Int, facultyId)
        .input("caseStudy_Id", sql.Int, CaseStudyId)
        .input("institute_Id", sql.Int, InstituteId)
        .query(assignCaseStudyToFacultyQuery);

      // Get the faculty user ID from faculty_dtls table
      const userIdQuery = await pool.request().query(`
        SELECT f.faculty_user_dtls_id, ct.case_study_title
        FROM faculty_dtls f
        JOIN case_study_details ct ON ct.case_study_id = ${CaseStudyId}
        WHERE f.faculty_dtls_id = ${facultyId}
      `);

      if (userIdQuery.recordset && userIdQuery.recordset.length > 0) {
        const userId = userIdQuery.recordset[0].faculty_user_dtls_id;
        const caseStudyTitle =
          userIdQuery.recordset[0]?.case_study_title ||
          "the assigned case study";
        const customMessage = `You have been assigned a new case study "${caseStudyTitle}" by the institute admin. Please check your dashboard for details.`;

        // Add notification for case study assigned by institute admin using user ID
        await InsertNotificationHandler(
          userId,
          InfoMsg,
          CaseAssignedByInstituteHeading,
          customMessage
        );
      }

      // Get faculty name and case study title for institute notification
      const facultyInfoQuery = await pool.request().query(`
        SELECT u.user_firstname, u.user_lastname, c.case_study_title
        FROM faculty_dtls f
        JOIN users_dtls u ON u.user_dtls_id = f.faculty_user_dtls_id
        JOIN case_study_details c ON c.case_study_id = ${CaseStudyId}
        WHERE f.faculty_dtls_id = ${facultyId}
      `);

      // Get the institute user ID from the institute_dtls table
      const instituteUserIdQuery = await pool.request().query(`
        SELECT institute_user_dtls_id
        FROM institute_dtls
        WHERE institute_dtls_id = ${InstituteId}
      `);

      if (
        instituteUserIdQuery.recordset &&
        instituteUserIdQuery.recordset.length > 0 &&
        facultyInfoQuery.recordset &&
        facultyInfoQuery.recordset.length > 0
      ) {
        const instituteUserId =
          instituteUserIdQuery.recordset[0].institute_user_dtls_id;
        const facultyFirstName =
          facultyInfoQuery.recordset[0].user_firstname || "";
        const facultyLastName =
          facultyInfoQuery.recordset[0].user_lastname || "";
        const facultyFullName = `${facultyFirstName} ${facultyLastName}`.trim();
        const caseStudyTitle =
          facultyInfoQuery.recordset[0].case_study_title ||
          "Unnamed case study";

        // Custom message for institute notification
        const instituteCustomMessage = `A new case study "${caseStudyTitle}" has been assigned to faculty member ${facultyFullName}`;

        // Add notification for institute admin
        await InsertNotificationHandler(
          instituteUserId,
          InfoMsg,
          InstituteCaseAssignedToFacultyHeading,
          instituteCustomMessage
        );
      }
      // Optionally, you can also send an email or any other notification here
      // Example: sendEmailNotification(facultyId, CaseStudyId);
    }

    return res.json({
      success: true,
      message: "Case study assigned to all faculty members.",
    });
  } catch (error) {
    console.error("Error assigning case study:", error);
    return res.status(500).json({ error: error.message });
  }
}
