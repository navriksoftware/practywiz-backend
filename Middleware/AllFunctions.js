import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import { BlockBlobClient } from "@azure/storage-blob";
import intoStream from "into-stream";
import schedule from "node-schedule";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendEmail(msg) {
  const successEmail = "True";
  const errorEmail = "False";
  try {
    await sgMail.send(msg);
    console.log("Email sent to: ", msg.to);
    return successEmail;
  } catch (error) {
    console.error(error.toString());
    if (error.response) {
      console.error(error.response.body);
    }
    console.log("Email not sent");
    return errorEmail;
  }
}

export function uploadMentorPhotoToAzure(imageData, blobName) {
  const blobService = new BlockBlobClient(
    process.env.AZURE_STORAGE_CONNECTION_STRING,
    "practiwizcontainer/mentorprofilepictures",
    blobName
  );
  const stream = intoStream(imageData.image.data);
  const streamLength = imageData.image.data.length;
  blobService
    .uploadStream(stream, streamLength)
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err.messages);
      return res.send({
        error: "There was an error uploading",
      });
    });
}
// export function uploadMenteeResumeToAzure(fileBuffer, blobName) {
//   console.log("line 49");
// }
export function uploadMenteeResumeToAzure(fileBuffer, blobName) {
  console.log("line 49");
  const blobService = new BlockBlobClient(
    process.env.AZURE_STORAGE_CONNECTION_STRING,
    "practiwizcontainer/menteeresume",
    blobName
  );

  const stream = intoStream(fileBuffer);
  const streamLength = fileBuffer.length;

  return blobService
    .uploadStream(stream, streamLength)
    .then((response) => {
      console.log("Resume uploaded to Azure successfully:", response.requestId);
      // console.log("line 62");
      return {
        success: true,
        message: "Upload successful",
        url: blobService.url,
      };
    })
    .catch((err) => {
      console.error("Error uploading resume to Azure:", err.message);
      return {
        success: false,
        error: "There was an error uploading to Azure Blob Storage",
      };
    });
}

export async function convertTo24HourFormat(time12h) {
  // Extract the period (AM/PM) from the string
  let period = time12h.slice(-2).toUpperCase(); // Get the last two characters (AM/PM)
  let time = time12h.slice(0, -2); // Get the time part (e.g., '6:00' or '5:30')
  let [hours, minutes] = time.split(":").map(Number);
  // Convert hours based on the period
  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }

  // Format the time as "HH:MM"
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
}

export async function scheduleReminderHandler(
  reminderTime,
  beforeMinutes,
  mentorMessage,
  menteeMessage
) {
  let reminderDate = new Date(reminderTime);
  reminderDate.setHours(reminderDate.getHours() - 5); // Subtract 5 hours
  reminderDate.setMinutes(reminderDate.getMinutes() - beforeMinutes); // Subtract 10 minutes
  // Check if the reminder date is in the future
  schedule.scheduleJob(reminderDate, async () => {
    const menteeResponse = await sendEmail(menteeMessage);
    if (
      menteeResponse === "True" ||
      menteeResponse === "true" ||
      menteeResponse === true
    ) {
      console.log("Email alert send to mentee before ", beforeMinutes);
    }
    const mentorResponse = await sendEmail(mentorMessage);
    if (
      mentorResponse === "True" ||
      mentorResponse === "true" ||
      mentorResponse === true
    ) {
      console.log("Email alert send to mentor before ", beforeMinutes);
    }
  });
}

export function calculateMentorScore(mentee, mentor) {
  let score = 0;

  // Skills Match
  const menteeSkills = mentee.mentee_skills || [];
  const mentorSkills = mentor.mentor_area_expertise || [];
  const commonSkills = mentorSkills.filter((skill) =>
    menteeSkills.includes(skill)
  );
  score += (commonSkills.length / Math.max(menteeSkills.length, 1)) * 30;

  // Language Match
  const menteeLangs = (mentee.mentee_language || []).map((l) => l.value || l);
  const mentorLangs = mentor.mentor_language || [];
  const commonLangs = mentorLangs.filter((lang) => menteeLangs.includes(lang));
  score += (commonLangs.length / Math.max(menteeLangs.length, 1)) * 15;

  // Institute Match
  const menteeInstitute =
    mentee.mentee_institute_details?.[0]?.collage_name || "";
  const mentorInstitutes =
    mentor.mentor_institute?.map((i) => i.Institute) || [];
  if (mentorInstitutes.includes(menteeInstitute)) score += 10;

  // Domain/Passion Match (basic text check)
  const menteeAbout = (mentee.mentee_about || "").toLowerCase();
  const mentorDomains = mentor.mentor_domain || [];
  if (
    mentorDomains.some((domain) => menteeAbout.includes(domain.toLowerCase()))
  )
    score += 20;

  // Experience Match
  const expStr = mentor.mentor_years_of_experience || "0";
  const expYears = parseInt(expStr.split("-")[0]);
  if (!isNaN(expYears) && expYears >= 5) score += 10;

  // Availability
  if ((mentor.mentor_timeslots_json || []).length > 0) score += 10;
  return score;
}
