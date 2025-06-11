export const newUserNotificationTemplate = (userType, userName, userEmail) => {
  return {
    to: "wecare@practywiz.com", // Practywiz admin email
    from: "no-reply@practywiz.com", // Sender email
    subject: `New ${userType} Registration: ${userName}`,
    html: `
    <section
      style="
        font-family: 'Poppins', sans-serif;
        background-color: #e9f5ff;
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
            alt="Practywiz Logo"
            style="max-width: 160px; margin-bottom: 20px;"
          />
          <h2
            style="
              font-size: 24px;
              text-transform: uppercase;
              color: #34495e;
              margin: 0;
            "
          >
            New ${userType} Notification
          </h2>
          <hr style="width: 80px; border: 1px solid #1abc9c; margin: 20px auto;" />
        </div>
        <p style="font-size: 16px; line-height: 1.8; color: #555;">
          Hello Admin,
        </p>

        <p style="font-size: 16px; line-height: 1.8; color: #555;">
          A new ${userType} has just registered on the Practywiz platform.
        </p>

        <div style="
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          margin: 20px 0;
        ">
          <p style="font-size: 16px; line-height: 1.5; color: #555; margin: 5px 0;">
            <strong>User Type:</strong> ${userType}
          </p>
          <p style="font-size: 16px; line-height: 1.5; color: #555; margin: 5px 0;">
            <strong>Name:</strong> ${userName}
          </p>
          <p style="font-size: 16px; line-height: 1.5; color: #555; margin: 5px 0;">
            <strong>Email:</strong> ${userEmail}
          </p>
        </div>

        <p style="font-size: 16px; line-height: 1.8; color: #555;">
          You can access the admin dashboard to view more details about this user.
        </p>

        <div
          style="
            text-align: center;
            margin: 30px 0;
          "
        >
          <a
            href="https://www.practywiz.com/admin/dashboard"
            style="
              text-decoration: none;
              padding: 15px 40px;
              background-color: #1abc9c;
              color: #ffffff;
              border-radius: 50px;
              font-size: 16px;
              display: inline-block;
              box-shadow: 0 5px 15px rgba(26, 188, 156, 0.3);
            "
            >Access Dashboard</a
          >
        </div>

        <p style="font-size: 16px; line-height: 1.8; color: #555; margin-top: 40px;">
          Best Regards,<br />The Practywiz System
        </p>
      </div>
    </section>
    `,
  };
};
