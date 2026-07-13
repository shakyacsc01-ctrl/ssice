import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { formatError } from "@/lib/api";
import { toast } from "sonner";
import { GraduationCap, User, Shield } from "lucide-react";

const ROLES = [
  { v: "student", label: "Student", icon: GraduationCap, color: "#0B3D91" },
  { v: "teacher", label: "Teacher", icon: User, color: "#FF9800" },
  { v: "admin", label: "Admin", icon: Shield, color: "#4CAF50" },
];

export default function Login() {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password, role);
      toast.success("Welcome back!");
      nav("/dashboard");
    } catch (err) {
      toast.error(formatError(err));
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[80vh] grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#0B3D91] to-[#051C42] text-white p-14 relative overflow-hidden">
        <div>
          <Link to="/" className="font-display font-extrabold text-2xl">SSICE</Link>
          <p className="text-[#FF9800] text-xs uppercase tracking-wider mt-1">Empowering Students Through Digital Education</p>
        </div>
        <div>
          <h2 className="heading-2 text-white">Welcome back to your learning journey.</h2>
          <p className="text-gray-300 mt-3 text-sm">Access study materials, practice MCQs and your certificates.</p>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#FF9800]/20 blur-3xl"></div>
      </div>

      <div className="flex items-center justify-center p-8 lg:p-14 bg-white">
        <form onSubmit={submit} className="w-full max-w-md" data-testid="login-form">
          <div className="eyebrow">Sign in</div>
          <h1 className="heading-2 mt-2 text-[#0B3D91]">Login to SSICE</h1>
          <p className="text-sm text-gray-500 mt-2">Choose your role to continue</p>

          <div className="grid grid-cols-3 gap-2 mt-6">
            {ROLES.map(({ v, label, icon: Ic, color }) => (
              <button
                key={v} type="button" onClick={() => setRole(v)}
                data-testid={`login-role-${v}`}
                className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all ${
                  role === v ? "border-[#FF9800] bg-orange-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Ic size={18} style={{ color: role === v ? "#FF9800" : color }} />
                <span className={`text-xs font-semibold ${role === v ? "text-[#FF9800]" : "text-gray-700"}`}>{label}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Email</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                data-testid="login-email-input"
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B3D91] focus:ring-2 focus:ring-[#0B3D91]/10 outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Password</label>
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                data-testid="login-password-input"
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B3D91] focus:ring-2 focus:ring-[#0B3D91]/10 outline-none"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full" data-testid="login-submit-btn">
              {loading ? "Signing in..." : `Login as ${ROLES.find(r => r.v === role).label}`}
            </button>
          </div>

          <p className="mt-5 text-sm text-gray-500 text-center">
            New student? <Link to="/register" className="text-[#FF9800] font-semibold">Apply for admission</Link>
          </p>

          <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-600">
            <div className="font-semibold text-gray-700 mb-1">Demo Credentials:</div>
            <div>Student: student@ssice.com / student123</div>
            <div>Teacher: teacher@ssice.com / teacher123</div>
            <div>Admin: admin@ssice.com / admin123</div>
          </div>
        </form>
      </div>
    </div>
  );
}
