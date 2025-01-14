import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";
import { sendEmail } from "../../Middleware/AllFunctions.js";
import moment from "moment";
import { userDtlsQuery } from "../../SQLQueries/MentorSQLQueries.js";
import { MenteeRegisterQuery } from "../../SQLQueries/Mentee/MenteeSqlQueries.js";
import { accountCreatedEmailTemplate } from "../../EmailTemplates/AccountEmailTemplate/AccountEmailTemplate.js";
import { InsertNotificationHandler } from "../../Middleware/NotificationFunction.js";
import {
  AccountCreatedHeading,
  AccountCreatedMessage,
  SuccessMsg,
} from "../../Messages/Messages.js";

dotenv.config();

// registering of the mentor application
export async function MenteeRegistration(req, res, next) {
  const {
    mentee_About,
    mentee_Email,
    mentee_Skills,
    mentee_firstname,
    mentee_gender,
    mentee_lastname,
    mentee_phone,
    mentee_type,
    mentee_password,
    mentee_InstituteName,
  } = req.body.data;
  const { userType } = req.body;
  const menteeInstituteDetails = [
    {
      mentee_courseName: "",
      mentee_instituteName: mentee_InstituteName,
      mentee_institute_End_Year: "",
      mentee_institute_Start_Year: "",
      mentee_institute_location: "",
    },
  ];
  const lowEmail = mentee_Email.toLowerCase();
  const timestamp = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
  let saltRounds = await bcrypt.genSalt(12);
  let hashedPassword = await bcrypt.hash(mentee_password, saltRounds);
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
          request.input("user_firstname", sql.VarChar, mentee_firstname);
          request.input("user_lastname", sql.VarChar, mentee_lastname);
          request.input("user_phone_number", sql.VarChar, mentee_phone);
          request.input("user_status", sql.VarChar, "1");
          request.input("user_modified_by", sql.VarChar, "Admin");
          request.input("user_type", sql.VarChar, userType);
          request.input("user_is_superadmin", sql.VarChar, "0");
          request.input("user_logindate", sql.Date, timestamp);
          request.input("user_logintime", sql.Date, timestamp);
          request.input("user_token", sql.VarChar, "");
          // Execute the query
          request.query(userDtlsQuery, (err, result) => {
            if (result && result.recordset && result.recordset.length > 0) {
              const userDtlsId = result.recordset[0].user_dtls_id;
              request.input("menteeUserDtlsId", sql.Int, userDtlsId);
              request.input("menteeAbout", sql.VarChar, mentee_About);
              request.input(
                "menteeSkills",
                sql.Text,
                JSON.stringify(mentee_Skills) || "[]"
              );
              request.input("menteeGender", sql.VarChar, mentee_gender);
              request.input("menteeType", sql.VarChar, mentee_type);
              request.input(
                "menteeProfilePic",
                sql.VarChar,
                "https://practiwizstorage.blob.core.windows.net/practiwizcontainer/blue-circle-with-white-user_78370-4707.webp"
              );
              request.input(
                "menteeInstitute",
                sql.Text,
                JSON.stringify(menteeInstituteDetails)
              );

              request.query(MenteeRegisterQuery, async (err, result) => {
                if (err) {
                  return res.json({
                    error: err.message,
                  });
                }
                if (result) {
                  const notificationHandler = await InsertNotificationHandler(
                    userDtlsId,
                    SuccessMsg,
                    AccountCreatedHeading,
                    AccountCreatedMessage
                  );
                  const msg = accountCreatedEmailTemplate(
                    lowEmail,
                    mentee_firstname + " " + mentee_lastname
                  );
                  const response = await sendEmail(msg);
                  if (
                    response === "True" ||
                    response === "true" ||
                    response === true
                  ) {
                    return res.json({
                      success: "Thank you for registering as a mentee",
                    });
                  }
                  if (
                    response === "False" ||
                    response === "false" ||
                    response === false
                  ) {
                    return res.json({
                      success: "Thank you for registering as a mentee",
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
