import { ShieldCheck, Award, GraduationCap, Target, Users, BookOpen } from "lucide-react";

export default function About() {
  return (
    <div>
      <section className="bg-[#051C42] text-white py-20">
        <div className="container-x">
          <div className="eyebrow text-[#FF9800]">About SSICE</div>
          <h1 className="heading-1 mt-2 text-white">Empowering Students Through Digital Education</h1>
          <p className="mt-4 text-gray-200 max-w-2xl">S.S. Institute of Computer Education is a govt-recognised institute committed to making quality computer education accessible to every student in India.</p>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="eyebrow">Our Mission</div>
            <h2 className="heading-2 text-[#0B3D91] mt-2">Skill-first, future-ready training</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Under the leadership of Director <span className="font-bold text-[#0B3D91]">Pappu Singh</span>, SSICE has trained over 2500 students in computer applications, accounting and digital literacy. Our curriculum aligns with NIELIT/CCC, MSME and Skill India guidelines.
            </p>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              {[
                { icon: Award, label: "MSME Registered" },
                { icon: ShieldCheck, label: "ISO 9001:2015 Certified" },
                { icon: GraduationCap, label: "Skill India Approved" },
                { icon: Target, label: "Digital India Partner" },
              ].map(({ icon: Ic, label }) => (
                <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F7FA] border border-gray-100">
                  <Ic className="text-[#FF9800]" />
                  <span className="font-semibold text-[#0B3D91] text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <img src="https://images.pexels.com/photos/10638075/pexels-photo-10638075.jpeg" alt="SSICE" className="rounded-3xl shadow-2xl w-full h-[400px] object-cover" />
        </div>
      </section>

      <section className="bg-[#F5F7FA] section">
        <div className="container-x grid md:grid-cols-3 gap-6">
          {[
            { icon: Users, n: "2500+", l: "Students Trained" },
            { icon: BookOpen, n: "11", l: "Courses Offered" },
            { icon: Award, n: "98%", l: "Certification Pass Rate" },
          ].map(({ icon: Ic, n, l }) => (
            <div key={l} className="bg-white rounded-2xl p-8 border border-gray-100 text-center shadow-sm">
              <Ic className="text-[#FF9800] mx-auto" size={36} />
              <div className="text-4xl font-extrabold text-[#0B3D91] font-display mt-4">{n}</div>
              <div className="text-sm text-gray-500 mt-1 uppercase tracking-wider">{l}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
