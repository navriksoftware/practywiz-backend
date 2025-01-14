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
  InternshipHeading,
  InternshipPostMessage,
  SuccessMsg,
} from "../../Messages/Messages.js";
import moment from "moment";
import {
  CreateInternshipPostSqlQuery,
  FetchAllInternshipPostsSqlQuery,
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
