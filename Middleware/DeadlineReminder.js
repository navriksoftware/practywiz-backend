import sql from "mssql";
import config from "../Config/dbConfig.js";
import { InsertNotificationHandler } from "./NotificationFunction.js";
import {
  WarningMsg,
  CaseDeadlineReminderHeading,
  CaseDeadlineReminderMessage,
} from "../Messages/Messages.js";

/**
 * Check for upcoming case study deadlines and send notifications to faculty
 * This function checks for case deadlines that are approaching within the next 24 hours
 * and sends notifications to the faculty members
 */
export async function checkCaseDeadlines() {
  try {
    console.log("Running deadline check...");
    // Connect to database
    const pool = await sql.connect(config);

    // First, check if the notification_sent column exists, if not we'll need to skip that filter
    const columnCheckRequest = pool.request();
    const columnCheckResult = await columnCheckRequest.query(`
      SELECT COUNT(*) as columnExists
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'faculty_case_assign_dtls'
      AND COLUMN_NAME = 'faculty_case_assign_notification_sent'
    `);

    const notificationColumnExists =
      columnCheckResult.recordset[0].columnExists > 0;
    console.log(`Notification column exists: ${notificationColumnExists}`);

    // Get current date and time
    const currentDate = new Date();

    // Get date 24 hours from now
    const reminderDate = new Date(currentDate);
    reminderDate.setHours(reminderDate.getHours() + 24); // Query to find assignments with deadlines in the next 24 hours
    const request = pool.request();
    request.input("currentDate", sql.DateTime, currentDate);
    request.input("reminderDate", sql.DateTime, reminderDate);
    // Check if the case study ID column exists in faculty_case_assign_dtls
    const caseColumnCheckRequest = pool.request();
    const caseColumnCheckResult = await caseColumnCheckRequest.query(`
      SELECT COUNT(*) as columnExists
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'faculty_case_assign_dtls'
      AND COLUMN_NAME = 'faculty_case_assign_case_study_id'
    `);

    const caseColumnExists =
      caseColumnCheckResult.recordset[0].columnExists > 0;
    console.log(`Case study column exists: ${caseColumnExists}`);
    // Check if owned_by_practywiz column exists
    const ownedByColumnCheckRequest = pool.request();
    const ownedByColumnCheckResult = await ownedByColumnCheckRequest.query(`
      SELECT COUNT(*) as columnExists
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'faculty_case_assign_dtls'
      AND COLUMN_NAME = 'faculty_case_assign_owned_by_practywiz'
    `);

    const ownedByColumnExists =
      ownedByColumnCheckResult.recordset[0].columnExists > 0;
    console.log(`Owned by practywiz column exists: ${ownedByColumnExists}`);

    // Modify query based on schema availability
    let query = `
      SELECT 
        fca.faculty_case_assign_dtls_id,
        fca.faculty_case_assign_faculty_dtls_id AS faculty_id,
        fca.faculty_case_assign_end_date AS deadline,
        fca.faculty_case_assign_class_dtls_id AS class_id
    `;

    // Add case study ID column if it exists
    if (caseColumnExists) {
      query += `, fca.faculty_case_assign_case_study_id AS case_id`;
    }

    // Add owned by practywiz column if it exists
    if (ownedByColumnExists) {
      query += `, fca.faculty_case_assign_owned_by_practywiz AS owned_by_practywiz`;
    }

    query += `
      FROM 
        faculty_case_assign_dtls fca
      JOIN 
        faculty_dtls fd ON fca.faculty_case_assign_faculty_dtls_id = fd.faculty_dtls_id
      JOIN 
        class_dtls c ON fca.faculty_case_assign_class_dtls_id = c.class_dtls_id
      WHERE 
        fca.faculty_case_assign_end_date > @currentDate 
        AND fca.faculty_case_assign_end_date < @reminderDate
    `;

    // Add notification check only if the column exists
    if (notificationColumnExists) {
      query += ` AND fca.faculty_case_assign_notification_sent = 0`;
    }
    const result = await request.query(query);
    // If any deadlines are found, send notifications
    if (result.recordset && result.recordset.length > 0) {
      console.log(`Found ${result.recordset.length} upcoming deadlines`);

      // Process each deadline
      for (const assignment of result.recordset) {
        try {
          // First get the faculty user ID from faculty_dtls table
          const facultyUserRequest = pool.request();
          facultyUserRequest.input("facultyId", sql.Int, assignment.faculty_id);
          facultyUserRequest.input("classId", sql.Int, assignment.class_id);
          const facultyResult = await facultyUserRequest.query(`
            SELECT fd.faculty_user_dtls_id, c.class_name
            FROM faculty_dtls fd
            JOIN class_dtls c ON c.class_dtls_id = @classId
            WHERE fd.faculty_dtls_id = @facultyId
          `);

          if (
            !facultyResult.recordset ||
            facultyResult.recordset.length === 0
          ) {
            console.log(
              `Could not find faculty user for ID: ${assignment.faculty_id}`
            );
            continue;
          }

          const userId = facultyResult.recordset[0].faculty_user_dtls_id;
          const className = facultyResult.recordset[0].class_name; // Get case study name if case ID is available
          let caseName = "a case study";
          if (assignment.case_id) {
            try {
              // Check for owned_by_practywiz to determine which table to query
              const isOwnedByPractywiz =
                assignment.owned_by_practywiz === 1 ||
                assignment.owned_by_practywiz === true;
              const caseRequest = pool.request();
              caseRequest.input("caseId", sql.Int, assignment.case_id);

              let caseResult;
              if (isOwnedByPractywiz) {
                caseResult = await caseRequest.query(`
                  SELECT cs.case_study_title
                  FROM case_study_details cs
                  WHERE cs.case_study_id = @caseId
                `);
              } else {
                caseResult = await caseRequest.query(`
                  SELECT non_practywiz_case_title as case_study_title
                  FROM non_practywiz_case_dtls
                  WHERE non_practywiz_case_dtls_id = @caseId
                `);
              }

              if (caseResult.recordset && caseResult.recordset.length > 0) {
                caseName = `the case "${caseResult.recordset[0].case_study_title}"`;
              }
            } catch (caseError) {
              console.error("Error getting case study details:", caseError);
            }
          }

          // Create a custom message with the available details
          const customMessage = `You have a deadline approaching for ${caseName} in class "${className}". The deadline is set for ${new Date(
            assignment.deadline
          ).toLocaleString()}.`;

          // Send notification to the user ID, not the faculty ID
          await InsertNotificationHandler(
            userId,
            WarningMsg,
            CaseDeadlineReminderHeading,
            customMessage
          );

          // Mark notification as sent if column exists
          if (notificationColumnExists) {
            const updateRequest = pool.request();
            updateRequest.input(
              "id",
              sql.Int,
              assignment.faculty_case_assign_dtls_id
            );
            await updateRequest.query(`
              UPDATE faculty_case_assign_dtls 
              SET faculty_case_assign_notification_sent = 1 
              WHERE faculty_case_assign_dtls_id = @id
            `);
          }

          console.log(
            `Sent deadline reminder notification to faculty user ID: ${userId}`
          );
        } catch (notifError) {
          console.error(
            `Error sending notification for assignment ID ${assignment.faculty_case_assign_dtls_id}:`,
            notifError
          );
        }
      }
    } else {
      console.log("No upcoming deadlines found");
    }
  } catch (error) {
    console.error("Error checking for deadlines:", error);
  }
}

// Function to initialize the scheduler
export function initDeadlineReminders() {
  // Check immediately on startup
  checkCaseDeadlines();

  // Schedule checks every hour
  setInterval(checkCaseDeadlines, 3600000); // 3600000 ms = 1 hour

  console.log("Deadline reminder scheduler initialized");
}
