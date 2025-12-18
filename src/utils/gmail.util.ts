import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const mailOptions: SMTPTransport.Options = {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
}

const transporter = nodemailer.createTransport(mailOptions);

export const sendMail = async(
    { toMail, mailSubject, htmlContent }:
    { toMail: string, mailSubject: string, htmlContent: string }
) => {
    try{
        await transporter.sendMail({
            from: process.env.SMTP_EMAIL,
            to: toMail,
            subject: mailSubject,
            html: htmlContent
        });

        return "Email send successfully";
    } catch(error) {
        console.error("Error sending email: ",error);
    }
}