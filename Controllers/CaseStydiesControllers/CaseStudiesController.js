import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";
import moment from "moment";
import crypto from "crypto";
import { CaseStudiesData } from "../../Data/CaseStudiesData.js";
import PurchasedCaseStudyData from "../../Data/CaseStudyPurchased.js";
import Razorpay from "razorpay";
import { RazorpayBookingOrderQuery } from "../../SQLQueries/MentorSQLQueries.js";
import { sendEmail } from "../../Middleware/AllFunctions.js";
import {
  caseStudyConsultantEmailTemplate,
  caseStudyAuthorAutoReplyTemplate,
} from "../../EmailTemplates/CaseStudyEmailTemplate/CaseStudyConsultantEmailTemplate.js";

dotenv.config();

export const fetchAllCaseStudyData = (req, res) => {
  try {
    return res.json({ success: CaseStudiesData });
  } catch (error) {
    return res.json({
      error: "There is some problem fetching case study data",
    });
  }
};

export const getCartTotalAmount = async (req, res) => {
  try {
    const { cart } = req.body;
    // Fetch item prices from your database
    let totalAmount = 0;
    for (const item of cart) {
      const itemDetails = CaseStudiesData.find((item2) => item2.id === item.id);
      // Assuming you're using Mongoose or a similar ORM
      if (itemDetails) {
        totalAmount += itemDetails.price * 100;
      }
    }
    return res.json({ success: totalAmount });
  } catch (err) {
    return res.json({ error: "Failed to fetch total amount" });
  }
};

// Function to fetch all purchased case studies
export async function fetchPurchasedCaseStudies(req, res) {
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        return res.json({
          error: err.message,
        });
      }
      if (db) {
        const request = new sql.Request();

        // Fetch the entire table
        request.query("SELECT * FROM case_study_details", (err, results) => {
          if (err) {
            return res.json({
              error: err.message,
            });
          }
          if (results.recordset.length > 0) {
            // Return the entire table data
            return res.json({
              success: true,
              data: results.recordset,
            });
          } else {
            // Handle case where the table is empty
            return res.json({
              success: false,
              message: "No case studies found in the database.",
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

// Function to fetch a purchased case study by ID
export const fetchPurchasedCaseStudyById = async (req, res) => {
  try {
    // Parse the ID from the request parameters
    const id = parseInt(req.params.id, 10);

    // Validate the ID
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid case study ID." });
    }

    // Connect to the database
    sql.connect(config, (err, db) => {
      if (err) {
        return res.json({
          error: err.message,
        });
      }
      if (db) {
        const request = new sql.Request();

        // Input the ID into the query
        request.input("case_study_id", sql.Int, id);

        // Query the database for the specific case study
        request.query(
          "SELECT * FROM case_study_details WHERE case_study_id = @case_study_id",
          (err, results) => {
            if (err) {
              return res.json({
                error: err.message,
              });
            }

            // Check if the case study exists
            if (results.recordset.length > 0) {
              return res.json({
                success: true,
                data: results.recordset[0],
              });
            } else {
              return res.status(404).json({
                message: "Case study not found.",
              });
            }
          }
        );
      }
    });
  } catch (error) {
    console.error("Error fetching the purchased case study:", error);
    return res.status(500).json({
      message: "Server error while fetching the purchased case study.",
    });
  }
};

export const CreateCaseStudyRazorPayOrder = (req, res, next) => {
  const { userEmail, userId, cart } = req.body;
  try {
    let totalAmount = 0;
    for (const item of cart) {
      const itemDetails = CaseStudiesData.find((item2) => item2.id === item.id);
      // Assuming you're using Mongoose or a similar ORM
      if (itemDetails) {
        totalAmount += parseInt(itemDetails.price);
      }
    }
    console.log(totalAmount);
    sql.connect(config, (err) => {
      if (err) {
        return res.json({
          error: "There is some error while creating the order",
        });
      }
      const request = new sql.Request();

      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET_STRING,
      });
      const options = {
        amount: totalAmount * 100,
        currency: "INR",
      };
      instance.orders
        .create(options)
        .then((order) => {
          request.input("bookingMCRazDltsId", sql.Int, 55);
          request.input("bookingRazUserDtlsId", sql.Int, userId);
          request.input("userEmail", sql.VarChar, userEmail);
          request.input("amount", sql.Decimal, order.amount);
          request.input("amountDue", sql.Decimal, order.amount_due);
          request.input("amountPaid", sql.Decimal, order.amount_paid);
          request.input("attempts", sql.Int, order.attempts);
          request.input("createdAt", sql.Int, order.created_at);
          request.input("currency", sql.VarChar, order.currency);
          request.input("entity", sql.VarChar, order.entity);
          request.input("id", sql.VarChar, order.id);
          request.input("offerId", sql.VarChar, order.offer_id);
          request.input("receipt", sql.VarChar, order.receipt);
          request.input("status", sql.VarChar, order.status);
          request.input("type", sql.VarChar, "case study booking");
          request.query(RazorpayBookingOrderQuery, (err, result) => {
            if (err) return res.json({ error: err.message });
            if (result) return res.json({ success: order });
          });
        })
        .catch((error) => {
          return res.json({ error: error.message });
        });
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
};

export const PayCaseStudyAmount = async (req, res) => {
  const { razorpayPaymentId, razorpayOrderId, razorpaySignature, amount } =
    req.body;
  try {
    // Create the expected signature from RazorpayOrderId and PaymentId using your Razorpay Secret Key
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET_STRING)
      .update(razorpayOrderId + "|" + razorpayPaymentId)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Razorpay signature" });
    }
    // Create Razorpay instance with your credentials
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET_STRING,
    });
    // Fetch payment details from Razorpay to verify the amount
    const payment = await razorpay.payments.fetch(razorpayPaymentId);
    if (payment.amount !== amount) {
      return res
        .status(400)
        .json({ success: false, message: "Payment amount mismatch" });
    }
    // Continue with your business logic (e.g., create order, record payment, etc.)
    res
      .status(200)
      .json({ success: true, message: "Payment verified successfully" });
  } catch (err) {
    console.error("Error verifying Razorpay payment:", err);
    res
      .status(500)
      .json({ success: false, message: "Error verifying payment" });
  }
};

// Handle case study consultant connection request
export async function connectWithCaseStudyConsultant(req, res) {
  const { name, email, phone } = req.body;

  // Validate required fields
  if (!name || !email) {
    return res.status(400).json({
      error: "Please provide your name and email address.",
    });
  }

  try {
    // Send notification email to case study consultant
    const consultantEmailTemplate = caseStudyConsultantEmailTemplate(
      name,
      email,
      phone || "Not provided"
    );

    // Send auto-reply email to the potential author
    const authorEmailTemplate = caseStudyAuthorAutoReplyTemplate(name, email);

    // Send both emails
    const consultantEmailResult = await sendEmail(consultantEmailTemplate);
    const authorEmailResult = await sendEmail(authorEmailTemplate);

    // Check if emails were sent successfully
    if (consultantEmailResult === "True" && authorEmailResult === "True") {
      return res.status(200).json({
        success:
          "Your request has been sent successfully. Our case study consultant will contact you soon!",
      });
    } else {
      // If email sending failed
      return res.status(500).json({
        error:
          "There was an issue sending your request. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Case study consultant connection error:", error);
    return res.status(500).json({
      error:
        "There was an error processing your request. Please try again later.",
    });
  }
}
