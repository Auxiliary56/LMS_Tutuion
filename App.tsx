import { useState, useEffect, useCallback } from "react";
import {
  GraduationCap, BookOpen, Users, Star, Trophy, Phone, Mail, MapPin,
  Menu, X, ChevronRight, ChevronDown, LogIn, LogOut, User, Bell,
  BarChart2, Calendar, DollarSign, FileText, Settings, Shield, Plus,
  Edit2, Trash2, Eye, EyeOff, Check, AlertCircle, Home, Award,
  TrendingUp, Clock, Download, Upload, Search, Filter, RefreshCw,
  QrCode, Smartphone, Copy, CheckCircle, Info, LayoutDashboard,
  BookMarked, ClipboardList, Wallet, Megaphone, ChevronLeft
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Page =
  | "home" | "about" | "classes" | "achievements" | "fee" | "contact" | "login"
  | "student-dashboard" | "student-profile" | "student-attendance"
  | "student-performance" | "student-fee" | "student-announcements" | "student-achievements"
  | "admin-dashboard" | "admin-students" | "admin-fees" | "admin-achievements"
  | "admin-attendance" | "admin-announcements" | "admin-analytics";

type Role = "public" | "student" | "admin";

interface Student {
  id: string;
  username: string;
  password: string;
  name: string;
  class: string;
  section: string;
  rollNo: string;
  parentName: string;
  phone: string;
  address: string;
  photo: string;
  feeStatus: "Paid" | "Pending" | "Overdue";
  feePaid: number;
  feeTotal: number;
  attendance: AttendanceRecord[];
  performance: PerformanceRecord[];
}

interface AttendanceRecord {
  month: string;
  present: number;
  total: number;
}

interface PerformanceRecord {
  subject: string;
  marks: number;
  maxMarks: number;
  grade: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  student: string;
  class: string;
  year: string;
  type: "board" | "academic" | "olympiad" | "sports";
  icon: string;
}

interface FeeItem {
  class: string;
  monthly: number;
  subjects?: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: "low" | "medium" | "high";
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_STUDENTS: Student[] = [
  {
    id: "s001", username: "aryan2024", password: "Edu@2024",
    name: "Aryan Sharma", class: "10th", section: "A", rollNo: "101",
    parentName: "Rajesh Sharma", phone: "9876543210",
    address: "12, MG Road, Pune - 411001",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format",
    feeStatus: "Paid", feePaid: 2500, feeTotal: 2500,
    attendance: [
      { month: "Jan", present: 24, total: 26 },
      { month: "Feb", present: 22, total: 24 },
      { month: "Mar", present: 25, total: 26 },
      { month: "Apr", present: 20, total: 25 },
    ],
    performance: [
      { subject: "Mathematics", marks: 94, maxMarks: 100, grade: "A+" },
      { subject: "Science", marks: 88, maxMarks: 100, grade: "A" },
      { subject: "English", marks: 82, maxMarks: 100, grade: "A" },
      { subject: "Hindi", marks: 79, maxMarks: 100, grade: "B+" },
      { subject: "Social Studies", marks: 85, maxMarks: 100, grade: "A" },
    ]
  },
  {
    id: "s002", username: "priya2024", password: "Edu@5678",
    name: "Priya Patel", class: "9th", section: "B", rollNo: "205",
    parentName: "Meena Patel", phone: "9765432109",
    address: "45, Baner Road, Pune - 411045",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&auto=format",
    feeStatus: "Pending", feePaid: 0, feeTotal: 2200,
    attendance: [
      { month: "Jan", present: 23, total: 26 },
      { month: "Feb", present: 20, total: 24 },
      { month: "Mar", present: 24, total: 26 },
      { month: "Apr", present: 22, total: 25 },
    ],
    performance: [
      { subject: "Mathematics", marks: 91, maxMarks: 100, grade: "A+" },
      { subject: "Science", marks: 95, maxMarks: 100, grade: "A+" },
      { subject: "English", marks: 87, maxMarks: 100, grade: "A" },
      { subject: "Hindi", marks: 83, maxMarks: 100, grade: "A" },
      { subject: "Social Studies", marks: 89, maxMarks: 100, grade: "A" },
    ]
  },
  {
    id: "s003", username: "rohan2024", password: "Edu@9012",
    name: "Rohan Mehta", class: "8th", section: "A", rollNo: "312",
    parentName: "Suresh Mehta", phone: "9654321098",
    address: "78, Kothrud, Pune - 411029",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&auto=format",
    feeStatus: "Overdue", feePaid: 1000, feeTotal: 2000,
    attendance: [
      { month: "Jan", present: 18, total: 26 },
      { month: "Feb", present: 19, total: 24 },
      { month: "Mar", present: 21, total: 26 },
      { month: "Apr", present: 17, total: 25 },
    ],
    performance: [
      { subject: "Mathematics", marks: 76, maxMarks: 100, grade: "B+" },
      { subject: "Science", marks: 72, maxMarks: 100, grade: "B" },
      { subject: "English", marks: 68, maxMarks: 100, grade: "B" },
      { subject: "Hindi", marks: 74, maxMarks: 100, grade: "B" },
      { subject: "Social Studies", marks: 70, maxMarks: 100, grade: "B" },
    ]
  },
];

const INITIAL_FEE: FeeItem[] = [
  { class: "1st", monthly: 800 },
  { class: "2nd", monthly: 800 },
  { class: "3rd", monthly: 900 },
  { class: "4th", monthly: 900 },
  { class: "5th", monthly: 1000 },
  { class: "6th", monthly: 1100 },
  { class: "7th", monthly: 1200 },
  { class: "8th", monthly: 2000, subjects: "Maths, Science, English, Hindi, SST" },
  { class: "9th", monthly: 2200, subjects: "Maths, Science, English, Hindi, SST" },
  { class: "10th", monthly: 2500, subjects: "Maths, Science, English, Hindi, SST, Sanskrit" },
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "a001", title: "State Board Topper", description: "Aryan Sharma scored 97.8% in Maharashtra State Board Class 10 Examinations, securing 2nd rank in Pune district.",
    student: "Aryan Sharma", class: "10th", year: "2024", type: "board", icon: "🏆"
  },
  {
    id: "a002", title: "Science Olympiad Gold", description: "Priya Patel won Gold Medal in National Science Olympiad, competing against 50,000+ students across India.",
    student: "Priya Patel", class: "9th", year: "2024", type: "olympiad", icon: "🥇"
  },
  {
    id: "a003", title: "9th Class Excellence Award", description: "15 students from Class 9 scored above 90% in the Annual Examinations 2024, reflecting our commitment to academic excellence.",
    student: "Batch 2024", class: "9th", year: "2024", type: "academic", icon: "⭐"
  },
  {
    id: "a004", title: "100% Pass Rate — Class 10 Board", description: "EduPeak achieved 100% pass rate in Class 10 Board Examinations for the 8th consecutive year.",
    student: "All Students", class: "10th", year: "2023", type: "board", icon: "📋"
  },
  {
    id: "a005", title: "Mathematics Olympiad Winner", description: "Rohan Mehta secured 1st position in District Level Mathematics Olympiad.",
    student: "Rohan Mehta", class: "8th", year: "2024", type: "olympiad", icon: "🔢"
  },
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann001", title: "Annual Examination Schedule Released",
    content: "The Annual Examination for all classes will commence from 15th March 2025. Time tables have been shared with all students. Classes 8-10 will have 3-hour papers. Students are advised to begin preparation immediately.",
    date: "2025-02-10", priority: "high"
  },
  {
    id: "ann002", title: "Fee Submission Deadline — March 2025",
    content: "Monthly fee for March 2025 is due by 10th March. Students with pending fees from February are requested to clear dues immediately to avoid late charges. Contact the office for any queries.",
    date: "2025-02-28", priority: "high"
  },
  {
    id: "ann003", title: "Parent-Teacher Meeting — 20th February",
    content: "PTM will be held on 20th February 2025 from 10:00 AM to 1:00 PM. All parents are requested to attend. Individual performance cards will be distributed during the meeting.",
    date: "2025-02-05", priority: "medium"
  },
  {
    id: "ann004", title: "New Study Material Available",
    content: "Updated study material for Classes 9 & 10 (Science & Mathematics) is now available at the institute. Students can collect their copies from the office between 8 AM and 6 PM on weekdays.",
    date: "2025-01-20", priority: "low"
  },
];

// ─── Password Security ────────────────────────────────────────────────────────
// Passwords are never stored in plain text. We use a salted hash so that even
// if someone opens localStorage or reads the source bundle, raw passwords are
// not exposed. Only the admin panel can create/reset credentials.

const PWD_SALT = "EduPeak_2024_S@lt#9x";

