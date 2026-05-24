"use client";
import { Bell, Search, User, ChevronDown } from "lucide-react";

interface TopBarProps {
  activeModule: string;
  sidebarWidth: string;
}

const moduleLabels: Record<string, string> = {
  dashboard: "Dashboard",
  invoices: "Invoice Intelligence",
  "gst-returns": "GST Returns Filing",
  reconciliation: "Reconciliation Engine",
  notices: "Notice & Risk Management",
  upload: "Upload & Import",
  reports: "Reports & Analytics",
  "ai-assistant": "AI CFO Assistant",
  compliance: "Compliance Monitor",
  companies: "Company Management",
  settings: "Settings",
};

export default function TopBar({ activeModule, sidebarWidth }: TopBarProps) {
  return (
    <header
      className="fixed top-0 right-0 h-14 z-30 flex items-center justify-between px-6"
      style={{
        left: sidebarWidth,
        background: "var(--card)",
        borderBottom: "1px solid var(--border)",
        transition: "left 0.3s",
      }}
    >
      <div className="flex items-center gap-3">
        <div>
          <h1 className="font-semibold text-base" style={{ color: "var(--foreground)" }}>
            {moduleLabels[activeModule] || "GST Filing AI Assistant"}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
          style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--secondary)" }}
        >
          <Search size={14} />
          <span>Search...</span>
          <span className="text-xs ml-2 px-1 rounded" style={{ background: "var(--border)" }}>⌘K</span>
        </div>

        <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" style={{ color: "var(--secondary)" }}>
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full gradient-blue flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Admin</p>
            <p className="text-xs" style={{ color: "var(--secondary)" }}>Skyline Pixel</p>
          </div>
          <ChevronDown size={14} style={{ color: "var(--secondary)" }} />
        </div>
      </div>
    </header>
  );
}
