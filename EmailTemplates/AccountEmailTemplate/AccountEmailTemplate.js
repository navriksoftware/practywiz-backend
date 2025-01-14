export const accountCreatedEmailTemplate = (email, username, url) => {
  return {
    to: `${email}`, // Change to your recipient
    from: "no-reply@practiwiz.com", // Change to your verified sender
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
        src="https://res.cloudinary.com/droa7dncb/image/upload/v1665987569/practiwiz-logo3_xifxbc.png"
        alt="Practiwiz Logo"
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
        Welcome to Practiwiz
      </h2>
      <hr style="width: 80px; border: 1px solid #1abc9c; margin: 20px auto;" />
    </div>
    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      Hi <b>${username}</b>,
    </p>

    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      Congratulations! Your account has been successfully activated on <b>Practiwiz</b>.
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
        href="${url}"
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
      <a href="mailto:wecare@practiwiz.com" style="color: #1abc9c; text-decoration: none;">
        wecare@practiwiz.com
      </a>. We're here to help!
    </p>

    <p style="font-size: 16px; line-height: 1.8; color: #555; margin-top: 40px;">
      Best Regards,<br />The Practiwiz Team
    </p>

    <div style="text-align: center; margin-top: 40px;">
      <img
        src="https://via.placeholder.com/150x50?text=Practiwiz+Footer+Logo"
        alt="Practiwiz Footer Logo"
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
    from: "no-reply@practiwiz.com", // Change to your verified sender
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

        alt="Practiwiz Logo"
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
      <a href="mailto:wecare@practiwiz.com" style="color: #1abc9c; text-decoration: none;">
        wecare@practywiz.com
      </a>. We're here to help!
    </p>

    <p style="font-size: 16px; line-height: 1.8; color: #555; margin-top: 40px;">
      Best Regards,<br />The Practywiz Team
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
export const mentorUpdatedRegAccountCreatedEmailTemplate = (
  email,
  username
) => {
  return {
    to: `${email}`, // Change to your recipient
    from: "no-reply@practiwiz.com", // Change to your verified sender
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

        alt="Practiwiz Logo"
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
      <a href="mailto:wecare@practiwiz.com" style="color: #1abc9c; text-decoration: none;">
        wecare@practywiz.com
      </a>. We're here to help!
    </p>

    <p style="font-size: 16px; line-height: 1.8; color: #555; margin-top: 40px;">
      Best Regards,<br />The Practywiz Team
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
export const passwordUpdateEmailTemplate = (email, username) => {
  return {
    to: `${email}`, // Change to your recipient
    from: "no-reply@practiwiz.com", // Change to your verified sender
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
          Welcome to the Practiwiz Training Programme
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
        <p>Thanks, Practiwiz</p>
        <img
          width="300px"
          height="100px"
          src="https://res.cloudinary.com/droa7dncb/image/upload/v1665987569/practiwiz-logo3_xifxbc.png"
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
    from: "no-reply@practiwiz.com", // Change to your verified sender
    subject: `Reset your password`,
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
          Welcome to the Practiwiz Training Programme
        </h2>
        <p>Hi <b>${username}</b>,</p>
        <p>
          We're sorry to see that you've forgotten your password. Let us know if
          you forgot it, or if you just want to change your password.
        </p>
        <p>
          Please visit this click on the reset button to reset your password on
          <b>Practiwiz</b>
        </p>
        <button
          style="
            background-color: #085cca;
            border: none;
            color: white;
            padding: 10px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            border-radius: 7px;
          "
        >
          <a
            style="text-decoration: none; font-size: 17px; color: white"
            href="${url}"
            >Reset Password</a
          >
        </button>
        <p>or if it doesn't work try the link below</p>
        <p>${url}</p>
        <p>After 15 minutes this link will be expired.</p>
        <p>
          If you have any questions, send an email to wecare@practiwiz.com  and we'll be happy
          to help.
        </p>
        <p>Thanks, Practiwiz</p>
        <img
          width="300px"
          height="100px"
          src="https://res.cloudinary.com/droa7dncb/image/upload/v1665987569/practiwiz-logo3_xifxbc.png"
          alt="Logo"
        />
      </div>
    </section>
    `,
  };
};
