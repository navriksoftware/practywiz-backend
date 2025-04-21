import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "mssql";
import config from "../../../Config/dbConfig.js";
import dotenv from "dotenv";
// import { sendEmail } from "../../Middleware/AllFunctions.js";
import moment from "moment";
import { createClassQuery, fetchFacultyClassQuery, fetchFacultySingleClassQuery, fetchFacultySingleDashboardQuery } from "../../../SQLQueries/Institute/FacultySqlQueries.js";

dotenv.config();



export async function fetchFacultyDetailsDashboard(req, res, next) {
  const { FacultyUserId } = req.body;
  console.log(FacultyUserId);
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        console.log(err.message);
        return res.json({ error: err.message });
      }
      const request = new sql.Request();
      request.input("FacultyUserId", sql.Int, FacultyUserId);
      request.query(fetchFacultySingleDashboardQuery, (err, result) => {
        if (err) return res.json({ error: err.message });
        if (result) {
          return res.status(200).json({ success: result.recordset });
        }
      });
    });
  } catch (error) {}
}
export async function CreateClass(req, res) {
  console.log("CreateClass API called");
  const { Name,
    SubjectCode,
    SubjectName,
    SemisterEnd,
    facultyId,
   } = req.body;
    console.log("Request body:", req.body);
   
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        return res.json({
          error: err.message,
        });
      }
      if (db) {
        const request = new sql.Request();
        request.input("class_name", sql.VarChar, Name);
        request.input("subject_code", sql.VarChar, SubjectCode);
        request.input("subject_name", sql.VarChar, SubjectName);
        request.input("semister_end", sql.Date, SemisterEnd);
        request.input("faculty_id", sql.Int, facultyId);

        request.query(createClassQuery, (err, result) => {
          if (err) {
            console.log("Error in query execution:", err);
            return res.json({
              error: err.message,
            });
          } else {
            console.log("Class created successfully:", result);
            return res.status(200).json({
              message: "Class created successfully",
              
            });
          }
        });
      }
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
}


export async function fetchFacultyclassDetails(req, res, next) {
  const { FacultyUserId } = req.body;
  console.log(FacultyUserId);
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        console.log(err.message);
        return res.json({ error: err.message });
      }
      const request = new sql.Request();
      request.input("FacultyUserId", sql.Int, FacultyUserId);
      request.query(fetchFacultyClassQuery, (err, result) => {
        if (err) return res.json({ error: err.message });
        if (result) {
          return res.status(200).json({ success: result.recordset });
        }
      });
    });
  } catch (error) {}
}
export async function fetchFacultySingleclassDetails(req, res, next) {
  const { singleClassId } = req.body;
  console.log(singleClassId);
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        console.log(err.message);
        return res.json({ error: err.message });
      }
      const request = new sql.Request();
      request.input("single_classId", sql.Int, singleClassId);
      request.query(fetchFacultySingleClassQuery, (err, result) => {
        if (err) return res.json({ error: err.message });
        if (result) {
          return res.status(200).json({ success: result.recordset });
        }
      });
    });
  } catch (error) {}
}


