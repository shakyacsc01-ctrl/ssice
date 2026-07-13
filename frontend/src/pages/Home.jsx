import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Award, BookOpen, Users, Trophy, ShieldCheck, ArrowRight, Star, Sparkles, CheckCircle2 } from "lucide-react";

const HERO_IMG = "https://images.pexels.com/photos/5530484/pexels-photo-5530484.jpeg";
const HERO_IMG_2 = "https://images.pexels.com/photos/10638075/pexels-photo-10638075.jpeg";

const FEATURES = [
  { icon: BookOpen, title: "11+ Courses", desc: "From CCC to ADCA, Tally & Web Designing" },
  { icon: Award, title: "Govt-Recognised", desc: "MSME, ISO 9001 certified institute" },
  { icon: Users, title: "Expert Faculty", desc: "Experienced teachers & live mentoring" },
  { icon: Trophy, title: "Online Exams", desc: "Practice MCQs + timed exams + ranks" },
];

const TESTIMONIALS = [
  { name: "Priya Kumari", course: "DCA Graduate", quote: "SSICE changed my career — got a govt office job within 2 months of completing DCA." },
  { name: "Rahul Verma", course: "Tally + GST", quote: "Best accounting training in our district. Practical, affordable and certified." },
  { name: "Anjali Singh", course: "ADCA Student", quote: "The online MCQ practice helped me clear CCC with 92%. Excellent teachers!" },
];

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [notices, setNotices] = useState([]);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    api.get("/courses").then((r) => setCourses(r.data.slice(0, 6))).catch(() => {});
    api.get("/notices").then((r) => setNotices(r.data.slice(0, 3))).catch(() => {});
    const t = setInterval(() => setSlide((s) => (s + 1) % 2), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative gradient-mesh overflow-hidden" data-testid="home-hero">
        <div className="container-x py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div className="animate-fade-up">
            <div className="eyebrow mb-3">Empowering Students Through Digital Education</div>
            <h1 className="heading-1 text-[#0B3D91]">
              Build a future-ready career at <span className="text-[#FF9800]">SSICE</span>
            </h1>
            <p className="mt-5 text-gray-600 text-base sm:text-lg leading-relaxed max-w-xl">
              S.S. Institute of Computer Education offers govt-recognised diplomas, online exams, study material and certifications — all under one digital roof.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/register" className="btn-secondary" data-testid="hero-admission-btn">Online Admission <ArrowRight size={18} /></Link>
              <Link to="/login" className="btn-primary" data-testid="hero-login-btn">Student Login</Link>
              <Link to="/exams" className="btn-ghost" data-testid="hero-exam-btn">Online Exam</Link>
            </div>

            <div className="mt-10 grid grid-cols-3 max-w-md gap-4">
              {[["2500+","Students"],["11","Courses"],["98%","Pass Rate"]].map(([n,l]) => (
                <div key={l}>
                  <div className="text-3xl font-extrabold text-[#0B3D91] font-display">{n}</div>
                  <div className="text-xs uppercase tracking-wider text-gray-500">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-[420px] lg:h-[480px]">
            <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl">
              <img src={slide === 0 ? HERO_IMG : HERO_IMG_2} alt="SSICE Classroom" className="w-full h-full object-cover transition-opacity duration-700" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#051C42]/60 to-transparent"></div>
            </div>
            <div className="glass absolute -bottom-4 -left-4 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-[#4CAF50]" />
                <div>
                  <div className="text-sm font-bold text-[#0B3D91]">ISO 9001:2015</div>
                  <div className="text-xs text-gray-500">Certified Institute</div>
                </div>
              </div>
            </div>
            <div className="glass absolute -top-4 -right-2 rounded-2xl p-4 shadow-xl hidden sm:block">
              <div className="flex items-center gap-2">
                <Sparkles className="text-[#FF9800]" size={18} />
                <span className="text-sm font-semibold text-[#0B3D91]">New Batch: Feb 15</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section bg-white">
        <div className="container-x">
          <div className="text-center mb-12">
            <div className="eyebrow">Why SSICE</div>
            <h2 className="heading-2 mt-2 text-[#0B3D91]">Everything you need to learn & certify</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Ic, title, desc }) => (
              <div key={title} className="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#E6ECF5] text-[#0B3D91] grid place-items-center mb-4">
                  <Ic />
                </div>
                <h3 className="text-lg font-bold text-[#0B3D91] font-display">{title}</h3>
                <p className="text-sm text-gray-600 mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular courses */}
      <section className="section bg-[#F5F7FA]">
        <div className="container-x">
          <div className="flex justify-between items-end mb-8 flex-wrap gap-3">
            <div>
              <div className="eyebrow">Popular Courses</div>
              <h2 className="heading-2 mt-2 text-[#0B3D91]">Choose your path</h2>
            </div>
            <Link to="/courses" className="btn-ghost" data-testid="home-view-all-courses">View all <ArrowRight size={16} /></Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c) => (
              <Link key={c.code} to={`/courses/${c.code}`} className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all" data-testid={`course-card-${c.code}`}>
                <div className="flex justify-between items-start">
                  <div className="px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-[#0B3D91] text-white">{c.code}</div>
                  <div className="text-2xl font-extrabold text-[#FF9800] font-display">₹{c.fees}</div>
                </div>
                <h3 className="mt-4 text-lg font-bold text-[#0B3D91] font-display group-hover:text-[#FF9800] transition-colors">{c.name}</h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{c.description}</p>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                  <span><i className="bi bi-clock"></i> {c.duration}</span>
                  <span className="text-[#0B3D91] font-semibold">Explore →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-white">
        <div className="container-x">
          <div className="text-center mb-10">
            <div className="eyebrow">Testimonials</div>
            <h2 className="heading-2 mt-2 text-[#0B3D91]">What our students say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="rounded-2xl p-7 bg-[#F5F7FA] border border-gray-100">
                <div className="flex gap-1 text-[#FF9800]">
                  {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="#FF9800" />)}
                </div>
                <p className="mt-3 text-sm text-gray-700 leading-relaxed">"{t.quote}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0B3D91] text-white grid place-items-center font-bold">{t.name[0]}</div>
                  <div>
                    <div className="font-semibold text-sm text-[#0B3D91]">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.course}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest news */}
      {notices.length > 0 && (
        <section className="section bg-[#051C42] text-white">
          <div className="container-x">
            <div className="eyebrow text-[#FF9800] mb-2">Latest News & Notices</div>
            <h2 className="heading-2 text-white">Stay updated</h2>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              {notices.map((n) => (
                <div key={n.id} className="glass-dark rounded-2xl p-6">
                  <div className="text-[10px] uppercase tracking-wider text-[#FF9800] font-bold">{n.type}</div>
                  <h3 className="font-display text-lg font-semibold mt-2">{n.title}</h3>
                  <p className="text-sm text-gray-300 mt-2 line-clamp-3">{n.body}</p>
                  <p className="text-[11px] text-gray-400 mt-3">{new Date(n.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section">
        <div className="container-x">
          <div className="rounded-3xl p-10 md:p-16 bg-gradient-to-br from-[#0B3D91] to-[#051C42] text-white grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="heading-2">Ready to start your digital journey?</h2>
              <p className="mt-3 text-gray-200">Join 2500+ students who built successful careers at SSICE.</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link to="/register" className="btn-secondary" data-testid="cta-admission-btn">Apply for Admission</Link>
              <Link to="/contact" className="bg-white text-[#0B3D91] font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition" data-testid="cta-contact-btn">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
