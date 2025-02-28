export const caseStudyConsultantEmailTemplate = (name, email, phone) => {
  return {
    to: "wecare@practywiz.com", // Case study consultant email
    from: "no-reply@practywiz.com",
    subject: `New Case Study Consultant Connection Request`,
    html: `
    <section
      style="
        font-family: 'Poppins', sans-serif;
        background-color: #f4f8fb !important;
        padding: 50px;
      "
    >
      <div
        style="
          max-width: 600px;
          margin: auto;
          padding: 40px;
          background-color: #ffffff !Important;
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
              font-size: 22px;
              text-transform: uppercase;
              color: #2c3e50;
              margin: 0;
            "
          >
            New Case Study Consultant Request
          </h2>
          <hr style="width: 80px; border: 1px solid #1abc9c; margin: 20px auto;" />
        </div>

        <p style="font-size: 16px; line-height: 1.5; color: #333333;">
          Someone is interested in authoring a case study from their corporate experience and would like to connect with a case consultant.
        </p>
        
        <div style="background-color: #f9f9f9 !important; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <p style="font-size: 16px; line-height: 1.5; color: #333333; margin: 10px 0;">
            <strong>Name:</strong> ${name}
          </p>
          <p style="font-size: 16px; line-height: 1.5; color: #333333; margin: 10px 0;">
            <strong>Email:</strong> ${email}
          </p>
          <p style="font-size: 16px; line-height: 1.5; color: #333333; margin: 10px 0;">
            <strong>Phone:</strong> ${phone || "Not provided"}
          </p>
          <p style="font-size: 16px; line-height: 1.5; color: #333333; margin: 10px 0;">
            <strong>Message:</strong><br>
            "Hi, I'm interested in authoring a case from my corporate experience. Please connect with me on the contact details provided."
          </p>
        </div>
        
        <p style="font-size: 16px; line-height: 1.5; color: #333333;">
          Please reach out to this potential case author at your earliest convenience.
        </p>

        <div style="text-align: center; margin-top: 30px;">
          <a href="mailto:${email}" 
             style="text-decoration: none; padding: 12px 30px; background-color: #0255ca !important; color: #ffffff; border-radius: 50px; font-size: 16px; display: inline-block; box-shadow: 0 5px 15px rgba(2, 85, 202, 0.3);">
            Contact ${name}
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 40px;">
          <img
            src="https://practiwizstorage.blob.core.windows.net/practiwizcontainer/logo.jpg"
            alt="Practiwiz Footer Logo"
            style="max-width: 120px;"
          />
        </div>
      </div>
    </section>
    `,
  };
};

// Auto-reply to the person who submitted the form
export const caseStudyAuthorAutoReplyTemplate = (name, email) => {
  return {
    to: email,
    from: "no-reply@practywiz.com",
    subject: `Thank you for your interest in authoring a case study`,
    html: `
    <section
      style="
        font-family: 'Poppins', sans-serif;
        background-color: #f4f8fb !important;

      "
    >
      <div
        style="
          max-width: 600px;
          margin: auto;
          padding: 40px;
          background-color: #ffffff !important;   
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
              font-size: 22px;
              text-transform: uppercase;
              color: #2c3e50;
              margin: 0;
            "
          >
            Thank You for Your Interest
          </h2>
          <hr style="width: 80px; border: 1px solid #1abc9c; margin: 20px auto;" />
        </div>

        <p style="font-size: 16px; line-height: 1.5; color: #333333;">
          Hi <b>${name}</b>,
        </p>
        
        <p style="font-size: 16px; line-height: 1.5; color: #333333;">
          Thank you for your interest in authoring a case study with Practiwiz. We appreciate your willingness to share your corporate experience.
        </p>
        
        <p style="font-size: 16px; line-height: 1.5; color: #333333;">
          Our case study consultant will contact you shortly to discuss the process, requirements, and next steps for creating your case study.
        </p>
        
        <p style="font-size: 16px; line-height: 1.5; color: #333333;">
          If you have any questions in the meantime, please feel free to ask to our case consultant.
        </p>
        
        <p style="font-size: 16px; line-height: 1.5; color: #333333; margin-top: 30px;">
          Best Regards,<br />
          The Practiwiz Team
        </p>
        
        <div style="text-align: center; margin-top: 40px;">
          <img
            src="https://practiwizstorage.blob.core.windows.net/practiwizcontainer/logo.jpg"
            alt="Practiwiz Footer Logo"
            style="max-width: 120px;"
          />
        </div>
      </div>
    </section>
    `,
  };
};
