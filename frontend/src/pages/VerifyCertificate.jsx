import { useState } from "react";
import { api, formatError } from "@/lib/api";
import { toast } from "sonner";
import { Search, ShieldCheck, X } from "lucide-react";

export default function VerifyCertificate() {
  const [certNo, setCertNo] = useState("");
  const [cert, setCert] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const search = async (e) => {
    e.preventDefault();
    setLoading(true); setCert(null); setErr(null);
    try {
      const { data } = await api.get(`/certificates/verify/${certNo}`);
      setCert(data);
    } catch (e) { setErr(formatError(e)); }
    finally { setLoading(false); }
  };

  return (
    <div className="section">
      <div className="container-x max-w-3xl">
        <div className="eyebrow">Authenticity Check</div>
        <h1 className="heading-2 text-[#0B3D91] mt-2">Verify a SSICE Certificate</h1>
        <p className="text-gray-500 mt-2">Enter the certificate number printed on the document to verify its authenticity.</p>

        <form onSubmit={search} className="mt-8 flex gap-3" data-testid="verify-form">
          <input
            value={certNo} onChange={(e) => setCertNo(e.target.value.toUpperCase())}
            placeholder="e.g. SSICE-2026-12345"
            data-testid="verify-cert-input"
            className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B3D91] focus:ring-2 focus:ring-[#0B3D91]/10 outline-none"
          />
          <button type="submit" disabled={loading} className="btn-primary" data-testid="verify-submit-btn">
            <Search size={18} /> Verify
          </button>
        </form>

        {cert && (
          <div className="mt-8 rounded-2xl border-2 border-[#4CAF50] bg-green-50 p-6" data-testid="verify-result-success">
            <div className="flex items-center gap-3"><ShieldCheck className="text-[#4CAF50]" size={28} /> <span className="font-display font-bold text-lg text-[#0B3D91]">Certificate Verified</span></div>
            <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
              <div><div className="text-xs uppercase text-gray-500">Certificate No</div><div className="font-semibold">{cert.cert_no}</div></div>
              <div><div className="text-xs uppercase text-gray-500">Student</div><div className="font-semibold">{cert.student_name}</div></div>
              <div><div className="text-xs uppercase text-gray-500">Course</div><div className="font-semibold">{cert.course_name}</div></div>
              <div><div className="text-xs uppercase text-gray-500">Grade</div><div className="font-semibold">{cert.grade} ({cert.percent}%)</div></div>
              <div><div className="text-xs uppercase text-gray-500">Issued</div><div className="font-semibold">{new Date(cert.issued_at).toLocaleDateString()}</div></div>
              <div><div className="text-xs uppercase text-gray-500">Director</div><div className="font-semibold">{cert.director}</div></div>
            </div>
          </div>
        )}
        {err && (
          <div className="mt-8 rounded-2xl border-2 border-red-300 bg-red-50 p-6 flex items-center gap-3" data-testid="verify-result-error">
            <X className="text-red-500" /> <span className="font-semibold text-red-700">{err}</span>
          </div>
        )}
      </div>
    </div>
  );
}
