import dotenv from "dotenv";
import sql from "mssql";
import config from "../Config/dbConfig.js";
import { InsertNotificationQuery } from "../SQLQueries/NotificationQuery.js";

export async function InsertNotificationHandler(
  userId,
  type,
  heading,
  message
) {
  const successNotification = "True";
  const errorNotification = "False";

  // Validate userId - prevent foreign key violations
  if (!userId) {
    console.error("Error inserting notification: No user ID provided");
    return errorNotification;
  }

  try {
    // Connect to the database
    const db = await sql.connect(config);

    // Check if the provided ID is a faculty_dtls_id rather than a user_dtls_id
    // This helps prevent the common mistake of passing faculty_dtls_id instead of user_dtls_id
    if (userId) {
      const checkFacultyRequest = new sql.Request(db);
      checkFacultyRequest.input("facultyId", sql.Int, userId);
      const facultyCheck = await checkFacultyRequest.query(`
        SELECT faculty_user_dtls_id
        FROM faculty_dtls
        WHERE faculty_dtls_id = @facultyId
      `);

      // If this is a faculty ID and not a user ID, get the associated user ID instead
      if (facultyCheck.recordset && facultyCheck.recordset.length > 0) {
        userId = facultyCheck.recordset[0].faculty_user_dtls_id;
        console.log(`Converted faculty ID to user ID: ${userId}`);
      }
    }

    // Now verify the user exists in users_dtls table
    const verifyUserRequest = new sql.Request(db);
    verifyUserRequest.input("userId", sql.Int, userId);
    const userExists = await verifyUserRequest.query(`
      SELECT COUNT(*) as userCount 
      FROM users_dtls 
      WHERE user_dtls_id = @userId
    `);

    if (!userExists.recordset[0].userCount) {
      console.error(
        `Error inserting notification: User ID ${userId} does not exist in users_dtls table`
      );
      return errorNotification;
    }

    // Create a new SQL request
    const request = new sql.Request(db);
    // Add input parameters to the request
    request.input("notificationUserDtlsId", sql.Int, userId);
    request.input("notificationType", sql.VarChar(50), type);
    request.input("notificationHeading", sql.VarChar(255), heading);
    request.input("notificationMessage", sql.Text, message);
    // Execute the query
    const result = await request.query(InsertNotificationQuery);
    // Return success if the query was executed successfully
    if (result) {
      console.log(`Notification sent successfully to user ID: ${userId}`);
      return successNotification;
    }
    return errorNotification;
  } catch (error) {
    console.error("Error inserting notification:", error);
    return errorNotification;
  }
}
