import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, formatError } from "@/lib/api";
import { toast } from "sonner";
import { Clock, AlertTriangle, CheckCircle2, XCircle, Trophy } from "lucide-react";

export default function ExamRunner() {
  const { id } = useParams();
  const nav = useNavigate();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [idx, setIdx] = useState(0);
  const [time, setTime] = useState(0);
  const [submitted, setSubmitted] = useState(null);
  const intervalRef = useRef(null);
  const submitting = useRef(false);

  useEffect(() => {
    api.get(`/exams/${id}`).then(({ data }) => {
      setExam(data);
      setTime(data.duration_min * 60);
    }).catch((e) => { toast.error(formatError(e)); nav("/exams"); });
  }, [id, nav]);

  useEffect(() => {
    if (!exam || submitted) return;
    intervalRef.current = setInterval(() => {
      setTime((t) => {
        if (t <= 1) { clearInterval(intervalRef.current); handleSubmit(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line
  }, [exam, submitted]);

  const handleSubmit = async (auto = false) => {
    if (submitting.current || submitted) return;
    submitting.current = true;
    try {
      const { data } = await api.post("/exams/submit", { exam_id: id, answers });
      setSubmitted(data);
      clearInterval(intervalRef.current);
      if (auto) toast.info("Time up! Auto-submitted.");
    } catch (e) { toast.error(formatError(e)); submitting.current = false; }
  };

  if (!exam) return <div className="min-h-screen grid place-items-center text-gray-500">Loading exam...</div>;

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] py-10">
        <div className="container-x max-w-4xl">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl text-center">
            <Trophy className="text-[#FF9800] mx-auto" size={56} />
            <h1 className="heading-2 mt-3 text-[#0B3D91]">{submitted.attempt.passed ? "Congratulations!" : "Result"}</h1>
            <p className="text-gray-500 mt-2">{exam.title}</p>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
              {[
                ["Total", submitted.attempt.total],
                ["Correct", submitted.attempt.correct],
                ["Wrong", submitted.attempt.wrong],
                ["Score", `${submitted.attempt.percent}%`],
              ].map(([l, v]) => (
                <div key={l} className="p-4 rounded-xl bg-[#F5F7FA]">
                  <div className="text-2xl font-extrabold text-[#0B3D91] font-display">{v}</div>
                  <div className="text-xs uppercase tracking-wider text-gray-500">{l}</div>
                </div>
              ))}
            </div>
            <div className={`mt-4 inline-block px-4 py-2 rounded-full font-bold text-sm ${submitted.attempt.passed ? "bg-green-100 text-[#4CAF50]" : "bg-red-100 text-red-500"}`}>
              {submitted.attempt.passed ? "✓ PASSED" : "✗ FAILED"}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 mt-6 border border-gray-100 shadow-sm">
            <h3 className="font-display font-bold text-[#0B3D91] text-lg">OMR Review</h3>
            <div className="mt-4 space-y-3">
              {submitted.review.map((r, i) => (
                <div key={r.mcq_id} className="p-4 rounded-xl bg-[#F5F7FA] border border-gray-100">
                  <div className="flex items-start gap-2">
                    {r.is_correct ? <CheckCircle2 className="text-[#4CAF50] mt-0.5 flex-shrink-0" size={18} /> : <XCircle className="text-red-500 mt-0.5 flex-shrink-0" size={18} />}
                    <div className="text-sm text-gray-700">
                      <span className="font-semibold">Q{i+1}.</span> {r.question}
                    </div>
                  </div>
                  <div className="ml-7 mt-2 text-xs text-gray-600">
                    Your answer: <span className="font-semibold">{r.your_answer || "—"}</span> • Correct: <span className="font-semibold text-[#4CAF50]">{r.correct}</span>
                  </div>
                  {r.explanation && <div className="ml-7 mt-1 text-xs text-gray-500 italic">💡 {r.explanation}</div>}
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3 justify-center">
              <button onClick={() => nav("/dashboard")} className="btn-primary" data-testid="exam-back-dashboard">Back to Dashboard</button>
              <button onClick={() => nav("/exams")} className="btn-ghost" data-testid="exam-more">More Exams</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const q = exam.questions[idx];
  const mm = String(Math.floor(time / 60)).padStart(2, "0");
  const ss = String(time % 60).padStart(2, "0");
  const answered = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-[#F5F7FA]" data-testid="exam-fullscreen">
      <header className="sticky top-0 z-40 bg-[#051C42] text-white">
        <div className="container-x py-3 flex justify-between items-center">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#FF9800]">{exam.course_code}</div>
            <div className="font-display font-bold">{exam.title}</div>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold ${time < 60 ? "bg-red-500 animate-pulse" : "bg-white/10"}`} data-testid="exam-timer">
            <Clock size={18} /> {mm}:{ss}
          </div>
          <button onClick={() => handleSubmit(false)} className="btn-secondary" data-testid="exam-submit-btn">Submit Exam</button>
        </div>
      </header>

      <div className="container-x py-8 grid lg:grid-cols-[1fr_280px] gap-6">
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
          <div className="text-xs text-gray-500 uppercase tracking-wider">Question {idx + 1} of {exam.questions.length}</div>
          <h2 className="mt-2 font-display font-bold text-lg text-[#0B3D91]">{q.question}</h2>

          <div className="mt-5 space-y-2">
            {["A","B","C","D"].map((opt) => {
              const sel = answers[q.id] === opt;
              return (
                <button key={opt} onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                  className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border-2 transition-all ${sel ? "border-[#FF9800] bg-orange-50" : "border-gray-200 hover:border-[#0B3D91]"}`}
                  data-testid={`exam-option-${opt}`}>
                  <span className={`w-7 h-7 rounded-full font-bold text-xs grid place-items-center flex-shrink-0 ${sel ? "bg-[#FF9800] text-white" : "bg-[#0B3D91] text-white"}`}>{opt}</span>
                  <span className="text-sm text-gray-700">{q[`option_${opt.toLowerCase()}`]}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex justify-between">
            <button disabled={idx === 0} onClick={() => setIdx(idx - 1)} className="btn-ghost disabled:opacity-30" data-testid="exam-prev">← Previous</button>
            <button disabled={idx === exam.questions.length - 1} onClick={() => setIdx(idx + 1)} className="btn-primary disabled:opacity-30" data-testid="exam-next">Next →</button>
          </div>
        </div>

        <aside className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm h-fit lg:sticky lg:top-24">
          <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Question Navigator</div>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {exam.questions.map((qq, i) => {
              const ans = answers[qq.id];
              const cls = i === idx ? "bg-[#FF9800] text-white" : ans ? "bg-[#4CAF50] text-white" : "bg-gray-100 text-gray-700";
              return (
                <button key={qq.id} onClick={() => setIdx(i)} className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${cls}`} data-testid={`exam-nav-${i+1}`}>{i+1}</button>
              );
            })}
          </div>
          <div className="mt-4 text-xs text-gray-600 space-y-1">
            <div>Answered: <span className="font-bold text-[#4CAF50]">{answered}</span></div>
            <div>Remaining: <span className="font-bold text-[#FF9800]">{exam.questions.length - answered}</span></div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-xs text-yellow-800 flex gap-2">
            <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" /> Do not refresh or close this tab.
          </div>
        </aside>
      </div>
    </div>
  );
}
