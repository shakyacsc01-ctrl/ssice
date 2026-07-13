import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import WhatsAppButton from "@/components/WhatsAppButton";
import {
  BookOpen, ClipboardCheck, FileText, BookMarked, Trophy, Award,
  TrendingUp, Bell, Users, Layers, ScrollText, CheckCircle2
} from "lucide-react";

function StatCard({ icon: Ic, label, value, accent }) {
  return (
    <div className="glass rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-0.5 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase text-gray-500 tracking-wider font-semibold">{label}</div>
          <div className="text-3xl font-extrabold text-[#0B3D91] font-display mt-1">{value}</div>
        </div>
        <div className="w-12 h-12 rounded-xl grid place-items-center" style={{ background: accent + "20", color: accent }}><Ic size={22} /></div>
      </div>
    </div>
  );
}

function StudentDash({ user }) {
  const [data, setData] = useState({ courses: [], results: [], certs: [], att: { percent: 0 }, fees: [], notices: [] });

  useEffect(() => {
    (async () => {
      try {
        const [c, r, ce, a, f, n] = await Promise.all([
          api.get("/my/courses"), api.get("/my/results"),
          api.get("/my/certificates"), api.get("/my/attendance"),
          api.get("/my/fees"), api.get("/notices"),
        ]);
        setData({ courses: c.data, results: r.data, certs: ce.data, att: a.data, fees: f.data, notices: n.data });
      } catch {}
    })();
  }, []);

  const due = data.fees.filter((x) => x.status === "due").reduce((s, x) => s + x.amount, 0);

  return (
    <>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-[#0B3D91]">Welcome back, {user.name.split(" ")[0]} 👋</h1>
        <p className="text-sm text-gray-500">Here's a snapshot of your learning today.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label="My Courses" value={data.courses.length} accent="#0B3D91" />
        <StatCard icon={Trophy} label="Exams Taken" value={data.results.length} accent="#FF9800" />
        <StatCard icon={Award} label="Certificates" value={data.certs.length} accent="#4CAF50" />
        <StatCard icon={CheckCircle2} label="Attendance" value={`${data.att.percent}%`} accent="#0B3D91" />
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        <Link to="/practice" className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all" data-testid="dash-practice-card">
          <ClipboardCheck className="text-[#FF9800]" size={28} />
          <h3 className="font-bold text-[#0B3D91] mt-3 font-display">Practice MCQs</h3>
          <p className="text-sm text-gray-500 mt-1">Subject-wise unlimited practice</p>
        </Link>
        <Link to="/exams" className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all" data-testid="dash-exam-card">
          <FileText className="text-[#0B3D91]" size={28} />
          <h3 className="font-bold text-[#0B3D91] mt-3 font-display">Online Exams</h3>
          <p className="text-sm text-gray-500 mt-1">Timed exams with rank list</p>
        </Link>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <ScrollText className="text-[#4CAF50]" size={28} />
          <h3 className="font-bold text-[#0B3D91] mt-3 font-display">Pending Fees</h3>
          <p className="text-2xl font-extrabold mt-1 text-[#FF9800]">₹{due}</p>
        </div>
      </div>

      <div className="mt-6 grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-[#0B3D91] font-display flex items-center gap-2"><BookOpen size={18} /> My Courses</h3>
          <div className="mt-4 space-y-3">
            {data.courses.length === 0 && <p className="text-sm text-gray-400">No enrollments yet. <Link to="/courses" className="text-[#FF9800] font-semibold">Browse courses</Link></p>}
            {data.courses.map((c) => (
              <div key={c.code} className="p-3 rounded-xl bg-[#F5F7FA]">
                <div className="flex justify-between text-sm">
                  <div className="font-semibold text-[#0B3D91]">{c.name}</div>
                  <div className="text-xs text-gray-500">{c.progress}%</div>
                </div>
                <div className="mt-2 h-1.5 bg-white rounded-full overflow-hidden">
                  <div className="h-full bg-[#FF9800]" style={{ width: `${c.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-[#0B3D91] font-display flex items-center gap-2"><Trophy size={18} /> Recent Results</h3>
          <div className="mt-4 space-y-2">
            {data.results.length === 0 && <p className="text-sm text-gray-400">No exam attempts yet.</p>}
            {data.results.slice(0, 4).map((r) => (
              <div key={r.id} className="flex justify-between p-3 rounded-xl bg-[#F5F7FA] text-sm">
                <span className="font-semibold text-[#0B3D91]">{r.exam_title}</span>
                <span className={`font-bold ${r.passed ? "text-[#4CAF50]" : "text-red-500"}`}>{r.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {data.certs.length > 0 && (
        <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-[#0B3D91] font-display flex items-center gap-2"><Award size={18} /> My Certificates</h3>
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            {data.certs.map((c) => (
              <Link key={c.id} to={`/certificate/${c.cert_no}`} className="p-4 rounded-xl border border-gray-200 hover:border-[#FF9800] transition-colors" data-testid={`cert-link-${c.cert_no}`}>
                <div className="text-xs text-gray-500">{c.cert_no}</div>
                <div className="font-semibold text-[#0B3D91] mt-1">{c.course_name}</div>
                <div className="text-xs text-[#FF9800] font-bold mt-1">Grade {c.grade} • {c.percent}%</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function AdminDash({ user }) {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/admin/stats").then((r) => setStats(r.data));
    api.get("/admin/users").then((r) => setUsers(r.data));
  }, []);

  return (
    <>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-[#0B3D91]">Admin Control Room</h1>
        <p className="text-sm text-gray-500">Live institute metrics & management.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Students" value={stats.students || 0} accent="#0B3D91" />
        <StatCard icon={Users} label="Teachers" value={stats.teachers || 0} accent="#FF9800" />
        <StatCard icon={BookOpen} label="Courses" value={stats.courses || 0} accent="#4CAF50" />
        <StatCard icon={Layers} label="MCQs" value={stats.mcqs || 0} accent="#0B3D91" />
        <StatCard icon={FileText} label="Exams" value={stats.exams || 0} accent="#FF9800" />
        <StatCard icon={Award} label="Certificates" value={stats.certificates || 0} accent="#4CAF50" />
        <StatCard icon={Trophy} label="Attempts" value={stats.attempts || 0} accent="#0B3D91" />
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        <Link to="/admin/users" className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
          <Users className="text-[#0B3D91]" /> <h3 className="font-bold mt-3 font-display">Manage Users</h3>
          <p className="text-xs text-gray-500 mt-1">{users.length} total accounts</p>
        </Link>
        <Link to="/admin/mcqs" className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
          <Layers className="text-[#FF9800]" /> <h3 className="font-bold mt-3 font-display">MCQ Bank</h3>
          <p className="text-xs text-gray-500 mt-1">Bulk upload Excel/CSV</p>
        </Link>
        <Link to="/exams" className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
          <FileText className="text-[#4CAF50]" /> <h3 className="font-bold mt-3 font-display">Exam Management</h3>
          <p className="text-xs text-gray-500 mt-1">Create & monitor exams</p>
        </Link>
      </div>
    </>
  );
}

function TeacherDash({ user }) {
  return (
    <>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-[#0B3D91]">Teacher Panel — {user.name}</h1>
        <p className="text-sm text-gray-500">Manage your subjects, MCQs and exams.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/admin/mcqs" className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all">
          <Layers className="text-[#FF9800]" /> <h3 className="font-bold mt-3 font-display">Upload MCQs</h3>
          <p className="text-xs text-gray-500 mt-1">Add subject-wise questions</p>
        </Link>
        <Link to="/exams" className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all">
          <FileText className="text-[#0B3D91]" /> <h3 className="font-bold mt-3 font-display">Exams</h3>
          <p className="text-xs text-gray-500 mt-1">Create & review exams</p>
        </Link>
      </div>
    </>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="flex bg-[#F5F7FA] min-h-screen">
      <Sidebar />
      <main className="flex-1 p-5 md:p-8 max-w-full overflow-x-hidden" data-testid="dashboard-main">
        {user.role === "student" && <StudentDash user={user} />}
        {user.role === "teacher" && <TeacherDash user={user} />}
        {user.role === "admin" && <AdminDash user={user} />}
      </main>
      <WhatsAppButton />
    </div>
  );
}
