import pkg from "mssql";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const { Request } = pkg;

import {
  updateOtpStatusToExpiredQuery,
  generateOtpQuery,
  checkExistingOtpQuery,
  validateOtpQuery,
  updateOtpToVerifiedQuery,
} from "./optVerificationSqlQuery.js";

/**
 * Execute a parameterized SQL query
 */

const executeQuery = async (queryText, params) => {
  try {
    const request = new Request();

    // Add parameters to the request
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });

    return await request.query(queryText);
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

/**
 * Helper Functions
 */
const markOtpAsExpired = async (phone) => {
  try {
    await executeQuery(updateOtpStatusToExpiredQuery, { phone });
  } catch (error) {
    throw new Error(`Failed to mark OTP as expired: ${error.message}`);
  }
};

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const createNewOtp = async (phone) => {
  try {
    const otp = generateOtp();
    await executeQuery(generateOtpQuery, { phone, otp });
    return otp;
  } catch (error) {
    throw new Error(`Failed to create new OTP: ${error.message}`);
  }
};

const isOtpPendingForPhone = async (phone) => {
  try {
    const result = await executeQuery(checkExistingOtpQuery, { phone });
    return result.recordset.length > 0;
  } catch (error) {
    throw new Error(`Failed to check pending OTP: ${error.message}`);
  }
};

const verifyOtpAndUpdateStatus = async (phone, otp) => {
  try {
    const result = await executeQuery(validateOtpQuery, { phone, otp });

    if (result.recordset.length === 0) {
      throw new Error("Invalid OTP or OTP has expired.");
    }

    await executeQuery(updateOtpToVerifiedQuery, { phone, otp });
  } catch (error) {
    throw new Error(`Failed to verify OTP: ${error.message}`);
  }
};

/**
 * Controller Functions
 */
export const requestOtp = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    if (await isOtpPendingForPhone(phone)) {
      return res.status(400).json({
        message:
          "OTP already sent. Please wait for the previous OTP to expire.",
      });
    }

    const otp = await createNewOtp(phone);
    console.log(`OTP generated for ${phone}: ${otp}`); // For development purposes
    const response = await axios({
      url: `${process.env.WHATSAPP_API_URL}`,
      method: "post",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: phone,
        type: "template",
        template: {
          name: "otp_template_pz",
          language: {
            code: "en_US",
          },
          components: [
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: otp,
                },
              ],
            },
            {
              type: "button",
              sub_type: "url",
              index: "0",
              parameters: [
                {
                  type: "text",
                  text: otp,
                },
              ],
            },
          ],
        },
      }),
    });
    console.log(response.data);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully!",
    });
  } catch (error) {
    console.error("Error in requestOtp:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to request OTP",
      error: error.message,
    });
  }
};

export const validateOtp = async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res
      .status(400)
      .json({ message: "Phone number and OTP are required" });
  }

  try {
    await verifyOtpAndUpdateStatus(phone, otp);

    return res.status(200).json({
      success: true,
      message: "OTP validated successfully!",
    });
  } catch (error) {
    console.error("Error in validateOtp:", error);
    return res.status(400).json({
      success: false,
      message: "Invalid OTP or OTP has expired",
      error: error.message,
    });
  }
};

export const resendOtp = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    await markOtpAsExpired(phone);
    const otp = await createNewOtp(phone);
    console.log(`New OTP generated for ${phone}: ${otp}`); // For development purposes

    // TODO: Implement OTP sending logic (e.g., via WhatsApp/SMS)
    const response = await axios({
      url: `${process.env.WHATSAPP_API_URL}`,
      method: "post",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: phone,
        type: "template",
        template: {
          name: "otp_template_pz",
          language: {
            code: "en_US",
          },
          components: [
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: otp,
                },
              ],
            },
            {
              type: "button",
              sub_type: "url",
              index: "0",
              parameters: [
                {
                  type: "text",
                  text: otp,
                },
              ],
            },
          ],
        },
      }),
    });
    return res.status(200).json({
      success: true,
      message: "OTP resent successfully!",
    });
  } catch (error) {
    console.error("Error in resendOtp:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to resend OTP",
      error: error.message,
    });
  }
};
