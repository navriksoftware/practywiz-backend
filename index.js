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
import fs from "fs";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import authRouter from "./Routes/AuthRoutes/AuthRoutes.js";
import VerifyOTP from "./Routes/VerifyOTPRoutes/VerifyOTPRoutes.js"
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
import { ApprovedAccountMessgsendtoMentor } from "./WhtasappMessages/SuccessMessageFunction.js";
import { mentorApprovedEmailTemplate } from "./EmailTemplates/MentorEmailTemplate/MentorEmailTemplate.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 1337;

// CORS configuration
const corsOptions = {
  origin: "*", // Allow all origins, or specify a specific domain
  methods: "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE",
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-requested-with",
    "x-client-key",
    "x-client-token",
    "x-client-secret",
    "Accept",
  ],
};


// Apply CORS middleware
app.use(cors(corsOptions));


app.options("*", cors(corsOptions)); // This is usually redundant, as `cors()` already handles preflight requests.

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("common"));
app.use(
  fileUpload({
    createParentPath: true,
  })
);

// File upload configuration using Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// API routes
app.get("/", (req, res) => {
  const time = new Date().getTime();
  const date = new Date().toDateString();
  res.json({
    success: `The server is working fine on the date ${date} and ${time}`,
  });
});

app.get("/test/db-connection", async (req, res) => {
  try {
    await sql.connect(config);
    res.json({ success: "Connected to database successfully" });
  } catch (err) {
    res.json({ message: "Error connecting to database", error: err.message });
  }
});

// Razorpay key endpoint
app.get("/api/get-razorpay-key", (req, res) => {
  res.send({ key: process.env.RAZORPAY_KEY_ID });
});

// Authentication and user-related routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/otpvarification", VerifyOTP);
app.use("/api/v1/mentor", mentorRouter);
app.use("/api/v1/mentor/booking/appointment", mentorBookingRouter);
app.use("/api/v1/mentor/dashboard", mentorDashboardRouter);
app.use("/api/v1/mentor/dashboard/update", mentorDashboardUpdateRoute);
app.use("/api/v1/mentor/dashboard/case-study", mentorDashboardCaseStudyRouter);

app.use("/api/v1/mentee", menteeRoute);
app.use("/api/v1/mentee/dashboard", menteeDashboardRoute);
app.use("/api/v1/mentee/dashboard/profile", menteeProfileDashboardRoute);

app.use("/api/v1/institute", instituteRoute);
app.use("/api/v1/institute/dashboard", instituteDashboardRoute);

app.use("/api/v1/admin/dashboard", adminDashboardRoute);
app.use("/api/v1/admin/dashboard/case-studies", adminCaseStudiesDashboardRoute);

app.use("/api/v1/case-studies", caseStudiesRoute);
app.use("/api/v1/employer", employerRoute);
app.use("/api/v1/employer/internship", internshipRoute);

// LinkedIn API
app.post("/getLinkedInToken", async (req, res) => {
  const { code } = req.body;
  try {
    const tokenResponse = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      null,
      {
        params: {
          grant_type: "authorization_code",
          code,
          redirect_uri: `${process.env.FRONT_END_LINK}/auth/linkedin/callback`,
          client_id: process.env.LINKEDIN_CLIENT_ID,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    res.json(tokenResponse.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch access token" });
  }
});

// Test email endpoint
app.get("/test/email", async (req, res) => {
  const msg = accountCreatedEmailTemplate(
    "keeprememberall@gmail.com",
    "Mike",
    "link"
  );
  try {
    const emailRes = await sendEmail(msg);
    res.json({ success: true, message: emailRes });
  } catch (error) {
    res.json({ error: "Error sending email", details: error.message });
  }
});

// Background database approval logic
async function getAllNotApprovedMentorsListAdminDashboard() {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(autoApproveFetchAllNotApprovedMentorQuery);
    console.log(result.recordset);


    if (result.recordset.length > 0) {
      for (const record of result.recordset) {

        if (parseInt(record.total_progress) >= 80) {
          const name = record.mentor_firstname + " " + record.mentor_lastname;

          await pool
            .request()
            .input("mentorUserId", sql.Int, record.mentor_user_dtls_id)
            .query(
              "UPDATE mentor_dtls SET mentor_approved_status = 'Yes' WHERE mentor_user_dtls_id = @mentorUserId"
            );



          //Whatsappnotification send to mentor for account is approved now
          ApprovedAccountMessgsendtoMentor(record.mentor_phone_number, name, "mentor_approved_success");

          // email send to mentor for account is approved now
          mentorApprovedEmailTemplate(record.mentor_email, name)
        }
      }
    } else {
      console.log("No mentor applications found for approval.");
    }
  } catch (error) {
    console.error("Error approving mentors:", error.message);
  }
}

setInterval(() => {
  getAllNotApprovedMentorsListAdminDashboard();// need to change the time interval according to the requirement
}, 86400 * 1000);

// Start server
app.listen(port, () => {
  console.log(`Running on port http://localhost:${port}`);
  console.log("Working fine on " + process.env.PORT);
});
