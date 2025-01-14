import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";
import { GetAllMentorCaseStudiesInputQuery } from "../../SQLQueries/AdminDashboard/AdminCaseStudiesSQLQueries.js";

export async function getAllMentorsCaseStudiesListAdminDashboard(
  req,
  res,
  next
) {
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        return res.json({
          error: err.message,
        });
      }
      if (db) {
        const request = new sql.Request();
        request.query(GetAllMentorCaseStudiesInputQuery, (err, result) => {
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
              error: "No case studies found",
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