export async function BulkMenteeRegistration(req, res, next) {
const{formData} = req.body;
  console.log("BulkMenteeRegistration API called", formData.excelFile);

  // try {
  //   // Check if file exists in the request
  //   if (!req.file) {
  //     return res.status(400).json({ error: "Please upload an Excel file" });
  //   }

  //   const excelFile = req.file;
  //   const workbook = xlsx.read(excelFile.buffer, { type: 'buffer' });
  //   const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  //   const jsonData = xlsx.utils.sheet_to_json(worksheet);

  //   if (jsonData.length === 0) {
  //     return res.status(400).json({ error: "Excel file is empty" });
  //   }

  //   // Connect to SQL server
  //   const pool = await sql.connect(config);
    
  //   // Track registration results
  //   const results = {
  //     successful: [],
  //     failed: []
  //   };

  //   // Process each student record
  //   for (const student of jsonData) {
  //     try {
  //       // Extract student data from Excel row
  //       const rollNumber = student['Roll Number'];
  //       const fullName = student['Name'];
  //       // Split full name into first and last name
  //       const nameParts = fullName.split(' ');
  //       const firstName = nameParts[0];
  //       const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
  //       const email = student['Email Id'];
  //       const phoneNumber = student['Phone Number'].toString();
        
  //       // Create default password (firstname@1234)
  //       const defaultPassword = `${firstName.toLowerCase()}@1234`;
        
  //       // Check if email already exists
  //       const checkEmailRequest = new sql.Request(pool);
  //       checkEmailRequest.input("email", sql.VarChar, email.toLowerCase());
  //       const emailCheckResult = await checkEmailRequest.query(
  //         "select user_email from users_dtls where user_email = @email"
  //       );
        
  //       if (emailCheckResult.recordset.length > 0) {
  //         results.failed.push({
  //           rollNumber,
  //           name: fullName,
  //           email,
  //           reason: "Email already exists"
  //         });
  //         continue;
  //       }
        
  //       // Hash password
  //       const saltRounds = await bcrypt.genSalt(12);
  //       const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);
        
  //       // Prepare mentee data
  //       const timestamp = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
  //       const menteeInstituteDetails = [
  //         {
  //           mentee_courseName: "",
  //           mentee_instituteName: req.body.instituteName || "",
  //           mentee_institute_End_Year: "",
  //           mentee_institute_Start_Year: "",
  //           mentee_institute_location: "",
  //         },
  //       ];
        
  //       // Insert user details
  //       const userRequest = new sql.Request(pool);
  //       userRequest.input("user_email", sql.VarChar, email.toLowerCase());
  //       userRequest.input("user_pwd", sql.VarChar, hashedPassword);
  //       userRequest.input("user_firstname", sql.VarChar, firstName);
  //       userRequest.input("user_lastname", sql.VarChar, lastName);
  //       userRequest.input("user_phone_number", sql.VarChar, phoneNumber);
  //       userRequest.input("user_status", sql.VarChar, "1");
  //       userRequest.input("user_modified_by", sql.VarChar, "Admin");
  //       userRequest.input("user_type", sql.VarChar, "mentee");
  //       userRequest.input("user_is_superadmin", sql.VarChar, "0");
  //       userRequest.input("user_logindate", sql.Date, timestamp);
  //       userRequest.input("user_logintime", sql.Date, timestamp);
  //       userRequest.input("user_token", sql.VarChar, "");
        
  //       const userResult = await userRequest.query(userDtlsQuery);
        
  //       if (userResult && userResult.recordset && userResult.recordset.length > 0) {
  //         const userDtlsId = userResult.recordset[0].user_dtls_id;
          
  //         // Insert mentee details
  //         const menteeRequest = new sql.Request(pool);
  //         menteeRequest.input("menteeUserDtlsId", sql.Int, userDtlsId);
  //         menteeRequest.input("menteeAbout", sql.VarChar, "");
  //         menteeRequest.input("menteeSkills", sql.Text, "[]");
  //         menteeRequest.input("menteeGender", sql.VarChar, "");
  //         menteeRequest.input("menteeType", sql.VarChar, "Student");
  //         menteeRequest.input(
  //           "menteeProfilePic",
  //           sql.VarChar,
  //           "https://practiwizstorage.blob.core.windows.net/practiwizcontainer/blue-circle-with-white-user_78370-4707.webp"
  //         );
  //         menteeRequest.input(
  //           "menteeInstitute",
  //           sql.Text,
  //           JSON.stringify(menteeInstituteDetails)
  //         );
          
  //         await menteeRequest.query(MenteeRegisterQuery);
          
  //         // Send notifications
  //         await InsertNotificationHandler(
  //           userDtlsId,
  //           SuccessMsg,
  //           AccountCreatedHeading,
  //           AccountCreatedMessage
  //         );
          
  //         // Send email
  //         const msg = accountCreatedEmailTemplate(
  //           email.toLowerCase(),
  //           `${firstName} ${lastName}`,
  //           defaultPassword
  //         );
          
  //         const emailResponse = await sendEmail(msg);
          
  //         // Send WhatsApp message
  //         sendWhatsAppMessage(
  //           phoneNumber,
  //           firstName,
  //           "mentee_acct_create_success"
  //         );
          
  //         results.successful.push({
  //           rollNumber,
  //           name: fullName,
  //           email,
  //           password: defaultPassword
  //         });
  //       }
  //     } catch (studentError) {
  //       console.error(`Error registering student: ${student['Name']}`, studentError);
  //       results.failed.push({
  //         rollNumber: student['Roll Number'],
  //         name: student['Name'],
  //         email: student['Email Id'],
  //         reason: studentError.message
  //       });
  //     }
  //   }
    
  //   // Return results summary
  //   return res.json({
  //     success: `Successfully registered ${results.successful.length} mentees`,
  //     failed: results.failed.length > 0 ? results.failed : undefined,
  //     registered: results.successful
  //   });
    
  // } catch (error) {
  //   console.error("Bulk registration error:", error);
  //   return res.status(500).json({ error: "Failed to process the Excel file" });
  // }
}

// // Update the email template to include the default password
// export function accountCreatedEmailTemplate(email, name, password) {
//   return {
//     to: email,
//     subject: "Your Mentee Account has been created",
//     html: `
//       <div>
//         <h2>Welcome, ${name}!</h2>
//         <p>Your mentee account has been created successfully.</p>
//         <p>Your login credentials:</p>
//         <ul>
//           <li><strong>Email:</strong> ${email}</li>
//           <li><strong>Password:</strong> ${password}</li>
//         </ul>
//         <p>Please change your password after your first login for security reasons.</p>
//         <p>Thank you for joining our platform!</p>
//       </div>
//     `
//   };
// }

// // You'll need to add this middleware configuration in your routes file
// export const uploadMiddleware = multer({
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB file size limit
//   },
//   storage: multer.memoryStorage()
// });
