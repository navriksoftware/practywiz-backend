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
  FacultyTableInsertQuery,
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
  try {
    const {
      contact_person_first_name,
      contact_person_last_name,
      phone,
      email,
      password,
      organization_name,
      organization_code,
      user_type,
    } = req.body.data;

    console.log(req.body.data);

    const lowEmail = email.toLowerCase();
    const saltRounds = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Connect to SQL database
    const pool = await sql.connect(config);

    // Check if email already exists
    const checkEmailRequest = new sql.Request(pool);
    checkEmailRequest.input("email", sql.VarChar, lowEmail);
    const emailCheckResult = await checkEmailRequest.query(
      "select user_email from users_dtls where user_email = @email"
    );

    if (emailCheckResult.recordset.length > 0) {
      return res.json({
        error:
          "This email address is already in use. Please use another email address",
      });
    }

    // Register user
    const registerRequest = new sql.Request(pool);

    // Add common input parameters
    registerRequest.input("user_email", sql.VarChar, lowEmail);
    registerRequest.input("user_pwd", sql.VarChar, hashedPassword);
    registerRequest.input(
      "user_firstname",
      sql.VarChar,
      contact_person_first_name
    );
    registerRequest.input(
      "user_lastname",
      sql.VarChar,
      contact_person_last_name
    );
    registerRequest.input("user_phone_number", sql.VarChar, phone);
    registerRequest.input("user_status", sql.VarChar, "1");
    registerRequest.input("user_type", sql.VarChar, user_type);

    // Insert user details
    const userResult = await registerRequest.query(InstituteRegisterSqlQuery);

    if (
      !userResult ||
      !userResult.recordset ||
      userResult.recordset.length === 0
    ) {
      return res.json({ error: "No record inserted or returned." });
    }

    const userDtlsId = userResult.recordset[0].user_dtls_id;

    // Insert organization details (either institute or faculty)
    const orgRequest = new sql.Request(pool);
    orgRequest.input("userId", sql.Int, userDtlsId);
    orgRequest.input("organizationName", sql.VarChar, organization_name);
    orgRequest.input("organizationCode", sql.VarChar, organization_code);
    orgRequest.input("organizationAbout", sql.Text, "");
    orgRequest.input("organizationProfilePic", sql.VarChar, "");

    // Use the appropriate query based on user type
    const queryToUse =
      user_type === "institute"
        ? InstituteTableInsertQuery
        : FacultyTableInsertQuery;

    await orgRequest.query(queryToUse);

    // Handle notifications
    await InsertNotificationHandler(
      userDtlsId,
      SuccessMsg,
      AccountCreatedHeading,
      AccountCreatedMessage
    );

    // Send email
    const fullName = `${contact_person_first_name} ${contact_person_last_name}`;
    const msg = accountCreatedEmailTemplate(lowEmail, fullName);

    try {
      const emailResponse = await sendEmail(msg);
      if (emailResponse !== "True" && emailResponse !== true) {
        console.error("Email sending failed:", emailResponse);
      }
    } catch (emailError) {
      console.error("Error sending email:", emailError);
    }

    // Generate JWT tokens
    const user_role = user_type; // Assuming user_type is equivalent to role, adjust if needed

    const accessToken = jwt.sign(
      {
        user_id: userDtlsId,
        user_role: user_role,
      },
      process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: "48h" }
    );

    const token = jwt.sign(
      {
        user_id: userDtlsId,
        user_email: lowEmail,
        user_firstname: contact_person_first_name,
        user_lastname: contact_person_last_name,
        user_type: user_type,
        user_role: user_role,
      },
      process.env.JWT_LOGIN_SECRET_KEY,
      { expiresIn: "48h" }
    );

    // Return success message with tokens
    const userTypeText =
      user_type === "institute" ? "an institute" : "a faculty";
    return res.json({
      success: `Thank you for registering as ${userTypeText}`,
      success_status: true,
      token: token,
      accessToken: accessToken,
      user_type: user_type,
      user_id: userDtlsId,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.json({
      error: "There is something wrong with the registration process.",
    });
  }
}

// export async function RegisterInstitute(req, res, next) {
//   const {
//     institute_contact_person_first_name,
//     institute_contact_person_last_name,
//     institute_phone,
//     institute_email,
//     institute_password,
//     institute_name,
//     instituteCode,
//     user_type
//   } = req.body.data;

//   console.log(req.body.data);

