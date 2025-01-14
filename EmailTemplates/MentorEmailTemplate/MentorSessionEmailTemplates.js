export const traineeBookingRemainderEmailTemplate = (
  email,
  username,
  mentorName,
  date,
  slotTime,
  time,
  url
) => {
  return {
    to: `${email}`, // Change to your recipient
    from: "no-reply@practywiz.com", // Change to your verified sender
    subject: `Remainder for the mentor session`,
    html: `<section
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
        src="https://practiwizstorage.blob.core.windows.net/practiwizcontainer/logo.jpg"
        alt="Practiwiz Logo"
        style="max-width: 160px; margin-bottom: 20px;"
      />
      <h2
        style="
          font-size: 24px;
          text-transform: uppercase;
          color: #2c3e50;
          margin: 0;
        "
      >
        Welcome to the Practiwiz
      </h2>
      <hr style="width: 80px; border: 1px solid #1abc9c; margin: 20px auto;" />
    </div>

    <p style="font-size: 16px; color: #333333; line-height: 1.6;">
      Hi <b>${username}</b>,
    </p>
    <p style="font-size: 16px; color: #333333; line-height: 1.6;">
      You have successfully booked a session with <b>${mentorName}</b> on <b>${date}</b> at <b>${slotTime}</b>. Your session will begin in approximately <b>${time}</b> minutes.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a
        target="_blank"
        href="${url}"
       style="
          display: inline-block;
          background-color: #1abc9c;
          color: #ffffff;
          text-decoration: none;
          padding: 12px 20px;
          border-radius: 5px;
          font-size: 16px;
        "
      >
        Join Now
      </a>
    </div>

    <p style="font-size: 16px; color: #333333; line-height: 1.6;">
      If the button above doesn't work, please use the link below:
    </p>
    <p style="font-size: 16px; color: #333333; line-height: 1.6;">
      <a href="${url}" style="color: #085cca;">${url}</a>
    </p>
    <p style="font-size: 16px; color: #333333; line-height: 1.6;">
      If you experience any issues joining the session, please reach out to us via email.
    </p>
    <p style="font-size: 16px; color: #333333; line-height: 1.6;">
      For additional assistance or inquiries, email us at <a href="mailto:wecare@practiwiz.com" style="color: #008080; text-decoration: none;">wecare@practiwiz.com</a>. We’re here to help.
    </p>

    <p style="font-size: 16px; color: #333333; line-height: 1.6;">
      Thanks,<br />The Practiwiz Team
    </p>

    <div style="text-align: center; margin-top: 40px;">
      <img
        src="https://practiwizstorage.blob.core.windows.net/practiwizcontainer/logo.jpg"
        alt="Practiwiz Footer Logo"
        style="max-width: 120px;"
      />
    </div>
  </div>
</section>`,
  };
};

export const mentorBookingRemainderEmailTemplate = (
  email,
  mentorName,
  username,
  date,
  slotTime,
  time,
  url
) => {
  return {
    to: `${email}`, // Change to your recipient
    from: "no-reply@practywiz.com", // Change to your verified sender
    subject: `Remainder for the mentor session`,
    html: `<section
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
        src="https://practiwizstorage.blob.core.windows.net/practiwizcontainer/logo.jpg"
        alt="Practiwiz Logo"
        style="max-width: 160px; margin-bottom: 20px;"
      />
      <h2
        style="
          font-size: 24px;
          text-transform: uppercase;
          color: #2c3e50;
          margin: 0;
        "
      >
        Welcome to the Practiwiz
      </h2>
      <hr style="width: 80px; border: 1px solid #1abc9c; margin: 20px auto;" />
    </div>

    <p style="font-size: 16px; color: #333333; line-height: 1.6;">
      Hi <b>${mentorName}</b>,
    </p>
    <p style="font-size: 16px; color: #333333; line-height: 1.6;">
     You; have an mentorship session with <b>${username}</b> on <b>${date}</b> at <b>${slotTime}</b>. Your session will begin in approximately <b>${time}</b> minutes.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a
        target="_blank"
        href="${url}"
       style="
          display: inline-block;
          background-color: #1abc9c;
          color: #ffffff;
          text-decoration: none;
          padding: 12px 20px;
          border-radius: 5px;
          font-size: 16px;
        "
      >
        Host Now
      </a>
    </div>

    <p style="font-size: 16px; color: #333333; line-height: 1.6;">
      If the button above doesn't work, please use the link below:
    </p>
    <p style="font-size: 16px; color: #333333; line-height: 1.6;">
      <a href="${url}" style="color: #085cca;">${url}</a>
    </p>
    <p style="font-size: 16px; color: #333333; line-height: 1.6;">
      If you experience any issues joining the session, please reach out to us via email.
    </p>
    <p style="font-size: 16px; color: #333333; line-height: 1.6;">
      For additional assistance or inquiries, email us at <a href="mailto:wecare@practiwiz.com" style="color: #008080; text-decoration: none;">wecare@practiwiz.com</a>. We’re here to help.
    </p>

    <p style="font-size: 16px; color: #333333; line-height: 1.6;">
      Thanks,<br />The Practiwiz Team
    </p>

    <div style="text-align: center; margin-top: 40px;">
      <img
        src="https://practiwizstorage.blob.core.windows.net/practiwizcontainer/logo.jpg"
        alt="Practiwiz Footer Logo"
        style="max-width: 120px;"
      />
    </div>
  </div>
</section>`,
  };
};
