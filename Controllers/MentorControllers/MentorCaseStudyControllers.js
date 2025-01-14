import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import { sendEmail } from "../../Middleware/AllFunctions.js";
import { InsertNotificationHandler } from "../../Middleware/NotificationFunction.js";
import {
  CaseStudySubmittedHeading,
  CaseStudySubmittedMessage,
  SuccessMsg,
} from "../../Messages/Messages.js";
import { insertMentorCaseStudyQuery } from "../../SQLQueries/MentorDashboard/CaseStudySQlQueries.js";

export async function createMentorCaseInput(req, res) {
  const {
    caseBackground,
    caseCategory,
    caseSummary,
    caseTitle,
    challenge,
    characters,
    futureSkills,
    lesson,
    resource,
    roleOfMainCharacter,
  } = req.body.data;
  const { mentorUserId, mentorDtlsId, roles } = req.body;
  try {
    sql.connect(config, (err, db) => {
      if (err)
        return res.json({ error: "There is something wrong with submitting" });
      const request = new sql.Request();
      request.input("userId", sql.Int, mentorUserId);
      request.input("mentorId", sql.Int, mentorDtlsId);
      request.input("caseCategory", sql.VarChar(100), caseCategory);
      request.input("caseTitle", sql.Text, caseTitle);
      request.input("caseSummary", sql.Text, caseSummary);
      request.input("caseBackground", sql.Text, caseBackground);
      request.input("challenge", sql.Text, challenge);
      request.input("characters", sql.Int, characters);
      request.input("roles", sql.Text, roles);
      request.input(
        "roleOfMainCharacter",
        sql.VarChar(100),
        roleOfMainCharacter
      );
      request.input("lesson", sql.Text, lesson);
      request.input("futureSkills", sql.Text, futureSkills);
      request.input("resource", sql.Text, resource);
      request.query(insertMentorCaseStudyQuery, (err, result) => {
        if (err)
          return res.json({
            error: err.message,
          });
        if (result) {
          const caseStudyNotification = InsertNotificationHandler(
            mentorUserId,
            SuccessMsg,
            CaseStudySubmittedHeading,
            CaseStudySubmittedMessage
          );
          return res.json({
            success: "Successfully submitted the case study.",
          });
        }
      });
    });
  } catch (error) {
    return res.json({ error: "There is something wrong with submitting" });
  }
}