//   const lowEmail = institute_email.toLowerCase();
//   let saltRounds = await bcrypt.genSalt(12);
//   let hashedPassword = await bcrypt.hash(institute_password, saltRounds);
//   sql.connect(config, async (err) => {
//     if (err) {
//       return res.send({ error: "There is something wrong!" });
//     }
//     const request = new sql.Request();
//     request.input("email", sql.VarChar, lowEmail);
//     request.query(
//       "select user_email from users_dtls where user_email = @email",
//       (err, result) => {
//         if (err) return res.json({ error: "There is something wrong!" });
//         if (result.recordset.length > 0) {
//           return res.json({
//             error:
//               "This email address is already in use, Please use another email address",
//           });
//         } else {
//           const request = new sql.Request();
//           // Add input parameters
//           request.input("user_email", sql.VarChar, lowEmail);
//           request.input("user_pwd", sql.VarChar, hashedPassword);
//           request.input(
//             "user_firstname",
//             sql.VarChar,
//             institute_contact_person_first_name
//           );
//           request.input(
//             "user_lastname",
//             sql.VarChar,
//             institute_contact_person_last_name
//           );
//           request.input("user_phone_number", sql.VarChar, institute_phone);
//           request.input("user_status", sql.VarChar, "1");
//           request.input("user_type", sql.VarChar, user_type);
//           // Execute the query
//           request.query(InstituteRegisterSqlQuery, (err, result) => {
//             if (result && result.recordset && result.recordset.length > 0) {
//               const instituteUserDtlsId = result.recordset[0].user_dtls_id;
//               if (user_type === "Institute") {
//                 request.input("instituteUserId", sql.Int, instituteUserDtlsId);
//                 request.input("instituteName", sql.VarChar, institute_name);
//                 request.input("institute_Code", sql.VarChar, instituteCode);
//                 request.input("instituteAbout", sql.Text, "");
//                 request.input("instituteProfilePic", sql.VarChar, "");
//                 request.query(InstituteTableInsertQuery, async (err, result) => {
//                   if (err) {
//                     return res.json({ error: err.message });
//                   }
//                   if (result) {
//                     const notificationHandler = await InsertNotificationHandler(
//                       instituteUserDtlsId,
//                       SuccessMsg,
//                       AccountCreatedHeading,
//                       AccountCreatedMessage
//                     );
//                     const msg = accountCreatedEmailTemplate(
//                       lowEmail,
//                       institute_contact_person_first_name +
//                       " " +
//                       institute_contact_person_last_name
//                     );
//                     const response = await sendEmail(msg);
//                     if (
//                       response === "True" ||
//                       response === "true" ||
//                       response === true
//                     ) {
//                       return res.json({
//                         success: "Thank you for registering as a institute",
//                       });
//                     }
//                     if (
//                       response === "False" ||
//                       response === "false" ||
//                       response === false
//                     ) {
//                       return res.json({
//                         success: "Thank you for registering as a institute",
//                       });
//                     }
//                   }
//                 });
//               }
//               else if (user_type === 'Faculty') {
//                 request.input("instituteUserId", sql.Int, instituteUserDtlsId);
//                 request.input("instituteName", sql.VarChar, institute_name);
//                 request.input("institute_Code", sql.VarChar, instituteCode);
//                 request.input("instituteAbout", sql.Text, "");
//                 request.input("instituteProfilePic", sql.VarChar, "");
//                 request.query(FacultyTableInsertQuery, async (err, result) => {
//                   if (err) {
//                     return res.json({ error: err.message });
//                   }
//                   if (result) {
//                     const notificationHandler = await InsertNotificationHandler(
//                       instituteUserDtlsId,
//                       SuccessMsg,
//                       AccountCreatedHeading,
//                       AccountCreatedMessage
//                     );
//                     const msg = accountCreatedEmailTemplate(
//                       lowEmail,
//                       institute_contact_person_first_name +
//                       " " +
//                       institute_contact_person_last_name
//                     );
//                     const response = await sendEmail(msg);
//                     if (
//                       response === "True" ||
//                       response === "true" ||
//                       response === true
//                     ) {
//                       return res.json({
//                         success: "Thank you for registering as a institute",
//                       });
//                     }
//                     if (
//                       response === "False" ||
//                       response === "false" ||
//                       response === false
//                     ) {
//                       return res.json({
//                         success: "Thank you for registering as a institute",
//                       });
//                     }
//                   }
//                 });
//               }

//             } else {
//               return res.json({ error: "No record inserted or returned." });
//             }
//           });
//         }
//       }
//     );
//   });
// }
