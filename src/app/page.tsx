"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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

export interface RiziptContext {
  gstin?: string;
  company?: string;
  pan?: string;
  email?: string;
  phone?: string;
  source?: string;
}

// Global context so any component can read rizipt params
export let riziptContext: RiziptContext = {};

function HomeContent() {
  const searchParams = useSearchParams();
  const [activeModule, setActiveModule] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [context, setContext] = useState<RiziptContext>({});

  useEffect(() => {
    // Read URL params passed from rizipt.in floating button
    const ctx: RiziptContext = {
      gstin: searchParams.get("gstin") || undefined,
      company: searchParams.get("company") || undefined,
      pan: searchParams.get("pan") || undefined,
      email: searchParams.get("email") || undefined,
      phone: searchParams.get("phone") || undefined,
      source: searchParams.get("source") || undefined,
    };
    // Also check sessionStorage (set by postMessage from rizipt iframe)
    try {
      const stored = sessionStorage.getItem("riziptContext");
      if (stored) {
        const parsed = JSON.parse(stored);
        Object.assign(ctx, parsed);
      }
    } catch {}

    riziptContext = ctx;
    setContext(ctx);

    // If opened from rizipt with a module param, switch to it
    const mod = searchParams.get("module");
    if (mod && moduleComponents[mod]) {
      setActiveModule(mod);
    }
  }, [searchParams]);

  // Listen for postMessage from rizipt parent window (iframe / opener)
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "RIZIPT_CONTEXT") {
        const ctx = event.data.payload as RiziptContext;
        riziptContext = { ...riziptContext, ...ctx };
        setContext(c => ({ ...c, ...ctx }));
        try {
          sessionStorage.setItem("riziptContext", JSON.stringify(riziptContext));
        } catch {}
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const ActiveComponent = moduleComponents[activeModule] || Dashboard;
  const sidebarWidth = sidebarCollapsed ? "64px" : "240px";

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Rizipt context banner */}
      {context.company && (
        <div
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-1.5 text-xs font-medium text-white"
          style={{ background: "linear-gradient(90deg, #10b981, #059669)", height: "28px" }}
        >
          <span>
            📦 Loaded from rizipt POS &nbsp;|&nbsp;
            <strong>{context.company}</strong>
            {context.gstin && <> &nbsp;·&nbsp; GSTIN: <strong>{context.gstin}</strong></>}
          </span>
          <a
            href="https://rizipt.in"
            className="opacity-80 hover:opacity-100 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            ← Back to rizipt
          </a>
        </div>
      )}

      <Sidebar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
      />
      <TopBar activeModule={activeModule} sidebarWidth={sidebarWidth} />
      <main
        className="transition-all duration-300"
        style={{
          marginLeft: sidebarWidth,
          paddingTop: context.company ? "calc(3.5rem + 28px)" : "3.5rem",
        }}
      >
        <div className="p-6">
          <ActiveComponent />
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
