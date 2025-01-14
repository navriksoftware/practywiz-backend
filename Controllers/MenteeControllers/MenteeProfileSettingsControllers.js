import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";
import {
  sendEmail,
  uploadMentorPhotoToAzure,
} from "../../Middleware/AllFunctions.js";
import moment from "moment";
import { InsertNotificationHandler } from "../../Middleware/NotificationFunction.js";
import {
  MenteeProfileChangedMessage,
  MenteeProfileHeading,
  SuccessMsg,
} from "../../Messages/Messages.js";
import {
  MenteeEduWorkUpdateQuery,
  MenteeProfilePictureUpdateQuery,
  MenteeProfileUpdateQuery,
} from "../../SQLQueries/Mentee/MenteeProfileSqlQueries.js";
dotenv.config();

export async function UpdateMenteeProfileDetails(req, res, next) {
  const {
    mentee_linkedin_link,

    mentee_language,
    mentee_gender,
    mentee_aboutyouself,
  } = req.body.formData;

  const { menteeUserDtlsId } = req.body;
  try {
    sql.connect(config, (err, db) => {
      if (err)
        return res.json({
          error: "There is some error while updating the profile details",
        });
      const request = new sql.Request();
      request.input("menteeUserDtlsId", sql.Int, menteeUserDtlsId);
      request.input("linkedinUrl", sql.VarChar, mentee_linkedin_link);

      request.input(
        "menteeLanguage",
        sql.Text,
        JSON.stringify(mentee_language)
      );
      request.input("menteeGender", sql.VarChar, mentee_gender);
      request.input("menteeAbout", sql.VarChar, mentee_aboutyouself);

      request.query(MenteeProfileUpdateQuery, async (err, result) => {
        if (err) return res.json({ error: err.message });
        if (result) {
          const notification = await InsertNotificationHandler(
            menteeUserDtlsId,
            SuccessMsg,
            MenteeProfileHeading,
            MenteeProfileChangedMessage
          );
          return res.json({ success: "Successfully updated the profile" });
        }
      });
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
}
export async function UpdateMenteeEduWorkDetails(req, res, next) {
  const { menteeUserDtlsId } = req.body;
  const {
    edutype,
    mentee_skills,
    mentee_EduDetails,
    mentee_CertDetails,
    mentee_WorkExpDetails,
    mentee_AddDetails,
  } = req.body;
  console.log(req.body);

  try {
    sql.connect(config, (err, db) => {
      if (err)
        return res.json({
          error: "There is some error while updating the profile details",
        });
      const request = new sql.Request();
      request.input("menteeUserDtlsId", sql.Int, menteeUserDtlsId);
      request.input("menteeType", sql.VarChar, edutype);
      request.input("menteeSkills", sql.Text, JSON.stringify(mentee_skills));

      request.input(
        "instituteDetails",
        sql.Text,
        JSON.stringify(mentee_EduDetails)
      );

      request.input(
        "certificateDetails",
        sql.Text,
        JSON.stringify(mentee_CertDetails)
      );
      request.input(
        "experienceDetails",
        sql.Text,
        JSON.stringify(mentee_WorkExpDetails)
      );
      request.input(
        "additionalDetails",
        sql.Text,
        JSON.stringify(mentee_AddDetails)
      );
      request.query(MenteeEduWorkUpdateQuery, async (err, result) => {
        if (err) return res.json({ error: err.message });
        if (result) {
          const notification = await InsertNotificationHandler(
            menteeUserDtlsId,
            SuccessMsg,
            MenteeProfileHeading,
            MenteeProfileChangedMessage
          );
          return res.json({ success: "Successfully updated the profile" });
        }
      });
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
}

export async function UpdateMenteeProfilePicture(req, res) {
  const { menteeUserDtlsId } = req.body;
  if (!req.files.image) {
    return res.json({ error: "Please select a file to upload" });
  } else {
    try {
      const blobName = new Date().getTime() + "-" + req.files.image.name;
      var fileName = `https://practiwizstorage.blob.core.windows.net/practiwizcontainer/mentorprofilepictures/${blobName}`;
      uploadMentorPhotoToAzure(req.files, blobName);
      sql.connect(config, (err, db) => {
        if (err)
          return res.json({
            error: "There is some error while updating the profile details",
          });
        const request = new sql.Request();
        request.input("menteeUserDtlsId", sql.Int, menteeUserDtlsId);
        request.input("menteeProfileUrl", sql.VarChar, fileName);
        request.query(MenteeProfilePictureUpdateQuery, async (err, result) => {
          if (err) return res.json({ error: err.message });
          if (result) {
            const notification = await InsertNotificationHandler(
              menteeUserDtlsId,
              SuccessMsg,
              MenteeProfileHeading,
              MenteeProfileChangedMessage
            );
            return res.json({ success: "Successfully updated the profile" });
          }
        });
      });
    } catch (error) {
      return res.json({ error: error.message });
    }
  }
}
