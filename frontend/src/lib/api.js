import axios from "axios";

const BACKEND = process.env.REACT_APP_BACKEND_URL;
export const API_BASE = `${BACKEND}/api`;

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// attach Bearer token if present in localStorage (fallback to cookie)
api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem("ssice_token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

export function setAuthToken(t) {
  if (t) localStorage.setItem("ssice_token", t);
  else localStorage.removeItem("ssice_token");
}

export function formatError(err) {
  const d = err?.response?.data?.detail;
  if (!d) return err?.message || "Something went wrong";
  if (typeof d === "string") return d;
  if (Array.isArray(d)) return d.map((e) => e?.msg || JSON.stringify(e)).join(", ");
  return typeof d === "object" ? d.msg || JSON.stringify(d) : String(d);
}
