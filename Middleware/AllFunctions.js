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
    console.log("Email sent");
    return successEmail;
  } catch (error) {
    console.log(error);
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
