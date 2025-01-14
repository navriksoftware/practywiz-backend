// appointment with mentor and mentee
export const appointmentBookedTraineeEmailTemplate = (
  menteeEmail,
  menteeName,
  mentorName,
  date,
  slotTime,
  joinURL
) => {
  return {
    to: `${menteeEmail}`, // Change to your recipient
    from: "no-reply@practiwiz.com", // Change to your verified sender
    subject: "Mentorship Appointment Scheduled",
    html: `
 <section
  style="
    font-family: 'Poppins', sans-serif;
    background-color: #f4f8fb;
    padding: 50px 0;
  "
>
  <div
    style="
      max-width: 600px;
      margin: auto;
      padding: 40px;
      background-color: #ffffff;
      border-radius: 15px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    "
  >
    <div style="text-align: center; margin-bottom: 30px;">
      <img
        src="https://res.cloudinary.com/droa7dncb/image/upload/v1665987569/practiwiz-logo3_xifxbc.png"
        alt="Practiwiz Logo"
        style="max-width: 160px; margin-bottom: 20px;"
      />
      <h2
        style="
          font-size: 22px;
          text-transform: uppercase;
          color: #2c3e50;
          margin: 0;
        "
      >
        Welcome to Practiwiz
      </h2>
      <hr style="width: 80px; border: 1px solid #1abc9c; margin: 20px auto;" />
    </div>

    <p style="font-size: 16px; line-height: 1.5; color: #333333;">
      Hi <b>${menteeName}</b>,
    </p>
    <p style="font-size: 16px; line-height: 1.5; color: #333333;">
      Congratulations! Your booked session with <b>${mentorName}</b> has been accepted. You can attend the session as scheduled:
    </p>
    <p style="font-size: 16px; line-height: 1.5; color: #333333;">
      <b>Date:</b> ${date}<br>
      <b>Time:</b> ${slotTime}
    </p>
    <p style="font-size: 16px; line-height: 1.5; color: #333333;">
      To join the session, please click the link below at the scheduled time:
    </p>
    <p style="font-size: 16px; line-height: 1.5; color: #00796b; text-align: center;">
      <a href="${joinURL}" style="color: #ffffff; background-color: #00796b; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">Join Your Session</a>
    </p>
    <p style="font-size: 16px; line-height: 1.5; color: #333333;">
      If you have any questions, feel free to reach out to us at <a href="mailto:wecare@practiwiz.com" style="color: #00796b; text-decoration: none;">wecare@practiwiz.com</a>, and we'll be happy to assist you.
    </p>
    <p style="font-size: 16px; line-height: 1.5; color: #333333;">
      Thank you for choosing Practiwiz!
    </p>
    <div style="text-align: center; margin-top: 30px;">
    
      <img src="https://via.placeholder.com/600x200" alt="Session Image" style="border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); max-width: 100%; height: auto;">
    </div>
  </div>
</section>

    `,
  };
};
