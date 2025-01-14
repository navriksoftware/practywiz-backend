import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";
import { sendEmail } from "../../Middleware/AllFunctions.js";
import moment from "moment";
import {
  InstituteRegisterSqlQuery,
  InstituteTableInsertQuery,
} from "../../SQLQueries/Institute/InstituteSQLQueries.js";
import { accountCreatedEmailTemplate } from "../../EmailTemplates/AccountEmailTemplate/AccountEmailTemplate.js";
import { InsertNotificationHandler } from "../../Middleware/NotificationFunction.js";
import {
  AccountCreatedHeading,
  AccountCreatedMessage,
  SuccessMsg,
} from "../../Messages/Messages.js";

dotenv.config();
import { fetchGuestLecturesQuery } from "../../SQLQueries/MentorSQLQueries.js";
dotenv.config();

export async function fetchGuestLectures(req, res, next) {
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        return res.json({
          error: err.message,
        });
      }
      if (db) {
        const request = new sql.Request();
        request.query(fetchGuestLecturesQuery, (err, result) => {
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

export async function RegisterInstitute(req, res, next) {
  const {
    institute_name,
    institute_contact_person_first_name,
    institute_contact_person_last_name,
    institute_email,
    institute_password,
    institute_phone,
  } = req.body.data;
  const { userType } = req.body;
  const lowEmail = institute_email.toLowerCase();
  let saltRounds = await bcrypt.genSalt(12);
  let hashedPassword = await bcrypt.hash(institute_password, saltRounds);
  sql.connect(config, async (err) => {
    if (err) {
      return res.send({ error: "There is something wrong!" });
    }
    const request = new sql.Request();
    request.input("email", sql.VarChar, lowEmail);
    request.query(
      "select user_email from users_dtls where user_email = @email",
      (err, result) => {
        if (err) return res.json({ error: "There is something wrong!" });
        if (result.recordset.length > 0) {
          return res.json({
            error:
              "This email address is already in use, Please use another email address",
          });
        } else {
          const request = new sql.Request();
          // Add input parameters
          request.input("user_email", sql.VarChar, lowEmail);
          request.input("user_pwd", sql.VarChar, hashedPassword);
          request.input(
            "user_firstname",
            sql.VarChar,
            institute_contact_person_first_name
          );
          request.input(
            "user_lastname",
            sql.VarChar,
            institute_contact_person_last_name
          );
          request.input("user_phone_number", sql.VarChar, institute_phone);
          request.input("user_status", sql.VarChar, "1");
          request.input("user_type", sql.VarChar, userType);
          // Execute the query
          request.query(InstituteRegisterSqlQuery, (err, result) => {
            if (result && result.recordset && result.recordset.length > 0) {
              const instituteUserDtlsId = result.recordset[0].user_dtls_id;
              request.input("instituteUserId", sql.Int, instituteUserDtlsId);
              request.input("instituteName", sql.VarChar, institute_name);
              request.input("instituteAbout", sql.Text, "");
              request.input("instituteProfilePic", sql.VarChar, "");
              request.query(InstituteTableInsertQuery, async (err, result) => {
                if (err) {
                  return res.json({ error: err.message });
                }
                if (result) {
                  const notificationHandler = await InsertNotificationHandler(
                    instituteUserDtlsId,
                    SuccessMsg,
                    AccountCreatedHeading,
                    AccountCreatedMessage
                  );
                  const msg = accountCreatedEmailTemplate(
                    lowEmail,
                    institute_contact_person_first_name +
                      " " +
                      institute_contact_person_last_name
                  );
                  const response = await sendEmail(msg);
                  if (
                    response === "True" ||
                    response === "true" ||
                    response === true
                  ) {
                    return res.json({
                      success: "Thank you for registering as a institute",
                    });
                  }
                  if (
                    response === "False" ||
                    response === "false" ||
                    response === false
                  ) {
                    return res.json({
                      success: "Thank you for registering as a institute",
                    });
                  }
                }
              });
            } else {
              return res.json({ error: "No record inserted or returned." });
            }
          });
        }
      }
    );
  });
}
