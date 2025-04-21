import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";
import { sendEmail } from "../../Middleware/AllFunctions.js";
import moment from "moment";
import { InsertNotificationHandler } from "../../Middleware/NotificationFunction.js";
import { fetchfacultyDetailsDashboardQuery, fetchInstituteSingleDashboardQuery,fetchSinglefacultyDetailsQuery } from "../../SQLQueries/Institute/InstituteDashboardSqlQueries.js";
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
      request.input("institute_Code", sql.Int, instituteCode);
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
