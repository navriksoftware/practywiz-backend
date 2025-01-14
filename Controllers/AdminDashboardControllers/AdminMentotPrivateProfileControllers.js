import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";
import { fetchSingleMentorProfileForPrivateQuery } from "../../SQLQueries/AdminDashboard/AdminSqlQueries.js";

// to fetch single mentor and need to pass the user id in public profile
export async function fetchSingleMentorPrivateDetails(req, res) {
  const id = req.params.id;
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        return res.json({
          error: err.message,
        });
      }
      if (db) {
        const request = new sql.Request();
        request.input("desired_mentor_dtls_id", sql.Int, id);
        request.query(
          fetchSingleMentorProfileForPrivateQuery,
          (err, result) => {
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
          }
        );
      }
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
}