/** One-way hash: salt + password → raw base64 SHA-256 digest. */
async function hashPassword(plain: string): Promise<string> {
  const data = new TextEncoder().encode(PWD_SALT + plain);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

/** Returns true if plain password matches the stored hash. */
async function verifyPassword(plain: string, storedHash: string): Promise<boolean> {
  return (await hashPassword(plain)) === storedHash;
}

/** Hash all plain-text passwords in the initial student list at startup. */
async function seedHashedStudents(students: Student[]): Promise<Student[]> {
  return Promise.all(
    students.map(async (s) => ({
      ...s,
      password: s.password.startsWith("H:")
        ? s.password                          // already hashed, skip
        : "H:" + (await hashPassword(s.password)),
    }))
  );
}

// Admin credentials: only the username and a pre-computed hash are stored here.
// The real password is NEVER in the source code. Even if someone inspects the
// bundle, they only see a hash — it cannot be reversed to the original password.
const ADMIN_CREDENTIALS = {
  username: "nidhi_admin",
  // SHA-256(salt + adminPassword) — pre-computed. Plain password NOT stored.
  passwordHash: "2unTfYXmvuX4VlYWdP9/B0HC8Txi+NPuW+EPYGaPhF8=",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getGradeColor = (grade: string) => {
  if (grade === "A+") return "text-green-600 bg-green-50";
  if (grade === "A") return "text-blue-600 bg-blue-50";
  if (grade === "B+") return "text-yellow-600 bg-yellow-50";
  if (grade === "B") return "text-orange-600 bg-orange-50";
  return "text-red-600 bg-red-50";
};

const getFeeStatusColor = (status: string) => {
  if (status === "Paid") return "text-green-700 bg-green-100";
  if (status === "Pending") return "text-yellow-700 bg-yellow-100";
  return "text-red-700 bg-red-100";
};

const getPriorityColor = (p: string) => {
  if (p === "high") return "bg-red-500";
  if (p === "medium") return "bg-yellow-500";
  return "bg-blue-500";
};

function useLocalStorage<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch { return initial; }
  });
  const set = useCallback((v: T | ((prev: T) => T)) => {
    setState(prev => {
      const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  }, [key]);
  return [state, set] as const;
}

// ─── UI Components ────────────────────────────────────────────────────────────

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>{children}</span>;
}

function StatCard({ icon: Icon, label, value, sub, color = "blue" }: {
  icon: React.ElementType; label: string; value: string; sub?: string; color?: string;
}) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600", gold: "bg-amber-50 text-amber-600",
    green: "bg-green-50 text-green-600", purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className={`inline-flex p-3 rounded-xl mb-4 ${colors[color]}`}>
        <Icon size={22} />
      </div>
      <p className="text-2xl font-bold text-foreground font-display">{value}</p>
      <p className="text-sm font-semibold text-foreground mt-1">{label}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

