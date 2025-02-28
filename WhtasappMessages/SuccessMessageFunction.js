import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const sendWhatsAppMessage = async (phoneNumber, firstName, template) => {
  try {
    const response = await axios({
      url: "https://graph.facebook.com/v21.0/581414571714157/messages",
      method: "post",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "template",
        template: {
          name: template,
          language: {
            code: "en_US",
          },
          components: [
            {
              type: "body",
              parameters: [{ type: "text", text: firstName }],
            },
          ],
        },
      }),
    });

    // console.log("Message sent successfully:", response.data);
  } catch (error) {
    console.error(
      "Error sending message:",
      error.response?.data || error.message
    );
  }
};
const menteePaymentReceivedMessage = async (menteePhoneNo, menteeName, sessionDate, sessionFrom, sessionTo, template) => {
  try {
    const response = await axios({
      url: "https://graph.facebook.com/v21.0/581414571714157/messages",
      method: "post",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        messaging_product: "whatsapp",
        to: menteePhoneNo,
        type: "template",
        template: {
          name: template,
          language: {
            code: "en_US",
          },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: menteeName },
                { type: 'text', text: sessionDate },
                { type: 'text', text: sessionFrom },
                { type: 'text', text: sessionTo }
              ],
            },
          ],
        },
      }),
    });

    // console.log("Message sent successfully:", response.data);
  } catch (error) {
    console.error(
      "Error sending message:",
      error.response?.data || error.message
    );
  }
};
const ApprovalReqToMentorMessage = async (mentorPhoneNo, mentorName, menteeName, sessionDate, sessionFrom, sessionTo, template) => {
  try {
    const response = await axios({
      url: "https://graph.facebook.com/v21.0/581414571714157/messages",
      method: "post",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        messaging_product: "whatsapp",
        to: mentorPhoneNo,
        type: "template",
        template: {
          name: template,
          language: {
            code: "en_US",
          },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: mentorName },
                { type: 'text', text: menteeName },
                { type: 'text', text: sessionDate },
                { type: 'text', text: sessionFrom },
                { type: 'text', text: sessionTo }
              ],
            },
          ],
        },
      }),
    });

    // console.log("Message sent successfully:", response.data);
  } catch (error) {
    console.error(
      "Error sending message:",
      error.response?.data || error.message
    );
  }
};
const SessionApprovedToMenteeMessage = async (menteePhoneNo, menteeName, mentorName, mentorBookingStartsTime, starttime, endtime, joinURL, template) => {
  try {
    const response = await axios({
      url: "https://graph.facebook.com/v21.0/581414571714157/messages",
      method: "post",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        messaging_product: "whatsapp",
        to: menteePhoneNo,
        type: "template",
        template: {
          name: template,
          language: {
            code: "en_US",
          },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: menteeName },
                { type: 'text', text: mentorName },
                { type: 'text', text: mentorBookingStartsTime },
                { type: 'text', text: starttime },
                { type: 'text', text: endtime },
                { type: 'text', text: joinURL }
              ],
            },
          ],
        },
      }),
    });

    // console.log("Message sent successfully:", response.data);
  } catch (error) {
    console.error(
      "Error sending message:",
      error.response?.data || error.message
    );
  }
};
const SessionApprovedToMentorMessage = async (mentorPhoneNo, menteeName, mentorName, mentorBookingStartsTime, starttime, endtime, joinURL, template) => {
  try {
    const response = await axios({
      url: "https://graph.facebook.com/v21.0/581414571714157/messages",
      method: "post",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        messaging_product: "whatsapp",
        to: mentorPhoneNo,
        type: "template",
        template: {
          name: template,
          language: {
            code: "en_US",
          },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: mentorName },
                { type: 'text', text: menteeName },
                { type: 'text', text: mentorBookingStartsTime },
                { type: 'text', text: starttime },
                { type: 'text', text: endtime },
                { type: 'text', text: joinURL }
              ],
            },
          ],
        },
      }),
    });

    // console.log("Message sent successfully:", response.data);
  } catch (error) {
    console.error(
      "Error sending message:",
      error.response?.data || error.message
    );
  }
};
const ApprovedAccountMessgsendtoMentor = async (mentorPhoneNo, mentorName, template) => {
  try {
    const response = await axios({
      url: "https://graph.facebook.com/v21.0/581414571714157/messages",
      method: "post",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        messaging_product: "whatsapp",
        to: mentorPhoneNo,
        type: "template",
        template: {
          name: template,
          language: {
            code: "en_US",
          },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: mentorName }
              ],
            },
          ],
        },
      }),
    });

    console.log("Message sent successfully:", response.data);
  } catch (error) {
    console.error(
      "Error sending message:",
      error.response?.data || error.message
    );
  }
};

const RemainderMessgSendToMentor = async (mentorPhoneNo, menteeName, mentorName, mentorBookingStartsTime, starttime, endtime, joinURL, template) => {
  try {
    const response = await axios({
      url: "https://graph.facebook.com/v21.0/581414571714157/messages",
      method: "post",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        messaging_product: "whatsapp",
        to: mentorPhoneNo,
        type: "template",
        template: {
          name: template,
          language: {
            code: "en_US",
          },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: mentorName },
                { type: 'text', text: menteeName },
                { type: 'text', text: mentorBookingStartsTime },
                { type: 'text', text: starttime },
                { type: 'text', text: endtime },
                { type: 'text', text: joinURL }
              ],
            },
          ],
        },
      }),
    });

    // console.log("Message sent successfully:", response.data);
  } catch (error) {
    console.error(
      "Error sending message:",
      error.response?.data || error.message
    );
  }
};
const RemainderMessgSendToMentee = async (mentorPhoneNo, menteeName, mentorName, mentorBookingStartsTime, starttime, endtime, joinURL, template) => {
  try {
    const response = await axios({
      url: "https://graph.facebook.com/v21.0/581414571714157/messages",
      method: "post",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        messaging_product: "whatsapp",
        to: mentorPhoneNo,
        type: "template",
        template: {
          name: template,
          language: {
            code: "en_US",
          },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: menteeName },
                { type: 'text', text: mentorName },
                { type: 'text', text: mentorBookingStartsTime },
                { type: 'text', text: starttime },
                { type: 'text', text: endtime },
                { type: 'text', text: joinURL }
              ],
            },
          ],
        },
      }),
    });

    // console.log("Message sent successfully:", response.data);
  } catch (error) {
    console.error(
      "Error sending message:",
      error.response?.data || error.message
    );
  }
};


export {
  sendWhatsAppMessage,
  ApprovalReqToMentorMessage,
  SessionApprovedToMenteeMessage,
  SessionApprovedToMentorMessage,
  menteePaymentReceivedMessage,
  ApprovedAccountMessgsendtoMentor,
  RemainderMessgSendToMentor,
  RemainderMessgSendToMentee
};
