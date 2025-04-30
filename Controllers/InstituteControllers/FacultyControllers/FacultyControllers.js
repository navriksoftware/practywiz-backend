// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import sql from "mssql";
// import config from "../../../Config/dbConfig.js";
// import dotenv from "dotenv";
// // import { sendEmail } from "../../Middleware/AllFunctions.js";
// import moment from "moment";
// import {
//   createClassQuery,
//   fetchFacultyClassQuery,
//   fetchFacultySingleClassQuery,
//   fetchFacultySingleDashboardQuery,
//   MenteeRegisterByFacultyQuery,
// } from "../../../SQLQueries/Institute/FacultySqlQueries.js";
// import { userDtlsQuery } from "../../../SQLQueries/MentorSQLQueries.js";

// dotenv.config();

// export async function fetchFacultyDetailsDashboard(req, res, next) {
//   const { FacultyUserId } = req.body;
//   console.log(FacultyUserId);
//   try {
//     sql.connect(config, (err, db) => {
//       if (err) {
//         console.log(err.message);
//         return res.json({ error: err.message });
//       }
//       const request = new sql.Request();
//       request.input("FacultyUserId", sql.Int, FacultyUserId);
//       request.query(fetchFacultySingleDashboardQuery, (err, result) => {
//         if (err) return res.json({ error: err.message });
//         if (result) {
//           return res.status(200).json({ success: result.recordset });
//         }
//       });
//     });
//   } catch (error) {}
// }
// export async function CreateClass(req, res) {
//   console.log("CreateClass API called");
//   const { Name, SubjectCode, SubjectName, SemisterEnd, facultyId } = req.body;
//   console.log("Request body:", req.body);

//   try {
//     sql.connect(config, (err, db) => {
//       if (err) {
//         return res.json({
//           error: err.message,
//         });
//       }
//       if (db) {
//         const request = new sql.Request();
//         request.input("class_name", sql.VarChar, Name);
//         request.input("subject_code", sql.VarChar, SubjectCode);
//         request.input("subject_name", sql.VarChar, SubjectName);
//         request.input("semister_end", sql.Date, SemisterEnd);
//         request.input("faculty_id", sql.Int, facultyId);

//         request.query(createClassQuery, (err, result) => {
//           if (err) {
//             console.log("Error in query execution:", err);
//             return res.json({
//               error: err.message,
//             });
//           } else {
//             console.log("Class created successfully:", result);
//             return res.status(200).json({
//               message: "Class created successfully",
//             });
//           }
//         });
//       }
//     });
//   } catch (error) {
//     return res.json({
//       error: error.message,
//     });
//   }
// }

// export async function fetchFacultyclassDetails(req, res, next) {
//   const { FacultyUserId } = req.body;
//   console.log(FacultyUserId);
//   try {
//     sql.connect(config, (err, db) => {
//       if (err) {
//         console.log(err.message);
//         return res.json({ error: err.message });
//       }
//       const request = new sql.Request();
//       request.input("FacultyUserId", sql.Int, FacultyUserId);
//       request.query(fetchFacultyClassQuery, (err, result) => {
//         if (err) return res.json({ error: err.message });
//         if (result) {
//           return res.status(200).json({ success: result.recordset });
//         }
//       });
//     });
//   } catch (error) {}
// }
// export async function fetchFacultySingleclassDetails(req, res, next) {
//   const { singleClassId } = req.body;
//   console.log(singleClassId);
//   try {
//     sql.connect(config, (err, db) => {
//       if (err) {
//         console.log(err.message);
//         return res.json({ error: err.message });
//       }
//       const request = new sql.Request();
//       request.input("single_classId", sql.Int, singleClassId);
//       request.query(fetchFacultySingleClassQuery, (err, result) => {
//         if (err) return res.json({ error: err.message });
//         if (result) {
//           return res.status(200).json({ success: result.recordset });
//         }
//       });
//     });
//   } catch (error) {}
// }

// // Bulk registration of mentees
// export async function BulkMenteeRegistration(req, res, next) {
//   try {
//     // Get JSON data from request body
//     const { students, instituteName, classId } = req.body;

//     if (!students || !Array.isArray(students) || students.length === 0) {
//       return res
//         .status(400)
//         .json({ error: "No student data provided or invalid format" });
//     }
//     if (!classId) {
//       return res.status(400).json({ error: "Class ID is required" });
//     }
//     console.log("BulkMenteeRegistration API called", students, instituteName);

//     // Connect to SQL server
//     const pool = await sql.connect(config);

//     // Track registration results
//     const results = {
//       successful: [],
//       failed: [],
//     };

//     // Process each student record
//     for (const student of students) {
//       // Create a transaction for each student
//       const transaction = new sql.Transaction(pool);

//       try {
//         // Start transaction
//         await transaction.begin();

