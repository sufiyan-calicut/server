import nodeMailer from "nodemailer";
import otpGenerator from "otp-generator";

export const sendOtp = (mail) => {
  return new Promise(async (resolve, reject) => {
    const transporter = nodeMailer.createTransport({
      service: "Gmail",
      auth: {
        user: "testnajwatest@gmail.com",
        pass: "ibfpkpxhccvtpshw",
      },
    });

    const OTP = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    console.log(OTP)

    const mailOptions = {
      from: process.env.MAIL,
      to: mail,
      subject: "OTP Verification",
      html: `<h1>Here is your OTP Verification code : ${OTP}</h1>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      resolve(OTP);
    } catch (error) {
      console.log(error);
      resolve(error);
    }
  });
};
