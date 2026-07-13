import "@/App.css";
import "@/index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Courses from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Contact from "@/pages/Contact";
import VerifyCertificate from "@/pages/VerifyCertificate";
import Dashboard from "@/pages/Dashboard";
import Practice from "@/pages/Practice";
import ExamList from "@/pages/ExamList";
import ExamRunner from "@/pages/ExamRunner";
import Certificate from "@/pages/Certificate";
import AdminMCQ from "@/pages/AdminMCQ";
import AdminUsers from "@/pages/AdminUsers";

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

function Protected({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen grid place-items-center text-[#0B3D91]">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/courses" element={<PublicLayout><Courses /></PublicLayout>} />
          <Route path="/courses/:code" element={<PublicLayout><CourseDetail /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
          <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
          <Route path="/verify" element={<PublicLayout><VerifyCertificate /></PublicLayout>} />

          {/* Authenticated app shell */}
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/practice" element={<Protected roles={["student"]}><Practice /></Protected>} />
          <Route path="/exams" element={<Protected><ExamList /></Protected>} />
          <Route path="/exam/:id" element={<Protected roles={["student"]}><ExamRunner /></Protected>} />
          <Route path="/certificate/:certNo" element={<Protected><Certificate /></Protected>} />
          <Route path="/admin/mcqs" element={<Protected roles={["admin","teacher"]}><AdminMCQ /></Protected>} />
          <Route path="/admin/users" element={<Protected roles={["admin"]}><AdminUsers /></Protected>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </AuthProvider>
  );
}

export default App;
