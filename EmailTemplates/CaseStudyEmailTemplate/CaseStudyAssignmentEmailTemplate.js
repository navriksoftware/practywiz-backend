export function caseStudyAssignmentEmailTemplate(
  recipientEmail,
  recipientName,
  caseStudyTitle,
  className,
  classSubject,
  startTime,
  endTime,
  taskType
) {
  return {
    from: { email: "noreply@practywiz.com", name: "Practywiz" },
    to: recipientEmail,
    subject: `Case Study Assignment: ${caseStudyTitle} - ${taskType}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
          }
          .header {
            background-color: #4a86e8;
            color: white;
            padding: 10px 20px;
            border-radius: 5px 5px 0 0;
          }
          .content {
            padding: 20px;
          }
          .footer {
            background-color: #f5f5f5;
            padding: 10px 20px;
            border-top: 1px solid #e0e0e0;
            border-radius: 0 0 5px 5px;
            font-size: 12px;
            color: #666;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4a86e8;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
          }
          .info-box {
            background-color: #f8f9fa;
            padding: 15px;
            border-left: 4px solid #4a86e8;
            margin-bottom: 20px;
          }
          .important {
            color: #d73a49;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Case Study Assignment</h2>
          </div>
          <div class="content">
            <p>Hello ${recipientName},</p>
            
            <p>A new case study task has been assigned to you in your class:</p>
            
            <div class="info-box">
              <p><strong>Case Study:</strong> ${caseStudyTitle}</p>
              <p><strong>Class:</strong> ${className} (${classSubject})</p>
              <p><strong>Task:</strong> ${taskType}</p>
              <p><strong>Start Time:</strong> ${startTime}</p>
              <p><strong>End Time:</strong> ${endTime}</p>
            </div>
            
            <p>Please log in to your Practywiz account to access and complete this task before the deadline.</p>
            
            <p class="important">Note: This task must be completed within the specified time frame.</p>
            
            <a href="https://practywiz.com/login" class="button">Login to Practywiz</a>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply directly to this email.</p>
            <p>&copy; ${new Date().getFullYear()} Practywiz. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}

export function caseStudyCombinedEmailTemplate(
  recipientEmail,
  recipientName,
  caseStudyTitle,
  className,
  classSubject,
  startTime,
  endTime
) {
  return {
    from: { email: "noreply@practywiz.com", name: "Practywiz" },
    to: recipientEmail,
    subject: `Case Study Assignment: ${caseStudyTitle} - Fact Finding & Analysis`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
          }
          .header {
            background-color: #4a86e8;
            color: white;
            padding: 10px 20px;
            border-radius: 5px 5px 0 0;
          }
          .content {
            padding: 20px;
          }
          .footer {
            background-color: #f5f5f5;
            padding: 10px 20px;
            border-top: 1px solid #e0e0e0;
            border-radius: 0 0 5px 5px;
            font-size: 12px;
            color: #666;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4a86e8;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
          }
          .info-box {
            background-color: #f8f9fa;
            padding: 15px;
            border-left: 4px solid #4a86e8;
            margin-bottom: 20px;
          }
          .important {
            color: #d73a49;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Case Study Assignment</h2>
          </div>
          <div class="content">
            <p>Hello ${recipientName},</p>
            
            <p>A new case study has been assigned to you in your class:</p>
            
            <div class="info-box">
              <p><strong>Case Study:</strong> ${caseStudyTitle}</p>
              <p><strong>Class:</strong> ${className} (${classSubject})</p>
              <p><strong>Tasks:</strong> Fact Finding & Analysis</p>
              <p><strong>Start Time:</strong> ${startTime}</p>
              <p><strong>End Time:</strong> ${endTime}</p>
            </div>
            
            <p>Please log in to your Practywiz account to access and complete both the fact finding and analysis tasks for this case study before the deadline.</p>
            
            <p class="important">Note: Both tasks must be completed within the specified time frame.</p>
            
            <a href="https://practywiz.com/login" class="button">Login to Practywiz</a>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply directly to this email.</p>
            <p>&copy; ${new Date().getFullYear()} Practywiz. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}

export function caseStudySplitEmailTemplate(
  recipientEmail,
  recipientName,
  caseStudyTitle,
  className,
  classSubject,
  factStartTime,
  factEndTime,
  analysisStartTime,
  analysisEndTime
) {
  return {
    from: { email: "noreply@practywiz.com", name: "Practywiz" },
    to: recipientEmail,
    subject: `Case Study Assignment: ${caseStudyTitle} - Fact Finding & Analysis`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
          }
          .header {
            background-color: #4a86e8;
            color: white;
            padding: 10px 20px;
            border-radius: 5px 5px 0 0;
          }
          .content {
            padding: 20px;
          }
          .footer {
            background-color: #f5f5f5;
            padding: 10px 20px;
            border-top: 1px solid #e0e0e0;
            border-radius: 0 0 5px 5px;
            font-size: 12px;
            color: #666;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4a86e8;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
          }
          .info-box {
            background-color: #f8f9fa;
            padding: 15px;
            border-left: 4px solid #4a86e8;
            margin-bottom: 20px;
          }
          .important {
            color: #d73a49;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Case Study Assignment</h2>
          </div>
          <div class="content">
            <p>Hello ${recipientName},</p>
            
            <p>A new case study has been assigned to you in your class:</p>
            
            <div class="info-box">
              <p><strong>Case Study:</strong> ${caseStudyTitle}</p>
              <p><strong>Class:</strong> ${className} (${classSubject})</p>
              <p><strong>Tasks:</strong> Fact Finding & Analysis</p>
              <p><strong>Fact Finding Start Time:</strong> ${factStartTime}</p>
              <p><strong>Fact Finding End Time:</strong> ${factEndTime}</p>
              <p><strong>Analysis Start Time:</strong> ${analysisStartTime}</p>
              <p><strong>Analysis End Time:</strong> ${analysisEndTime}</p>
            </div>
            <p>Please log in to your Practywiz account to access and complete both the fact finding and analysis tasks for this case study before the deadlines.</p>
            <p class="important">Note: Both tasks must be completed within the specified time frames.</p>
            <a href="https://practywiz.com/login" class="button">Login to Practywiz</a>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply directly to this email.</p>
            <p>&copy; ${new Date().getFullYear()} Practywiz. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}

export function caseStudyReminderEmailTemplate(
  recipientEmail,
  recipientName,
  caseStudyTitle,
  className,
  classSubject,
  startTime,
  taskType
) {
  return {
    from: { email: "noreply@practywiz.com", name: "Practywiz" },
    to: recipientEmail,
    subject: `REMINDER: Case Study ${caseStudyTitle} - ${taskType} Starting Soon`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
          }
          .header {
            background-color: #ff9800;
            color: white;
            padding: 10px 20px;
            border-radius: 5px 5px 0 0;
          }
          .content {
            padding: 20px;
          }
          .footer {
            background-color: #f5f5f5;
            padding: 10px 20px;
            border-top: 1px solid #e0e0e0;
            border-radius: 0 0 5px 5px;
            font-size: 12px;
            color: #666;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #ff9800;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
          }
          .info-box {
            background-color: #fff3e0;
            padding: 15px;
            border-left: 4px solid #ff9800;
            margin-bottom: 20px;
          }
          .important {
            color: #d73a49;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>⏰ REMINDER: Case Study Starting Soon</h2>
          </div>
          <div class="content">
            <p>Hello ${recipientName},</p>
            
            <p>This is a friendly reminder that your case study task starts in less than an hour:</p>
            
            <div class="info-box">
              <p><strong>Case Study:</strong> ${caseStudyTitle}</p>
              <p><strong>Class:</strong> ${className} (${classSubject})</p>
              <p><strong>Task:</strong> ${taskType}</p>
              <p><strong>Starts At:</strong> ${startTime}</p>
            </div>
            
            <p>Please be ready to access the case study through your Practywiz account at the scheduled time.</p>
            
            <p class="important">Make sure you have allocated sufficient time to complete this task.</p>
            
            <a href="https://practywiz.com/login" class="button">Login to Practywiz</a>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply directly to this email.</p>
            <p>&copy; ${new Date().getFullYear()} Practywiz. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}

export function caseStudyCombinedReminderEmailTemplate(
  recipientEmail,
  recipientName,
  caseStudyTitle,
  className,
  classSubject,
  startTime
) {
  return {
    from: { email: "noreply@practywiz.com", name: "Practywiz" },
    to: recipientEmail,
    subject: `REMINDER: Case Study ${caseStudyTitle} - Starting Soon`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
          }
          .header {
            background-color: #ff9800;
            color: white;
            padding: 10px 20px;
            border-radius: 5px 5px 0 0;
          }
          .content {
            padding: 20px;
          }
          .footer {
            background-color: #f5f5f5;
            padding: 10px 20px;
            border-top: 1px solid #e0e0e0;
            border-radius: 0 0 5px 5px;
            font-size: 12px;
            color: #666;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #ff9800;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
          }
          .info-box {
            background-color: #fff3e0;
            padding: 15px;
            border-left: 4px solid #ff9800;
            margin-bottom: 20px;
          }
          .important {
            color: #d73a49;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>⏰ REMINDER: Case Study Starting Soon</h2>
          </div>
          <div class="content">
            <p>Hello ${recipientName},</p>
            
            <p>This is a friendly reminder that your case study starts in less than an hour:</p>
            
            <div class="info-box">
              <p><strong>Case Study:</strong> ${caseStudyTitle}</p>
              <p><strong>Class:</strong> ${className} (${classSubject})</p>
              <p><strong>Tasks:</strong> Fact Finding & Analysis</p>
              <p><strong>Starts At:</strong> ${startTime}</p>
            </div>
            
            <p>Please be ready to access the case study through your Practywiz account at the scheduled time.</p>
            
            <p class="important">Make sure you have allocated sufficient time to complete both the fact finding and analysis tasks.</p>
            
            <a href="https://practywiz.com/login" class="button">Login to Practywiz</a>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply directly to this email.</p>
            <p>&copy; ${new Date().getFullYear()} Practywiz. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}
