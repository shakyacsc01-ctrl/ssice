import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard, BookOpen, FileText, Trophy, Award, Bell, Users,
  Upload, LogOut, GraduationCap, ClipboardCheck, ShieldCheck
} from "lucide-react";

const STUDENT = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/practice", label: "Practice MCQs", icon: ClipboardCheck },
  { to: "/exams", label: "Online Exams", icon: FileText },
];

const TEACHER = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/mcqs", label: "Manage MCQs", icon: Upload },
  { to: "/exams", label: "Exams", icon: FileText },
];

const ADMIN = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/mcqs", label: "MCQ Bank", icon: Upload },
  { to: "/exams", label: "Exams", icon: FileText },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const items = user?.role === "admin" ? ADMIN : user?.role === "teacher" ? TEACHER : STUDENT;

  return (
    <aside className="bg-[#051C42] text-white w-64 min-h-screen sticky top-0 hidden lg:flex flex-col" data-testid="dashboard-sidebar">
      <div className="px-5 py-5 border-b border-white/10 flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-[#FF9800] grid place-items-center">
          <GraduationCap size={22} />
        </div>
        <div>
          <div className="font-extrabold font-display">SSICE</div>
          <div className="text-[10px] uppercase tracking-wider text-gray-300">{user?.role} Panel</div>
        </div>
      </div>

      <nav className="p-3 flex-1 space-y-1">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            data-testid={`sidebar-${label.toLowerCase().replace(/\s+/g,'-')}`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive ? "bg-[#FF9800] text-white font-semibold" : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 pb-3">
          <div className="w-9 h-9 rounded-full bg-[#FF9800] grid place-items-center font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="text-xs">
            <div className="font-semibold">{user?.name}</div>
            <div className="text-gray-400">{user?.email}</div>
          </div>
        </div>
        <button
          onClick={async () => { await logout(); nav("/"); }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-red-500/80 text-sm font-semibold transition-colors"
          data-testid="sidebar-logout-btn"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}
