import nodemailer from "nodemailer"
import config from "config"
import debug from "debug"
const mailDebugger = debug("app:mailDebugger")



export const sendEmail = async (email: string, code: string) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "revant.sinha@gmail.com",
            pass: config.get("App_Mail_Password")
        }
    })
    
    const mailOptions = {
        from: "bookHub.com",
        to: email,
        subject: "Email Verification",
        text: `Here is the code to verify your account ${code}`

    }
    try {
        await transporter.sendMail(mailOptions);
        mailDebugger("Email is Sent")
    } catch (error:any) {
        mailDebugger("Email Couldnt be sent");
    }
}



