import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";
import moment from "moment";
import sgMail from "@sendgrid/mail";
import axios from "axios";
import { OAuth2Client } from "google-auth-library";
import { userDtlsQuery } from "../../SQLQueries/MentorSQLQueries.js";
import { sendEmail } from "../../Middleware/AllFunctions.js";
import {
  mentorAccountCreatedEmailTemplate,
  passwordUpdateEmailTemplate,
} from "../../EmailTemplates/AccountEmailTemplate/AccountEmailTemplate.js";
import { InsertNotificationHandler } from "../../Middleware/NotificationFunction.js";
import {
  AccountCreatedHeading,
  AccountCreatedMessage,
  InfoMsg,
  PasswordChangedHeading,
  PasswordChangedMessage,
  ResetPasswordHeading,
  ResetPasswordMessage,
  SuccessMsg,
} from "../../Messages/Messages.js";
dotenv.config();
import { MentorUserFIrstRegDtlsQuery } from "../../SQLQueries/Auth/AuthSQLqueries.js";
// user registration status table insert

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export async function UserRegistrationStatus(req, res) {
  const { firstName, lastName, email, UserType, phoneNumber } = req.body;
  const lowEmail = email.toLowerCase();
  const timestamp = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
  try {
    sql.connect(config, async (err) => {
      if (err) {
        return res.send({ error: "There is something wrong!" });
      }
      const request = new sql.Request();
      request.input("email", sql.VarChar, lowEmail);
      request.query(
        "select user_reg_email from users_reg_dtls where user_email = @email",
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
            request.input("user_reg_email", sql.VarChar, email);
            request.input("user_reg_firstname", sql.VarChar, firstName);
            request.input("user_reg_lastname", sql.VarChar, lastName);
            request.input("user_reg_phone_number", sql.VarChar, phoneNumber);
            request.input("user_reg_type", sql.VarChar, UserType);
            request.input("user_reg_logindate", sql.Date, timestamp);
            // Execute the query
            request.query(userDtlsQuery, (err, result) => {
              if (err) {
                return res.json({ error: err.message });
              }
              if (result) {
                return res.json({ success: "success" });
              }
            });
          }
        }
      );
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
}

export async function MentorFirstRegister(req, res) {
  const { firstname, lastName, phoneNumber, emailId } = req.body;
  const lowEmail = emailId.toLowerCase();
  const capitalizedString = capitalizeFirstLetter(firstname);
  const hashedPassword = await bcrypt.hash(capitalizedString + "@12", 12);
  try {
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
                "This email address is already in use, Please use another email address or Login in to update the mentor details in Dashboard.",
            });
          } else {
            const request = new sql.Request();
            // Add input parameters
            request.input("user_email", sql.VarChar, lowEmail);
            request.input("user_pwd", sql.VarChar, hashedPassword);
            request.input("user_firstname", sql.VarChar, firstname);
            request.input("user_lastname", sql.VarChar, lastName);
            request.input("user_phone_number", sql.VarChar, phoneNumber);
            request.input("user_type", sql.VarChar, "mentor");
            request.input("user_status", sql.VarChar, "1");
            // Execute the query
            request.query(MentorUserFIrstRegDtlsQuery, async (err, result) => {
              if (err) {
                return res.json({ error: err.message });
              }
              if (result && result.recordset && result.recordset.length > 0) {
                const userDtlsId = result.recordset[0].user_dtls_id;
                const mentorNotificationHandler = InsertNotificationHandler(
                  userDtlsId,
                  SuccessMsg,
                  AccountCreatedHeading,
                  AccountCreatedMessage
                );
                const msg = mentorAccountCreatedEmailTemplate(
                  lowEmail,
                  firstname + " " + lastName,
                  capitalizedString + "@12"
                );
                const response = await sendEmail(msg);
                if (
                  response === "True" ||
                  response === "true" ||
                  response === true
                ) {
                  return res.json({ success: "success" });
                }
                if (
                  response === "False" ||
                  response === "false" ||
                  response === false
                ) {
                  return res.json({ success: "success" });
                }
              }
            });
          }
        }
      );
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
}
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
// logging in to the portal
export async function login(req, res) {
  let { email, password } = req.body;
  email = email.toLowerCase();
  if (!email || !password) {
    return res.json({ error: "Invalid email or password" });
  }
  try {
    sql.connect(config, async (err) => {
      if (err) {
        return res.json({ error: err.message });
      }
      const request = new sql.Request();
      request.input("email", sql.VarChar, email);
      request.input("active", sql.VarChar, "active");
      request.query(
        `select user_dtls_id,user_email,user_pwd,user_firstname,user_lastname,user_is_superadmin,user_type from users_dtls where user_email = @email AND user_profile_active_status = @active`,
        (err, result) => {
          if (result?.recordset.length > 0) {
            bcrypt.compare(
              password,
              result.recordset[0].user_pwd,
              (err, response) => {
                if (!response) {
                  return res.json({
                    error:
                      "You have entered incorrect password,Please try again or re-enter your password",
                  });
                }
                if (response) {
                  const accessToken = jwt.sign(
                    {
                      user_id: result.recordset[0].user_dtls_id,
                      user_role: result.recordset[0].user_is_superadmin,
                    },
                    process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
                    { expiresIn: "48h" }
                  );
                  const token = jwt.sign(
                    {
                      user_id: result.recordset[0].user_dtls_id,
                      user_email: result.recordset[0].user_email,
                      user_firstname: result.recordset[0].user_firstname,
                      user_lastname: result.recordset[0].user_lastname,
                      user_type: result.recordset[0].user_type,
                      user_role: result.recordset[0].user_is_superadmin,
                    },
                    process.env.JWT_LOGIN_SECRET_KEY,
                    { expiresIn: "48h" }
                  );
                  return res.json({
                    success: true,
                    token: token,
                    accessToken: accessToken,
                  });
                } else {
                  return res.json({
                    error: "Sorry you have entered incorrect password",
                  });
                }
              }
            );
          } else {
            return res.json({
              error:
                "There is no account with that email address Please sign up! ",
            });
          }
        }
      );
    });
  } catch (error) {
    return res.json({
      error: "There is some error while logging in. Please try again",
    });
  }
}

