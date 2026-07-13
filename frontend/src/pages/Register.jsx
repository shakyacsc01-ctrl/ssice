import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { formatError } from "@/lib/api";
import { toast } from "sonner";

export default function Register() {
  const [f, setF] = useState({ name: "", email: "", password: "", phone: "", role: "student" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(f);
      toast.success("Registration successful!");
      nav("/dashboard");
    } catch (err) { toast.error(formatError(err)); }
    finally { setLoading(false); }
  };

  return (
    <div className="container-x section">
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-xl">
        <div className="eyebrow">Online Admission</div>
        <h1 className="heading-2 mt-2 text-[#0B3D91]">Apply to SSICE</h1>
        <p className="text-sm text-gray-500 mt-2">Fill in your details to start your digital learning journey.</p>

        <form onSubmit={submit} className="mt-7 space-y-4" data-testid="register-form">
          {[
            ["name","Full Name","text",true],
            ["email","Email","email",true],
            ["phone","Phone Number","tel",false],
            ["password","Password (min 6 chars)","password",true],
          ].map(([k,l,t,req]) => (
            <div key={k}>
              <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider">{l}</label>
              <input
                type={t} required={req}
                value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })}
                data-testid={`register-${k}-input`}
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B3D91] focus:ring-2 focus:ring-[#0B3D91]/10 outline-none"
              />
            </div>
          ))}
          <div>
            <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Register as</label>
            <select
              value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })}
              data-testid="register-role-select"
              className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B3D91] outline-none"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher (subject to approval)</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn-secondary w-full" data-testid="register-submit-btn">
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>

        <p className="mt-5 text-sm text-gray-500 text-center">
          Already have an account? <Link to="/login" className="text-[#0B3D91] font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
}
