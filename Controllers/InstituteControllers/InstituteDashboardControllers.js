import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";
import { sendEmail } from "../../Middleware/AllFunctions.js";
import moment from "moment";
import { InsertNotificationHandler } from "../../Middleware/NotificationFunction.js";
import { fetchCaseStudiesListForInstituteQuery, fetchfacultyDetailsDashboardQuery, fetchInstituteSingleDashboardQuery,fetchSinglefacultyDetailsQuery,assignCaseStudyToFacultyQuery } from "../../SQLQueries/Institute/InstituteDashboardSqlQueries.js";
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
  const {InstituteId,FacultyIds, CaseStudyId } = req.body;

  if (!Array.isArray(FacultyIds) || FacultyIds.length === 0) {
    return res.status(400).json({ error: 'FacultyIds must be a non-empty array' });
  }

  if (!CaseStudyId) {
    return res.status(400).json({ error: 'CaseStudyId is required' });
  }

  try {
    const pool = await sql.connect(config);

    for (const facultyId of FacultyIds) {
      await pool
        .request()
        .input('faculty_Id', sql.Int, facultyId)
        .input('caseStudy_Id', sql.Int, CaseStudyId)
        .input('institute_Id', sql.Int, InstituteId)
        .query(assignCaseStudyToFacultyQuery);
        // Replace with your INSERT/UPDATE/EXEC query
    }

    return res.json({ success: true, message: 'Case study assigned to all faculty members.' });
  } catch (error) {
    console.error('Error assigning case study:', error);
    return res.status(500).json({ error: error.message });
  }
}