export async function changeUserPassword(req, res, next) {
  const { password, userId } = req.body;
  const saltRounds = await bcrypt.genSalt(12);
  console.log(saltRounds);
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  try {
    sql.connect(config, async (err) => {
      if (err)
        return res.json({
          error: "There is something went wrong. Please try again later.",
        });
      const request = new sql.Request();
      request.input("id", sql.Int, userId);
      request.query(
        "select user_dtls_id from users_dtls where user_dtls_id = @id",
        (err, result) => {
          if (err) {
            return res.json({ error: err.message });
          }
          if (result.recordset.length > 0) {
            const email = result.recordset[0].user_email;
            const username =
              result.recordset[0].user_firstname +
              " " +
              result.recordset[0].user_lastname;
            sql.connect(config, async (err) => {
              if (err) return res.send(err.message);
              const request = new sql.Request();
              request.input("id", sql.Int, userId);
              request.input("password", sql.VarChar, hashedPassword);
              request.query(
                "update users_dtls set user_pwd= @password where user_dtls_id= @id",
                async (err, response) => {
                  if (err)
                    return res.send(
                      "There is something went wrong. Please try again later."
                    );
                  if (response) {
                    const msg = passwordUpdateEmailTemplate(email, username);
                    const notificationHandler = InsertNotificationHandler(
                      userId,
                      InfoMsg,
                      PasswordChangedHeading,
                      PasswordChangedMessage
                    );
                    const emailResponse = await sendEmail(msg);
                    if (
                      emailResponse === "True" ||
                      emailResponse === "true" ||
                      emailResponse === true
                    ) {
                      return res.json({
                        success: "successfully",
                      });
                    }
                    if (
                      emailResponse === "False" ||
                      emailResponse === "false" ||
                      emailResponse === false
                    ) {
                      return res.json({
                        success: "successfully",
                      });
                    }
                  } else {
                    res.send({
                      error: "There was an error updating the password",
                    });
                  }
                }
              );
            });
          } else {
            return res.json({
              error:
                "There is no account with this email address. Please sign up!",
            });
          }
        }
      );
    });
  } catch (error) {
    return res.send("There is something went wrong. Please try again later.");
  }
}

//forgot password from the page
export async function forgotPassword(req, res) {
  const email = req.body.email;
  if (!email) return res.json({ error: "Please enter an email address" });
  sql.connect(config, async (err) => {
    if (err)
      return res.json({
        error: "There is some error while resetting the password",
      });
    const request = new sql.Request();
    request.input("email", sql.VarChar, email);
    request.query(
      "select user_email,user_firstname,user_lastname,user_dtls_id from users_dtls where user_email = @email",
      async (err, result) => {
        if (err) {
          return res.json({
            error: "There is something went wrong. Please try again later.",
          });
        }
        if (result.recordset.length > 0) {
          const fullName =
            result.recordset[0].user_firstname +
            " " +
            result.recordset[0].user_lastname;
          const forgotPasswordToken = jwt.sign(
            {
              id: result.recordset[0].user_dtls_id,
            },
            process.env.JWT_FORGOT_PASSWORD_TOKEN,
            { expiresIn: "1h" }
          );
          const url = `${process.env.FRONT_END_LINK}/user/activate/reset-password/${forgotPasswordToken}`;
          const msg = resetPasswordEmailTemplates(
            email,
            fullName.toUpperCase(),
            url
          );
          const userId = result.recordset[0].user_dtls_id;
          const notificationHandler = InsertNotificationHandler(
            userId,
            InfoMsg,
            ResetPasswordHeading,
            ResetPasswordMessage
          );
          const emailResponse = await sendEmail(msg);
          if (
            emailResponse === "True" ||
            emailResponse === "true" ||
            emailResponse === true
          ) {
            return res.json({
              success:
                "Password reset email has been sent successfully, Link will be expire in the 1 hour",
            });
          }
        } else {
          return res.json({ error: "Email is not registered, Please sign up" });
        }
      }
    );
  });
}