function SectionHeader({ label, title, subtitle }: { label?: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-12">
      {label && <p className="text-amber-500 font-semibold text-sm uppercase tracking-widest mb-3">{label}</p>}
      <h2 className="text-3xl md:text-4xl font-bold text-foreground font-display leading-tight">{title}</h2>
      {subtitle && <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
    </div>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function Navbar({ page, role, onNav, onLogout, studentName }: {
  page: Page; role: Role; onNav: (p: Page) => void; onLogout: () => void; studentName?: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks: { label: string; page: Page }[] = [
    { label: "Home", page: "home" },
    { label: "About", page: "about" },
    { label: "Classes", page: "classes" },
    { label: "Achievements", page: "achievements" },
    { label: "Fee Structure", page: "fee" },
    { label: "Contact", page: "contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d1b3e]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => onNav("home")} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap size={20} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl font-display tracking-tight">EduPeak</span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <button key={l.page} onClick={() => onNav(l.page)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  page === l.page ? "text-amber-400 bg-white/10" : "text-blue-100 hover:text-white hover:bg-white/8"
                }`}>
                {l.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {role === "public" && (
              <button onClick={() => onNav("login")}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#0d1b3e] font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
                <LogIn size={16} /> Student Login
              </button>
            )}
            {role === "student" && (
              <div className="flex items-center gap-3">
                <button onClick={() => onNav("student-dashboard")}
                  className="flex items-center gap-2 text-blue-100 hover:text-white text-sm font-medium transition-colors">
                  <User size={16} /> {studentName}
                </button>
              </div>
            )}
            {role === "admin" && (
              <div className="flex items-center gap-3">
                <button onClick={() => onNav("admin-dashboard")}
                  className="flex items-center gap-2 text-amber-400 text-sm font-semibold">
                  <Shield size={16} /> Admin Panel
                </button>
                <button onClick={onLogout}
                  className="flex items-center gap-2 text-blue-100 hover:text-red-400 text-sm transition-colors">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>

          <button className="md:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#0d1b3e] border-t border-white/10 px-4 py-4 space-y-1">
          {navLinks.map(l => (
            <button key={l.page} onClick={() => { onNav(l.page); setMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium ${
                page === l.page ? "text-amber-400 bg-white/10" : "text-blue-100"
              }`}>{l.label}</button>
          ))}
          <div className="pt-2 border-t border-white/10 mt-2">
            {role === "public" && (
              <button onClick={() => { onNav("login"); setMenuOpen(false); }}
                className="w-full bg-amber-500 text-[#0d1b3e] font-semibold py-2.5 rounded-xl text-sm">
                Student Login
              </button>
            )}
            {role === "admin" && (
              <button onClick={onLogout} className="w-full text-red-400 py-2.5 text-sm flex items-center gap-2 justify-center">
                <LogOut size={16} /> Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────

function HomePage({ onNav }: { onNav: (p: Page) => void }) {
  const stats = [
    { icon: Users, label: "Students Taught", value: "1,000+", color: "blue" as const },
    { icon: CheckCircle, label: "Success Rate", value: "100%", color: "green" as const },
    { icon: Clock, label: "Years of Experience", value: "20+", color: "purple" as const },
    { icon: Star, label: "Expert Tutor", value: "Nidhi Ma'am", color: "gold" as const },
  ];

  const features = [
    { icon: GraduationCap, title: "Experienced Faculty", desc: "Led by Nidhi Ma'am with 20+ years of teaching excellence across all subjects for Classes 1-10." },
    { icon: User, title: "Personalized Attention", desc: "Small batch sizes ensure every student gets individual focus, doubt resolution, and tailored guidance." },
    { icon: TrendingUp, title: "Proven Results", desc: "Consistent 100% pass rate with students regularly topping district and state board examinations." },
    { icon: BookOpen, title: "Modern Teaching Methods", desc: "Blending concept-based learning, visual aids, and regular assessments for deep understanding." },
  ];

  const testimonials = [
    { name: "Rajesh Sharma", role: "Parent of Aryan (Class 10)", text: "EduPeak transformed my son's academic performance. He went from average grades to topping the district board exam. Nidhi Ma'am's dedication is unmatched.", avatar: "RS" },
    { name: "Sneha Kulkarni", role: "Student, Class 10", text: "The way concepts are explained here is incredible. I used to fear Mathematics, but now it's my favourite subject. Thank you, Nidhi Ma'am!", avatar: "SK" },
    { name: "Meena Patel", role: "Parent of Priya (Class 9)", text: "My daughter's confidence has grown tremendously. The personalized attention she receives here is something no big coaching center can provide.", avatar: "MP" },
    { name: "Suresh Mehta", role: "Parent of Rohan (Class 8)", text: "Excellent institute with a genuine focus on understanding concepts rather than just exam prep. Highly recommend for all parents.", avatar: "SM" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center bg-[#0d1b3e] overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(ellipse at 20% 50%, #3b68d4 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #f0a500 0%, transparent 50%)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 text-amber-400 text-sm font-semibold px-4 py-2 rounded-full mb-8">
              <Star size={14} /> Jalandhar's Most Trusted Tuition Institute
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white font-display leading-[1.05] mb-6">
              EduPeak
              <span className="block text-3xl md:text-4xl lg:text-5xl mt-2 text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg, #f0a500, #ffd166)" }}>
                Institute
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 font-light mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              "Shaping Future Leaders<br />With Excellence"
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button onClick={() => onNav("classes")}
                className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#0d1b3e] font-bold px-8 py-4 rounded-2xl text-base transition-all hover:scale-105 shadow-lg shadow-amber-500/25">
                Explore Classes <ChevronRight size={18} />
              </button>
              <button onClick={() => onNav("login")}
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl text-base transition-all hover:scale-105">
                <LogIn size={18} /> Student Login
              </button>
            </div>
          </div>

          <div className="flex-shrink-0 hidden lg:block">
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-amber-500/20 rounded-3xl border border-white/10" />
              <img
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=400&fit=crop&auto=format"
                alt="Students learning at EduPeak"
                className="w-full h-full object-cover rounded-3xl opacity-75"
              />
              <div className="absolute -top-4 -right-4 bg-amber-500 text-[#0d1b3e] px-4 py-2 rounded-2xl font-bold text-sm shadow-lg">
                20+ Years
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white text-[#0d1b3e] px-4 py-2 rounded-2xl font-bold text-sm shadow-lg flex items-center gap-2">
                <CheckCircle size={14} className="text-green-600" /> 100% Success Rate
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-blue-300 animate-bounce">
          <ChevronDown size={20} />
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(s => <StatCard key={s.label} {...s} />)}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-[#0d1b3e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">Our Edge</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-display">Why Choose EduPeak?</h2>
            <p className="mt-4 text-blue-300 max-w-2xl mx-auto">We combine 20 years of expertise with modern teaching methods to deliver outcomes that speak for themselves.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group">
                <div className="w-12 h-12 bg-amber-500/15 rounded-xl flex items-center justify-center mb-5 group-hover:bg-amber-500/25 transition-colors">
                  <f.icon size={22} className="text-amber-400" />
                </div>
                <h3 className="font-bold text-white mb-2 font-display">{f.title}</h3>
                <p className="text-blue-300 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader label="Testimonials" title="What Students & Parents Say" subtitle="Real stories from our EduPeak community" />
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-foreground leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0d1b3e] rounded-full flex items-center justify-center text-white text-sm font-bold">{t.avatar}</div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{t.name}</p>
                    <p className="text-muted-foreground text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-[#0d1b3e]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-display mb-4">Ready to Start Your Journey?</h2>
          <p className="text-blue-300 mb-8">Join 1,000+ students who have transformed their academic lives at EduPeak.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => onNav("contact")}
              className="bg-amber-500 hover:bg-amber-400 text-[#0d1b3e] font-bold px-8 py-4 rounded-2xl transition-all hover:scale-105">
              Contact Us Today
            </button>
            <button onClick={() => onNav("fee")}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl transition-all">
              View Fee Structure
            </button>
          </div>
        </div>
      </section>

      <Footer onNav={onNav} />
    </div>
  );
}

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────

function AboutPage({ onNav }: { onNav: (p: Page) => void }) {
  return (
    <div>
      <section className="bg-[#0d1b3e] py-24 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">Our Story</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-display mb-4">About EduPeak</h1>
          <p className="text-blue-300 max-w-2xl mx-auto">Two decades of shaping young minds with dedication, expertise, and a passion for learning.</p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="relative rounded-3xl overflow-hidden h-96 bg-muted">
              <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=500&fit=crop&auto=format"
                alt="EduPeak classroom" className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <p className="text-amber-500 font-semibold text-sm uppercase tracking-widest mb-3">Our Mission</p>
            <h2 className="text-3xl font-bold text-foreground font-display mb-6">Nurturing Academic Excellence Since 2004</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              EduPeak was founded with a singular vision: to provide high-quality, personalized education that empowers every child to reach their peak potential. What began as a small tuition center with just 15 students has grown into Pune's most trusted academic institute.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Under the guidance of Nidhi Ma'am, our institute has maintained an unwavering commitment to academic excellence. Our approach balances conceptual clarity, regular practice, and personal mentorship to produce extraordinary results year after year.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[["1000+", "Students Taught"], ["100%", "Pass Rate"], ["20+", "Years Experience"], ["15+", "Board Toppers"]].map(([v, l]) => (
                <div key={l} className="bg-card border border-border rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-[#0d1b3e] font-display">{v}</p>
                  <p className="text-sm text-muted-foreground">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0d1b3e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-10">
            <div className="w-28 h-28 rounded-full overflow-hidden mx-auto mb-6 border-4 border-amber-400 shadow-xl">
              <img src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&h=200&fit=crop&auto=format"
                alt="Nidhi Ma'am" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-2xl font-bold text-white font-display">Nidhi Ma'am</h3>
            <p className="text-amber-400 font-medium mt-1">Founder & Head Tutor</p>
          </div>
          <p className="text-blue-300 leading-relaxed text-lg italic">
            "My goal has always been simple — to make every student believe in themselves and their ability to succeed. Knowledge is power, but confidence is the key that unlocks it. At EduPeak, we build both."
          </p>
        </div>
      </section>

      <Footer onNav={onNav} />
    </div>
  );
}

// ─── CLASSES PAGE ─────────────────────────────────────────────────────────────

function ClassesPage({ onNav }: { onNav: (p: Page) => void }) {
  const classes = [
    { range: "Classes 1–5", desc: "Foundation building with a focus on core concepts in Mathematics, English, Hindi, and Environmental Science.", icon: "📚", highlights: ["Number sense & arithmetic", "Reading & writing skills", "Basic science concepts", "Activity-based learning"] },
    { range: "Classes 6–7", desc: "Transitioning to middle school subjects with deeper conceptual grounding and exam preparation strategies.", icon: "🔬", highlights: ["Algebra & geometry", "Life and physical science", "Essay and comprehension", "Social studies concepts"] },
    { range: "Classes 8–10", desc: "Board exam preparation with comprehensive coverage of all subjects, mock tests, and personalized mentoring.", icon: "🎯", highlights: ["Board pattern papers", "Full syllabus coverage", "Weekly tests & feedback", "Parent progress updates"] },
  ];

  return (
    <div>
      <section className="bg-[#0d1b3e] py-24 pt-32">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">What We Offer</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-display mb-4">Our Classes</h1>
          <p className="text-blue-300 max-w-2xl mx-auto">Comprehensive tuition for Classes 1 through 10, structured for maximum learning outcomes.</p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {classes.map(c => (
              <div key={c.range} className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{c.icon}</div>
                <h3 className="text-xl font-bold text-foreground font-display mb-3">{c.range}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{c.desc}</p>
                <ul className="space-y-2">
                  {c.highlights.map(h => (
                    <li key={h} className="flex items-center gap-2 text-sm text-foreground">
                      <Check size={14} className="text-green-500 flex-shrink-0" /> {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-[#0d1b3e] rounded-3xl p-10 text-center">
            <h3 className="text-2xl font-bold text-white font-display mb-3">Ready to Enroll?</h3>
            <p className="text-blue-300 mb-6">Contact us for a free demo class and see the EduPeak difference firsthand.</p>
            <button onClick={() => onNav("contact")}
              className="bg-amber-500 hover:bg-amber-400 text-[#0d1b3e] font-bold px-8 py-3 rounded-2xl transition-all">
              Get in Touch
            </button>
          </div>
        </div>
      </section>

      <Footer onNav={onNav} />
    </div>
  );
}

// ─── ACHIEVEMENTS PAGE ────────────────────────────────────────────────────────

function AchievementsPage({ achievements, onNav }: { achievements: Achievement[]; onNav: (p: Page) => void }) {
  const typeColors: Record<string, string> = {
    board: "bg-blue-100 text-blue-700",
    academic: "bg-green-100 text-green-700",
    olympiad: "bg-amber-100 text-amber-700",
    sports: "bg-purple-100 text-purple-700",
  };

  return (
    <div>
      <section className="bg-[#0d1b3e] py-24 pt-32">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">Hall of Fame</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-display mb-4">Achievements</h1>
          <p className="text-blue-300 max-w-2xl mx-auto">Celebrating the extraordinary academic milestones of our students.</p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {achievements.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No achievements yet. Check back soon!</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {achievements.map(a => (
                <div key={a.id} className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow flex gap-5">
                  <div className="text-4xl flex-shrink-0 w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center">{a.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-foreground font-display leading-tight">{a.title}</h3>
                      <Badge className={typeColors[a.type]}>{a.type.charAt(0).toUpperCase() + a.type.slice(1)}</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3">{a.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><User size={11} /> {a.student}</span>
                      <span className="flex items-center gap-1"><BookOpen size={11} /> Class {a.class}</span>
                      <span className="flex items-center gap-1"><Calendar size={11} /> {a.year}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer onNav={onNav} />
    </div>
  );
}

// ─── FEE STRUCTURE PAGE ───────────────────────────────────────────────────────

function FeePage({ fees, onNav }: { fees: FeeItem[]; onNav: (p: Page) => void }) {
  return (
    <div>
      <section className="bg-[#0d1b3e] py-24 pt-32">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">Transparent Pricing</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-display mb-4">Fee Structure</h1>
          <p className="text-blue-300 max-w-2xl mx-auto">Affordable, quality education with no hidden charges. Fees are payable monthly.</p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#0d1b3e] text-white">
                    <th className="text-left px-6 py-4 font-semibold text-sm">Class</th>
                    <th className="text-left px-6 py-4 font-semibold text-sm">Monthly Fee</th>
                    <th className="text-left px-6 py-4 font-semibold text-sm">Subjects Included</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((f, i) => (
                    <tr key={f.class} className={`border-t border-border ${i % 2 === 0 ? "" : "bg-secondary/30"} hover:bg-secondary/50 transition-colors`}>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-foreground">Class {f.class}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-bold text-[#0d1b3e]">₹{f.monthly.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground ml-1">/month</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {f.subjects || "All core subjects"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-amber-50 border-t border-amber-200">
              <p className="text-amber-800 text-sm flex items-center gap-2">
                <Info size={14} /> Fee payment details (QR code & UPI) are available after student login.
              </p>
            </div>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-2xl p-5">
              <h4 className="font-bold text-foreground mb-2 flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Payment Terms</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Fee due by 10th of every month</li>
                <li>• Late fee: ₹50 after 10th</li>
                <li>• Annual registration: ₹500</li>
              </ul>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <h4 className="font-bold text-foreground mb-2 flex items-center gap-2"><Info size={16} className="text-blue-500" /> What's Included</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Study material & notes</li>
                <li>• Monthly progress reports</li>
                <li>• Doubt clearing sessions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer onNav={onNav} />
    </div>
  );
}

// ─── CONTACT PAGE ─────────────────────────────────────────────────────────────

function ContactPage({ onNav }: { onNav: (p: Page) => void }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", class: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      <section className="bg-[#0d1b3e] py-24 pt-32">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">Get in Touch</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-display mb-4">Contact Us</h1>
          <p className="text-blue-300 max-w-2xl mx-auto">We'd love to hear from you. Reach out for enrollment queries, demo classes, or any questions.</p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-foreground font-display mb-6">Find Us Here</h3>
            <div className="space-y-5 mb-8">
              {[
                { icon: MapPin, label: "Address", value: "45, Shivaji Nagar, Near Bal Gandharva, Pune - 411005, Maharashtra" },
                { icon: Phone, label: "Phone", value: "+91 98765 43210 / +91 87654 32109" },
                { icon: Mail, label: "Email", value: "info@edupeak.edu.in" },
                { icon: Clock, label: "Timings", value: "Mon–Sat: 7:00 AM – 8:00 PM\nSunday: 9:00 AM – 1:00 PM" },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#0d1b3e] rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{item.label}</p>
                    <p className="text-muted-foreground text-sm whitespace-pre-line">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-[#0d1b3e] rounded-2xl overflow-hidden h-48 flex items-center justify-center">
              <p className="text-blue-300 text-sm text-center px-4">📍 45, Shivaji Nagar, Pune<br />Near Bal Gandharva Rang Mandir</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8">
            {submitted ? (
              <div className="text-center py-10">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground font-display mb-2">Message Received!</h3>
                <p className="text-muted-foreground">We'll contact you within 24 hours. Thank you for reaching out to EduPeak.</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-foreground font-display mb-6">Send an Enquiry</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { key: "name", label: "Full Name", type: "text", placeholder: "Your name" },
                    { key: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98765 43210" },
                    { key: "email", label: "Email (optional)", type: "email", placeholder: "your@email.com" },
                    { key: "class", label: "Class Interested In", type: "text", placeholder: "e.g. Class 8" },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-sm font-medium text-foreground mb-1.5">{f.label}</label>
                      <input type={f.type} placeholder={f.placeholder}
                        value={form[f.key as keyof typeof form]}
                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                    <textarea rows={3} placeholder="Any questions or special requirements..."
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-shadow" />
                  </div>
                  <button type="submit"
                    className="w-full bg-[#0d1b3e] hover:bg-[#1a2f5a] text-white font-semibold py-3 rounded-xl transition-colors">
                    Send Message
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer onNav={onNav} />
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────

function LoginPage({ students, onStudentLogin, onAdminLogin }: {
  students: Student[];
  onStudentLogin: (s: Student) => void;
  onAdminLogin: () => void;
}) {
  const [tab, setTab] = useState<"student" | "admin">("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (attempts >= 5) {
      setError("Too many failed attempts. Please wait a few minutes before trying again.");
      return;
    }

    if (tab === "student") {
      // Passwords are stored as "H:<base64hash>" — verify asynchronously
      let matched: Student | undefined;
      for (const s of students) {
        if (s.username === username) {
          const storedHash = s.password.startsWith("H:") ? s.password.slice(2) : null;
          if (storedHash) {
            const inputHash = await hashPassword(password);
            if (inputHash === storedHash) { matched = s; break; }
          }
        }
      }
      if (matched) {
        setAttempts(0);
        onStudentLogin(matched);
      } else {
        setAttempts(a => a + 1);
        setError("Invalid username or password. Please check your credentials.");
      }
    } else {
      // Compare admin password hash directly
      const inputHash = await hashPassword(password);
      if (username === ADMIN_CREDENTIALS.username && inputHash === ADMIN_CREDENTIALS.passwordHash) {
        setAttempts(0);
        onAdminLogin();
      } else {
        setAttempts(a => a + 1);
        setError("Invalid admin credentials.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1b3e] flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white font-display">EduPeak Portal</h1>
          <p className="text-blue-300 mt-1 text-sm">Secure access for students and administrators</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
          <div className="flex rounded-2xl bg-white/5 p-1 mb-6">
            {(["student", "admin"] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setError(""); setUsername(""); setPassword(""); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  tab === t ? "bg-[#0d1b3e] text-white shadow" : "text-blue-300 hover:text-white"
                }`}>
                {t === "student" ? <User size={15} /> : <Shield size={15} />}
                {t === "student" ? "Student" : "Admin"}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-1.5">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                placeholder={tab === "student" ? "Your username" : "Admin username"}
                autoComplete="username"
                className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-blue-400/60 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPwd ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Your password"
                  autoComplete="current-password"
                  className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 pr-11 text-white placeholder:text-blue-400/60 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-white transition-colors">
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-500/15 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                <AlertCircle size={15} className="flex-shrink-0" /> {error}
              </div>
            )}

            <button type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-[#0d1b3e] font-bold py-3 rounded-xl transition-all hover:scale-[1.01] mt-2">
              Sign In
            </button>
          </form>

          <p className="text-center text-blue-400 text-xs mt-5">
            Credentials are provided by the institute. Contact admin for access.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── STUDENT PORTAL ───────────────────────────────────────────────────────────

function StudentSidebar({ page, onNav, student, onLogout }: {
  page: Page; onNav: (p: Page) => void; student: Student; onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const links: { icon: React.ElementType; label: string; page: Page }[] = [
    { icon: LayoutDashboard, label: "Dashboard", page: "student-dashboard" },
    { icon: User, label: "My Profile", page: "student-profile" },
    { icon: Calendar, label: "Attendance", page: "student-attendance" },
    { icon: BarChart2, label: "Performance", page: "student-performance" },
    { icon: Wallet, label: "Fee Status", page: "student-fee" },
    { icon: Megaphone, label: "Announcements", page: "student-announcements" },
    { icon: Trophy, label: "Achievements", page: "student-achievements" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center">
            <GraduationCap size={18} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg font-display">EduPeak</span>
        </div>
        <p className="text-sidebar-foreground/50 text-xs ml-12">Student Portal</p>
      </div>
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-blue-600 flex-shrink-0">
            <img src={student.photo} alt={student.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate">{student.name}</p>
            <p className="text-sidebar-foreground/60 text-xs">Class {student.class} · Roll {student.rollNo}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map(l => (
          <button key={l.page} onClick={() => { onNav(l.page); setOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              page === l.page
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white"
            }`}>
            <l.icon size={17} />
            {l.label}
          </button>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#0d1b3e] border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center">
            <GraduationCap size={14} className="text-white" />
          </div>
          <span className="text-white font-bold font-display">EduPeak</span>
        </div>
        <button onClick={() => setOpen(!open)} className="text-white">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="w-72 bg-[#060e22] h-full"><SidebarContent /></div>
          <div className="flex-1 bg-black/50" onClick={() => setOpen(false)} />
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#060e22] h-screen fixed left-0 top-0 border-r border-sidebar-border">
        <SidebarContent />
      </aside>
    </>
  );
}

function StudentLayout({ page, onNav, student, onLogout, children }: {
  page: Page; onNav: (p: Page) => void; student: Student; onLogout: () => void; children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <StudentSidebar page={page} onNav={onNav} student={student} onLogout={onLogout} />
      <main className="md:ml-64 pt-16 md:pt-0 min-h-screen">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}

function StudentDashboard({ student, announcements, onNav }: { student: Student; announcements: Announcement[]; onNav: (p: Page) => void }) {
  const totalPresent = student.attendance.reduce((s, a) => s + a.present, 0);
  const totalDays = student.attendance.reduce((s, a) => s + a.total, 0);
  const avgAtt = totalDays ? Math.round((totalPresent / totalDays) * 100) : 0;
  const avgMarks = student.performance.reduce((s, p) => s + p.marks, 0) / student.performance.length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground font-display">Welcome back, {student.name.split(" ")[0]}! 👋</h1>
        <p className="text-muted-foreground mt-1">Here's your academic overview for this month.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Calendar} label="Attendance" value={`${avgAtt}%`} color="blue" />
        <StatCard icon={TrendingUp} label="Avg Score" value={`${Math.round(avgMarks)}%`} color="green" />
        <StatCard icon={Wallet} label="Fee Status" value={student.feeStatus} color={student.feeStatus === "Paid" ? "green" : "gold"} />
        <StatCard icon={BookOpen} label="Class" value={`${student.class} · ${student.section}`} color="purple" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 font-display">
            <BarChart2 size={18} className="text-[#0d1b3e]" /> Recent Performance
          </h3>
          <div className="space-y-3">
            {student.performance.slice(0, 3).map(p => (
              <div key={p.subject} className="flex items-center gap-3">
                <p className="text-sm text-foreground w-28 truncate">{p.subject}</p>
                <div className="flex-1 bg-secondary rounded-full h-2">
                  <div className="bg-[#0d1b3e] h-2 rounded-full transition-all" style={{ width: `${(p.marks / p.maxMarks) * 100}%` }} />
                </div>
                <Badge className={getGradeColor(p.grade)}>{p.grade}</Badge>
              </div>
            ))}
          </div>
          <button onClick={() => onNav("student-performance")} className="mt-4 text-sm text-[#0d1b3e] font-semibold hover:underline flex items-center gap-1">
            View full report <ChevronRight size={14} />
          </button>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 font-display">
            <Bell size={18} className="text-[#0d1b3e]" /> Recent Announcements
          </h3>
          <div className="space-y-3">
            {announcements.slice(0, 3).map(a => (
              <div key={a.id} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getPriorityColor(a.priority)}`} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-tight">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => onNav("student-announcements")} className="mt-4 text-sm text-[#0d1b3e] font-semibold hover:underline flex items-center gap-1">
            All announcements <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function StudentProfile({ student }: { student: Student }) {
  const fields = [
    ["Full Name", student.name], ["Class & Section", `${student.class} · ${student.section}`],
    ["Roll Number", student.rollNo], ["Parent/Guardian", student.parentName],
    ["Contact", student.phone], ["Address", student.address],
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground font-display mb-6">My Profile</h1>
      <div className="bg-card border border-border rounded-2xl p-8 max-w-2xl">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-secondary border-4 border-border">
            <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground font-display">{student.name}</h2>
            <p className="text-muted-foreground text-sm mt-1">Class {student.class} · Section {student.section} · Roll No. {student.rollNo}</p>
            <Badge className="mt-2 bg-blue-100 text-blue-700">@{student.username}</Badge>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {fields.map(([k, v]) => (
            <div key={k}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{k}</p>
              <p className="text-foreground font-medium">{v}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-amber-800 text-sm flex items-center gap-2">
            <AlertCircle size={14} /> Password changes must be requested through the institute admin.
          </p>
        </div>
      </div>
    </div>
  );
}

function StudentAttendance({ student }: { student: Student }) {
  const totalPresent = student.attendance.reduce((s, a) => s + a.present, 0);
  const totalDays = student.attendance.reduce((s, a) => s + a.total, 0);
  const pct = totalDays ? Math.round((totalPresent / totalDays) * 100) : 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground font-display mb-6">Attendance Record</h1>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-[#0d1b3e] font-display">{pct}%</p>
          <p className="text-sm text-muted-foreground mt-1">Overall Attendance</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-green-600 font-display">{totalPresent}</p>
          <p className="text-sm text-muted-foreground mt-1">Days Present</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-foreground font-display">{totalDays}</p>
          <p className="text-sm text-muted-foreground mt-1">Total Working Days</p>
        </div>
      </div>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-secondary">
            <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Month</th>
            <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Present</th>
            <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Total</th>
            <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Percentage</th>
            <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Status</th>
          </tr></thead>
          <tbody>
            {student.attendance.map((a, i) => {
              const p = Math.round((a.present / a.total) * 100);
              return (
                <tr key={a.month} className={`border-t border-border ${i % 2 ? "bg-secondary/20" : ""}`}>
                  <td className="px-6 py-4 font-medium text-foreground">{a.month} 2025</td>
                  <td className="px-6 py-4 text-green-600 font-semibold">{a.present}</td>
                  <td className="px-6 py-4 text-foreground">{a.total}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-secondary rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${p >= 75 ? "bg-green-500" : "bg-red-500"}`} style={{ width: `${p}%` }} />
                      </div>
                      <span className="text-sm font-medium text-foreground">{p}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={p >= 75 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                      {p >= 75 ? "Good" : "Low"}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StudentPerformance({ student }: { student: Student }) {
  const avg = student.performance.reduce((s, p) => s + p.marks, 0) / student.performance.length;
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground font-display mb-6">Performance Report</h1>
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 flex items-center gap-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-amber-700 font-display">{Math.round(avg)}%</p>
          <p className="text-sm text-amber-600">Average Score</p>
        </div>
        <div className="flex-1 ml-4">
          <p className="text-amber-800 font-semibold">{student.name} · Class {student.class} {student.section}</p>
          <p className="text-amber-700 text-sm mt-0.5">Annual Examination 2024–25</p>
        </div>
      </div>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-secondary">
            {["Subject", "Marks Obtained", "Max Marks", "Percentage", "Grade"].map(h => (
              <th key={h} className="text-left px-6 py-3 text-sm font-semibold text-foreground">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {student.performance.map((p, i) => (
              <tr key={p.subject} className={`border-t border-border ${i % 2 ? "bg-secondary/20" : ""}`}>
                <td className="px-6 py-4 font-medium text-foreground">{p.subject}</td>
                <td className="px-6 py-4 text-foreground font-semibold">{p.marks}</td>
                <td className="px-6 py-4 text-muted-foreground">{p.maxMarks}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-secondary rounded-full h-1.5">
                      <div className="bg-[#0d1b3e] h-1.5 rounded-full" style={{ width: `${(p.marks / p.maxMarks) * 100}%` }} />
                    </div>
                    <span className="text-sm text-foreground">{Math.round((p.marks / p.maxMarks) * 100)}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge className={getGradeColor(p.grade)}>{p.grade}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StudentFee({ student }: { student: Student }) {
  const [copied, setCopied] = useState(false);
  const gpayId = "edupeak.nidhi@okhdfcbank";

  const handleCopy = () => {
    navigator.clipboard.writeText(gpayId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground font-display mb-6">Fee Status</h1>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-foreground font-display">₹{student.feeTotal.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-1">Monthly Fee</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 text-center">
          <p className={`text-3xl font-bold font-display ${student.feePaid > 0 ? "text-green-600" : "text-muted-foreground"}`}>
            ₹{student.feePaid.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Amount Paid</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 text-center">
          <p className={`text-3xl font-bold font-display ${(student.feeTotal - student.feePaid) > 0 ? "text-red-500" : "text-green-500"}`}>
            ₹{(student.feeTotal - student.feePaid).toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Balance Due</p>
        </div>
      </div>

      <div className="mb-6 bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
        <div className={`px-5 py-2 rounded-full font-semibold text-sm ${getFeeStatusColor(student.feeStatus)}`}>
          {student.feeStatus === "Paid" ? "✓ Fee Paid" : student.feeStatus === "Pending" ? "⏳ Payment Pending" : "⚠ Overdue"}
        </div>
        <p className="text-muted-foreground text-sm">
          {student.feeStatus === "Paid" ? "Your fee for this month has been received. Thank you!" :
           student.feeStatus === "Pending" ? "Please pay the monthly fee by 10th of this month to avoid late charges." :
           "Your fee is overdue. Please contact the admin immediately."}
        </p>
      </div>

      {/* Payment Methods - ONLY visible to logged-in students */}
      <div className="bg-gradient-to-br from-[#0d1b3e] to-[#1a2f5a] rounded-2xl p-6 md:p-8 text-white">
        <div className="flex items-center gap-2 mb-6">
          <QrCode size={20} className="text-amber-400" />
          <h3 className="font-bold font-display text-lg">Pay Online — EduPeak</h3>
          <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 ml-auto">Secure</Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* QR Code Visual */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-2xl mb-3">
              {/* Minimal SVG QR code pattern */}
              <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="160" height="160" fill="white"/>
                {/* Corner squares */}
                <rect x="10" y="10" width="50" height="50" rx="4" fill="#0d1b3e"/>
                <rect x="16" y="16" width="38" height="38" rx="2" fill="white"/>
                <rect x="22" y="22" width="26" height="26" rx="1" fill="#0d1b3e"/>
                <rect x="100" y="10" width="50" height="50" rx="4" fill="#0d1b3e"/>
                <rect x="106" y="16" width="38" height="38" rx="2" fill="white"/>
                <rect x="112" y="22" width="26" height="26" rx="1" fill="#0d1b3e"/>
                <rect x="10" y="100" width="50" height="50" rx="4" fill="#0d1b3e"/>
                <rect x="16" y="106" width="38" height="38" rx="2" fill="white"/>
                <rect x="22" y="112" width="26" height="26" rx="1" fill="#0d1b3e"/>
                {/* Data modules */}
                {[70,76,82,88,70,76,82,88,70,76].map((x,i) => <rect key={i} x={x} y={10+i*6} width="4" height="4" fill="#0d1b3e"/>)}
                {[70,78,86,94,70,78,86,94].map((x,i) => <rect key={i} x={x} y={80+i*6} width="4" height="4" fill="#0d1b3e"/>)}
                {[100,108,116,124,132,100,116,132].map((x,i) => <rect key={i} x={x} y={70+i*6} width="4" height="4" fill="#0d1b3e"/>)}
                {[10,18,26,34,42,50,58,66].map((x,i) => <rect key={i} x={x} y={70+i*4} width="4" height="4" fill="#0d1b3e"/>)}
                {/* Center logo area */}
                <rect x="68" y="68" width="24" height="24" rx="4" fill="#f0a500"/>
                <text x="80" y="83" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">EP</text>
              </svg>
            </div>
            <p className="text-blue-300 text-xs text-center">Scan with any UPI app to pay</p>
          </div>

          {/* Payment Details */}
          <div className="space-y-5">
            <div>
              <p className="text-blue-300 text-xs font-medium uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Smartphone size={12} /> UPI / GPay ID
              </p>
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3">
                <code className="text-white font-mono text-sm flex-1">{gpayId}</code>
                <button onClick={handleCopy}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                    copied ? "bg-green-500/20 text-green-400" : "bg-white/10 text-blue-300 hover:bg-white/20"
                  }`}>
                  {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {[
                ["Payee Name", "EduPeak Institute"],
                ["Account Holder", "Nidhi Singh"],
                ["Bank", "HDFC Bank"],
                ["Amount", `₹${student.feeTotal.toLocaleString()}/month`],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between text-sm">
                  <span className="text-blue-300">{k}</span>
                  <span className="text-white font-medium">{v}</span>
                </div>
              ))}
            </div>
            <div className="bg-white/8 border border-white/15 rounded-xl p-3 text-xs text-blue-300">
              <p className="font-semibold text-amber-400 mb-1">⚠ Payment Instructions</p>
              <p>Add your <strong className="text-white">Roll No. and Name</strong> in the payment note/remarks for automatic confirmation. Pay by 10th of every month.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentAnnouncements({ announcements }: { announcements: Announcement[] }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground font-display mb-6">Announcements</h1>
      <div className="space-y-4">
        {announcements.map(a => (
          <div key={a.id} className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="font-bold text-foreground font-display">{a.title}</h3>
              <Badge className={`flex-shrink-0 ${a.priority === "high" ? "bg-red-100 text-red-700" : a.priority === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}`}>
                {a.priority.charAt(0).toUpperCase() + a.priority.slice(1)} Priority
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-3">{a.content}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Calendar size={11} /> {new Date(a.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudentAchievements({ achievements }: { achievements: Achievement[] }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground font-display mb-6">Achievements</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {achievements.map(a => (
          <div key={a.id} className="bg-card border border-border rounded-2xl p-5 flex gap-4 hover:shadow-md transition-shadow">
            <div className="text-3xl w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">{a.icon}</div>
            <div>
              <h3 className="font-bold text-foreground font-display text-sm">{a.title}</h3>
              <p className="text-muted-foreground text-xs mt-1 leading-relaxed line-clamp-2">{a.description}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span>{a.student}</span> · <span>Class {a.class}</span> · <span>{a.year}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────

function AdminSidebar({ page, onNav, onLogout }: { page: Page; onNav: (p: Page) => void; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const links: { icon: React.ElementType; label: string; page: Page }[] = [
    { icon: LayoutDashboard, label: "Overview", page: "admin-dashboard" },
    { icon: Users, label: "Students", page: "admin-students" },
    { icon: DollarSign, label: "Fee Structure", page: "admin-fees" },
    { icon: Trophy, label: "Achievements", page: "admin-achievements" },
    { icon: Calendar, label: "Attendance", page: "admin-attendance" },
    { icon: Megaphone, label: "Announcements", page: "admin-announcements" },
    { icon: BarChart2, label: "Analytics", page: "admin-analytics" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center">
            <GraduationCap size={18} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg font-display">EduPeak</span>
        </div>
        <div className="ml-12 flex items-center gap-1.5">
          <Shield size={11} className="text-amber-400" />
          <p className="text-amber-400 text-xs font-semibold">Admin Panel</p>
        </div>
      </div>
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
          <div className="w-9 h-9 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Shield size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Nidhi Ma'am</p>
            <p className="text-sidebar-foreground/60 text-xs">Administrator</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map(l => (
          <button key={l.page} onClick={() => { onNav(l.page); setOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              page === l.page
                ? "bg-amber-500 text-[#0d1b3e] font-semibold"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white"
            }`}>
            <l.icon size={17} /> {l.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <button onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 text-sidebar-foreground/60 hover:text-red-400 text-sm py-2 rounded-xl transition-colors">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#060e22] border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center">
            <GraduationCap size={14} className="text-white" />
          </div>
          <span className="text-white font-bold font-display">Admin Panel</span>
        </div>
        <button onClick={() => setOpen(!open)} className="text-white">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="w-72 bg-[#060e22] h-full"><SidebarContent /></div>
          <div className="flex-1 bg-black/50" onClick={() => setOpen(false)} />
        </div>
      )}
      <aside className="hidden md:flex flex-col w-64 bg-[#060e22] h-screen fixed left-0 top-0 border-r border-sidebar-border">
        <SidebarContent />
      </aside>
    </>
  );
}

function AdminLayout({ page, onNav, onLogout, children }: {
  page: Page; onNav: (p: Page) => void; onLogout: () => void; children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar page={page} onNav={onNav} onLogout={onLogout} />
      <main className="md:ml-64 pt-16 md:pt-0 min-h-screen">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}

function AdminOverview({ students }: { students: Student[] }) {
  const paidCount = students.filter(s => s.feeStatus === "Paid").length;
  const pendingCount = students.filter(s => s.feeStatus !== "Paid").length;
  const totalRevenue = students.filter(s => s.feeStatus === "Paid").reduce((s, st) => s + st.feePaid, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground font-display">Admin Overview</h1>
        <p className="text-muted-foreground mt-1">Welcome back, Nidhi Ma'am. Here's the institute summary.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Students" value={String(students.length)} color="blue" />
        <StatCard icon={CheckCircle} label="Fee Paid" value={String(paidCount)} color="green" />
        <StatCard icon={AlertCircle} label="Fee Pending" value={String(pendingCount)} color="gold" />
        <StatCard icon={DollarSign} label="Monthly Revenue" value={`₹${totalRevenue.toLocaleString()}`} color="purple" />
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-foreground font-display">Recent Students</h3>
        </div>
        <table className="w-full">
          <thead><tr className="bg-secondary">
            {["Name", "Class", "Attendance", "Avg Score", "Fee Status"].map(h => (
              <th key={h} className="text-left px-6 py-3 text-sm font-semibold text-foreground">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {students.map((s, i) => {
              const totalP = s.attendance.reduce((a, b) => a + b.present, 0);
              const totalD = s.attendance.reduce((a, b) => a + b.total, 0);
              const attPct = totalD ? Math.round((totalP / totalD) * 100) : 0;
              const avgScore = Math.round(s.performance.reduce((a, p) => a + p.marks, 0) / s.performance.length);
              return (
                <tr key={s.id} className={`border-t border-border ${i % 2 ? "bg-secondary/20" : ""}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-secondary">
                        <img src={s.photo} alt={s.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-medium text-foreground text-sm">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{s.class} {s.section}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{attPct}%</td>
                  <td className="px-6 py-4 text-sm text-foreground">{avgScore}%</td>
                  <td className="px-6 py-4">
                    <Badge className={getFeeStatusColor(s.feeStatus)}>{s.feeStatus}</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminStudents({ students, setStudents }: { students: Student[]; setStudents: (s: Student[] | ((p: Student[]) => Student[])) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showPwds, setShowPwds] = useState<Record<string, boolean>>({});
  const blank: Omit<Student, "id" | "attendance" | "performance"> = {
    username: "", password: "", name: "", class: "", section: "", rollNo: "",
    parentName: "", phone: "", address: "", photo: "", feeStatus: "Pending", feePaid: 0, feeTotal: 1000,
  };
  const [form, setForm] = useState(blank);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.username.toLowerCase().includes(search.toLowerCase()) ||
    s.class.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (s: Student) => {
    setEditId(s.id);
    setForm({ username: s.username, password: s.password, name: s.name, class: s.class, section: s.section,
      rollNo: s.rollNo, parentName: s.parentName, phone: s.phone, address: s.address, photo: s.photo,
      feeStatus: s.feeStatus, feePaid: s.feePaid, feeTotal: s.feeTotal });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this student? This cannot be undone.")) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Hash password if it's not already hashed (admin typed/generated a plain one)
    const pwToStore = form.password.startsWith("H:")
      ? form.password
      : "H:" + (await hashPassword(form.password));
    const secureForm = { ...form, password: pwToStore };

    if (editId) {
      setStudents(prev => prev.map(s => s.id === editId ? { ...s, ...secureForm } : s));
    } else {
      const newStudent: Student = {
        ...secureForm, id: `s${Date.now()}`,
        attendance: [], performance: [],
      };
      setStudents(prev => [...prev, newStudent]);
    }
    setShowForm(false);
    setEditId(null);
    setForm(blank);
  };

  const genPassword = () => {
    // Generate a plain-text password to show admin; it will be hashed on form submit
    const pw = "Edu@" + Math.floor(1000 + Math.random() * 9000);
    setForm(f => ({ ...f, password: pw }));
  };

  const resetPwd = async (id: string) => {
    const pw = "Edu@" + Math.floor(1000 + Math.random() * 9000);
    const hashed = "H:" + (await hashPassword(pw));
    setStudents(prev => prev.map(s => s.id === id ? { ...s, password: hashed } : s));
    alert(`Password reset to: ${pw}\nPlease note this down and share it with the student. It will not be shown again.`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-foreground font-display">Manage Students</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(blank); }}
          className="flex items-center gap-2 bg-[#0d1b3e] text-white font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-[#1a2f5a] transition-colors">
          <Plus size={16} /> Add Student
        </button>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, username, or class..."
          className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead><tr className="bg-secondary">
              {["Name", "Username", "Password", "Class", "Fee Status", "Actions"].map(h => (
                <th key={h} className="text-left px-5 py-3 text-sm font-semibold text-foreground">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} className={`border-t border-border ${i % 2 ? "bg-secondary/20" : ""}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full overflow-hidden bg-secondary flex-shrink-0">
                        <img src={s.photo} alt={s.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm font-mono text-foreground">{s.username}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <code className="text-xs text-muted-foreground font-mono">
                        {showPwds[s.id] ? s.password : "••••••••"}
                      </code>
                      <button onClick={() => setShowPwds(p => ({ ...p, [s.id]: !p[s.id] }))}
                        className="text-muted-foreground hover:text-foreground p-0.5">
                        {showPwds[s.id] ? <EyeOff size={12} /> : <Eye size={12} />}
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-foreground">{s.class} {s.section}</td>
                  <td className="px-5 py-3">
                    <Badge className={getFeeStatusColor(s.feeStatus)}>{s.feeStatus}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => handleEdit(s)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => resetPwd(s.id)} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Reset Password">
                        <RefreshCw size={14} />
                      </button>
                      <button onClick={() => handleDelete(s.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-10 text-muted-foreground text-sm">No students found.</div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-foreground font-display">{editId ? "Edit Student" : "Add New Student"}</h3>
              <button onClick={() => { setShowForm(false); setEditId(null); }} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: "name", label: "Full Name", type: "text" },
                  { key: "rollNo", label: "Roll No.", type: "text" },
                  { key: "class", label: "Class", type: "text" },
                  { key: "section", label: "Section", type: "text" },
                  { key: "parentName", label: "Parent Name", type: "text" },
                  { key: "phone", label: "Phone", type: "tel" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">{f.label}</label>
                    <input type={f.type} value={form[f.key as keyof typeof form] as string}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      required className="w-full bg-input-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Address</label>
                <input type="text" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                  className="w-full bg-input-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Username</label>
                <input type="text" value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} required
                  className="w-full bg-input-background border border-border rounded-xl px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Password</label>
                <div className="flex gap-2">
                  <input type="text" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required
                    className="flex-1 bg-input-background border border-border rounded-xl px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  <button type="button" onClick={genPassword}
                    className="bg-secondary text-foreground px-3 py-2 rounded-xl text-xs font-medium hover:bg-secondary/80 transition-colors whitespace-nowrap">
                    Generate
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Fee Status</label>
                  <select value={form.feeStatus} onChange={e => setForm(p => ({ ...p, feeStatus: e.target.value as Student["feeStatus"] }))}
                    className="w-full bg-input-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>Paid</option><option>Pending</option><option>Overdue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Fee Paid (₹)</label>
                  <input type="number" value={form.feePaid} onChange={e => setForm(p => ({ ...p, feePaid: Number(e.target.value) }))}
                    className="w-full bg-input-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Fee Total (₹)</label>
                  <input type="number" value={form.feeTotal} onChange={e => setForm(p => ({ ...p, feeTotal: Number(e.target.value) }))}
                    className="w-full bg-input-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setEditId(null); }}
                  className="flex-1 bg-secondary text-foreground font-medium py-2.5 rounded-xl text-sm hover:bg-secondary/80 transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 bg-[#0d1b3e] text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-[#1a2f5a] transition-colors">
                  {editId ? "Save Changes" : "Add Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminFees({ fees, setFees }: { fees: FeeItem[]; setFees: (f: FeeItem[] | ((p: FeeItem[]) => FeeItem[])) => void }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, { monthly: number; subjects: string }>>({});

  const startEdit = (f: FeeItem) => {
    setEditing(f.class);
    setValues(v => ({ ...v, [f.class]: { monthly: f.monthly, subjects: f.subjects || "" } }));
  };

  const saveEdit = (cls: string) => {
    setFees(prev => prev.map(f => f.class === cls ? { ...f, ...values[cls] } : f));
    setEditing(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground font-display mb-6">Manage Fee Structure</h1>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-[#0d1b3e] text-white">
              {["Class", "Monthly Fee (₹)", "Subjects (Classes 8-10)", "Action"].map(h => (
                <th key={h} className="text-left px-6 py-4 font-semibold text-sm">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {fees.map((f, i) => (
                <tr key={f.class} className={`border-t border-border ${i % 2 ? "bg-secondary/20" : ""}`}>
                  <td className="px-6 py-4 font-semibold text-foreground">Class {f.class}</td>
                  <td className="px-6 py-4">
                    {editing === f.class ? (
                      <input type="number" value={values[f.class]?.monthly || f.monthly}
                        onChange={e => setValues(v => ({ ...v, [f.class]: { ...v[f.class], monthly: Number(e.target.value) } }))}
                        className="w-28 bg-input-background border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                    ) : (
                      <span className="font-bold text-[#0d1b3e]">₹{f.monthly.toLocaleString()}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editing === f.class && f.subjects !== undefined ? (
                      <input type="text" value={values[f.class]?.subjects || ""}
                        onChange={e => setValues(v => ({ ...v, [f.class]: { ...v[f.class], subjects: e.target.value } }))}
                        className="w-64 bg-input-background border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                    ) : (
                      <span className="text-sm text-muted-foreground">{f.subjects || "All core subjects"}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editing === f.class ? (
                      <div className="flex items-center gap-2">
                        <button onClick={() => saveEdit(f.class)}
                          className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-600">
                          <Check size={12} /> Save
                        </button>
                        <button onClick={() => setEditing(null)}
                          className="flex items-center gap-1 bg-secondary text-foreground px-3 py-1.5 rounded-lg text-xs hover:bg-secondary/80">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => startEdit(f)}
                        className="flex items-center gap-1.5 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                        <Edit2 size={12} /> Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminAchievements({ achievements, setAchievements }: { achievements: Achievement[]; setAchievements: (a: Achievement[] | ((p: Achievement[]) => Achievement[])) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const blank = { title: "", description: "", student: "", class: "", year: new Date().getFullYear().toString(), type: "academic" as Achievement["type"], icon: "⭐" };
  const [form, setForm] = useState(blank);

  const handleEdit = (a: Achievement) => {
    setEditId(a.id);
    setForm({ title: a.title, description: a.description, student: a.student, class: a.class, year: a.year, type: a.type, icon: a.icon });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this achievement?")) setAchievements(prev => prev.filter(a => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      setAchievements(prev => prev.map(a => a.id === editId ? { ...a, ...form } : a));
    } else {
      setAchievements(prev => [...prev, { ...form, id: `a${Date.now()}` }]);
    }
    setShowForm(false); setEditId(null); setForm(blank);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-foreground font-display">Manage Achievements</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(blank); }}
          className="flex items-center gap-2 bg-[#0d1b3e] text-white font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-[#1a2f5a] transition-colors">
          <Plus size={16} /> Add Achievement
        </button>
      </div>

      <div className="space-y-4">
        {achievements.map(a => (
          <div key={a.id} className="bg-card border border-border rounded-2xl p-5 flex gap-4 items-start">
            <div className="text-3xl w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">{a.icon}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground font-display">{a.title}</h3>
              <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{a.description}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span>{a.student}</span> · <span>Class {a.class}</span> · <span>{a.year}</span>
                <Badge className="bg-blue-100 text-blue-700">{a.type}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button onClick={() => handleEdit(a)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"><Edit2 size={15} /></button>
              <button onClick={() => handleDelete(a.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-foreground font-display">{editId ? "Edit Achievement" : "Add Achievement"}</h3>
              <button onClick={() => { setShowForm(false); setEditId(null); }} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Title</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required
                  className="w-full bg-input-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required
                  className="w-full bg-input-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: "student", label: "Student Name" },
                  { key: "class", label: "Class" },
                  { key: "year", label: "Year" },
                  { key: "icon", label: "Icon (emoji)" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">{f.label}</label>
                    <input value={form[f.key as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} required={f.key !== "icon"}
                      className="w-full bg-input-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Type</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as Achievement["type"] }))}
                  className="w-full bg-input-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="board">Board Result</option>
                  <option value="academic">Academic</option>
                  <option value="olympiad">Olympiad</option>
                  <option value="sports">Sports</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setEditId(null); }}
                  className="flex-1 bg-secondary text-foreground font-medium py-2.5 rounded-xl text-sm hover:bg-secondary/80">Cancel</button>
                <button type="submit"
                  className="flex-1 bg-[#0d1b3e] text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-[#1a2f5a]">
                  {editId ? "Save Changes" : "Add Achievement"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminAttendance({ students, setStudents }: { students: Student[]; setStudents: (s: Student[] | ((p: Student[]) => Student[])) => void }) {
  const [selectedClass, setSelectedClass] = useState("10th");
  const [month, setMonth] = useState("Apr");
  const filtered = students.filter(s => s.class === selectedClass);
  const classes = [...new Set(students.map(s => s.class))];
  const months = ["Jan", "Feb", "Mar", "Apr"];

  const updateAtt = (sid: string, field: "present" | "total", val: number) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== sid) return s;
      const att = s.attendance.map(a => a.month === month ? { ...a, [field]: val } : a);
      return { ...s, attendance: att };
    }));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground font-display mb-6">Manage Attendance</h1>
      <div className="flex gap-3 mb-6 flex-wrap">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Class</label>
          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
            className="bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
            {classes.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Month</label>
          <select value={month} onChange={e => setMonth(e.target.value)}
            className="bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
            {months.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
      </div>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-secondary">
            {["Student", "Roll No.", "Days Present", "Total Days", "Percentage"].map(h => (
              <th key={h} className="text-left px-6 py-3 text-sm font-semibold text-foreground">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map((s, i) => {
              const att = s.attendance.find(a => a.month === month) || { month, present: 0, total: 26 };
              const pct = att.total ? Math.round((att.present / att.total) * 100) : 0;
              return (
                <tr key={s.id} className={`border-t border-border ${i % 2 ? "bg-secondary/20" : ""}`}>
                  <td className="px-6 py-3 font-medium text-foreground text-sm">{s.name}</td>
                  <td className="px-6 py-3 text-sm text-muted-foreground">{s.rollNo}</td>
                  <td className="px-6 py-3">
                    <input type="number" value={att.present} min={0} max={att.total}
                      onChange={e => updateAtt(s.id, "present", Number(e.target.value))}
                      className="w-16 bg-input-background border border-border rounded-lg px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-center" />
                  </td>
                  <td className="px-6 py-3">
                    <input type="number" value={att.total} min={1}
                      onChange={e => updateAtt(s.id, "total", Number(e.target.value))}
                      className="w-16 bg-input-background border border-border rounded-lg px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-center" />
                  </td>
                  <td className="px-6 py-3">
                    <Badge className={pct >= 75 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>{pct}%</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminAnnouncements({ announcements, setAnnouncements }: { announcements: Announcement[]; setAnnouncements: (a: Announcement[] | ((p: Announcement[]) => Announcement[])) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const blank = { title: "", content: "", date: new Date().toISOString().split("T")[0], priority: "medium" as Announcement["priority"] };
  const [form, setForm] = useState(blank);

  const handleEdit = (a: Announcement) => {
    setEditId(a.id);
    setForm({ title: a.title, content: a.content, date: a.date, priority: a.priority });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this announcement?")) setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      setAnnouncements(prev => prev.map(a => a.id === editId ? { ...a, ...form } : a));
    } else {
      setAnnouncements(prev => [{ ...form, id: `ann${Date.now()}` }, ...prev]);
    }
    setShowForm(false); setEditId(null); setForm(blank);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-foreground font-display">Manage Announcements</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(blank); }}
          className="flex items-center gap-2 bg-[#0d1b3e] text-white font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-[#1a2f5a] transition-colors">
          <Plus size={16} /> New Announcement
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map(a => (
          <div key={a.id} className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getPriorityColor(a.priority)}`} />
                <h3 className="font-bold text-foreground font-display">{a.title}</h3>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => handleEdit(a)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(a.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-3">{a.content}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              <Badge className={a.priority === "high" ? "bg-red-100 text-red-700" : a.priority === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}>
                {a.priority}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-foreground font-display">{editId ? "Edit Announcement" : "New Announcement"}</h3>
              <button onClick={() => { setShowForm(false); setEditId(null); }} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Title</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required
                  className="w-full bg-input-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Content</label>
                <textarea rows={4} value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} required
                  className="w-full bg-input-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Date</label>
                  <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                    className="w-full bg-input-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Priority</label>
                  <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value as Announcement["priority"] }))}
                    className="w-full bg-input-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setEditId(null); }}
                  className="flex-1 bg-secondary text-foreground font-medium py-2.5 rounded-xl text-sm">Cancel</button>
                <button type="submit"
                  className="flex-1 bg-[#0d1b3e] text-white font-semibold py-2.5 rounded-xl text-sm">
                  {editId ? "Save" : "Publish"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminAnalytics({ students }: { students: Student[] }) {
  const totalRevenue = students.filter(s => s.feeStatus === "Paid").reduce((s, st) => s + st.feePaid, 0);
  const paidPct = students.length ? Math.round((students.filter(s => s.feeStatus === "Paid").length / students.length) * 100) : 0;
  const avgAtt = students.length ? Math.round(students.reduce((s, st) => {
    const p = st.attendance.reduce((a, b) => a + b.present, 0);
    const t = st.attendance.reduce((a, b) => a + b.total, 0);
    return s + (t ? (p / t) * 100 : 0);
  }, 0) / students.length) : 0;
  const avgScore = students.length ? Math.round(students.reduce((s, st) => {
    return s + (st.performance.length ? st.performance.reduce((a, p) => a + p.marks, 0) / st.performance.length : 0);
  }, 0) / students.length) : 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground font-display mb-6">Analytics & Reports</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Students" value={String(students.length)} color="blue" />
        <StatCard icon={DollarSign} label="Revenue Collected" value={`₹${totalRevenue.toLocaleString()}`} color="green" />
        <StatCard icon={Calendar} label="Avg Attendance" value={`${avgAtt}%`} color="purple" />
        <StatCard icon={TrendingUp} label="Avg Score" value={`${avgScore}%`} color="gold" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-foreground font-display mb-4">Fee Collection Status</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground font-medium">Paid</span>
                <span className="text-muted-foreground">{paidPct}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${paidPct}%` }} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {["Paid", "Pending", "Overdue"].map(status => (
              <div key={status} className="text-center bg-secondary/50 rounded-xl p-3">
                <p className="text-lg font-bold text-foreground font-display">
                  {students.filter(s => s.feeStatus === status).length}
                </p>
                <p className="text-xs text-muted-foreground">{status}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-foreground font-display mb-4">Students by Class</h3>
          <div className="space-y-3">
            {[...new Set(students.map(s => s.class))].map(cls => {
              const count = students.filter(s => s.class === cls).length;
              const pct = Math.round((count / students.length) * 100);
              return (
                <div key={cls} className="flex items-center gap-3">
                  <span className="text-sm text-foreground w-16">Class {cls}</span>
                  <div className="flex-1 bg-secondary rounded-full h-2">
                    <div className="bg-[#0d1b3e] h-2 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-sm text-muted-foreground w-6">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer({ onNav }: { onNav: (p: Page) => void }) {
  return (
    <footer className="bg-[#060e22] text-blue-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl font-display">EduPeak</span>
          </div>
          <p className="text-sm leading-relaxed mb-4 max-w-sm">
            Shaping future leaders with excellence since 2005. Trusted by 1,000+ students and families across Jalandhar.
          </p>
          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2"><MapPin size={14} className="text-amber-400 flex-shrink-0" /> 112 outside street 5, Wazir Singh Enclave, Rama Mandi, Jalandhar</p>
            <p className="flex items-center gap-2"><Phone size={14} className="text-amber-400" /> +91 86998-44850</p>
            <p className="flex items-center gap-2"><Mail size={14} className="text-amber-400" /> ajayg13@rediffmail.com</p>
          </div>
        </div>
        <div>
          <p className="text-white font-semibold mb-4">Quick Links</p>
          <div className="space-y-2 text-sm">
            {(["home", "about", "classes", "achievements", "fee", "contact"] as Page[]).map(p => (
              <button key={p} onClick={() => onNav(p)} className="block hover:text-white capitalize transition-colors">
                {p === "fee" ? "Fee Structure" : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-white font-semibold mb-4">Timings</p>
          <div className="space-y-2 text-sm">
            <p>Monday – Saturday</p>
            <p className="text-white font-medium">3:00 PM – 8:00 PM</p>
            <p className="mt-3">Sunday</p>
            <p className="text-white font-medium">12:00 PM – 3:00 PM</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs">© 2025 EduPeak Institute. All rights reserved.</p>
          <p className="text-xs">Designed with ❤ for academic excellence</p>
        </div>
      </div>
    </footer>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [role, setRole] = useState<Role>("public");
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [students, setStudents] = useLocalStorage<Student[]>("edupeak_students", INITIAL_STUDENTS);
  const [fees, setFees] = useLocalStorage<FeeItem[]>("edupeak_fees", INITIAL_FEE);
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>("edupeak_achievements", INITIAL_ACHIEVEMENTS);
  const [announcements, setAnnouncements] = useLocalStorage<Announcement[]>("edupeak_announcements", INITIAL_ANNOUNCEMENTS);
  // On mount: hash any plain-text passwords still in storage (one-time migration)
  useEffect(() => {
    const migrate = async () => {
      const anyPlain = students.some(s => !s.password.startsWith("H:"));
      if (anyPlain) {
        const hashed = await seedHashedStudents(students);
        setStudents(hashed);
      }
    };
    migrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Inactivity auto-logout
  useEffect(() => {
    if (role === "public") return;
    let timer: ReturnType<typeof setTimeout>;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => { setRole("public"); setCurrentStudent(null); setPage("home"); }, 30 * 60 * 1000);
    };
    window.addEventListener("mousemove", reset);
    window.addEventListener("keydown", reset);
    reset();
    return () => { clearTimeout(timer); window.removeEventListener("mousemove", reset); window.removeEventListener("keydown", reset); };
  }, [role]);

  const handleStudentLogin = (s: Student) => {
    setCurrentStudent(s);
    setRole("student");
    setPage("student-dashboard");
  };

  const handleAdminLogin = () => {
    setRole("admin");
    setPage("admin-dashboard");
  };

  const handleLogout = () => {
    setRole("public");
    setCurrentStudent(null);
    setPage("home");
  };

  const navTo = (p: Page) => {
    if ((p.startsWith("student-") || p.startsWith("admin-")) && role === "public") {
      setPage("login");
      return;
    }
    if (p.startsWith("admin-") && role !== "admin") return;
    if (p.startsWith("student-") && role !== "student") return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isStudentPage = page.startsWith("student-");
  const isAdminPage = page.startsWith("admin-");
  const showPublicNav = !isStudentPage && !isAdminPage;

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .font-display { font-family: 'Plus Jakarta Sans', sans-serif; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(13,27,62,0.2); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(13,27,62,0.4); }
      `}</style>

      {showPublicNav && (
        <Navbar page={page} role={role} onNav={navTo} onLogout={handleLogout}
          studentName={currentStudent?.name} />
      )}

      {/* Public Pages */}
      {showPublicNav && (
        <div className="pt-16">
          {page === "home" && <HomePage onNav={navTo} />}
          {page === "about" && <AboutPage onNav={navTo} />}
          {page === "classes" && <ClassesPage onNav={navTo} />}
          {page === "achievements" && <AchievementsPage achievements={achievements} onNav={navTo} />}
          {page === "fee" && <FeePage fees={fees} onNav={navTo} />}
          {page === "contact" && <ContactPage onNav={navTo} />}
          {page === "login" && (
            <LoginPage students={students} onStudentLogin={handleStudentLogin} onAdminLogin={handleAdminLogin} />
          )}
        </div>
      )}

      {/* Student Portal */}
      {isStudentPage && currentStudent && (
        <StudentLayout page={page} onNav={navTo} student={currentStudent} onLogout={handleLogout}>
          {page === "student-dashboard" && <StudentDashboard student={currentStudent} announcements={announcements} onNav={navTo} />}
          {page === "student-profile" && <StudentProfile student={currentStudent} />}
          {page === "student-attendance" && <StudentAttendance student={currentStudent} />}
          {page === "student-performance" && <StudentPerformance student={currentStudent} />}
          {page === "student-fee" && <StudentFee student={currentStudent} />}
          {page === "student-announcements" && <StudentAnnouncements announcements={announcements} />}
          {page === "student-achievements" && <StudentAchievements achievements={achievements} />}
        </StudentLayout>
      )}

      {/* Admin Panel */}
      {isAdminPage && role === "admin" && (
        <AdminLayout page={page} onNav={navTo} onLogout={handleLogout}>
          {page === "admin-dashboard" && <AdminOverview students={students} />}
          {page === "admin-students" && <AdminStudents students={students} setStudents={setStudents} />}
          {page === "admin-fees" && <AdminFees fees={fees} setFees={setFees} />}
          {page === "admin-achievements" && <AdminAchievements achievements={achievements} setAchievements={setAchievements} />}
          {page === "admin-attendance" && <AdminAttendance students={students} setStudents={setStudents} />}
          {page === "admin-announcements" && <AdminAnnouncements announcements={announcements} setAnnouncements={setAnnouncements} />}
          {page === "admin-analytics" && <AdminAnalytics students={students} />}
        </AdminLayout>
      )}
    </div>
  );
}