//         // Extract student data from JSON
//         const rollNumber = student["Roll Number"];
//         const fullName = student["Name"];
//         // Split full name into first and last name
//         const nameParts = fullName.split(" ");
//         const firstName = nameParts[0];
//         const lastName =
//           nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
//         const email = student["Email Id"];
//         const phoneNumber = student["Phone Number"].toString();

//         // Create default password (firstname@1234)
//         const defaultPassword = `${firstName.charAt(0).toUpperCase()}${firstName
//           .slice(1)
//           .toLowerCase()}@1234`;

//         // Check if email already exists
//         const checkEmailRequest = new sql.Request(transaction);
//         checkEmailRequest.input("email", sql.VarChar, email.toLowerCase());
//         const emailCheckResult = await checkEmailRequest.query(
//           "select user_email from users_dtls where user_email = @email"
//         );

//         if (emailCheckResult.recordset.length > 0) {
//           results.failed.push({
//             rollNumber,
//             name: fullName,
//             email,
//             reason: "Email already exists",
//           });
//           await transaction.rollback();
//           continue;
//         }

//         // Hash password
//         const saltRounds = await bcrypt.genSalt(12);
//         const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

//         // Prepare mentee data
//         const timestamp = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
//         const menteeInstituteDetails = [
//           {
//             mentee_courseName: "",
//             mentee_instituteName: instituteName || "",
//             mentee_institute_End_Year: "",
//             mentee_institute_Start_Year: "",
//             mentee_institute_location: "",
//           },
//         ];

//         // Insert user details - Using transaction
//         const userRequest = new sql.Request(transaction);
//         userRequest.input("user_email", sql.VarChar, email.toLowerCase());
//         userRequest.input("user_pwd", sql.VarChar, hashedPassword);
//         userRequest.input("user_firstname", sql.VarChar, firstName);
//         userRequest.input("user_lastname", sql.VarChar, lastName);
//         userRequest.input("user_phone_number", sql.VarChar, phoneNumber);
//         userRequest.input("user_status", sql.VarChar, "1");
//         userRequest.input("user_modified_by", sql.VarChar, "Admin");
//         userRequest.input("user_type", sql.VarChar, "mentee");
//         userRequest.input("user_is_superadmin", sql.VarChar, "0");
//         userRequest.input("user_logindate", sql.Date, timestamp);
//         userRequest.input("user_logintime", sql.Date, timestamp);
//         userRequest.input("user_token", sql.VarChar, "");

//         const userResult = await userRequest.query(userDtlsQuery);

//         if (
//           userResult &&
//           userResult.recordset &&
//           userResult.recordset.length > 0
//         ) {
//           const userDtlsId = userResult.recordset[0].user_dtls_id;
//           console.log("User details inserted successfully:", userDtlsId);

//           // Insert mentee details - Using transaction
//           const menteeRequest = new sql.Request(transaction);
//           menteeRequest.input("menteeUserDtlsId", sql.Int, userDtlsId);
//           menteeRequest.input("menteeAbout", sql.VarChar, "");
//           menteeRequest.input("menteeSkills", sql.Text, "[]");
//           menteeRequest.input("menteeGender", sql.VarChar, "");
//           menteeRequest.input("menteeType", sql.VarChar, "Student");
//           menteeRequest.input(
//             "menteeProfilePic",
//             sql.VarChar,
//             "https://practiwizstorage.blob.core.windows.net/practiwizcontainer/blue-circle-with-white-user_78370-4707.webp"
//           );
//           menteeRequest.input(
//             "menteeInstitute",
//             sql.Text,
//             JSON.stringify(menteeInstituteDetails)
//           );
//           menteeRequest.input("menteeRollNumber", sql.VarChar, rollNumber);

//           const menteeResult = await menteeRequest.query(
//             MenteeRegisterByFacultyQuery
//           );
//           if (
//             menteeResult &&
//             menteeResult.recordset &&
//             menteeResult.recordset.length > 0
//           ) {
//             const menteeDtlsId = menteeResult.recordset[0].mentee_dtls_id;
//             console.log(
//               "Mentee details inserted successfully:",
//               menteeResult.recordset[0].mentee_dtls_id
//             );

//             // Insert mentee-class mapping - Using transaction
//             const menteeClassRequest = new sql.Request(transaction);
//             menteeClassRequest.input("menteeId", sql.Int, menteeDtlsId);
//             menteeClassRequest.input("classId", sql.Int, classId);
//             await menteeClassRequest.query(
//               `INSERT INTO [dbo].[class_mentee_mapping] (mentee_dtls_id, class_dtls_id) VALUES (@menteeId, @classId)`
//             );
//           }
//           // If we've reached here, both operations were successful
//           // Commit the transaction
//           await transaction.commit();

