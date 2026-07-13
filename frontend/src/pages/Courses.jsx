import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Clock, IndianRupee, ArrowRight, Search } from "lucide-react";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => { api.get("/courses").then((r) => setCourses(r.data)); }, []);
  const filtered = courses.filter((c) => (c.name + c.code).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="section">
      <div className="container-x">
        <div className="flex justify-between items-end flex-wrap gap-4 mb-10">
          <div>
            <div className="eyebrow">Browse</div>
            <h1 className="heading-2 text-[#0B3D91] mt-2">All Courses</h1>
            <p className="text-gray-500 mt-2 text-sm">Pick the course that fits your career goal.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search courses..."
              data-testid="courses-search-input"
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#0B3D91] focus:ring-2 focus:ring-[#0B3D91]/10 outline-none text-sm"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <Link key={c.code} to={`/courses/${c.code}`} className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all" data-testid={`course-link-${c.code}`}>
              <div className="flex justify-between items-start">
                <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-[#0B3D91] text-white">{c.code}</span>
                <span className="text-2xl font-extrabold text-[#FF9800] font-display">₹{c.fees}</span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#0B3D91] font-display group-hover:text-[#FF9800] transition-colors">{c.name}</h3>
              <p className="mt-2 text-sm text-gray-600 line-clamp-3">{c.description}</p>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1"><Clock size={12} /> {c.duration}</span>
                <span className="text-[#0B3D91] font-semibold flex items-center gap-1">Details <ArrowRight size={12} /></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
