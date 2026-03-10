export default function Contact() {
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
         <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <form className="">
                <div className="flex flex-col gap-3 pb-5">
                    <label>Name</label>
                    <input name="name" type="text" id="name" placeholder="Enter your name" className="w-full px-3 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300" required/>
                </div>
                <div className="flex flex-col gap-3 pb-5">
                    <label>Email</label>
                    <input name="email" type="email" id="email" placeholder="Enter your email" className="w-full px-3 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300" required/>
                </div>
                <div className="flex flex-col gap-3 pb-8">
                    <textarea name="name" id="name" placeholder="Enter your message" cols={30} rows={10} className="w-full px-3 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300" required/>
                </div>
                <button type="submit" className="bg-linear-to-r from-primary/10 via-primary/15 to-primary/20 border border-primary/20 px-5 py-4 rounded-xl">Submit</button>
         </form>
         </div>
      </div>
    </section>
  );
}