//           // Send notifications - outside transaction as these are non-critical
//           // await InsertNotificationHandler(
//           //   userDtlsId,
//           //   SuccessMsg,
//           //   AccountCreatedHeading,
//           //   AccountCreatedMessage
//           // );

//           // // Send email
//           // const msg = accountCreatedEmailTemplate(
//           //   email.toLowerCase(),
//           //   `${firstName} ${lastName}`,
//           //   defaultPassword
//           // );

//           // const emailResponse = await sendEmail(msg);

//           // // Send WhatsApp message
//           // sendWhatsAppMessage(
//           //   phoneNumber,
//           //   firstName,
//           //   "mentee_acct_create_success"
//           // );

//           results.successful.push({
//             rollNumber,
//             name: fullName,
//             email,
//             password: defaultPassword,
//           });
//         } else {
//           // User insert didn't return expected results
//           await transaction.rollback();
//           throw new Error("Failed to insert user details");
//         }
//       } catch (studentError) {
//         // If any error occurs, roll back the transaction
//         try {
//           await transaction.rollback();
//         } catch (rollbackError) {
//           console.error("Error during transaction rollback:", rollbackError);
//         }

//         console.error(
//           `Error registering student: ${student["Name"]}`,
//           studentError
//         );
//         results.failed.push({
//           rollNumber: student["Roll Number"],
//           name: student["Name"],
//           email: student["Email Id"],
//           reason: studentError.message,
//         });
//       }
//     }

//     // Return results summary
//     return res.json({
//       success: `Successfully registered ${results.successful.length} mentees`,
//       failed: results.failed.length > 0 ? results.failed : undefined,
//       registered: results.successful,
//     });
//   } catch (error) {
//     console.error("Bulk registration error:", error);
//     return res.status(500).json({ error: "Failed to process student data" });
//   }
// }

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "mssql";
import config from "../../../Config/dbConfig.js";
import dotenv from "dotenv";
// import { sendEmail } from "../../Middleware/AllFunctions.js";
import moment from "moment";
import {
  createClassQuery,
  fetchFacultyClassQuery,
  fetchFacultySingleClassQuery,
  fetchFacultySingleDashboardQuery, fetchFacultySingleClassUpdateQuery,
  fetchStudentListofClassQuery,
  MenteeRegisterByFacultyQuery,
  AvailableCaseStudiesForfacultyQuery,
  insertNonPractywizCaseStudyQuery,
  getNonPractywizCaseStudiesByFacultyQuery
} from "../../../SQLQueries/Institute/FacultySqlQueries.js";
import { userDtlsQuery } from "../../../SQLQueries/MentorSQLQueries.js";

dotenv.config();

// Create a connection pool to be reused across functions
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

// Global error handler for database connection
poolConnect.catch((err) => {
  console.error("Error connecting to database:", err);
});

export async function fetchFacultyDetailsDashboard(req, res, next) {
  const { FacultyUserId } = req.body;
  console.log("Fetching faculty details for userId:", FacultyUserId);

  if (!FacultyUserId) {
    return res.status(400).json({ error: "FacultyUserId is required" });
  }

  try {
    await poolConnect; // Ensure pool is connected

    const request = pool.request();
    request.input("FacultyUserId", sql.Int, FacultyUserId);

    const result = await request.query(fetchFacultySingleDashboardQuery);

    if (result && result.recordset) {
      return res.status(200).json({ success: result.recordset });
    } else {
      return res.status(404).json({ error: "No data found" });
    }
  } catch (error) {
    console.error("Error in fetchFacultyDetailsDashboard:", error.message);
    return res.status(500).json({ error: error.message });
  }
}

