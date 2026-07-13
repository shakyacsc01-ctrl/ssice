import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Menu, X, GraduationCap, LogOut } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/courses", label: "Courses" },
  { to: "/verify", label: "Verify Cert" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-gray-100">
      <div className="container-x flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2" data-testid="logo-link">
          <div className="w-10 h-10 rounded-xl bg-[#0B3D91] grid place-items-center text-white">
            <GraduationCap size={22} />
          </div>
          <div className="leading-tight">
            <div className="font-extrabold font-display text-[#0B3D91] text-lg">SSICE</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500">Computer Education</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              data-testid={`nav-${l.label.toLowerCase().replace(/\s+/g,'-')}`}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive ? "text-[#0B3D91] bg-[#E6ECF5]" : "text-gray-700 hover:text-[#0B3D91] hover:bg-gray-50"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          {!user ? (
            <>
              <Link to="/login" className="btn-ghost" data-testid="nav-login-btn">Login</Link>
              <Link to="/register" className="btn-secondary" data-testid="nav-register-btn">Admission</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="btn-primary" data-testid="nav-dashboard-btn">Dashboard</Link>
              <button onClick={async () => { await logout(); nav("/"); }} className="btn-ghost" data-testid="nav-logout-btn">
                <LogOut size={16} /> Logout
              </button>
            </>
          )}
        </div>

        <button className="lg:hidden p-2" onClick={() => setOpen(!open)} data-testid="nav-mobile-toggle">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="container-x py-3 flex flex-col gap-1">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-50">{l.label}</Link>
            ))}
            <div className="flex gap-2 pt-2">
              {!user ? (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="btn-ghost flex-1">Login</Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="btn-secondary flex-1">Admission</Link>
                </>
              ) : (
                <Link to="/dashboard" onClick={() => setOpen(false)} className="btn-primary flex-1">Dashboard</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
