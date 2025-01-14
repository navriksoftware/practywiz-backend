import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";
import {
  fetchAllApprovedMentorQuery,
  fetchAllMentorCompletedSessionsQuery,
  fetchAllMentorInCompletedSessionsQuery,
  fetchAllMentorUpcomingSessionsQuery,
  fetchAllNotApprovedMentorQuery,
  UpdateMentorToApproveQuery,
  UpdateMentorToDisapproveQuery,
} from "../../SQLQueries/AdminDashboard/AdminSqlQueries.js";
import {
  mentorApplicationEmail,
  mentorApplicationFillEmailAlertTemplate,
  mentorApprovedEmailTemplate,
} from "../../EmailTemplates/MentorEmailTemplate/MentorEmailTemplate.js";
import { sendEmail } from "../../Middleware/AllFunctions.js";
import { InsertNotificationHandler } from "../../Middleware/NotificationFunction.js";
import {
  InfoMsg,
  MentorApplicationProgressHeading,
  MentorApprovedHeading,
  MentorApprovedMsg,
  MentorDisApprovedHeading,
  MentorDisApprovedMsg,
  MentorEmailAlertMessage,
  SuccessMsg,
  WarningMsg,
} from "../../Messages/Messages.js";
dotenv.config();

export async function getAllUsersListAdminDashboard(req, res, next) {}
export async function getAllApprovedMentorsListAdminDashboard(req, res, next) {
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        return res.json({
          error: err.message,
        });
      }
      if (db) {
        const request = new sql.Request();
        request.query(fetchAllApprovedMentorQuery, (err, result) => {
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
export async function getAllNotApprovedMentorsListAdminDashboard(
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
        request.query(fetchAllNotApprovedMentorQuery, (err, result) => {
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
              error: "There are no current mentor applications.",
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
// updating the mentor to disapproving status
export async function UpdateMentorToDisapprove(req, res) {
  const { mentorDtlsId, mentorEmail, mentorName, userId } = req.body;
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        return res.json({
          error: err.message,
        });
      }
      if (db) {
        const request = new sql.Request();
        request.input("mentorUserDtls", sql.Int, mentorDtlsId);
        request.query(UpdateMentorToDisapproveQuery, async (err, result) => {
          if (err) {
            return res.json({
              error: err.message,
            });
          }
          if (result) {
            const response = await InsertNotificationHandler(
              userId,
              WarningMsg,
              MentorDisApprovedHeading,
              MentorDisApprovedMsg
            );
            return res.json({
              success: "Success",
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
// updating the mentor to approving status
export async function UpdateMentorToApprove(req, res) {
  const { mentorDtlsId, mentorEmail, mentorName, userId } = req.body;
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        return res.json({
          error: err.message,
        });
      }
      if (db) {
        const request = new sql.Request();
        request.input("mentorUserDtls", sql.Int, mentorDtlsId);
        request.query(UpdateMentorToApproveQuery, async (err, result) => {
          if (err) {
            return res.json({
              error: err.message,
            });
          }
          if (result) {
            const msg = mentorApprovedEmailTemplate(mentorEmail, mentorName);
            const notResponse = await InsertNotificationHandler(
              userId,
              SuccessMsg,
              MentorApprovedHeading,
              MentorApprovedMsg
            );
            const response = await sendEmail(msg);
            if (
              response === "True" ||
              response === "true" ||
              response === true
            ) {
              return res.json({
                success: "success",
              });
            }
            if (
              response === "False" ||
              response === "false" ||
              response === false
            ) {
              return res.json({
                success: "success",
              });
            }
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

// getting all the mentor booking session

export async function getAllMentorUpcomingAdminDashboard(req, res, next) {
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        return res.json({
          error: err.message,
        });
      }
      if (db) {
        const request = new sql.Request();
        request.query(fetchAllMentorUpcomingSessionsQuery, (err, result) => {
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
              error: "",
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

export async function getAllMentorCompletedAdminDashboard(req, res, next) {
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        return res.json({
          error: err.message,
        });
      }
      if (db) {
        const request = new sql.Request();
        request.query(fetchAllMentorCompletedSessionsQuery, (err, result) => {
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

export async function getAllMentorInCompletedAdminDashboard(req, res, next) {
  const { username, mentorEmail } = req.body;
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        return res.json({
          error: err.message,
        });
      }
      if (db) {
        const request = new sql.Request();
        request.query(fetchAllMentorInCompletedSessionsQuery, (err, result) => {
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
              error: "",
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

export async function sendEmailAlertForMentorDashboard(req, res, next) {
  const { userId, mentorName, mentorEmail } = req.body;
  try {
    const msg = mentorApplicationFillEmailAlertTemplate(
      mentorEmail,
      mentorName
    );
    const notResponse = await InsertNotificationHandler(
      userId,
      WarningMsg,
      MentorApplicationProgressHeading,
      MentorEmailAlertMessage
    );
    const response = await sendEmail(msg);
    if (response === "True" || response === "true" || response === true) {
      return res.json({
        success: "Email alert send successfully",
      });
    }
    if (response === "False" || response === "false" || response === false) {
      return res.json({
        error:
          "There was an error sending the email notification. Please try again later",
      });
    }
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
}