export async function CreateClass(req, res) {
  console.log("CreateClass API called");
  const { Name, SubjectCode, SubjectName, SemisterEnd, facultyId } = req.body;
  console.log("Request body:", req.body);

  // Input validation
  if (!Name || !SubjectCode || !SubjectName || !SemisterEnd || !facultyId) {
    return res.status(400).json({
      error: "Missing required fields",
    });
  }

  try {
    await poolConnect; // Ensure pool is connected

    const request = pool.request();
    request.input("class_name", sql.VarChar, Name);
    request.input("subject_code", sql.VarChar, SubjectCode);
    request.input("subject_name", sql.VarChar, SubjectName);
    request.input("semister_end", sql.Date, SemisterEnd);
    request.input("faculty_id", sql.Int, facultyId);

    const result = await request.query(createClassQuery);

    console.log("Class created successfully");
    return res.status(200).json({
      message: "Class created successfully",
    });
  } catch (error) {
    console.error("Error in CreateClass:", error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
}

export async function fetchFacultyclassDetails(req, res, next) {
  const { FacultyUserId } = req.body;
  console.log("Fetching faculty class details for userId:", FacultyUserId);

  if (!FacultyUserId) {
    return res.status(400).json({ error: "FacultyUserId is required" });
  }

  try {
    await poolConnect; // Ensure pool is connected

    const request = pool.request();
    request.input("FacultyUserId", sql.Int, FacultyUserId);

    const result = await request.query(fetchFacultyClassQuery);

    if (result && result.recordset) {
      return res.status(200).json({ success: result.recordset });
    } else {
      return res.status(404).json({ error: "No classes found" });
    }
  } catch (error) {
    console.error("Error in fetchFacultyclassDetails:", error.message);
    return res.status(500).json({ error: error.message });
  }
}

export async function fetchFacultySingleclassDetails(req, res, next) {
  const { singleClassId } = req.body;
  console.log("Fetching single class details for classId:", singleClassId);

  if (!singleClassId) {
    return res.status(400).json({ error: "singleClassId is required" });
  }

  try {
    await poolConnect; // Ensure pool is connected

    const request = pool.request();
    request.input("single_classId", sql.Int, singleClassId);

    const result = await request.query(fetchFacultySingleClassQuery);

    if (result && result.recordset) {
      return res.status(200).json({ success: result.recordset });
    } else {
      return res.status(404).json({ error: "Class not found" });
    }
  } catch (error) {
    console.error("Error in fetchFacultySingleclassDetails:", error.message);
    return res.status(500).json({ error: error.message });
  }
}

export async function fetchStudentListofClass(req, res, next) {
  const { classId } = req.body;
  console.log("Fetching student list for classId:", classId);
  if (!classId) {
    return res.status(400).json({ error: "classId is required" });
  }
  try {
    await poolConnect; // Ensure pool is connected
    const request = pool.request();
    request.input("classId", sql.Int, classId);
    const result = await request.query(fetchStudentListofClassQuery);
    if (result && result.recordset && result.recordset.length > 0) {
      return res.status(200).json({ success: result.recordset });
    } else {
      return res.status(404).json({ error: "No students found" });
    }
  } catch (error) {
    console.error("Error in fetchStudentListofClass:", error.message);
    return res.status(500).json({ error: error.message });
  }
}

// Bulk registration of mentees old backup with mentee already exist case not hndled
// export async function BulkMenteeRegistration(req, res, next) {
//   try {
//     // Get JSON data from request body
//     const { students, instituteName, classId } = req.body;

//     if (!students || !Array.isArray(students) || students.length === 0) {
//       return res
//         .status(400)
//         .json({ error: "No student data provided or invalid format" });
//     }
//     if (!classId) {
//       return res.status(400).json({ error: "Class ID is required" });
//     }
//     console.log(
//       "BulkMenteeRegistration API called with",
//       students.length,
//       "students"
//     );

//     // Connect to SQL server
//     await poolConnect; // Ensure pool is connected

//     // Track registration results
//     const results = {
//       successful: [],
//       failed: [],
//     };

//     // Process each student record
//     for (const student of students) {
//       // Create a transaction for each student
//       const transaction = new sql.Transaction(pool);

//       try {
//         // Start transaction
//         await transaction.begin();

//         // Extract student data from JSON
//         const rollNumber = student["Roll Number"];
//         const fullName = student["Name"];

//         if (!rollNumber || !fullName) {
//           throw new Error("Missing required student data");
//         }

//         // Split full name into first and last name
//         const nameParts = fullName.split(" ");
//         const firstName = nameParts[0];
//         const lastName =
//           nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
//         const email = student["Email Id"];

//         if (!email) {
//           throw new Error("Email is required");
//         }

//         const phoneNumber = student["Phone Number"]
//           ? student["Phone Number"].toString()
//           : "";

//         // Create default password (firstname@1234)
//         const defaultPassword = `${firstName.charAt(0).toUpperCase()}${firstName
//           .slice(1)
//           .toLowerCase()}@1234`;

//         // Check if email already exists
//         const checkEmailRequest = new sql.Request(transaction);
//         checkEmailRequest.input("email", sql.VarChar, email.toLowerCase());
//         const emailCheckResult = await checkEmailRequest.query(
//           "SELECT user_email FROM users_dtls WHERE user_email = @email"
//         );

//         if (emailCheckResult.recordset.length > 0) {
//           results.failed.push({
//             rollNumber,
//             name: fullName,
//             email,
//             reason: "Email already exists",
//           });
//           await transaction.rollback();
//           continue;
//         }

//         // Hash password
//         const saltRounds = 12;
//         const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

//         // Prepare mentee data
//         const timestamp = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
//         const menteeInstituteDetails = [
//           {
//             mentee_courseName: "",
//             mentee_instituteName: instituteName || "",
//             mentee_institute_End_Year: "",
//             mentee_institute_Start_Year: "",
//             mentee_institute_location: "",
//           },
//         ];

//         // Insert user details - Using transaction
//         const userRequest = new sql.Request(transaction);
//         userRequest.input("user_email", sql.VarChar, email.toLowerCase());
//         userRequest.input("user_pwd", sql.VarChar, hashedPassword);
//         userRequest.input("user_firstname", sql.VarChar, firstName);
//         userRequest.input("user_lastname", sql.VarChar, lastName);
//         userRequest.input("user_phone_number", sql.VarChar, phoneNumber);
//         userRequest.input("user_status", sql.VarChar, "1");
//         userRequest.input("user_modified_by", sql.VarChar, "Admin");
//         userRequest.input("user_type", sql.VarChar, "mentee");
//         userRequest.input("user_is_superadmin", sql.VarChar, "0");
//         userRequest.input("user_logindate", sql.DateTime, timestamp);
//         userRequest.input("user_logintime", sql.DateTime, timestamp);
//         userRequest.input("user_token", sql.VarChar, "");

//         const userResult = await userRequest.query(userDtlsQuery);

//         if (
//           userResult &&
//           userResult.recordset &&
//           userResult.recordset.length > 0
//         ) {
//           const userDtlsId = userResult.recordset[0].user_dtls_id;
//           console.log("User details inserted successfully:", userDtlsId);

//           // Insert mentee details - Using transaction
//           const menteeRequest = new sql.Request(transaction);
//           menteeRequest.input("menteeUserDtlsId", sql.Int, userDtlsId);
//           menteeRequest.input("menteeAbout", sql.VarChar, "");
//           menteeRequest.input("menteeSkills", sql.Text, "[]");
//           menteeRequest.input("menteeGender", sql.VarChar, "");
//           menteeRequest.input("menteeType", sql.VarChar, "Student");
//           menteeRequest.input(
//             "menteeProfilePic",
//             sql.VarChar,
//             "https://practiwizstorage.blob.core.windows.net/practiwizcontainer/blue-circle-with-white-user_78370-4707.webp"
//           );
//           menteeRequest.input(
//             "menteeInstitute",
//             sql.Text,
//             JSON.stringify(menteeInstituteDetails)
//           );
//           menteeRequest.input("menteeRollNumber", sql.VarChar, rollNumber);

//           const menteeResult = await menteeRequest.query(
//             MenteeRegisterByFacultyQuery
//           );
//           if (
//             menteeResult &&
//             menteeResult.recordset &&
//             menteeResult.recordset.length > 0
//           ) {
//             const menteeDtlsId = menteeResult.recordset[0].mentee_dtls_id;
//             console.log("Mentee details inserted successfully:", menteeDtlsId);

//             // Insert mentee-class mapping - Using transaction
//             const menteeClassRequest = new sql.Request(transaction);
//             menteeClassRequest.input("menteeId", sql.Int, menteeDtlsId);
//             menteeClassRequest.input("classId", sql.Int, classId);
//             await menteeClassRequest.query(
//               `INSERT INTO [dbo].[class_mentee_mapping] (mentee_dtls_id, class_dtls_id) VALUES (@menteeId, @classId)`
//             );

//             // Commit the transaction
//             await transaction.commit();

//             // Store successful registration
//             results.successful.push({
//               rollNumber,
//               name: fullName,
//               email,
//               password: defaultPassword, // Be careful with this in production
//             });

//             // If you want to implement it, make sure these functions and variables are defined:
//             /*
//             // Send notifications
//             await InsertNotificationHandler(
//               userDtlsId,
//               "Success",  // Replace SuccessMsg
//               "Account Created", // Replace AccountCreatedHeading
//               "Your account has been created successfully" // Replace AccountCreatedMessage
//             );

//             // Send email
//             const msg = accountCreatedEmailTemplate(
//               email.toLowerCase(),
//               `${firstName} ${lastName}`,
//               defaultPassword
//             );
//             const emailResponse = await sendEmail(msg);

//             // Send WhatsApp message
//             sendWhatsAppMessage(
//               phoneNumber,
//               firstName,
//               "mentee_acct_create_success"
//             );
//             */
//           } else {
//             // Mentee insert didn't return expected results
//             await transaction.rollback();
//             throw new Error("Failed to insert mentee details");
//           }
//         } else {
//           // User insert didn't return expected results
//           await transaction.rollback();
//           throw new Error("Failed to insert user details");
//         }
//       } catch (studentError) {
//         // If any error occurs, roll back the transaction
//         try {
//           if (transaction.isActive()) {
//             await transaction.rollback();
//           }
//         } catch (rollbackError) {
//           console.error("Error during transaction rollback:", rollbackError);
//         }

//         console.error(
//           `Error registering student: ${student["Name"]}`,
//           studentError.message
//         );
//         results.failed.push({
//           rollNumber: student["Roll Number"] || "Unknown",
//           name: student["Name"] || "Unknown",
//           email: student["Email Id"] || "Unknown",
//           reason: studentError.message,
//         });
//       }
//     }

//     // Return results summary
//     return res.json({
//       success: `Successfully registered ${results.successful.length} mentees`,
//       failed: results.failed.length > 0 ? results.failed : undefined,
//       registered: results.successful,
//     });
//   } catch (error) {
//     console.error("Bulk registration error:", error);
//     return res.status(500).json({ error: "Failed to process student data" });
//   }
// }

// Bulk registration of mentees with existing user handling
// This function handles the case where the user already exists in the database
// and maps them to a new class if they are a mentee.
// It also handles the case where the user is not a mentee or the mapping already exists.
// It uses transactions to ensure that all database operations are atomic and consistent.
export async function BulkMenteeRegistration(req, res, next) {
  try {
    // Get JSON data from request body
    const { students, instituteName, classId } = req.body;

    if (!students || !Array.isArray(students) || students.length === 0) {
      return res
        .status(400)
        .json({ error: "No student data provided or invalid format" });
    }
    if (!classId) {
      return res.status(400).json({ error: "Class ID is required" });
    }

    // Connect to SQL server
    await poolConnect; // Ensure pool is connected

    // Track registration results
    const results = {
      successful: [],
      failed: [],
      existingMapped: [], // New array to track existing mentees that were mapped
    };

    // Process each student record
    for (const student of students) {
      // Create a transaction for each student
      const transaction = new sql.Transaction(pool);

      try {
        // Start transaction
        await transaction.begin();

        // Extract student data from JSON
        // Ensure rollNumber is a string
        const rollNumber = student["Roll Number"]
          ? student["Roll Number"].toString()
          : "";
        const fullName = student["Name"];

        if (!rollNumber || !fullName) {
          throw new Error("Missing required student data");
        }

        // Split full name into first and last name
        const nameParts = fullName.split(" ");
        const firstName = nameParts[0];
        const lastName =
          nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
        const email = student["Email Id"];

        if (!email) {
          throw new Error("Email is required");
        }

        const phoneNumber = student["Phone Number"]
          ? student["Phone Number"].toString()
          : "";

        // Create default password (Firstname@12345)
        const defaultPassword = `${firstName.charAt(0).toUpperCase()}${firstName
          .slice(1)
          .toLowerCase()}@12345`;

        // Check if email already exists
        const checkEmailRequest = new sql.Request(transaction);
        checkEmailRequest.input("email", sql.VarChar, email.toLowerCase());
        const emailCheckResult = await checkEmailRequest.query(
          "SELECT user_dtls_id, user_type FROM users_dtls WHERE user_email = @email"
        );

        // If user exists, check if they're a mentee
        if (emailCheckResult.recordset.length > 0) {
          const existingUser = emailCheckResult.recordset[0];

          // If user is a mentee, get their mentee ID and map to class
          if (existingUser.user_type === "mentee") {
            // Get mentee_dtls_id for the existing user
            const menteeCheckRequest = new sql.Request(transaction);
            menteeCheckRequest.input(
              "userDtlsId",
              sql.Int,
              existingUser.user_dtls_id
            );
            const menteeResult = await menteeCheckRequest.query(
              "SELECT mentee_dtls_id FROM mentee_dtls WHERE mentee_user_dtls_id = @userDtlsId"
            );

            if (menteeResult.recordset.length > 0) {
              const menteeDtlsId = menteeResult.recordset[0].mentee_dtls_id;

              // Check if the mapping already exists
              const checkMappingRequest = new sql.Request(transaction);
              checkMappingRequest.input("menteeId", sql.Int, menteeDtlsId);
              checkMappingRequest.input("classId", sql.Int, classId);
              const mappingResult = await checkMappingRequest.query(
                "SELECT class_mentee_mapping_id FROM class_mentee_mapping WHERE mentee_dtls_id = @menteeId AND class_dtls_id = @classId"
              );

              if (mappingResult.recordset.length === 0) {
                // Mapping doesn't exist, create it
                const menteeClassRequest = new sql.Request(transaction);
                menteeClassRequest.input("menteeId", sql.Int, menteeDtlsId);
                menteeClassRequest.input("classId", sql.Int, classId);
                menteeClassRequest.input(
                  "menteeRollNumber",
                  sql.VarChar,
                  rollNumber
                );
                await menteeClassRequest.query(`
                  INSERT INTO [dbo].[class_mentee_mapping] (mentee_dtls_id, class_dtls_id) 
                  VALUES (@menteeId, @classId)
                `);

                // If you need to update the mentee's roll number
                await menteeClassRequest.query(`
                  UPDATE [dbo].[mentee_dtls] 
                  SET mentee_roll_no = @menteeRollNumber
                  WHERE mentee_dtls_id = @menteeId
                `);

                // Commit the transaction
                await transaction.commit();

                // Add to existingMapped results
                results.existingMapped.push({
                  rollNumber,
                  name: fullName,
                  email,
                  action: "Added to new class",
                });

                continue; // Move to next student
              } else {
                // Mapping already exists
                await transaction.rollback();
                results.failed.push({
                  rollNumber,
                  name: fullName,
                  email,
                  reason: "Already mapped to this class",
                });
                continue; // Move to next student
              }
            }
          }

          // If we get here, user exists but isn't a mentee or couldn't find mentee record
          results.failed.push({
            rollNumber,
            name: fullName,
            email,
            reason:
              "Email already exists but not as a mentee or couldn't get mentee record",
          });
          await transaction.rollback();
          continue;
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

        // Prepare mentee data
        const timestamp = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
        const menteeInstituteDetails = [
          {
            mentee_courseName: "",
            mentee_instituteName: instituteName || "",
            mentee_institute_End_Year: "",
            mentee_institute_Start_Year: "",
            mentee_institute_location: "",
          },
        ];

        // Insert user details - Using transaction
        const userRequest = new sql.Request(transaction);
        userRequest.input("user_email", sql.VarChar, email.toLowerCase());
        userRequest.input("user_pwd", sql.VarChar, hashedPassword);
        userRequest.input("user_firstname", sql.VarChar, firstName);
        userRequest.input("user_lastname", sql.VarChar, lastName);
        userRequest.input("user_phone_number", sql.VarChar, phoneNumber);
        userRequest.input("user_status", sql.VarChar, "1");
        userRequest.input("user_modified_by", sql.VarChar, "Admin");
        userRequest.input("user_type", sql.VarChar, "mentee");
        userRequest.input("user_is_superadmin", sql.VarChar, "0");
        userRequest.input("user_logindate", sql.DateTime, timestamp);
        userRequest.input("user_logintime", sql.DateTime, timestamp);
        userRequest.input("user_token", sql.VarChar, "");

        const userResult = await userRequest.query(userDtlsQuery);

        if (
          userResult &&
          userResult.recordset &&
          userResult.recordset.length > 0
        ) {
          const userDtlsId = userResult.recordset[0].user_dtls_id;
          console.log("User details inserted successfully:", userDtlsId);

          // Insert mentee details - Using transaction
          const menteeRequest = new sql.Request(transaction);
          menteeRequest.input("menteeUserDtlsId", sql.Int, userDtlsId);
          menteeRequest.input("menteeAbout", sql.VarChar, "");
          menteeRequest.input("menteeSkills", sql.Text, "[]");
          menteeRequest.input("menteeGender", sql.VarChar, "");
          menteeRequest.input("menteeType", sql.VarChar, "Student");
          menteeRequest.input(
            "menteeProfilePic",
            sql.VarChar,
            "https://practiwizstorage.blob.core.windows.net/practiwizcontainer/blue-circle-with-white-user_78370-4707.webp"
          );
          menteeRequest.input(
            "menteeInstitute",
            sql.Text,
            JSON.stringify(menteeInstituteDetails)
          );
          menteeRequest.input("menteeRollNumber", sql.VarChar, rollNumber);

          const menteeResult = await menteeRequest.query(
            MenteeRegisterByFacultyQuery
          );
          if (
            menteeResult &&
            menteeResult.recordset &&
            menteeResult.recordset.length > 0
          ) {
            const menteeDtlsId = menteeResult.recordset[0].mentee_dtls_id;
            console.log("Mentee details inserted successfully:", menteeDtlsId);

            // Insert mentee-class mapping - Using transaction
            const menteeClassRequest = new sql.Request(transaction);
            menteeClassRequest.input("menteeId", sql.Int, menteeDtlsId);
            menteeClassRequest.input("classId", sql.Int, classId);
            await menteeClassRequest.query(
              `INSERT INTO [dbo].[class_mentee_mapping] (mentee_dtls_id, class_dtls_id) VALUES (@menteeId, @classId)`
            );

            // Commit the transaction
            await transaction.commit();

            // Store successful registration
            results.successful.push({
              rollNumber,
              name: fullName,
              email,
              password: defaultPassword, // Be careful with this in production
            });

            // If you want to implement it, make sure these functions and variables are defined:
            /*
            // Send notifications
            await InsertNotificationHandler(
              userDtlsId,
              "Success",  // Replace SuccessMsg
              "Account Created", // Replace AccountCreatedHeading
              "Your account has been created successfully" // Replace AccountCreatedMessage
            );

            // Send email
            const msg = accountCreatedEmailTemplate(
              email.toLowerCase(),
              `${firstName} ${lastName}`,
              defaultPassword
            );
            const emailResponse = await sendEmail(msg);

            // Send WhatsApp message
            sendWhatsAppMessage(
              phoneNumber,
              firstName,
              "mentee_acct_create_success"
            );
            */
          } else {
            // Mentee insert didn't return expected results
            await transaction.rollback();
            throw new Error("Failed to insert mentee details");
          }
        } else {
          // User insert didn't return expected results
          await transaction.rollback();
          throw new Error("Failed to insert user details");
        }
      } catch (studentError) {
        // If any error occurs, roll back the transaction
        try {
          if (transaction && typeof transaction.rollback === "function") {
            await transaction.rollback();
          }
        } catch (rollbackError) {
          console.error("Error during transaction rollback:", rollbackError);
        }

        console.error(
          `Error registering student: ${student["Name"]}`,
          studentError.message
        );
        results.failed.push({
          rollNumber: student["Roll Number"] || "Unknown",
          name: student["Name"] || "Unknown",
          email: student["Email Id"] || "Unknown",
          reason: studentError.message,
        });
      }
    }

    // Return results summary
    return res.json({
      success: `Successfully registered ${results.successful.length} mentees and mapped ${results.existingMapped.length} existing mentees to class`,
      failed: results.failed.length > 0 ? results.failed : undefined,
      registered: results.successful,
      existingMapped:
        results.existingMapped.length > 0 ? results.existingMapped : undefined,
    });
  } catch (error) {
    console.error("Bulk registration error:", error);
    return res.status(500).json({ error: "Failed to process student data" });
  }
}

export async function UpdateclassDetails(req, res, next) {
  const { singleClassId, formData } = req.body;
  const { Name,
    SubjectCode,
    SubjectName,
    SemisterEnd,
    } = formData;

  try {
    sql.connect(config, (err, db) => {
      if (err) {
        console.log(err.message);
        return res.json({ error: err.message });
      }
      const request = new sql.Request();
      request.input("single_ClassId", sql.Int, singleClassId);
      request.input("class_name", sql.VarChar, Name);
      request.input("class_subject", sql.VarChar, SubjectName);
      request.input("class_subject_code", sql.VarChar, SubjectCode);
      request.input("class_sem_end_date", sql.Date, SemisterEnd);
      

      request.query(fetchFacultySingleClassUpdateQuery, (err, result) => {
        if (err) return res.json({ error: err.message });
        if (result) {
          return res.status(200).json({
            success: true,
            message: "Class updated successfully",
          });
        }
      });
    });
  } catch (error) {  return res.status(500).json({
    success: false,
    message: "Error updating class",
    error: error.message,
  });}
}


export async function fetchAvailableCaseStudiesForfaculty(req, res, next) {
  const {facultyId} = req.body;
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        console.log(err.message);
        return res.json({ error: err.message });
      }
      const request = new sql.Request();
      request.input("faculty_Id", sql.Int, facultyId);
      request.query(AvailableCaseStudiesForfacultyQuery, (err, result) => {
        if (err) return res.json({ error: err.message });
        if (result) {
          return res.json({ success: result.recordset });
        }
      });
    });
  } catch (error) {  return res.status(500).json({
    success: false,
    message: "Error updating class",
    error: error.message,
  });}
}

