import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, formatError } from "@/lib/api";
import { QrCode, ShieldCheck, Award, Download, Printer } from "lucide-react";

export default function Certificate() {
  const { certNo } = useParams();
  const nav = useNavigate();
  const [c, setC] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    api.get(`/certificates/verify/${certNo}`).then((r) => setC(r.data)).catch((e) => setErr(formatError(e)));
  }, [certNo]);

  if (err) return <div className="min-h-screen grid place-items-center text-red-500">{err}</div>;
  if (!c) return <div className="min-h-screen grid place-items-center text-gray-500">Loading certificate...</div>;

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-10 print:bg-white print:py-0">
      <div className="container-x max-w-5xl">
        <div className="flex gap-2 justify-end mb-4 print:hidden">
          <button onClick={() => window.print()} className="btn-secondary" data-testid="cert-print-btn"><Printer size={16} /> Print</button>
          <button onClick={() => nav("/dashboard")} className="btn-ghost" data-testid="cert-back-btn">← Back</button>
        </div>

        <div id="cert-print" className="bg-white p-8 md:p-14 border-8 border-[#0B3D91] relative shadow-2xl print:shadow-none">
          <div className="absolute inset-2 border-2 border-[#FF9800] pointer-events-none"></div>
          {/* Header logos row */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-center">
              <ShieldCheck className="text-[#0B3D91] mx-auto" size={28} />
              <div className="text-[9px] uppercase tracking-wider font-bold mt-1">ISO 9001</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-extrabold text-[#0B3D91] font-display">SSICE</div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-gray-600 mt-1">S.S. Institute of Computer Education</div>
              <div className="text-[10px] italic text-[#FF9800] mt-1">"Empowering Students Through Digital Education"</div>
            </div>
            <div className="text-center">
              <Award className="text-[#FF9800] mx-auto" size={28} />
              <div className="text-[9px] uppercase tracking-wider font-bold mt-1">MSME</div>
            </div>
          </div>

          <div className="border-t-2 border-b-2 border-[#FF9800]/50 py-2 text-center">
            <div className="text-xs uppercase tracking-[0.4em] text-gray-500 font-bold">Certificate of Completion</div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">This is to certify that</p>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold text-[#0B3D91] mt-3 underline decoration-[#FF9800] decoration-2 underline-offset-8">{c.student_name}</h1>
            <p className="mt-5 text-sm text-gray-700 max-w-2xl mx-auto leading-relaxed">
              has successfully completed the <span className="font-bold text-[#0B3D91]">{c.course_name}</span> program with a final score of <span className="font-bold text-[#FF9800]">{c.percent}%</span>, achieving Grade <span className="font-bold text-[#4CAF50]">{c.grade}</span>.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-3 items-end gap-6">
            <div>
              <div className="border-t-2 border-gray-400 pt-2 text-center">
                <div className="font-semibold text-sm">{c.director}</div>
                <div className="text-[10px] uppercase tracking-wider text-gray-500">Director</div>
              </div>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full border-4 border-[#0B3D91] grid place-items-center">
                <div className="text-center">
                  <div className="text-[8px] uppercase font-bold text-[#0B3D91] leading-tight">Institute<br />Seal</div>
                </div>
              </div>
            </div>
            <div>
              <div className="border-2 border-gray-300 p-2 w-24 h-24 ml-auto grid place-items-center bg-white">
                <QrCode className="text-[#0B3D91]" size={64} />
              </div>
              <div className="text-[9px] text-gray-500 text-right mt-1">Scan to verify</div>
            </div>
          </div>

          <div className="mt-8 flex justify-between text-xs text-gray-500 border-t pt-3">
            <div>Certificate No: <span className="font-bold text-[#0B3D91]">{c.cert_no}</span></div>
            <div>Issued: {new Date(c.issued_at).toLocaleDateString()}</div>
            <div>Skill India • Digital India</div>
          </div>
        </div>
      </div>
      <style>{`@media print { .print\\:hidden { display: none; } body { background: white; } }`}</style>
    </div>
  );
}
