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
  } = useForm<FormSubmitData>();

  const onSubmit = async (data: FormSubmitData) => {
    const result = await sendMail(data);
    if (result.success) {
      toast.success("Email sent successfully", {
        position: "bottom-right",
      });
    } else {
      toast.error(result.error, {
        position: "bottom-right",
      });
    }

    reset();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-3 pb-5">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          placeholder="Enter your name"
          className="w-full px-3 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
          {...register("name", { required: true })}
        />
        {errors.name?.type === "required" && <span className="text-red-500 py-1">{errors.name.message}</span>}
      </div>
      <div className="flex flex-col gap-3 pb-5">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          className="w-full px-3 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
          {...register("email", { required: true })}
        />
        {errors.email && <span className="text-red-500 py-1">{errors.email.message}</span>}
      </div>
      <div className="flex flex-col gap-3 pb-5">
        <label htmlFor="subject">Subject</label>
        <input
          type="text"
          id="subject"
          placeholder="Enter your subject"
          className="w-full px-3 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
          {...register("subject",  { required: true })}
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
          className="w-full px-3 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
          {...register("message",  { required: true })}
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
