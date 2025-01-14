import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";
import { sendEmail } from "../../Middleware/AllFunctions.js";
import moment from "moment";
import { InsertNotificationHandler } from "../../Middleware/NotificationFunction.js";
import { fetchInstituteSingleDashboardQuery } from "../../SQLQueries/Institute/InstituteDashboardSqlQueries.js";
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
