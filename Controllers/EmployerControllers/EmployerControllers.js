import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";
import {
  sendEmail,
  uploadMentorPhotoToAzure,
} from "../../Middleware/AllFunctions.js";
import { InsertNotificationHandler } from "../../Middleware/NotificationFunction.js";
import {
  AccountCreatedHeading,
  AccountCreatedMessage,
  SuccessMsg,
} from "../../Messages/Messages.js";
import { MentorUserFIrstRegDtlsQuery } from "../../SQLQueries/Auth/AuthSQLqueries.js";
import { mentorDtlsUpdatedRegistrationQuery } from "../../SQLQueries/MentorDashboard/MentorUpdateRegSqlQueries.js";
import { mentorUpdatedRegAccountCreatedEmailTemplate } from "../../EmailTemplates/AccountEmailTemplate/AccountEmailTemplate.js";
import moment from "moment";
import {
  EmployerOrganizationDtlsSqlQuery,
  fetchEmployerSingleDashboardQuery,
  UpdateEMployerOrgDetailsQuery,
} from "../../SQLQueries/EmployerSQlQueries/EmployerSqlQueries.js";

dotenv.config();

export async function employeeRegisterController(req, res, next) {
  const {
    employer_first_name,
    employer_last_name,
    employer_email,
    employer_password,
    employer_phone,
  } = req.body;

  const lowEmail = employer_email.toLowerCase();
  let saltRounds = await bcrypt.genSalt(12);
  let hashedPassword = await bcrypt.hash(employer_password, saltRounds);

  sql.connect(config, async (err) => {
    if (err) {
      return res.json({ error: err.message });
    }
    const request = new sql.Request();
    request.input("email", sql.VarChar, lowEmail);
    // Add input parameters
    request.query(
      "select user_email from users_dtls where user_email = @email",
      (err, result) => {
        if (err) return res.json({ error: err.message });
        if (result.recordset.length > 0) {
          return res.json({
            error:
              "The email is all ready in use, Please use another email address or Login to dashboard for updating the organization results",
          });
        } else {
          const request = new sql.Request();
          // Add input parameters
          request.input("user_email", sql.VarChar, lowEmail);
          request.input("user_pwd", sql.VarChar, hashedPassword);
          request.input("user_firstname", sql.VarChar, employer_first_name);
          request.input("user_lastname", sql.VarChar, employer_last_name);
          request.input("user_phone_number", sql.VarChar, employer_phone);
          request.input("user_type", sql.VarChar, "employer");
          request.input("user_status", sql.VarChar, "1");
          // Execute the query
          request.query(MentorUserFIrstRegDtlsQuery, async (err, result) => {
            if (err) {
              return res.json({ error: err.message });
            }
            if (result && result.recordset && result.recordset.length > 0) {
              const userDtlsId = result.recordset[0].user_dtls_id;
              const user_email = employer_email;
              const user_firstname = employer_first_name;
              const user_lastname = employer_last_name;
              const user_role = 0;
              request.input("employerUserDtlsId", sql.Int, userDtlsId);
              request.input("employerEmail", sql.VarChar, lowEmail);
              request.input("employerOrgName", sql.VarChar, "");
              request.input("employerOrgDesc", sql.Text, "");
              request.input("employerOrgLogo", sql.VarChar, "");
              request.input("employerOrgIndustry", sql.VarChar, "");
              request.input("employerOrgLocation", sql.VarChar, "");
              request.input("employerOrgNoOfEmp", sql.VarChar, "");
              request.query(
                EmployerOrganizationDtlsSqlQuery,
                async (err, result) => {
                  if (err) return res.json({ error: err.message });
                  if (result) {
                    const employerNotificationHandler =
                      InsertNotificationHandler(
                        userDtlsId,
                        SuccessMsg,
                        AccountCreatedHeading,
                        AccountCreatedMessage
                      );
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
                        user_email: user_email,
                        user_firstname: user_firstname,
                        user_lastname: user_lastname,
                        user_type: "employer",
                        user_role: user_role,
                      },
                      process.env.JWT_LOGIN_SECRET_KEY,
                      { expiresIn: "48h" }
                    );
                    return res.json({
                      success: true,
                      token: token,
                      accessToken: accessToken,
                    });
                  }
                }
              );
            }
          });
        }
      }
    );
  });
}

export async function getEmployeeDashboardDetails(req, res) {
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
        request.input("employerUserDtlsId", sql.Int, userId);
        request.query(fetchEmployerSingleDashboardQuery, (err, result) => {
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
      }
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
}

export async function UpdateEmployerOrganizationDetails(req, res) {
  const {
    organization_name,
    organization_description,
    industry,
    organization_location,
    company_size,
    organization_website,
    organization_linkedin,
    organization_employee_designation,
    organization_address,
  } = req.body.data;
  const { employerUserDtlsId } = req.body;
  try {
    sql.connect(config, (err, db) => {
      if (err) return res.json({ error: err.message });
      const request = new sql.Request();
      request.input("employerUserDtlsId", sql.Int, employerUserDtlsId);
      request.input("employerOrgName", sql.VarChar, organization_name);
      request.input("employerOrgDesc", sql.Text, organization_description);
      request.input("employerOrgIndustry", sql.VarChar, industry);
      request.input("employerOrgLocation", sql.VarChar, organization_location);
      request.input("employerOrgNoOfEmp", sql.VarChar, company_size);
      request.input("organization_website", sql.VarChar, organization_website);
      request.input(
        "organization_linkedin",
        sql.VarChar,
        organization_linkedin
      );
      request.input(
        "organization_employee_designation",
        sql.VarChar,
        organization_employee_designation
      );
      request.input("organization_address", sql.Text, organization_address);

      request.query(UpdateEMployerOrgDetailsQuery, (err, result) => {
        if (err) return res.json({ error: err.message });
        if (result) {
          return res.json({
            success: "Successfully updated the organization details",
          });
        }
      });
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
}