export async function resetPassword(req, res) {
  const password = req.body.password;
  if (!password) {
    return res.json({ error: "The password must be required" });
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.JWT_FORGOT_PASSWORD_TOKEN, (err, user) => {
        if (!err) {
          sql.connect(config, async (err) => {
            if (err)
              return res.json({ error: "Please enter an email address" });
            const request = new sql.Request();
            request.input("id", sql.Int, user.id);
            request.query(
              "select user_dtls_id,user_email,user_firstname,user_lastname from users_dtls where user_dtls_id = @id",
              (err, result) => {
                if (err) {
                  return res.send({ error: err.message });
                }
                if (result.recordset.length > 0) {
                  const email = result.recordset[0].user_email;
                  const username =
                    result.recordset[0].user_firstname +
                    " " +
                    result.recordset[0].user_lastname;
                  request.input("userId", sql.Int, user.id);
                  request.input("password", sql.VarChar, hashedPassword);
                  request.query(
                    "update users_dtls set user_pwd= @password where user_dtls_id= @userId",
                    async (err, response) => {
                      if (err)
                        return res.send(
                          "There is something went wrong. Please try again later."
                        );
                      if (response) {
                        const msg = passwordUpdateEmailTemplate(
                          email,
                          username
                        );
                        const notificationHandler = InsertNotificationHandler(
                          user.id,
                          InfoMsg,
                          PasswordChangedHeading,
                          PasswordChangedMessage
                        );
                        const emailResponse = await sendEmail(msg);
                        if (
                          emailResponse === "True" ||
                          emailResponse === "true" ||
                          emailResponse === true
                        ) {
                          return res.json({
                            success: "Password changed successfully",
                          });
                        }
                        if (
                          emailResponse === "False" ||
                          emailResponse === "false" ||
                          emailResponse === false
                        ) {
                          return res.json({
                            success: "Password changed successfully",
                          });
                        }
                      }
                    }
                  );
                } else {
                  return res.send({
                    error:
                      "There is no account with this email address. Please sign up!",
                  });
                }
              }
            );
          });
        } else {
          return res.send({ token: "link is invalid or expired" });
        }
      });
    } else {
      return res.send({ token: "You are not authenticated" });
    }
  } catch (error) {
    return res.send("There is something went wrong. Please try again later.");
  }
}

export async function GoogleLogin(req, res) {
  const { token } = req.body;
  try {
    // Verify the Google token
    const response = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
    );
    if (response?.data) {
      const { email } = response.data;
      sql.connect(config, async (err) => {
        if (err) {
          return res.json({ error: err.message });
        }
        const request = new sql.Request();
        request.input("email", sql.VarChar, email);
        request.query(
          `select * from users_dtls where user_email = @email`,
          (err, result) => {
            if (result?.recordset.length > 0) {
              const accessToken = jwt.sign(
                {
                  user_id: result.recordset[0].user_dtls_id,
                  user_role: result.recordset[0].user_is_superadmin,
                },
                process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
                { expiresIn: "48h" }
              );
              const token = jwt.sign(
                {
                  user_id: result.recordset[0].user_dtls_id,
                  user_email: result.recordset[0].user_email,
                  user_firstname: result.recordset[0].user_firstname,
                  user_lastname: result.recordset[0].user_lastname,
                  user_type: result.recordset[0].user_type,
                  user_role: result.recordset[0].user_is_superadmin,
                },
                process.env.JWT_LOGIN_SECRET_KEY,
                { expiresIn: "48h" }
              );
              return res.json({
                success: true,
                token: token,
                accessToken: accessToken,
              });
            } else {
              return res.json({
                error:
                  "There is no account with that email address, user type, Please sign up! ",
              });
            }
          }
        );
      });
    } else {
      return res.json({
        error:
          "There is an error while sign in with Google, Sign in using the password",
      });
    }
  } catch (error) {
    return res.json({
      error:
        "There is an error while sign in with Google, Sign in using the password",
    });
  }
}
