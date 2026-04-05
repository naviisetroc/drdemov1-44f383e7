import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  ArrowRightLeft,
  Calendar,
  Settings,
  Menu,
  X,
  Stethoscope,
  MessageCircle,
  LogOut,
  User } from
"lucide-react";
import { useNavigate } from "react-router-dom";

const navItems = [
{ to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
{ to: "/pacientes", icon: Users, label: "Pacientes" },
{ to: "/notas", icon: FileText, label: "Notas Médicas" },
{ to: "/agenda", icon: Calendar, label: "Agenda" },

{ to: "/referencias", icon: ArrowRightLeft, label: "Referencias" },
{ to: "/configuracion", icon: Settings, label: "Configuración" }];


export default function AppLayout({ children }: {children: React.ReactNode;}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("medisec_logged_in");
    navigate("/");
  };

  return (
    <div className="flex h-screen overflow-hidden gradient-bg">
      {/* Mobile overlay */}
      {sidebarOpen &&
      <div
        className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden"
        onClick={() => setSidebarOpen(false)} />

      }

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar/95 backdrop-blur-xl text-sidebar-foreground border-r border-sidebar-border transition-transform duration-200 lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"}`
        }>
        
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
            <Stethoscope className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-base font-bold text-sidebar-primary-foreground">
              Dr. Guapo
            </h1>
            <p className="text-[10px] text-sidebar-muted">Secretario Inteligente</p>
          </div>
          <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                active ?
                "bg-primary/15 text-primary border border-primary/20 shadow-sm glow-primary" :
                "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`
                }>
                
                <item.icon className={`h-[18px] w-[18px] ${active ? "text-primary" : ""}`} />
                {item.label}
              </Link>);

          })}
        </nav>

        {/* Demo patient link */}
        <div className="border-t border-sidebar-border p-3">
          <Link
            to="/paciente"
            target="_blank"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/20 px-3 py-2.5 text-xs font-medium text-sidebar-foreground hover:border-accent/40 transition-all">
            
            <User className="h-3.5 w-3.5 text-accent" />
            Vista paciente (demo)
          </Link>
        </div>

        {/* Doctor info */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-accent/30 text-sm font-semibold text-foreground ring-2 ring-primary/20">
              AR
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-sidebar-primary-foreground">
                Dr. Alejandro Ramírez
              </p>
              <p className="truncate text-[10px] text-sidebar-muted">Medicina General</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-sidebar-muted hover:text-destructive transition-colors"
              title="Cerrar sesión">
              
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar mobile */}
        <header className="flex h-14 items-center gap-3 border-b border-border glass px-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            <span className="font-display text-base font-bold">Dr. Guapo</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="animate-fade-in bg-slate-400">{children}</div>
        </main>
      </div>
    </div>);

}