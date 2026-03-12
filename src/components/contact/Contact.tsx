
import Form from "./Form";

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
        <p className="text-base text-white text-center pb-6">
          Want to discuss about your idea, or just want to say hi?
        </p>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <Form />
        </div>
      </div>
    </section>
  );
}
