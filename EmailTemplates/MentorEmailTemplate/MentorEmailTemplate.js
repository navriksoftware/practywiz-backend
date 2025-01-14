// mentor application email needd to pass mentor email and mentorname
export const mentorApplicationEmail = (mentorEmail, mentorName) => {
  return {
    to: `${mentorEmail}`, // Change to your recipient
    from: "no-reply@practiwiz.com", // Change to your verified sender
    subject: "Thank you for your mentor application!",
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
          font-size: 24px;
          text-transform: uppercase;
          color: #2c3e50;
          margin: 0;
        "
      >
        Welcome to Practiwiz
      </h2>
      <hr style="width: 80px; border: 1px solid #1abc9c; margin: 20px auto;" />
    </div>
    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      Hi <b>${mentorName}</b>,
    </p>

    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      Thank you for submitting your mentor application to join the <b>Practiwiz</b> team. We’re excited about the possibility of working together to empower and guide our learners.
    </p>

    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      While we review your application, we encourage you to explore our blog, where we share insights and experiences from our current mentors. It’s a great way to get familiar with our community and the impact we’re making.
    </p>

    <div
      style="
        text-align: center;
        margin: 30px 0;
      "
    >
      <a
        href="https://practiwiz.com/blog"
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
        >Explore Our Blog</a
      >
    </div>

    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      We will be in touch shortly with the next steps. Your expertise and passion for mentoring are highly valued, and we’re eager to see how you can contribute to the growth of our community.
    </p>

    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      If you have any questions or need further information, feel free to contact us at 
      <a href="mailto:wecare@practiwiz.com" style="color: #1abc9c; text-decoration: none;">
        wecare@practiwiz.com
      </a>. We're here to assist you!
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
// mentor approve email
export const mentorApprovedEmailTemplateOld = (mentorEmail, username) => {
  return {
    to: `${mentorEmail}`, // Change to your recipient
    from: "no-reply@practiwiz.com", // Change to your verified sender
    subject: "Congratulations! You're our next mentor!",
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
          font-size: 24px;
          text-transform: uppercase;
          color: #2c3e50;
          margin: 0;
        "
      >
        Welcome to Practiwiz
      </h2>
      <hr style="width: 80px; border: 1px solid #1abc9c; margin: 20px auto;" />
    </div>
    <!-- Greeting and Introduction -->
    <p style="font-size: 16px; color: #333333; line-height: 1.6;">
      Hi <b>${username}</b>,
    </p>
    <p style="font-size: 16px; color: #333333; line-height: 1.6;">
      We are excited to welcome you as a mentor! Your expertise will greatly benefit our community, and we can’t wait to see the impact you’ll make. As a mentor, you’ll earn compensation for each session you host on our platform.
    </p>
    
    <!-- Call to Action Image -->
    <div style="text-align: center; margin: 30px 0;">
      <img src="https://res.cloudinary.com/droa7dncb/image/upload/v1693636352/start_tutorial_session_pgrl8f.jpg" alt="Get Started" style="width: 100%;height:300px; border-radius: 8px;"/>
    </div>
    
    <!-- Details and Encouragement -->
    <p style="font-size: 16px; color: #333333; line-height: 1.6;">
      To kick things off, we recommend joining a live tutorial session. This will unlock all the tools you need to begin your mentoring journey and start earning.
    </p>
    <p style="font-size: 16px; color: #333333; line-height: 1.6;">
      At <b>Practiwiz</b>, we’re dedicated to supporting both mentors and students. Our platform empowers you to share your knowledge effectively, and we’re here to ensure your success every step of the way.
    </p>
    <p style="font-size: 16px; color: #333333; line-height: 1.6;">
      Remember, once you start hosting sessions, you can increase your earnings by gaining referrals.
    </p>
    
    <!-- Support Section -->
    <p style="font-size: 16px; color: #333333; line-height: 1.6;">
      If you have any questions or need support, don’t hesitate to reach out to us at <a href="mailto:wecare@practiwiz.com" style="color: #008080; text-decoration: none;">wecare@practiwiz.com</a>. We’re here to help!
    </p>
    
    <!-- Closing and Signature -->
    <p style="font-size: 16px; color: #333333; line-height: 1.6;">
      Best of luck in your mentorship journey!
    </p>
    <p style="font-size: 16px; line-height: 1.8; color: #333333; margin-top: 40px;">
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

// mentor approve email
export const mentorApprovedEmailTemplate = (mentorEmail, username) => {
  return {
    to: `${mentorEmail}`, // Change to your recipient
    from: "no-reply@practiwiz.com", // Change to your verified sender
    subject: "You are ready to start your mentorship journey🎉🎊",
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
        src="https://practiwizstorage.blob.core.windows.net/practiwizcontainer/logo.jpg"
        alt="Practywiz Logo"
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
        Welcome to Practywiz
      </h2>
      <hr style="width: 80px; border: 1px solid #1abc9c; margin: 20px auto;" />
    </div>
    <!-- Greeting and Introduction -->
    <p style="font-size: 16px; color: #333333; line-height: 1.6;">
      Hi <b>${username}</b>,
    </p>
    <p style="font-size: 16px; color: #333333; line-height: 1.6;">
      We are excited to welcome you as a mentor! Your expertise will greatly benefit our community, and we can’t wait to see the impact you’ll make. As a mentor, you’ll earn compensation for each session you host on our platform.
    </p>
    
    <!-- Call to Action Image -->
    <div style="text-align: center; margin: 30px 0;">
      <img src="https://practiwizstorage.blob.core.windows.net/practiwizcontainer/getting started.jpg" alt="Get Started" style="width: 100%;height:300px; border-radius: 8px;"/>
    </div>
    
    <p style="font-size: 16px; color: #333333; line-height: 1.6;">
      At <b>Practywiz</b>, we’re dedicated to supporting both mentors and mentee(Professionals and Students). Our platform empowers you to share your knowledge effectively, and we’re here to ensure your success every step of the way.
    </p>
    <p style="font-size: 16px; color: #333333; line-height: 1.6;">
      Remember, once you start hosting sessions, you can increase your earnings by gaining referrals.
    </p>
    
    <!-- Support Section -->
    <p style="font-size: 16px; color: #333333; line-height: 1.6;">
      If you have any questions or need support, don’t hesitate to reach out to us at <a href="mailto:wecare@practywiz.com" style="color: #008080; text-decoration: none;">wecare@practywiz.com</a>. We’re here to help!
    </p>
    
    <!-- Closing and Signature -->
    <p style="font-size: 16px; color: #333333; line-height: 1.6;">
      Best of luck in your mentorship journey!
    </p>
    <p style="font-size: 16px; line-height: 1.8; color: #333333; margin-top: 40px;">
      Best Regards,<br />The Practywiz Team
    </p>

    <div style="text-align: center; margin-top: 40px;">
      <img
        src="https://practiwizstorage.blob.core.windows.net/practiwizcontainer/logo.jpg"
        alt="practywiz Footer Logo"
        style="max-width: 120px;"
      />
    </div>
  </div>
</section>
    `,
  };
};
// mentor disapprove email
export const mentorDisApproveEmail = (mentorEmail, username) => {
  return {
    to: `${mentorEmail}`, // Change to your recipient
    from: "no-reply@practiwiz.com", // Change to your verified sender
    subject: "We are sorry to inform you...",
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
          Unfortunately, we are unable to approve you as a mentor at this time.
          Our decision are based on a number of different reasons including your
          application, amount of experience, engagement with the community,
          teaching and mentoring experience, and more.
        </p>
        <p>
          We're sorry for any inconvenience this may cause. If you have any
          questions about the process or requirements for mentoring please get
          in touch with us at contact at support@practiwiz.com .
        </p>
        <p>
          I know this may not be the answer you wanted to hear but I hope it's
          good news for you in the future
        </p>
        <p>
          Please know that we are more than happy to answer any questions or
          concerns that may arise.
        </p>
        <p>
          Best of luck with your application and thank you for your interest in
          being a part of our team!
        </p>
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

// mentor disapprove email
export const mentorApplicationFillEmailAlertTemplate = (
  mentorEmail,
  username
) => {
  return {
    to: `${mentorEmail}`, // Change to your recipient
    from: "no-reply@practiwiz.com", // Change to your verified sender
    subject: "Progress your mentor application.....",
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
        alt="Practywiz Logo"
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
        Welcome to Practywiz
      </h2>
      <hr style="width: 80px; border: 1px solid #1abc9c; margin: 20px auto;" />
    </div>
    <!-- Greeting and Alert Message -->
    <p style="font-size: 16px; color: #333333; line-height: 1.6;">
      Hi <b>${username}</b>,
    </p>
    <p style="font-size: 16px; color: #333333; line-height: 1.6;">
      We noticed that you haven't completed your application yet. Please make sure to fill out the required details on our website to be approved as a mentor at Practywiz.
    </p>

    <!-- Call to Action Button -->
    <div style="text-align: center; margin: 30px 0;">
      <a 
        target="_blank"
        href="https://www.practywiz.com/login"
        style="
          display: inline-block;
          background-color: #1abc9c;
          color: #ffffff;
          text-decoration: none;
          padding: 12px 20px;
          border-radius: 5px;
          font-size: 16px;
        "
        >Login to Complete Your Application</a
      >
    </div>

    <!-- Additional Information -->
    <p style="font-size: 16px; color: #333333; line-height: 1.6;">
      At <b>Practywiz</b>, we’re dedicated to supporting both mentors and mentees (Professionals and Students). Your expertise is highly valued, and we can’t wait to see the contributions you'll make. Remember, once you complete your application and start hosting sessions, you’ll be eligible to earn compensation and gain referrals to increase your earnings.
    </p>

    <!-- Support Section -->
    <p style="font-size: 16px; color: #333333; line-height: 1.6;">
      If you have any questions or need support, don’t hesitate to reach out to us at <a href="mailto:wecare@practywiz.com" style="color: #008080; text-decoration: none;">wecare@practywiz.com</a>. We’re here to help!
    </p>

    <!-- Closing and Signature -->
    <p style="font-size: 16px; color: #333333; line-height: 1.6;">
      Best of luck in your mentorship journey!
    </p>
    <p style="font-size: 16px; line-height: 1.8; color: #333333; margin-top: 40px;">
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
