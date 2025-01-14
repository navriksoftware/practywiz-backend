import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import sql from "mssql";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import { google } from "googleapis";
import fs, { access } from "fs";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import authRouter from "./Routes/AuthRoutes/AuthRoutes.js";
import mentorRouter from "./Routes/MentorRoutes/MentorRoutes.js";
import mentorBookingRouter from "./Routes/MentorRoutes/MentorBookingRoute.js";
import menteeRoute from "./Routes/MenteeRoutes/MenteeRoutes.js";
import instituteRoute from "./Routes/InstituteRoutes/InstituteRoutes.js";
import mentorDashboardRouter from "./Routes/MentorRoutes/MentorDashboard.js";
import adminDashboardRoute from "./Routes/AdminDashboard/AdminDashboardRoutes.js";
import adminCaseStudiesDashboardRoute from "./Routes/AdminDashboard/AdminDashboardCaseStudiesRoutes.js";
import mentorDashboardUpdateRoute from "./Routes/MentorRoutes/MentorDashboardUpdateRoutes.js";
import menteeDashboardRoute from "./Routes/MenteeRoutes/MenteeDashboardRoutes.js";
import menteeProfileDashboardRoute from "./Routes/MenteeRoutes/MenteeProfileSettings.js";
import caseStudiesRoute from "./Routes/CaseStudies/CaseStudyRoutes.js";
import instituteDashboardRoute from "./Routes/InstituteRoutes/InstituteDashboardRoute.js";
import config from "./Config/dbConfig.js";
import mentorDashboardCaseStudyRouter from "./Routes/MentorRoutes/MentorCaseStudyRoute.js";
import employerRoute from "./Routes/EmployerRoutes/EmployerRoutes.js";
import internshipRoute from "./Routes/EmployerRoutes/InternshipRoutes.js";
import { InsertNotificationHandler } from "./Middleware/NotificationFunction.js";
import { accountCreatedEmailTemplate } from "./EmailTemplates/AccountEmailTemplate/AccountEmailTemplate.js";
import { sendEmail } from "./Middleware/AllFunctions.js";
import { autoApproveFetchAllNotApprovedMentorQuery } from "./SQLQueries/AdminDashboard/AdminSqlQueries.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 1337;

// Middleware to parse JSON bodies
app.use(express.json());

// HTTP request logger
app.use(morgan("common"));

// Parse cookies
app.use(cookieParser());

// Enable CORS
app.use(cors());

// Security middleware
app.use(helmet());

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for handling file uploads using express-fileupload
app.use(
  fileUpload({
    createParentPath: true,
  })
);

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder for uploads (ensure it exists)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to filename
  },
});

const upload = multer({ storage: storage });

// Middleware to handle CORS issues
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Endpoint to check server status
app.get("/", async (req, res) => {
  const time = new Date().getTime();
  const date = new Date().toDateString();
  return res.json({
    success: `The server is working fine on the date ${date} and ${time}`,
  });
});
// Endpoint to check server status
app.get("/test/db-connection", async (req, res) => {
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        return res.json({
          message: "There was an error connecting to database",
          error: err.message,
        });
      }
      if (db) {
        return res.json({ success: "Connected to database successfully" });
      }
    });
  } catch (error) {
    return res.json({
      message: "There was an error connecting to database",
      error: err.message,
    });
  }
});
// razorpay key
app.get("/api/get-razorpay-key", (req, res) => {
  res.send({ key: process.env.RAZORPAY_KEY_ID });
});
// Authentication routes
app.use("/api/v1/auth", authRouter);

// Mentor routes
app.use("/api/v1/mentor", mentorRouter);
app.use("/api/v1/mentor/booking/appointment", mentorBookingRouter);
app.use("/api/v1/mentor/dashboard", mentorDashboardRouter);
app.use("/api/v1/mentor/dashboard/update", mentorDashboardUpdateRoute);
app.use("/api/v1/mentor/dashboard/case-study", mentorDashboardCaseStudyRouter);

// mentee routes
app.use("/api/v1/mentee", menteeRoute);
app.use("/api/v1/mentee/dashboard", menteeDashboardRoute);
app.use("/api/v1/mentee/dashboard/profile", menteeProfileDashboardRoute);

// institute routes
app.use("/api/v1/institute", instituteRoute);
app.use("/api/v1/institute/dashboard", instituteDashboardRoute);

// admin dashboard
app.use("/api/v1/admin/dashboard", adminDashboardRoute);
app.use("/api/v1/admin/dashboard/case-studies", adminCaseStudiesDashboardRoute);

