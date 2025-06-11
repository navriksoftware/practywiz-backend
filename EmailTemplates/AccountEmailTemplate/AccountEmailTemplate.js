export const accountCreatedEmailTemplate = (email, username, url) => {
  return {
    to: `${email}`, // Change to your recipient
    from: "no-reply@practywiz.com", // Change to your verified sender
    subject: `Account created successfully`,
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
        Welcome to Practywiz
      </h2>
      <hr style="width: 80px; border: 1px solid #1abc9c; margin: 20px auto;" />
    </div>
    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      Hi <b>${username}</b>,
    </p>

    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      Congratulations! Your account has been successfully activated on <b>Practywiz</b>.
    </p>

    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      You can now log in and explore our services whenever you like. We're thrilled to have you with us!
    </p>

    <div
      style="
        text-align: center;
        margin: 30px 0;
      "
    >
      <a
        href="https://www.practywiz.com/login"
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
        >Log In Now</a
      >
    </div>
    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      We look forward to supporting your journey and helping you achieve your goals.
    </p>

    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      If you have any questions, feel free to reach out to us at 
      <a href="mailto:wecare@practywiz.com" style="color: #1abc9c; text-decoration: none;">
        wecare@practywiz.com
      </a>. We're here to help!
    </p>

    <p style="font-size: 16px; line-height: 1.8; color: #555; margin-top: 40px;">
      Best Regards,<br />The Practywiz Team
    </p>

    <div style="text-align: center; margin-top: 40px;">
      <img
        src="https://via.placeholder.com/150x50?text=Practiwiz+Footer+Logo"
        alt="Practywiz Footer Logo"
        style="max-width: 120px;"
      />
    </div>
  </div>
</section>

    `,
  };
};

export const mentorAccountCreatedEmailTemplate = (
  email,
  username,
  password
) => {
  return {
    to: `${email}`, // Change to your recipient
    from: "no-reply@practywiz.com", // Change to your verified sender
    subject: `Account created successfully`,
    html: ` <section
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
        Welcome to Practywiz
      </h2>
      <hr style="width: 80px; border: 1px solid #1abc9c; margin: 20px auto;" />
    </div>

    <div style="text-align: center; margin-bottom: 30px;">
      <img
        src="https://via.placeholder.com/600x200?text=Welcome+to+Practiwyz+Training+Program"
        alt="Welcome Banner"
        style="max-width: 100%; border-radius: 10px;"
      />
    </div>

    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      Hi <b>${username}</b>,
    </p>

    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      Congratulations! Your account has been successfully created on <b>Practywiz</b>.
    </p>
<p style="font-size: 16px; line-height: 1.8; color: #555;">
      Incase If you have not filled the entire mentor application. Still you can login and Update the details in Dashboard.
    </p>
    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      You can now log in  using this credentials username: ${email}, Password:  ${password}
    </p>

    <div
      style="
        text-align: center;
        margin: 30px 0;
      "
    >
      <a target="_blank"
        href="https://www.practywiz.com/login"
        style="
          text-decoration: none;
          padding: 15px 40px;
          background-color: #0255ca;
          color: #ffffff;
          border-radius: 50px;
          font-size: 16px;
          display: inline-block;
          box-shadow: 0 5px 15px rgba(26, 188, 156, 0.3);
        "
        >Log In Now</a
      >
    </div>
    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      We look forward to supporting your journey and helping you achieve your goals.
    </p>

    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      If you have any questions, feel free to reach out to us at 
      <a href="mailto:wecare@practywiz.com" style="color: #1abc9c; text-decoration: none;">
        wecare@practywiz.com
      </a>. We're here to help!
    </p>

    <p style="font-size: 16px; line-height: 1.8; color: #555; margin-top: 40px;">
      Best Regards,<br />The Practywiz Team
    </p>

    <div style="text-align: center; margin-top: 40px;">
      <img
        src="https://practiwizstorage.blob.core.windows.net/practiwizcontainer/logo.jpg"
        alt="Practywiz Footer Logo"
        style="max-width: 120px;"
      />
    </div>
  </div>
</section>`,
  };
};
export const mentorUpdatedRegAccountCreatedEmailTemplate = (
  email,
  username
) => {
  return {
    to: `${email}`, // Change to your recipient
    from: "no-reply@practywiz.com", // Change to your verified sender
    subject: `Account created successfully`,
    html: ` <section
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
        Welcome to Practywiz
      </h2>
      <hr style="width: 80px; border: 1px solid #1abc9c; margin: 20px auto;" />
    </div>
    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      Hi <b>${username}</b>,
    </p>

    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      Congratulations! Your account has been successfully created on <b>Practywiz</b>.
    </p>
<p style="font-size: 16px; line-height: 1.8; color: #555;">
      Incase If you have not filled the entire mentor application. Still you can login and Update the details in Dashboard.
    </p>
    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      You can now log in  using this email address : ${email},
    </p>

    <div
      style="
        text-align: center;
        margin: 30px 0;
      "
    >
      <a target="_blank"
        href="https://www.practywiz.com/login"
        style="
          text-decoration: none;
          padding: 15px 40px;
          background-color: #0255ca;
          color: #ffffff;
          border-radius: 50px;
          font-size: 16px;
          display: inline-block;
          box-shadow: 0 5px 15px rgba(26, 188, 156, 0.3);
        "
        >Log In Now</a
      >
    </div>
    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      We look forward to supporting your journey and helping you achieve your goals.
    </p>

    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      If you have any questions, feel free to reach out to us at 
      <a href="mailto:wecare@practywiz.com" style="color: #1abc9c; text-decoration: none;">
        wecare@practywiz.com
      </a>. We're here to help!
    </p>

    <p style="font-size: 16px; line-height: 1.8; color: #555; margin-top: 40px;">
      Best Regards,<br />The Practywiz Team
    </p>

    <div style="text-align: center; margin-top: 40px;">
      <img
        src="https://practiwizstorage.blob.core.windows.net/practiwizcontainer/logo.jpg"
        alt="Practywiz Footer Logo"
        style="max-width: 120px;"
      />
    </div>
  </div>
</section>`,
  };
};
export const passwordUpdateEmailTemplate = (email, username) => {
  return {
    to: `${email}`, // Change to your recipient
    from: "no-reply@practywiz.com", // Change to your verified sender
    subject: `Password changed successfully`,
    html: `
<section>
      <div
        style="
          font-size: 19px;
          font-family: poppins;
          max-width: 700px;
          margin: auto;
          padding: 50px 20px;
        "
      >
        <h2
          style="
            text-transform: uppercase;
            color: teal;
            text-align: center;
            padding-bottom: 30px;
          "
        >
          Welcome to the Practywiz Training Programme
        </h2>
        <p>Hi <b>${username}</b>,</p>
        <p>
          Just a quick note to let you know that your password has been changed
          to the new password you requested.
        </p>
        <p>
          If you have any questions or are experiencing any difficulties logging
          in, please reach out to our customer service team directly at
          <b>(120) 3569310</b>.
        </p>
        <p>We look forward to seeing your progress with our service!</p>
        <p>
          If you have any questions or would like us to help you with anything
          else, please don't hesitate to reach out <b>support@practiwiz.com</b>.
        </p>
        <p>Thanks, Practywiz</p>
        <img
          width="300px"
          height="100px"
          src="https://practiwizstorage.blob.core.windows.net/practiwizcontainer/logo.jpg"
          alt="Logo"
        />
      </div>
    </section>
    `,
  };
};

// email reset password working
export const resetPasswordEmailTemplate = (email, username, url) => {
  return {
    to: `${email}`, // Change to your recipient
    from: "no-reply@practywiz.com", // Change to your verified sender
    subject: `Reset your password`,
    html: `
          <section>
            <div
              style="
                font-size: 19px;
                font-family: Poppins, sans-serif;
                max-width: 700px;
                margin: auto;
                padding: 50px 20px;
              "
            >
              <p>Hi <b>${username}</b>,</p>
              <p>
                We received a request to reset your password for your Practywiz account. If you made this request, click the button below to reset your           password.
              </p>
              <p>
                If you didn't request a password reset, please ignore this email. Your account is secure.
              </p>
              <a
                href="${url}"
                style="
                  background-color: #085cca;
                  border: none;
                  color: white;
                  padding: 12px 30px;
                  text-align: center;
                  text-decoration: none;
                  display: inline-block;
                  font-size: 16px;
                  border-radius: 7px;
                  margin: 20px 0;
                "
              >
                Reset Your Password
              </a>
              <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
              <p><a href="${url}" style="color: #085cca; word-wrap: break-word;">${url}</a></p>
              <p>This link will expire in 15 minutes.</p>
              <p>
                Need help? Contact us at 
                <a href="mailto:wecare@practywiz.com" style="color: #085cca;">wecare@practywiz.com</a>.
              </p>
              <p>Best regards,</p>
              <p>The Practywiz Team</p>
              <img
                width="300px"
                height="100px"
                src="https://practiwizstorage.blob.core.windows.net/practiwizcontainer/logo.jpg"
                alt="Practywiz Logo"
              />
            </div>
          </section>`,
  };
};

// Email template for notifying existing mentees when they are added to a new class
export const existingMenteeAddedToClassEmailTemplate = (
  email,
  username,
  className,
  classSubject,
  classSubjectCode,
  instructorName
) => {
  return {
    to: `${email}`, // Change to your recipient
    from: "no-reply@practywiz.com", // Change to your verified sender
    subject: `You've been added to a new class: ${className}`,
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
        New Class Enrollment
      </h2>
      <hr style="width: 80px; border: 1px solid #1abc9c; margin: 20px auto;" />
    </div>

    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      Hi <b>${username}</b>,
    </p>

    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      Good news! You have been added to a new class on <b>Practywiz</b>.
    </p>

    <div style="background-color: #f8f9fa; border-left: 4px solid #1abc9c; padding: 15px; margin: 25px 0; border-radius: 5px;">
      <h3 style="margin-top: 0; color: #34495e; font-size: 18px;">Class Details:</h3>
      <p style="font-size: 16px; line-height: 1.6; color: #555; margin: 5px 0;">
        <b>Class Name:</b> ${className}
      </p>
      <p style="font-size: 16px; line-height: 1.6; color: #555; margin: 5px 0;">
        <b>Subject:</b> ${classSubject}
      </p>
      <p style="font-size: 16px; line-height: 1.6; color: #555; margin: 5px 0;">
        <b>Subject Code:</b> ${classSubjectCode}
      </p>
      <p style="font-size: 16px; line-height: 1.6; color: #555; margin: 5px 0;">
        <b>Instructor:</b> ${instructorName}
      </p>
    </div>

    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      Your existing Practywiz account has been connected to this class, so you can access all your class materials and case assignments by logging in with your usual credentials.
    </p>

    <div
      style="
        text-align: center;
        margin: 30px 0;
      "
    >
      <a
        href="https://www.practywiz.com/login"
        style="
          text-decoration: none;
          padding: 15px 40px;
          background-color: #0255ca;
          color: #ffffff;
          border-radius: 50px;
          font-size: 16px;
          display: inline-block;
          box-shadow: 0 5px 15px rgba(2, 85, 202, 0.3);
        "
        target="_blank"
        >Log In Now</a
      >
    </div>
    
    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      To prepare for your class:
    </p>
    
    <ul style="font-size: 16px; line-height: 1.8; color: #555;">
      <li>Log in to your account to access the assigned cases</li>
      <li>Contact your instructor if you have any questions</li>
    </ul>

    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      If you have any questions, feel free to reach out to us at 
      <a href="mailto:wecare@practywiz.com" style="color: #1abc9c; text-decoration: none;">
        wecare@practywiz.com
      </a>. We're here to help!
    </p>

    <p style="font-size: 16px; line-height: 1.8; color: #555; margin-top: 40px;">
      Best Regards,<br />The Practywiz Team
    </p>

    <div style="text-align: center; margin-top: 40px;">
      <img
        src="https://practiwizstorage.blob.core.windows.net/practiwizcontainer/logo.jpg"
        alt="Practywiz Footer Logo"
        style="max-width: 120px;"
      />
    </div>
  </div>
</section>`,
  };
};

// Email template for notifying new mentees about their account creation and class enrollment
export const newMenteeAccountCreatedEmailTemplate = (
  email,
  username,
  password,
  className,
  classSubject,
  classSubjectCode,
  instructorName
) => {
  return {
    to: `${email}`, // Change to your recipient
    from: "no-reply@practywiz.com", // Change to your verified sender
    subject: `Your Practywiz account has been created and enrolled in ${className}`,
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
        Welcome to Practywiz
      </h2>
      <hr style="width: 80px; border: 1px solid #1abc9c; margin: 20px auto;" />
    </div>

    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      Hi <b>${username}</b>,
    </p>

    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      Congratulations! Your account has been successfully created by ${instructorName} on <b>Practywiz</b> and you've been enrolled in a class.
    </p>

    <div style="background-color: #f0f7ff; border-radius: 8px; padding: 15px; margin: 25px 0; border: 1px solid #c5deff;">
      <h3 style="margin-top: 0; color: #0255ca; font-size: 18px;">Your Login Information:</h3>
      <p style="font-size: 16px; line-height: 1.6; color: #555; margin: 5px 0;">
        <b>Email/Username:</b> ${email}
      </p>
      <p style="font-size: 16px; line-height: 1.6; color: #555; margin: 5px 0;">
        <b>Password:</b> ${password}
      </p>
      <p style="font-size: 14px; color: #666; margin-top: 10px; font-style: italic;">
        We recommend changing your password after your first login.
      </p>
    </div>

    <div style="background-color: #f8f9fa; border-left: 4px solid #1abc9c; padding: 15px; margin: 25px 0; border-radius: 5px;">
      <h3 style="margin-top: 0; color: #34495e; font-size: 18px;">Class Details:</h3>
      <p style="font-size: 16px; line-height: 1.6; color: #555; margin: 5px 0;">
        <b>Class Name:</b> ${className}
      </p>
      <p style="font-size: 16px; line-height: 1.6; color: #555; margin: 5px 0;">
        <b>Subject:</b> ${classSubject}
      </p>
      <p style="font-size: 16px; line-height: 1.6; color: #555; margin: 5px 0;">
        <b>Subject Code:</b> ${classSubjectCode}
      </p>
      <p style="font-size: 16px; line-height: 1.6; color: #555; margin: 5px 0;">
        <b>Instructor:</b> ${instructorName}
      </p>
    </div>

    <div
      style="
        text-align: center;
        margin: 30px 0;
      "
    >
      <a
        href="https://www.practywiz.com/login"
        style="
          text-decoration: none;
          padding: 15px 40px;
          background-color: #0255ca;
          color: #ffffff;
          border-radius: 50px;
          font-size: 16px;
          display: inline-block;
          box-shadow: 0 5px 15px rgba(2, 85, 202, 0.3);
        "
        target="_blank"
        >Log In Now</a
      >
    </div>
    
    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      Here's how to get started:
    </p>
    
    <ul style="font-size: 16px; line-height: 1.8; color: #555;">
      <li>Log in using your credentials above</li>
      <li>Complete your profile information</li>
      <li>Access your class materials and case assignments</li>
    </ul>

    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      If you have any questions, feel free to reach out to us at 
      <a href="mailto:wecare@practywiz.com" style="color: #1abc9c; text-decoration: none;">
        wecare@practywiz.com
      </a>. We're here to help!
    </p>

    <p style="font-size: 16px; line-height: 1.8; color: #555; margin-top: 40px;">
      Best Regards,<br />The Practywiz Team
    </p>

    <div style="text-align: center; margin-top: 40px;">
      <img
        src="https://practiwizstorage.blob.core.windows.net/practiwizcontainer/logo.jpg"
        alt="Practywiz Footer Logo"
        style="max-width: 120px;"
      />
    </div>
  </div>
</section>`,
  };
};
