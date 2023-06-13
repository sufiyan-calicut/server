import nodeMailer from "nodemailer";

export const approveMail = (email, userName) => {
  return new Promise(async (resolve, reject) => {
    // const transporter = nodeMailer.createTransport({
    //   host: "smtp.gmail.com",
    //   port: 465,
    //   secure: true,
    //   service: "Gmail",
    //   auth: {
    //     user: "testnajwatest@gmail.com",
    //     pass: "ibfpkpxhccvtpshw",
    //   },
    // });
    // var mailOptions = {
    //   to: email,
    //   subject: "Approval of Driver Request - Get Ready to Start Earning!",
    //   html: `
    //             <p>Dear ${userName},</p>
    //             <p>I hope this email finds you well. I am pleased to inform you that your request to join our team as a driver has been approved! Congratulations!</p>
    //             <p>Your dedication and qualifications have been duly recognized, and we believe that you will be a valuable asset to our organization. We appreciate your interest in becoming a part of our team and are confident that you will excel in your new role.</p>
    //             <p>To begin your journey as a driver, please follow the steps below:</p>
    //             <ol>
    //                 <li>Driver Login: Visit our website at [insert website link] and click on the "Driver Login" button located on the homepage.</li>
    //                 <li>Account Setup: Once you are on the Driver Login page, please select the option to create a new driver account. Follow the instructions provided to set up your account by entering the necessary details, such as your personal information and contact details.</li>
    //                 <li>Driver Onboarding: After completing the account setup, you will be guided through our driver onboarding process, which includes verifying your driving license, providing additional information, and reviewing our policies and guidelines. This step is crucial to ensure the safety and satisfaction of both our drivers and customers.</li>
    //                 <li>Start Earning: Once your onboarding process is complete, you will be able to start accepting ride requests and earning income as a driver for our team! You will have access to our driver app, where you can view ride requests, navigate to pick-up locations, and provide excellent service to our valued customers.</li>
    //             </ol>
    //             <p>We recommend downloading our driver app onto your smartphone to make the most of your experience. You can find the app by searching for "[App Name]" in your device's app store.</p>
    //             <p>If you encounter any difficulties during the account setup or have any questions about the process, please don't hesitate to reach out to our dedicated driver support team at [driver support email/phone number]. They will be more than happy to assist you.</p>
    //             <p>Once again, congratulations on being approved as a driver! We are excited to have you on board and look forward to a successful and rewarding partnership. Should you require any further information or assistance, please feel free to contact us.</p>
    //             <p>Best regards</p>
    //             <p>CITY-CABS</p>`
    // };
    try {
    //   await transporter.sendMail(mailOptions);
      resolve(true);
    } catch (error) {
      console.log(error);
      resolve(false);
    }
  });
};

export const declineMail = (email, userName) => {
    return new Promise(async (resolve, reject) => {
    //   const transporter = nodeMailer.createTransport({
    //         host: "smtp.gmail.com",
    //         port: 465,
    //         secure: true,
    //         service: 'Gmail',
    //         auth: {
    //             user:'testnajwatest@gmail.com',
    //             pass:'ibfpkpxhccvtpshw'
    //         }
    //     })
    //     const mailOptions = {
    //         to: email,
    //         subject: 'Decline of Driver Request',
    //         html: `
    //             <p>Dear ${userName},</p>
    //             <p>Thank you for your interest in joining our team as a driver. We appreciate the time and effort you put into your application.</p>
    //             <p>After careful consideration, we regret to inform you that your driver request has been declined. We received a high volume of applications, and while your qualifications are impressive, we have limited openings available at the moment.</p>
    //             <p>We encourage you to keep an eye on our job listings as new opportunities may arise in the future. We value your interest in our organization and wish you the best of luck in your future endeavors.</p>
    //             <p>If you have any questions or would like feedback regarding your application, please don't hesitate to reach out to us. We would be happy to provide more information.</p>
    //             <p>Thank you once again for considering our company. We appreciate your understanding.</p>
    //             <p>Best regards</p>
    //             <p>CITY-CABS</p>
    //         `
    //     };
        try {
            // await transporter.sendMail(mailOptions);
            resolve(true);
          } catch (error) {
            console.log(error);
            resolve(false);
          }
      }); 
};
