import { createTransport } from "nodemailer";
import { config } from "dotenv";
config()

const transporter = createTransport({
    service: "gmail",
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
    },
});

const sendMailService = async (to, subject, text,html) => {
    const info = await transporter.sendMail({
        from: process.env.NODEMAILER_USER,
        to,
        subject,
        text,
        html:html || httpGenerator(subject, text)
    })

    return info;
}


const httpGenerator = (subject, text) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${process.env.APP_NAME} Email</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      color: #333;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: #007bff;
      color: #fff;
      text-align: center;
      padding: 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .body {
      padding: 20px;
      line-height: 1.6;
    }
    .body h2 {
      color: #007bff;
    }
    .footer {
      background: #f4f4f4;
      text-align: center;
      padding: 10px;
      font-size: 14px;
      color: #777;
    }
    @media (max-width: 600px) {
      .email-container {
        width: 100%;
      }
      .body {
        padding: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1>${process.env.APP_NAME}</h1>
    </div>

    <!-- Body -->
    <div class="body">
      <h2>${subject},</h2>
      <p>${text}</p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>&copy; 2025 ${process.env.APP_NAME}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`
}

export default sendMailService