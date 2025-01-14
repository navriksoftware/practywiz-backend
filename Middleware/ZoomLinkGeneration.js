import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// creating the zoom access token
const getZoomAccessToken = async () => {
  const refreshToken = process.env.ZOOM_REFRESH_TOKEN;
  const tokenUrl = "https://zoom.us/oauth/token";
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;
  const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  try {
    const response = await axios.post(tokenUrl, null, {
      params: {
        grant_type: "account_credentials",
        account_id: "L0V9VsGwSpWSQe5wYdwe-A",
      },
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const { access_token, refresh_token, expires_in } = response.data;
    return access_token;
  } catch (error) {
    console.error(
      "Error retrieving Zoom access token:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to retrieve Zoom access token");
  }
};

// Function to create a Zoom meeting
export const createZoomMeeting = async (startTime, mentorName, menteeName) => {
  const accessToken = await getZoomAccessToken();
  const meetingOptions = {
    topic: "Mentorship Session",
    type: 2, // Scheduled meeting
    start_time: startTime,
    duration: 30, // Duration in minutes
    timezone: "Asia/Kolkata",
    agenda: `Mentorship session between ${mentorName} and ${menteeName}`,
    settings: {
      alternative_hosts: "",
      host_video: false, // Host’s video will not start automatically
      participant_video: true, // Participants’ video will start automatically
      join_before_host: true, // Participants can join before the host
      jbh_time: 0,
      join_before_host: true,
      jbh_time: 0,
      waiting_room: true,
    },
  };

  try {
    const response = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      meetingOptions,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    //console.log(response.data);
    const hostURL = response.data.start_url;
    const joinURL = response.data.join_url;
    const meetingId = response.data.id;
    const meetingPassword = response.data.password;
    return { hostURL, joinURL, meetingId, meetingPassword };
  } catch (error) {
    return error.message;
  }
};
