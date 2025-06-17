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
  EmployerProfileChangedMessage,
  InfoMsg,
  InternshipHeading,
  InternshipPostMessage,
  MentorProfileHeading,
  SuccessMsg,
} from "../../Messages/Messages.js";
import moment from "moment";
import {
  ApplyInternshipSqlQuery,
  CreateInternshipPostSqlQuery,
  FetchAllInternshipPostsSqlQuery,
  Show10InternshipsSqlQuery,
} from "../../SQLQueries/EmployerSQlQueries/InternshipSqlQueries.js";
import { FetchInternshipPostDetailsSqlQuery } from "../../SQLQueries/EmployerSQlQueries/EmployerSqlQueries.js";

dotenv.config();

export async function CreateInternshipPost(req, res, next) {
  const {
    internshipProfile,
    internshipType,
    internshipOpening,
    partFullTime,
    StartTimeFrom,
    endTimeTo,
    internshipPostTimezone,
    InternshipLocation,
    internshipStart,
    internshipDuration,
    internshipStipendType,
    stipendCurrencyType,
    stipendAmount,
    stipendTime,
    internshipPPOcheckbox,
    internshipRequirementsDeatils,
    internshipResponsibilities,
    supervisionType,
    internshipSatrtBy,
    employer_internship_post_support,
    employer_internship_post_project,
    employer_internship_post_contribution,
    taskCategory,
    businessObjective,
    projectPlan,
  } = req.body.payload;
  const {
    employerUserDtlsId,
    internshipSkills,
    internshipPerks,
    internshipDomain,
    employerOrgDtlsId,
  } = req.body;
  console.log(req.body.payload);
  try {
    sql.connect(config, (err, db) => {
      if (err) return res.json({ error: err.message });
      const request = new sql.Request();
      request.input(
        "employer_internship_post_user_dtls_id",
        sql.Int,
        employerUserDtlsId
      );
      request.input(
        "employer_internship_post_org_dtls_id",
        sql.Int,
        employerOrgDtlsId
      );
      request.input(
        "employer_internship_post_supervision_type",
        sql.VarChar,
        supervisionType
      );
      request.input(
        "employer_internship_post_position",
        sql.VarChar,
        internshipProfile
      );
      request.input(
        "employer_internship_post_type",
        sql.VarChar,
        internshipType
      );
      request.input(
        "employer_internship_post_openings",
        sql.Int,
        internshipOpening
      );
      request.input(
        "employer_internship_post_part_full_time",
        sql.VarChar,
        partFullTime
      );
      request.input(
        "employer_internship_post_coll_hours",
        sql.VarChar,
        StartTimeFrom + "-" + endTimeTo
      );
      request.input(
        "employer_internship_post_timezone",
        sql.VarChar,
        internshipPostTimezone
      );
      request.input(
        "employer_internship_post_location",
        sql.VarChar,
        InternshipLocation
      );
      request.input(
        "employer_internship_post_internship_start",
        sql.VarChar,
        internshipStart
      );
      request.input(
        "employer_internship_post_internship_start_date",
        sql.VarChar,
        internshipSatrtBy
      );
      request.input(
        "employer_internship_post_duration",
        sql.Int,
        internshipDuration
      );
      request.input(
        "employer_internship_post_skills",
        sql.Text,
        internshipSkills
      );
      request.input(
        "employer_internship_post_req",
        sql.Text,
        internshipRequirementsDeatils
      );
      request.input(
        "employer_internship_post_res",
        sql.Text,
        internshipResponsibilities
      );
      request.input(
        "employer_internship_post_stipend_type",
        sql.VarChar,
        internshipStipendType
      );
      request.input(
        "employer_internship_post_currency_type",
        sql.VarChar,
        stipendCurrencyType
      );
      request.input(
        "employer_internship_post_stipend_amount",
        sql.VarChar,
        stipendAmount
      );
      request.input(
        "employer_internship_post_pay_type",
        sql.VarChar,
        stipendTime
      );
      request.input(
        "employer_internship_post_perks",
        sql.VarChar,
        internshipPerks
      );
      request.input(
        "employer_internship_post_ppo",
        sql.Bit,
        internshipPPOcheckbox
      );
      request.input("employer_internship_post_support", sql.Text, taskCategory);
      request.input(
        "employer_internship_post_project",
        sql.Text,
        businessObjective
      );
      request.input(
        "employer_internship_post_contribution",
        sql.Text,
        projectPlan
      );
      request.input(
        "employer_internship_post_domain",
        sql.VarChar,
        internshipDomain
      );
      request.query(CreateInternshipPostSqlQuery, (err, result) => {
        if (err) return res.json({ error: err.message });
        if (result) {
          const employerNotificationHandler = InsertNotificationHandler(
            employerUserDtlsId,
            SuccessMsg,
            InternshipHeading,
            InternshipPostMessage
          );
          return res.json({
            success: "Successfully internship post is created",
          });
        }
      });
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
}
export async function fetchAllInternshipPosts(req, res, next) {
  try {
    sql.connect(config, (err, db) => {
      if (err) return res.json({ error: err.message });

      const request = new sql.Request();

      request.query(FetchAllInternshipPostsSqlQuery, (err, result) => {
        if (err) return res.json({ error: err.message });

        if (result.recordset.length > 0) {
          return res.json({
            success: true,
            status: 200,
            data: result.recordset,
          });
        } else {
          return res.json({
            success: false,
            message: "No internship posts found",
            data: [],
          });
        }
      });
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
}
export async function fetchSingleInternshipPost(req, res, next) {
  const { internshipPostId } = req.body;
  try {
    sql.connect(config, (err, db) => {
      if (err) return res.json({ error: err.message });
      const request = new sql.Request();
      request.input("internshipPostId", sql.Int, internshipPostId);
      request.query(FetchInternshipPostDetailsSqlQuery, (err, result) => {
        if (err) return res.json({ error: err.message });
        if (result.recordset.length > 0) {
          return res.json({ success: result.recordset });
        } else {
          return res.json({ error: "[]" });
        }
      });
    });
  } catch (error) {}
}

export async function fetch10InternshipsInHome(req, res, next) {
  try {
    sql.connect(config, (err, db) => {
      if (err) return res.json({ error: err.message });

      const request = new sql.Request();

      request.query(Show10InternshipsSqlQuery, (err, result) => {
        if (err) return res.json({ error: err.message });

        if (result.recordset.length > 0) {
          return res.json({
            success: true,
            status: 200,
            data: result.recordset,
          });
        } else {
          return res.json({
            success: false,
            message: "No internship posts found",
            data: [],
          });
        }
      });
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
}

export async function ApplyInternship(req, res) {
  const {
    mentee_user_dtls_id,
    mentee_dtls_id,
    internship_post_dtls_id,
    resume,
  } = req.body;
  // return res.json({ error: "this is an custom error" });
  try {
    sql.connect(config, (err, db) => {
      if (err) return res.json({ error: err.message });
      const request = new sql.Request();
      request.input("mentee_user_dtls_id", sql.Int, mentee_user_dtls_id);
      request.input("mentee_dtls_id", sql.Int, mentee_dtls_id);
      request.input(
        "internship_post_dtls_id",
        sql.Int,
        internship_post_dtls_id
      );
      request.input("mentee_resume_link", sql.VarChar, "false");
      request.input("mentee_internship_applied_status", sql.VarChar, "applied");
      request.query(ApplyInternshipSqlQuery, (err, result) => {
        if (err) return res.json({ error: err.message });
        if (result) {
          const customMssgHeading = "Internship Applied";
          const customMssg = "You have successfully applied for the internship";
          const menteeNotificationHandler = InsertNotificationHandler(
            mentee_user_dtls_id,
            SuccessMsg,
            customMssgHeading,
            customMssg
          );
          return res.json({
            success: "Successfully applied for the internship",
          });
        }
      });
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
}

export async function employerProfileSettingUpdate(req, res) {
  try {
    // Extracting data correctly
    const { employerDtlsId, fromdata } = req.body;
    if (!employerDtlsId || !fromdata) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const {
      organization_name,
      organization_description,
      company_size,
      organization_city,
      industry,
      organization_website,
      organization_linkedin,
    } = fromdata;

    // Connect to the database
    let pool = await sql.connect(config);
    let request = pool.request();

    request.input("employer_ID", sql.Int, employerDtlsId);

    // Checking if the employer exists
    let result = await request.query(
      "SELECT employer_organization_dtls_id FROM employer_organization_dtls WHERE employer_organization_user_dtls_id = @employer_ID"
    );

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Employer not found" });
    }

    // Adding necessary input parameters
    request.input("employer_Org_name", sql.Text, organization_name);
    request.input("employer_Org_Dec", sql.Text, organization_description);
    request.input("employer_Company_size", sql.VarChar, company_size);
    request.input("employer_Org_City", sql.VarChar, organization_city);
    request.input("employer_industry", sql.VarChar, industry);
    request.input("employer_Org_website", sql.VarChar, organization_website);
    request.input("employer_Org_linkedin", sql.VarChar, organization_linkedin);

    // Update employer details
    await request.query(`
      UPDATE employer_organization_dtls 
      SET 
        employer_organization_name = @employer_Org_name,
        employer_organization_desc = @employer_Org_Dec,
        employer_organization_industry = @employer_industry,
        employer_organization_location = @employer_Org_City,
        employer_organization_no_of_emp = @employer_Company_size,
        employer_organization_dtls_update_date = GETDATE(),
        employer_organization_website = @employer_Org_website,
        employer_organization_linkedin = @employer_Org_linkedin
      WHERE 
        employer_organization_user_dtls_id = @employer_ID
    `);

    const notificationHandler = await InsertNotificationHandler(
      employerDtlsId,
      InfoMsg,
      MentorProfileHeading,
      EmployerProfileChangedMessage
    );

    return res.json({ success: "Successfully updated employer details" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function internshipStatusChange(req, res) {
  const { status, id } = req.body;
  try {
    let pool = await sql.connect(config);
    let request = pool.request();
    request.input("new_status", sql.VarChar, status);
    request.input("internship_post_id", sql.Int, id);
    await request.query(
      `update [dbo].[employer_internship_posts_dtls] 
      SET [employer_internship_post_status]=@new_status
      where employer_internship_post_dtls_id=@internship_post_id`
    );
    return res
      .status(200)
      .json({ success: "Status has been changed Successfully" });
  } catch (e) {
    return res.status(400).json({ error: "Something went wrong in DataBase" });
  }
}

export async function EditInternshipPost(req, res) {
  const {
    internshipProfile,
    internshipType,
    internshipOpening,
    partFullTime,
    StartTimeFrom,
    endTimeTo,
    internshipPostTimezone,
    InternshipLocation,
    internshipStart,
    internshipDuration,
    internshipStipendType,
    stipendCurrencyType,
    stipendAmount,
    stipendTime,
    internshipPPOcheckbox,
    internshipRequirementsDeatils,
    internshipResponsibilities,
    supervisionType,
    internshipSatrtBy,
    employer_internship_post_support,
    employer_internship_post_project,
    employer_internship_post_contribution,
    taskCategory,
    businessObjective,
    projectPlan,
  } = req.body.payload;
  const {
    internshipPostId,
    employerUserDtlsId,
    internshipSkills,
    internshipPerks,
    internshipDomain,
    employerOrgDtlsId,
  } = req.body;

  console.log("body data", req.body.payload);

  return res.status(200).json({ success: "Post Edited Successfully" });
}