// Add Non-Practywiz Case Study
export async function addNonPractywizCaseStudy(req, res) {
  try {
    const { title, author, category, questions, facultyId } = req.body;

    // Input validation
    if (!title || !author || !category || !questions || !facultyId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await poolConnect;
    const request = pool.request();
    request.input("title", sql.VarChar(255), title);
    request.input("author", sql.VarChar(255), author);
    request.input("category", sql.VarChar(255), category);
    request.input("questions", sql.Text, JSON.stringify(questions));
    request.input("facultyId", sql.Int, facultyId);

    await request.query(insertNonPractywizCaseStudyQuery);

    return res.status(200).json({ message: "Case study added successfully" });
  } catch (error) {
    console.error("Error in addNonPractywizCaseStudy:", error.message);
    return res.status(500).json({ error: error.message });
  }
}

// Get Non-Practywiz Case Studies by Faculty
export async function getNonPractywizCaseStudiesByFaculty(req, res) {
  try {
    const { facultyId } = req.body;
    if (!facultyId) {
      return res.status(400).json({ error: "facultyId is required" });
    }

    await poolConnect;
    const request = pool.request();
    request.input("facultyId", sql.Int, facultyId);

    const result = await request.query(getNonPractywizCaseStudiesByFacultyQuery);

    // Parse questions JSON for each record
    const caseStudies = result.recordset.map(cs => ({
      ...cs,
      non_practywiz_case_question: JSON.parse(cs.non_practywiz_case_question)
    }));

    return res.status(200).json({ success: caseStudies });
  } catch (error) {
    console.error("Error in getNonPractywizCaseStudiesByFaculty:", error.message);
    return res.status(500).json({ error: error.message });
  }
}





// Handle cleanup when the process exits
process.on("exit", () => {
  if (pool) {
    pool.close();
  }
});
