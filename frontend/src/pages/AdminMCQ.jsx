import { useEffect, useRef, useState } from "react";
import { api, formatError } from "@/lib/api";
import { toast } from "sonner";
import Sidebar from "@/components/Sidebar";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Upload, Plus, Trash2 } from "lucide-react";

export default function AdminMCQ() {
  const [mcqs, setMcqs] = useState([]);
  const [subject, setSubject] = useState("");
  const [form, setForm] = useState({ question:"", option_a:"", option_b:"", option_c:"", option_d:"", correct:"A", explanation:"", subject:"Computer Fundamentals", chapter:"", difficulty:"medium" });
  const fileRef = useRef();

  const load = () => api.get("/mcqs", { params: { limit: 200, ...(subject && { subject }) } }).then((r) => setMcqs(r.data));
  useEffect(() => { load(); }, [subject]);

  const add = async (e) => {
    e.preventDefault();
    try { await api.post("/mcqs", form); toast.success("Added"); setForm({ ...form, question:"", option_a:"", option_b:"", option_c:"", option_d:"", explanation:"", chapter:"" }); load(); }
    catch (e) { toast.error(formatError(e)); }
  };

  const upload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const fd = new FormData(); fd.append("file", file);
    try {
      const { data } = await api.post("/mcqs/bulk-upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success(`Inserted ${data.inserted} MCQs`);
      if (data.errors?.length) toast.warning(`${data.errors.length} rows had errors`);
      load();
    } catch (err) { toast.error(formatError(err)); }
    fileRef.current.value = "";
  };

  const del = async (id) => { await api.delete(`/mcqs/${id}`); toast.success("Deleted"); load(); };

  const downloadTemplate = () => {
    const csv = "question,option_a,option_b,option_c,option_d,correct,explanation,subject,chapter,difficulty\nWhat is HTML?,Language,Browser,Database,Server,A,HTML is a markup language,Web,HTML,easy";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "mcq-template.csv"; a.click();
  };

  return (
    <div className="flex bg-[#F5F7FA] min-h-screen">
      <Sidebar />
      <main className="flex-1 p-5 md:p-8 max-w-full overflow-x-hidden">
        <h1 className="font-display text-2xl font-bold text-[#0B3D91]">MCQ Bank</h1>
        <p className="text-sm text-gray-500">Add questions or bulk-upload via CSV/Excel.</p>

        <div className="mt-6 grid lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3"><Upload className="text-[#FF9800]" /> <h3 className="font-display font-bold text-[#0B3D91]">Bulk Upload (CSV / Excel)</h3></div>
            <p className="text-xs text-gray-500 mb-3">Columns: question, option_a, option_b, option_c, option_d, correct, explanation, subject, chapter, difficulty</p>
            <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" onChange={upload} className="text-sm" data-testid="mcq-upload-file" />
            <button onClick={downloadTemplate} className="btn-ghost mt-3 text-xs" data-testid="mcq-download-template">Download CSV Template</button>
          </div>

          <form onSubmit={add} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" data-testid="mcq-add-form">
            <div className="flex items-center gap-2 mb-3"><Plus className="text-[#0B3D91]" /> <h3 className="font-display font-bold text-[#0B3D91]">Add Single MCQ</h3></div>
            <input required placeholder="Question" value={form.question} onChange={(e) => setForm({...form, question: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none text-sm" data-testid="mcq-question" />
            <div className="grid grid-cols-2 gap-2 mt-2">
              {["a","b","c","d"].map((o) => (
                <input key={o} required placeholder={`Option ${o.toUpperCase()}`} value={form[`option_${o}`]} onChange={(e) => setForm({...form, [`option_${o}`]: e.target.value})} className="px-3 py-2 rounded-lg border border-gray-200 outline-none text-sm" data-testid={`mcq-opt-${o}`} />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <select value={form.correct} onChange={(e) => setForm({...form, correct: e.target.value})} className="px-3 py-2 rounded-lg border border-gray-200 outline-none text-sm" data-testid="mcq-correct">
                <option>A</option><option>B</option><option>C</option><option>D</option>
              </select>
              <input placeholder="Subject" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})} className="px-3 py-2 rounded-lg border border-gray-200 outline-none text-sm" />
              <select value={form.difficulty} onChange={(e) => setForm({...form, difficulty: e.target.value})} className="px-3 py-2 rounded-lg border border-gray-200 outline-none text-sm">
                <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
              </select>
            </div>
            <input placeholder="Explanation (optional)" value={form.explanation} onChange={(e) => setForm({...form, explanation: e.target.value})} className="w-full px-3 py-2 mt-2 rounded-lg border border-gray-200 outline-none text-sm" />
            <button type="submit" className="btn-primary w-full mt-3" data-testid="mcq-add-submit">Add Question</button>
          </form>
        </div>

        <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center flex-wrap gap-2 mb-4">
            <h3 className="font-display font-bold text-[#0B3D91]">All Questions ({mcqs.length})</h3>
            <input placeholder="Filter by subject..." value={subject} onChange={(e) => setSubject(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 outline-none text-sm" data-testid="mcq-filter-subject" />
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {mcqs.map((m) => (
              <div key={m.id} className="p-3 rounded-lg bg-[#F5F7FA] flex justify-between items-start gap-3">
                <div className="text-sm">
                  <div className="font-semibold text-[#0B3D91]">{m.question}</div>
                  <div className="text-xs text-gray-500 mt-1">{m.subject} • {m.chapter} • {m.difficulty} • Ans: {m.correct}</div>
                </div>
                <button onClick={() => del(m.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg" data-testid={`mcq-del-${m.id}`}><Trash2 size={16} /></button>
              </div>
            ))}
            {mcqs.length === 0 && <p className="text-gray-400 text-sm">No MCQs in this subject.</p>}
          </div>
        </div>
      </main>
      <WhatsAppButton />
    </div>
  );
}
