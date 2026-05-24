"use client";
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import Dashboard from "@/components/dashboard/Dashboard";
import InvoiceAgent from "@/components/agents/InvoiceAgent";
import GSTReturns from "@/components/agents/GSTReturns";
import ReconciliationAgent from "@/components/agents/ReconciliationAgent";
import NoticeAgent from "@/components/agents/NoticeAgent";
import UploadCenter from "@/components/agents/UploadCenter";
import Reports from "@/components/agents/Reports";
import AIAssistant from "@/components/agents/AIAssistant";
import ComplianceDashboard from "@/components/agents/ComplianceDashboard";
import Companies from "@/components/agents/Companies";
import Settings from "@/components/agents/Settings";

const moduleComponents: Record<string, React.ComponentType> = {
  dashboard: Dashboard,
  invoices: InvoiceAgent,
  "gst-returns": GSTReturns,
  reconciliation: ReconciliationAgent,
  notices: NoticeAgent,
  upload: UploadCenter,
  reports: Reports,
  "ai-assistant": AIAssistant,
  compliance: ComplianceDashboard,
  companies: Companies,
  settings: Settings,
};

export default function Home() {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const ActiveComponent = moduleComponents[activeModule] || Dashboard;
  const sidebarWidth = sidebarCollapsed ? "64px" : "240px";

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <Sidebar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
      />
      <TopBar activeModule={activeModule} sidebarWidth={sidebarWidth} />
      <main
        className="transition-all duration-300 pt-14"
        style={{ marginLeft: sidebarWidth }}
      >
        <div className="p-6">
          <ActiveComponent />
        </div>
      </main>
    </div>
  );
}
