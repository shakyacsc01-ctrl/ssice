import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Contact() {
  const [f, setF] = useState({ name: "", email: "", message: "" });
  return (
    <div className="section">
      <div className="container-x">
        <div className="eyebrow">Reach Out</div>
        <h1 className="heading-2 text-[#0B3D91] mt-2">Get in touch</h1>
        <p className="text-gray-500 mt-2">We'd love to hear from you about admissions, courses or partnerships.</p>

        <div className="mt-10 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
            <form onSubmit={(e) => { e.preventDefault(); toast.success("Message sent! We'll get back soon."); setF({name:"",email:"",message:""}); }} data-testid="contact-form">
              <div className="grid sm:grid-cols-2 gap-4">
                <input value={f.name} onChange={(e) => setF({...f, name: e.target.value})} required placeholder="Your name" data-testid="contact-name" className="px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B3D91] outline-none" />
                <input value={f.email} onChange={(e) => setF({...f, email: e.target.value})} required type="email" placeholder="Your email" data-testid="contact-email" className="px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B3D91] outline-none" />
              </div>
              <textarea value={f.message} onChange={(e) => setF({...f, message: e.target.value})} required placeholder="Your message" rows={6} data-testid="contact-message" className="mt-4 w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B3D91] outline-none resize-none"></textarea>
              <button type="submit" className="btn-primary mt-4" data-testid="contact-submit-btn">Send Message</button>
            </form>
          </div>
          <div className="space-y-4">
            {[
              { icon: MapPin, t: "Address", v: "Main Road, Near Bus Stand, Bihar, India" },
              { icon: Phone, t: "Phone", v: "+91 98765 43210" },
              { icon: Mail, t: "Email", v: "info@ssice.in" },
              { icon: Clock, t: "Office Hours", v: "Mon-Sat • 9 AM - 7 PM" },
            ].map(({ icon: Ic, t, v }) => (
              <div key={t} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#E6ECF5] text-[#0B3D91] grid place-items-center"><Ic size={18} /></div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-gray-500">{t}</div>
                  <div className="text-sm font-semibold text-[#0B3D91] mt-1">{v}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
