import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { api, formatError } from "@/lib/api";
import { toast } from "sonner";
import Sidebar from "@/components/Sidebar";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Clock, FileText, Plus, Play } from "lucide-react";

export default function ExamList() {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [f, setF] = useState({ title: "", course_code: "CCC", duration_min: 15, total_questions: 10, negative_marking: 0, pass_percent: 40, subject: "" });

  const load = () => api.get("/exams").then((r) => setExams(r.data));
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    try {
      await api.post("/exams", { ...f, subject: f.subject || null });
      toast.success("Exam created");
      setShowForm(false); load();
    } catch (e) { toast.error(formatError(e)); }
  };

  return (
    <div className="flex bg-[#F5F7FA] min-h-screen">
      <Sidebar />
      <main className="flex-1 p-5 md:p-8 max-w-full overflow-x-hidden">
        <div className="flex justify-between items-end mb-6 flex-wrap gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#0B3D91]">Online Exams</h1>
            <p className="text-sm text-gray-500">Timed examinations with instant results.</p>
          </div>
          {(user?.role === "admin" || user?.role === "teacher") && (
            <button onClick={() => setShowForm(!showForm)} className="btn-secondary" data-testid="exam-create-toggle"><Plus size={16} /> New Exam</button>
          )}
        </div>

        {showForm && (
          <form onSubmit={create} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6 grid sm:grid-cols-2 gap-3" data-testid="exam-form">
            {[["title","Title","text"],["course_code","Course Code","text"],["subject","Subject (optional)","text"],
              ["duration_min","Duration (min)","number"],["total_questions","Total Questions","number"],
              ["negative_marking","Negative Marking","number"],["pass_percent","Pass %","number"]].map(([k,l,t]) => (
              <input key={k} type={t} placeholder={l} required={k!=="subject" && k!=="negative_marking"}
                value={f[k]} step={t==="number" ? "0.25" : undefined}
                onChange={(e) => setF({...f, [k]: t === "number" ? Number(e.target.value) : e.target.value})}
                className="px-3 py-2.5 rounded-lg border border-gray-200 focus:border-[#0B3D91] outline-none text-sm"
              />
            ))}
            <button type="submit" className="btn-primary sm:col-span-2" data-testid="exam-form-submit">Create Exam</button>
          </form>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {exams.length === 0 && <p className="text-gray-400 text-sm">No exams yet.</p>}
          {exams.map((e) => (
            <div key={e.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#FF9800]">{e.course_code}</div>
                  <h3 className="font-display font-bold text-lg text-[#0B3D91] mt-1">{e.title}</h3>
                </div>
                <FileText className="text-gray-300" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-[#F5F7FA] text-center"><Clock size={12} className="inline" /> <span className="font-semibold ml-1">{e.duration_min} min</span></div>
                <div className="p-2 rounded-lg bg-[#F5F7FA] text-center"><span className="text-gray-500">Qs:</span> <span className="font-semibold">{e.total_questions}</span></div>
                <div className="p-2 rounded-lg bg-[#F5F7FA] text-center"><span className="text-gray-500">Pass:</span> <span className="font-semibold">{e.pass_percent}%</span></div>
              </div>
              {user?.role === "student" && (
                <Link to={`/exam/${e.id}`} className="btn-primary w-full mt-4" data-testid={`exam-start-${e.id}`}><Play size={14} /> Start Exam</Link>
              )}
            </div>
          ))}
        </div>
      </main>
      <WhatsAppButton />
    </div>
  );
}
