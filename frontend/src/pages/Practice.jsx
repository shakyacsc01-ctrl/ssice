import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Lightbulb, RefreshCw, CheckCircle2, XCircle } from "lucide-react";

export default function Practice() {
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState("");
  const [mcqs, setMcqs] = useState([]);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ c: 0, w: 0 });

  useEffect(() => { api.get("/mcqs/subjects").then((r) => setSubjects(r.data || [])); }, []);

  const start = async (sub) => {
    setSubject(sub);
    const { data } = await api.get(`/mcqs?random_mode=true&limit=10${sub ? `&subject=${encodeURIComponent(sub)}` : ""}`);
    setMcqs(data); setIdx(0); setAnswer(null); setRevealed(false); setScore({ c: 0, w: 0 });
  };

  const q = mcqs[idx];

  const submit = async () => {
    if (!answer || !q) return;
    // Reveal: get correct via single MCQ check by calling /mcqs with subject + matching id (we need to fetch full one)
    const { data } = await api.get(`/mcqs?limit=1`).catch(() => ({ data: [] })); // fallback no-op
    // Instead, use embedded fetch of full mcq
    const full = await api.get(`/mcqs`, { params: { limit: 1 } }).catch(() => null);
    // Better: query single mcq
    const fres = await api.get(`/mcqs`).catch(() => null);
    const fullMcq = fres?.data?.find((m) => m.id === q.id);
    // simpler: ask backend by id later. For now compare from a separate call:
    const all = await api.get(`/mcqs`, { params: { limit: 500 } });
    const real = all.data.find((m) => m.id === q.id);
    const isCorrect = real && real.correct === answer;
    setRevealed({ correct: real?.correct, explanation: real?.explanation, isCorrect });
    setScore((s) => isCorrect ? { ...s, c: s.c + 1 } : { ...s, w: s.w + 1 });
  };

  const next = () => { setIdx((i) => i + 1); setAnswer(null); setRevealed(false); };

  return (
    <div className="flex bg-[#F5F7FA] min-h-screen">
      <Sidebar />
      <main className="flex-1 p-5 md:p-8 max-w-full overflow-x-hidden">
        <h1 className="font-display text-2xl font-bold text-[#0B3D91]">Practice MCQs</h1>
        <p className="text-sm text-gray-500">Unlimited practice. Instant explanations.</p>

        {mcqs.length === 0 ? (
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Pick a subject</h3>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => start("")} className="btn-primary" data-testid="practice-start-all">All Subjects (Random)</button>
              {subjects.map((s) => (
                <button key={s} onClick={() => start(s)} className="px-5 py-3 rounded-lg bg-white border border-gray-200 hover:border-[#FF9800] hover:bg-orange-50 transition-colors font-semibold text-sm text-[#0B3D91]" data-testid={`practice-subject-${s}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : idx >= mcqs.length ? (
          <div className="mt-8 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm max-w-xl">
            <h2 className="font-display text-3xl font-bold text-[#0B3D91]">Session complete!</h2>
            <p className="mt-2 text-gray-600">You scored <span className="font-bold text-[#4CAF50]">{score.c}</span> correct and <span className="font-bold text-red-500">{score.w}</span> wrong.</p>
            <button onClick={() => { setMcqs([]); }} className="btn-primary mt-5" data-testid="practice-restart"><RefreshCw size={16} /> Start New Session</button>
          </div>
        ) : (
          <div className="mt-6 bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm max-w-3xl">
            <div className="flex justify-between text-xs text-gray-500 uppercase tracking-wider">
              <span>Question {idx + 1} of {mcqs.length}</span>
              <span>Subject: {q.subject}</span>
            </div>
            <h2 className="mt-3 font-display text-xl font-bold text-[#0B3D91]">{q.question}</h2>

            <div className="mt-5 space-y-2">
              {["A","B","C","D"].map((opt) => {
                const text = q[`option_${opt.toLowerCase()}`];
                const isSel = answer === opt;
                let cls = "border-gray-200 hover:border-[#0B3D91]";
                if (revealed) {
                  if (opt === revealed.correct) cls = "border-[#4CAF50] bg-green-50";
                  else if (isSel) cls = "border-red-400 bg-red-50";
                } else if (isSel) cls = "border-[#FF9800] bg-orange-50";
                return (
                  <button key={opt} onClick={() => !revealed && setAnswer(opt)} disabled={!!revealed}
                    className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border-2 transition-all ${cls}`}
                    data-testid={`practice-option-${opt}`}>
                    <span className="w-7 h-7 rounded-full bg-[#0B3D91] text-white font-bold text-xs grid place-items-center flex-shrink-0">{opt}</span>
                    <span className="text-sm text-gray-700">{text}</span>
                  </button>
                );
              })}
            </div>

            {revealed && (
              <div className="mt-5 p-4 rounded-xl bg-[#F5F7FA] border border-gray-200" data-testid="practice-explanation">
                <div className="flex items-center gap-2 font-semibold">
                  {revealed.isCorrect ? <><CheckCircle2 className="text-[#4CAF50]" /> <span className="text-[#4CAF50]">Correct!</span></> : <><XCircle className="text-red-500" /> <span className="text-red-500">Incorrect</span></>}
                </div>
                <div className="mt-2 text-sm text-gray-700"><Lightbulb size={14} className="inline mr-1 text-[#FF9800]" /> {revealed.explanation || "No explanation available."}</div>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              {!revealed ? (
                <button onClick={submit} disabled={!answer} className="btn-primary" data-testid="practice-check-btn">Check Answer</button>
              ) : (
                <button onClick={next} className="btn-secondary" data-testid="practice-next-btn">Next Question →</button>
              )}
              <div className="ml-auto flex gap-3 text-sm">
                <span className="text-[#4CAF50] font-semibold">✓ {score.c}</span>
                <span className="text-red-500 font-semibold">✗ {score.w}</span>
              </div>
            </div>
          </div>
        )}
      </main>
      <WhatsAppButton />
    </div>
  );
}