// case studies routes
app.use("/api/v1/case-studies", caseStudiesRoute);

// employer routes
app.use("/api/v1/employer", employerRoute);
app.use("/api/v1/employer/internship", internshipRoute);

async function connectToDatabases() {
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        console.log(err.message);
      }
      if (db) {
        console.log(
          `Connected to database successfully to ${db.config.database}`
        );
      }
    });
  } catch (error) {
    console.log(error.message);
  }
}
// connectToDatabases();

app.get("/test/email", async (req, res) => {
  const msg = accountCreatedEmailTemplate(
    "keeprememberall@gmail.com",
    "Mike",
    "link"
  );
  try {
    const emailRes = await sendEmail(msg);
    return res.json({ success: true, message: emailRes });
  } catch (error) {
    return res.json({
      message: "There was an error connecting to database",
      error: err.message,
    });
  }
});
// app.get("/database", function (req, res) {
//   try {
//     sql.connect(config, (err, db) => {
//       if (err) {
//         console.log(err.message);
//       }
//       if (db) {
//         console.log(
//           `Connected to database successfully to ${db.config.database}`
//         );
//         const request = new sql.Request();
//         request.query(
//           'update mentor_dtls set mentor_domain = \'[ { \"value\": \"technology\", \"label\": \"Technology\" } ]\' where mentor_dtls_id = 19',
//           (err, res) => {
//             console.log(res);

//           }
//         );
//       }
//     });
//   } catch (error) {
//     console.log(error.message);
//   }
// });
// Endpoint to exchange the authorization code for an access token
app.post("/getLinkedInToken", async (req, res) => {
  const { code } = req.body;
  try {
    // Make a request to LinkedIn's OAuth 2.0 token endpoint
    const tokenResponse = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      null,
      {
        params: {
          grant_type: "authorization_code",
          code: code,
          redirect_uri: `${process.env.FRONT_END_LINK}/auth/linkedin/callback`, // Your LinkedIn
          // Your LinkedIn app's redirect URI
          client_id: `${process.env.LINKEDIN_CLIENT_ID}`, // Replace with your LinkedIn App's client_ids
          client_secret: `${process.env.LINKEDIN_CLIENT_SECRET}`, // Replace with your LinkedIn App's client_secret
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Send access token back to frontend
    res.json(tokenResponse.data);
  } catch (error) {
    console.error("Error response:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch access token" });
  }
});

// Endpoint to fetch LinkedIn profile data
app.get("/getLinkedInProfile", async (req, res) => {
  const accessToken = req.headers.authorization.split(" ")[1]; // Extract Bearer token
  try {
    // Fetch LinkedIn profile data using the correct LinkedIn API endpoint
    const profileResponse = await axios.get(
      "https://api.linkedin.com/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Send profile data back to frontend
    res.json(profileResponse.data);
  } catch (error) {
    console.error("Error fetching profile data:", error.message);
    res.status(500).json({ error: "Failed to fetch profile data" });
  }
});

async function getAllNotApprovedMentorsListAdminDashboard(req, res, next) {
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        return res.json({
          error: err.message,
        });
      }
      if (db) {
        const request = new sql.Request();
        request.query(
          autoApproveFetchAllNotApprovedMentorQuery,
          (err, result) => {
            if (err) {
              console.log(err.message);
            }
            if (result?.recordset.length > 0) {
              for (const recordset of result.recordset) {
                const total_progress = recordset.total_progress;
                if (parseInt(total_progress) >= 80) {
                  const mentorUserDtlsId = recordset.mentor_user_dtls_id;
                  const request = new sql.Request();
                  request.input("mentorUserId", sql.Int, mentorUserDtlsId);
                  request.query(
                    "update mentor_dtls set mentor_approved_status = 'Yes'  where mentor_user_dtls_id = @mentorUserId ",
                    (err, result) => {
                      if (err) {
                        console.log(err.message);
                      }
                      if (result) {
                        console.log(result);
                      }
                    }
                  );
                }
              }
            } else {
              console.log({
                error: "There are no current mentor applications.",
              });
            }
          }
        );
      }
    });
  } catch (error) {
    return console.log({
      error: error.message,
    });
  }
}
setInterval(() => {
  connectToDatabases();
  getAllNotApprovedMentorsListAdminDashboard();
}, 86400);

// Start the server
app.listen(port, () => {
  console.log(`Running on port http://localhost:${port}`);
  console.log("Working fine on " + process.env.PORT);
});
