"use client";

import { sendMail } from "@/app/actions/sendEmail";
import { FormSubmitData } from "@/app/types/formType";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function Form() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormSubmitData>({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: FormSubmitData) => {
    const result = await sendMail(data);
    if (result.success) {
      toast.success("Email sent successfully", {
        position: "bottom-right",
      });
      reset();
    } else {
      toast.error(result.error, {
        position: "bottom-right",
      });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-3 pb-5">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          placeholder="Enter your name"
          className="w-full px-3 py-4 bg-foreground/5 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-focus-ring transition-all duration-300"
          maxLength={100}
          {...register("name", {
            required: "Please enter your name.",
            maxLength: { value: 100, message: "Name must be 100 characters or fewer." },
          })}
        />
        {errors.name && <span className="text-red-500 py-1">{errors.name.message}</span>}
      </div>
      <div className="flex flex-col gap-3 pb-5">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          maxLength={254}
          className="w-full px-3 py-4 bg-foreground/5 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-focus-ring transition-all duration-300"
          {...register("email", {
            required: "Please enter your email address.",
            pattern: {
              value: /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i,
              message: "Invalid email address.",
            },
            maxLength: {
              value: 254,
              message: "Email must be 254 characters or fewer.",
            },
          })}
        />
        {errors.email && <span className="text-red-500 py-1">{errors.email.message}</span>}
      </div>
      <div className="flex flex-col gap-3 pb-5">
        <label htmlFor="subject">Subject</label>
        <input
          type="text"
          id="subject"
          placeholder="Enter your subject"
          className="w-full px-3 py-4 bg-foreground/5 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-focus-ring transition-all duration-300"
          maxLength={150}
          {...register("subject", {
            required: "Please enter a subject.",
            maxLength: { value: 150, message: "Subject must be 150 characters or fewer." },
          })}
        />
        {errors.subject && <span className="text-red-500 py-1">{errors.subject.message}</span>}
      </div>
      <div className="flex flex-col gap-3 pb-8">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          placeholder="Enter your message"
          cols={30}
          rows={10}
          maxLength={5000}
          className="w-full px-3 py-4 bg-foreground/5 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-focus-ring transition-all duration-300"
          {...register("message", {
            required: "Please enter a message.",
            maxLength: { value: 5000, message: "Message must be 5,000 characters or fewer." },
          })}
        />
        {errors.message && <span className="text-red-500 py-1">{errors.message.message}</span>}
      </div>
      <button
        type="submit"
        className="w-full text-center bg-linear-to-r from-primary/10 via-primary/15 to-primary/20 border border-primary/20 px-5 py-4 rounded-xl cursor-pointer hover:bg-primary/20 transition-all duration-300"
      >
        Submit
      </button>
    </form>
  );
}
