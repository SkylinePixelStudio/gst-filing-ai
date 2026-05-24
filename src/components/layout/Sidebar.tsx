"use client";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import {
  LayoutDashboard, FileText, Calculator, RefreshCw, Bell,
  Upload, BarChart3, MessageSquare, Settings, ChevronLeft,
  ChevronRight, Shield, Building2, LogOut, Sun, Moon, Zap
} from "lucide-react";

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "invoices", label: "Invoices", icon: FileText },
  { id: "gst-returns", label: "GST Returns", icon: Calculator },
  { id: "reconciliation", label: "Reconciliation", icon: RefreshCw },
  { id: "notices", label: "Notices", icon: Bell },
  { id: "upload", label: "Upload & Import", icon: Upload },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "ai-assistant", label: "AI CFO Chat", icon: MessageSquare },
  { id: "compliance", label: "Compliance", icon: Shield },
  { id: "companies", label: "Companies", icon: Building2 },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ activeModule, setActiveModule }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-40 flex flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}
      style={{ background: "var(--card)", borderRight: "1px solid var(--border)" }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "var(--border)" }}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-blue flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>GST AI</p>
              <p className="text-xs" style={{ color: "var(--secondary)" }}>Assistant</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg gradient-blue flex items-center justify-center mx-auto">
            <Zap size={16} className="text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          style={{ color: "var(--secondary)" }}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Company Selector */}
      {!collapsed && (
        <div className="p-3 mx-3 mt-3 rounded-lg" style={{ background: "var(--background)", border: "1px solid var(--border)" }}>
          <p className="text-xs font-medium truncate" style={{ color: "var(--secondary)" }}>Active Company</p>
          <p className="text-sm font-semibold truncate" style={{ color: "var(--foreground)" }}>Skyline Pixel Studio</p>
          <p className="text-xs truncate" style={{ color: "var(--secondary)" }}>29AABCS1234D1Z5</p>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto p-2 mt-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all text-sm font-medium ${
                isActive
                  ? "gradient-blue text-white shadow-md"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              style={!isActive ? { color: "var(--secondary)" } : {}}
              title={collapsed ? item.label : ""}
            >
              <Icon size={18} className={isActive ? "text-white" : ""} />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.id === "ai-assistant" && (
                <span className="ml-auto text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">AI</span>
              )}
              {!collapsed && item.id === "notices" && (
                <span className="ml-auto text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">2</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t" style={{ borderColor: "var(--border)" }}>
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm mb-1"
          style={{ color: "var(--secondary)" }}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          {!collapsed && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
        </button>
        <button
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm text-red-500"
        >
          <LogOut size={18} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
