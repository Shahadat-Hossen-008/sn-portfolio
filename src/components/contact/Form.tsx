"use client";

import { FormSubmitData } from "@/app/types/formType";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function Form({sendMail}: {sendMail: (formData: FormSubmitData) => Promise<{success: boolean, error: string | null }>}) {
    const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormSubmitData>()

  const onSubmit = async(data: FormSubmitData) => {
  const result =  await sendMail(data);
  if(result.success){
    
    toast.success("Email sent successfully",{
       position: "bottom-right"
    });
  } else{
    toast.error(result.error,{
        position: "bottom-right"
    });
  }
  reset();
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-3 pb-5">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          placeholder="Enter your name"
          className="w-full px-3 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
          required
          {...register("name")}
        />
      </div>
      <div className="flex flex-col gap-3 pb-5">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          className="w-full px-3 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
          required
          {...register("email")}
        />
      </div>
      <div className="flex flex-col gap-3 pb-5">
        <label htmlFor="subject">Subject</label>
        <input
          type="text"
          id="subject"
          placeholder="Enter your subject"
          className="w-full px-3 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
          required
          {...register("subject")}
        />
      </div>
      <div className="flex flex-col gap-3 pb-8">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          placeholder="Enter your message"
          cols={30}
          rows={10}
          className="w-full px-3 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
          required
          {...register("message")}
        />
      </div>
      <button
        type="submit"
        className="bg-linear-to-r from-primary/10 via-primary/15 to-primary/20 border border-primary/20 px-5 py-4 rounded-xl"
      >
        Submit
      </button>
    </form>
  );
}
