import { FormSubmitData } from "@/app/types/formType";
import Form from "./Form";
import nodemailer from "nodemailer";
import EmailContainer from "@/emails/EmailContainer";
import { render } from '@react-email/render';

export default function Contact() {
  const sendMail = async(formData: FormSubmitData) => {
    "use server";
    try {
      const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  } 
  
});

const emailHtml = await render(<EmailContainer name={formData.name} email={formData.email} subject={formData.subject} message={formData.message} />);

  const mailOptions = {
    from: formData.email,
    to: process.env.MAIL_RECIEVER_ADDRESS,
    subject: formData.subject,
    text: formData.message, 
    html: emailHtml
  }
  console.log(formData, emailHtml);
  
  // Send Email
  await transporter.sendMail(mailOptions);
  return { success: true, error: null };
    } catch (error) {
      return { success: false, error: "Failed to send email" };
    }
  }
  return (
    <section id="contact" className="relative bg-black py-20 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 opacity-20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 opacity-20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translatex-1/2 -translatey-1/2 w-96 h-96 bg-primary/10 opacity-30 rounded-full blur-3xl" />
      </div>
      <div className="max-w-5xl mx-auto px-4 lg:px-20 py-4">
         <h2 className="text-3xl md:text-5xl pb-6 text-center">Get in touch</h2>
         <p className="text-base text-white text-center pb-6">Want to discuss about your idea, or just want to say hi?</p>
         <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <Form sendMail={sendMail}/>
         </div>
      </div>
    </section>
  );
}
