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

  try {
    // Connect to the database
    const db = await sql.connect(config);
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
      return successNotification;
    }
    return errorNotification;
  } catch (error) {
    console.error("Error inserting notification:", error);
    return errorNotification;
  }
}
