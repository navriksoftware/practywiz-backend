import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";
import {
  CheckBankDetailsExistsQuery,
  fetchMentorNotUpdatedDetailsQuery,
  fetchMentorSingleDashboardQuery,
  InsertBankDetailsQuery,
  MarkMentorAllMessagesAsReadQuery,
  MarkMentorSingleMessageAsReadQuery,
} from "../../SQLQueries/MentorDashboard/MentorDashboardSqlQueries.js";
import moment from "moment";
import { InsertNotificationHandler } from "../../Middleware/NotificationFunction.js";
import { InfoMsg } from "../../Messages/Messages.js";

dotenv.config();

// to fetch single mentor and need to pass the user id
export async function fetchSingleDashboardMentorDetails(req, res) {
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
        request.input("mentor_dtls_id", sql.Int, userId);
        request.query(
          `select * from mentor_dtls where mentor_user_dtls_id = @mentor_dtls_id`,
          (err, results) => {
            if (results.recordset.length > 0) {
              request.input("desired_mentor_dtls_id", sql.Int, userId);
              request.query(fetchMentorSingleDashboardQuery, (err, result) => {
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
            } else {
              request.input("desired_mentor_dtls_id1", sql.Int, userId);
              request.query(
                fetchMentorNotUpdatedDetailsQuery,
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

// to fetch single mentor and need to pass the user id
export async function InsertBankDetails(req, res) {
  const { userId, mentorDtlsId } = req.body;
  const {
    accountHolderName,
    accountNumber,
    accountType,
    bankAddress,
    bankName,
    branch,
    ifscCode,
    panNumber,
    swift,
  } = req.body.formData;

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
        request.input("mentorBankUserDtlsId", sql.Int, userId);
        request.query(CheckBankDetailsExistsQuery, (err, result) => {
          if (err) {
            return res.json({
              error: err.message,
            });
          }
          if (result.recordset.length > 0) {
            return res.json({
              success: "You have all ready filled the data",
            });
          } else {
            request.input("mentorUserDtlsId", sql.Int, userId);
            request.input("mentorBankMentorDtlsId", sql.Int, mentorDtlsId);
            request.input(
              "mentorBankAccountHolderName",
              sql.VarChar(255),
              accountHolderName
            );
            request.input(
              "mentorBankAccountNumber",
              sql.VarChar(255),
              accountNumber
            );
            request.input("mentorBankName", sql.VarChar(255), bankName);
            request.input(
              "mentorBankAccountIfscCode",
              sql.VarChar(100),
              ifscCode
            );
            request.input("mentorBankBranch", sql.VarChar(255), branch);
            request.input(
              "mentorBankAccountType",
              sql.VarChar(255),
              accountType
            );
            request.input("mentorBankAddress", sql.VarChar(255), bankAddress);
            request.input("mentorBankPanNumber", sql.VarChar(100), panNumber);
            request.input("mentorBankSwiftCode", sql.VarChar(100), swift);
            request.input("mentorBankCrDate", sql.Date, timestamp);
            request.query(InsertBankDetailsQuery, (err, result) => {
              if (err) {
                return res.status({ error: err.message });
              }
              if (result) {
                const notificationHandler = InsertNotificationHandler(
                  userId,
                  InfoMsg,
                  "Bank details added",
                  "Successfully updated the bank details."
                );
                return res.json({
                  success: "successfully inserted the bank details",
                });
              }
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

export async function MarkAllMessageAsRead(req, res) {
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
        request.input("mentorUserDtlsId", sql.Int, userId);
        request.input("timestamp", sql.DateTime, timestamp);
        request.query(MarkMentorAllMessagesAsReadQuery, (err, result) => {
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
export async function MarkSingleMessageAsRead(req, res) {
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
        request.input("mentorUserDtlsId", sql.Int, userId);
        request.input("mentorNotificationId", sql.Int, notificationId);
        request.input("timestamp", sql.DateTime, timestamp);
        request.query(MarkMentorSingleMessageAsReadQuery, (err, result) => {
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
