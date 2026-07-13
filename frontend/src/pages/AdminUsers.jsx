import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Users, GraduationCap, Shield } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("");

  useEffect(() => {
    api.get("/admin/users", { params: { role: role || undefined } }).then((r) => setUsers(r.data));
  }, [role]);

  const roleIcon = (r) => r === "admin" ? <Shield size={14} /> : r === "teacher" ? <Users size={14} /> : <GraduationCap size={14} />;

  return (
    <div className="flex bg-[#F5F7FA] min-h-screen">
      <Sidebar />
      <main className="flex-1 p-5 md:p-8 max-w-full overflow-x-hidden">
        <h1 className="font-display text-2xl font-bold text-[#0B3D91]">User Management</h1>
        <p className="text-sm text-gray-500">{users.length} accounts</p>

        <div className="mt-4 flex gap-2">
          {[["","All"],["student","Students"],["teacher","Teachers"],["admin","Admins"]].map(([v,l]) => (
            <button key={v} onClick={() => setRole(v)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${role===v ? "bg-[#0B3D91] text-white" : "bg-white border border-gray-200 text-gray-700"}`} data-testid={`users-filter-${v||"all"}`}>
              {l}
            </button>
          ))}
        </div>

        <div className="mt-5 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F7FA] text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-gray-100">
                  <td className="p-4 font-semibold text-[#0B3D91]">{u.name}</td>
                  <td className="p-4 text-gray-600">{u.email}</td>
                  <td className="p-4 text-gray-600">{u.phone || "—"}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-[#E6ECF5] text-[#0B3D91]">
                      {roleIcon(u.role)} {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-400">No users found.</td></tr>}
            </tbody>
          </table>
        </div>
      </main>
      <WhatsAppButton />
    </div>
  );
}
