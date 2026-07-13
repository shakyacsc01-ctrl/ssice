import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api, formatError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Clock, IndianRupee, CheckCircle2, BookOpen, FileText, Video } from "lucide-react";

export default function CourseDetail() {
  const { code } = useParams();
  const [course, setCourse] = useState(null);
  const { user } = useAuth();
  const nav = useNavigate();

  useEffect(() => { api.get(`/courses/${code}`).then((r) => setCourse(r.data)); }, [code]);

  const enroll = async () => {
    if (!user) return nav("/login");
    try {
      await api.post(`/enroll/${code}`);
      toast.success("Enrolled successfully");
      nav("/dashboard");
    } catch (e) { toast.error(formatError(e)); }
  };

  if (!course) return <div className="container-x py-20 text-center text-gray-500">Loading...</div>;

  return (
    <div>
      <section className="bg-gradient-to-br from-[#0B3D91] to-[#051C42] text-white py-16">
        <div className="container-x">
          <Link to="/courses" className="text-[#FF9800] text-sm hover:underline">← All Courses</Link>
          <div className="flex items-center gap-3 mt-3">
            <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-[#FF9800] text-white">{course.code}</span>
            <span className="text-xs text-gray-300">Govt Recognised</span>
          </div>
          <h1 className="heading-1 mt-3">{course.name}</h1>
          <p className="mt-3 text-gray-200 max-w-2xl">{course.description}</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
              <Clock size={18} className="text-[#FF9800]" /> <span className="text-sm">{course.duration}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
              <IndianRupee size={18} className="text-[#FF9800]" /> <span className="text-sm font-bold">₹{course.fees}</span>
            </div>
            <button onClick={enroll} className="btn-secondary" data-testid="course-enroll-btn">
              {user ? "Enroll Now" : "Login to Enroll"}
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
              <h2 className="font-display text-xl font-bold text-[#0B3D91]">Syllabus</h2>
              <ul className="mt-4 space-y-3">
                {(course.syllabus || []).map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="text-[#4CAF50] mt-0.5 flex-shrink-0" size={18} />
                    <span className="text-sm text-gray-700">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: BookOpen, t: "Study Material", d: "PDFs, PPTs & notes" },
                { icon: Video, t: "Video Lectures", d: "Recorded sessions" },
                { icon: FileText, t: "Online Tests", d: "MCQs + Final Exam" },
              ].map(({ icon: Ic, t, d }) => (
                <div key={t} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <Ic className="text-[#FF9800]" />
                  <div className="font-semibold text-[#0B3D91] mt-2">{t}</div>
                  <div className="text-xs text-gray-500">{d}</div>
                </div>
              ))}
            </div>
          </div>

          <aside className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm h-fit sticky top-24">
            <div className="text-[10px] uppercase tracking-wider text-[#FF9800] font-bold">Course Fee</div>
            <div className="text-5xl font-extrabold text-[#0B3D91] font-display mt-1">₹{course.fees}</div>
            <div className="text-sm text-gray-500">for {course.duration}</div>
            <button onClick={enroll} className="btn-primary w-full mt-5" data-testid="course-sidebar-enroll-btn">
              {user ? "Enroll Now" : "Login to Enroll"}
            </button>
            <ul className="mt-6 space-y-2 text-sm text-gray-600">
              {["Govt-recognised certificate","Online + offline support","Practical sessions","Free MCQ practice"].map((x) => (
                <li key={x} className="flex gap-2"><CheckCircle2 size={16} className="text-[#4CAF50] mt-0.5" /> {x}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </div>
  );
}
