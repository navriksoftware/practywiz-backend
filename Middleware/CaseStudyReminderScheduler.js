import { sendEmail } from "./AllFunctions.js";
import { InsertNotificationHandler } from "./NotificationFunction.js";
import { InfoMsg } from "../Messages/Messages.js";
import {
  caseStudyReminderEmailTemplate,
  caseStudyCombinedReminderEmailTemplate,
} from "../EmailTemplates/CaseStudyEmailTemplate/CaseStudyAssignmentEmailTemplate.js";

/**
 * Schedules a reminder for a case study task to be sent 1 hour before the start time
 * @param {Object} reminderData - Object containing necessary data for the reminder
 * @param {Date} startTime - When the task starts
 * @param {String} taskType - "Fact Finding", "Analysis", or "Combined"
 */
export function scheduleCaseStudyReminder(reminderData, startTime, taskType) {
  const { userIds, emails, names, caseStudyTitle, className, classSubject } =
    reminderData;

  // Convert startTime to IST (UTC+5:30)
  const istStartTime = new Date(startTime);
  istStartTime.setMinutes(istStartTime.getMinutes() + 330); // Add 5 hours 30 minutes

  // Calculate when to send the reminder (1 hour before start time)
  const reminderTime = new Date(istStartTime);
  reminderTime.setHours(reminderTime.getHours() - 1);

  // Current time in IST for comparison
  const now = new Date();
  const istNow = new Date(now.getTime() + 330 * 60000); // Convert current time to IST

  // If the reminder time is in the past, return early without scheduling
  if (reminderTime <= istNow) {
    console.log(
      `Skipping reminder for ${caseStudyTitle} - reminder time already passed`
    );
    return;
  }

  // Calculate the delay in milliseconds
  const delay = reminderTime.getTime() - now.getTime();

  console.log(
    `Scheduling reminder for ${caseStudyTitle} - ${taskType} - Delay: ${Math.round(
      delay / 60000
    )} minutes`
  );

  // Schedule the reminder
  setTimeout(() => {
    try {
      // Format the time in IST
      const formattedISTStartTime = new Date(istStartTime).toLocaleString(
        "en-US",
        {
          timeZone: "Asia/Kolkata",
        }
      );

      sendReminders(reminderData, formattedISTStartTime, taskType);
      console.log(`Sent reminders for ${caseStudyTitle} - ${taskType}`);
    } catch (error) {
      console.error(`Error sending reminders for ${caseStudyTitle}:`, error);
    }
  }, delay);
}

/**
 * Sends emails and notifications for a case study reminder
 */
async function sendReminders(reminderData, formattedStartTime, taskType) {
  const { userIds, emails, names, caseStudyTitle, className, classSubject } =
    reminderData;

  // Loop through all recipients
  for (let i = 0; i < userIds.length; i++) {
    const userId = userIds[i];
    const email = emails[i];
    const name = names[i];

    try {
      // Send notification
      const notificationMessage = `Reminder: Your case study ${
        taskType === "Combined"
          ? "tasks (Fact Finding & Analysis)"
          : `${taskType} task`
      } for "${caseStudyTitle}" in class "${className}" starts soon at ${formattedStartTime}.`;

      await InsertNotificationHandler(
        userId,
        InfoMsg,
        `Case Study ${taskType} Reminder`,
        notificationMessage
      );

      // Send email
      let emailData;
      if (taskType === "Combined") {
        emailData = caseStudyCombinedReminderEmailTemplate(
          email,
          name,
          caseStudyTitle,
          className,
          classSubject,
          formattedStartTime
        );
      } else {
        emailData = caseStudyReminderEmailTemplate(
          email,
          name,
          caseStudyTitle,
          className,
          classSubject,
          formattedStartTime,
          taskType
        );
      }

      await sendEmail(emailData);
    } catch (error) {
      console.error(`Error sending reminder to ${email}:`, error);
    }
  }
}
