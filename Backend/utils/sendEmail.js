const nodemailer = require("nodemailer");

module.exports = async (userEmail, subject, htmlTemplate) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mohamed.gamal2052000@gmail.com",
        pass: "rrmk ookh zwys ipjo",
      },
    });

    const mailOptions = {
      from: process.env.APP_EMAIL_ADDRESS,
      to: userEmail,
      subject: subject,
      html: htmlTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email Sent: " + info.response);
  } catch (error) {
    console.log(error);
    throw new Error("Internal Server Error (nodemailer)");
  }
};
