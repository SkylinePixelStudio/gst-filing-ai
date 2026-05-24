"use client";
import { useState } from "react";
import { CheckCircle, Clock, AlertCircle, FileText, Download, Send, Zap, Eye } from "lucide-react";
import { mockGSTReturns } from "@/data/mockData";
import { formatCurrency } from "@/lib/utils";
import { GSTReturn } from "@/types";

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  filed: { label: "Filed", color: "#10b981", bg: "bg-green-100 dark:bg-green-900/30", icon: CheckCircle },
  ready: { label: "Ready to File", color: "#2563eb", bg: "bg-blue-100 dark:bg-blue-900/30", icon: FileText },
  draft: { label: "Draft", color: "#f59e0b", bg: "bg-yellow-100 dark:bg-yellow-900/30", icon: Clock },
  pending: { label: "Pending Data", color: "#94a3b8", bg: "bg-gray-100 dark:bg-gray-800", icon: AlertCircle },
};

const returnInfo: Record<string, { desc: string; sections: string[] }> = {
  "GSTR-1": {
    desc: "Statement of outward supplies — details of all sales invoices",
    sections: ["B2B Invoices", "B2C Invoices", "Debit/Credit Notes", "Exports", "Nil Rated", "HSN Summary"],
  },
  "GSTR-3B": {
    desc: "Monthly summary return — payment of taxes",
    sections: ["Outward Supplies", "ITC Available", "ITC Reversed", "Net ITC", "Tax Payable", "Late Fee"],
  },
  "GSTR-9": {
    desc: "Annual return — consolidated summary for the financial year",
    sections: ["Part I", "Part II Outward", "Part III ITC", "Part IV Tax Paid", "Part V Previous Year"],
  },
  "GSTR-2B": {
    desc: "Auto-generated ITC statement from supplier filings",
    sections: ["B2B", "CDNR", "ISD", "TDS", "TCS", "Import of Goods"],
  },
};

function ReturnCard({ gstReturn }: { gstReturn: GSTReturn }) {
  const status = statusConfig[gstReturn.status];
  const StatusIcon = status.icon;
  const info = returnInfo[gstReturn.type] || { desc: "", sections: [] };
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card mb-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 rounded-xl gradient-blue flex items-center justify-center flex-shrink-0`}>
            <FileText size={22} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-bold text-base" style={{ color: "var(--foreground)" }}>{gstReturn.type}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${status.bg}`} style={{ color: status.color }}>
                <StatusIcon size={11} />{status.label}
              </span>
            </div>
            <p className="text-sm" style={{ color: "var(--secondary)" }}>{gstReturn.period}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--secondary)" }}>{info.desc}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs mb-1" style={{ color: "var(--secondary)" }}>Due Date</p>
          <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{gstReturn.dueDate}</p>
          {gstReturn.filedDate && (
            <p className="text-xs text-green-500 mt-0.5">Filed: {gstReturn.filedDate}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="p-3 rounded-lg" style={{ background: "var(--background)" }}>
          <p className="text-xs" style={{ color: "var(--secondary)" }}>Taxable Amount</p>
          <p className="font-bold text-sm mt-0.5" style={{ color: "var(--foreground)" }}>{formatCurrency(gstReturn.taxableAmount)}</p>
        </div>
        <div className="p-3 rounded-lg" style={{ background: "var(--background)" }}>
          <p className="text-xs" style={{ color: "var(--secondary)" }}>Tax Amount</p>
          <p className="font-bold text-sm mt-0.5" style={{ color: "var(--foreground)" }}>{formatCurrency(gstReturn.taxAmount)}</p>
        </div>
        <div className="p-3 rounded-lg" style={{ background: "var(--background)" }}>
          <p className="text-xs" style={{ color: "var(--secondary)" }}>Late Fee</p>
          <p className="font-bold text-sm mt-0.5" style={{ color: gstReturn.lateFee ? "#ef4444" : "#10b981" }}>
            {gstReturn.lateFee ? formatCurrency(gstReturn.lateFee) : "Nil"}
          </p>
        </div>
      </div>

      {/* Sections */}
      {expanded && info.sections.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--secondary)" }}>RETURN SECTIONS</p>
          <div className="grid grid-cols-3 gap-2">
            {info.sections.map(section => (
              <div key={section} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: "var(--background)" }}>
                <CheckCircle size={12} className="text-green-500" />
                <span className="text-xs" style={{ color: "var(--foreground)" }}>{section}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
        <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
          <Eye size={13} />{expanded ? "Hide" : "View"} Details
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
          <Download size={13} /> Download JSON
        </button>
        {gstReturn.status === "ready" && (
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium gradient-blue text-white ml-auto">
            <Send size={13} /> File Now
          </button>
        )}
        {gstReturn.status === "draft" && (
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-yellow-500 text-white ml-auto">
            <Zap size={13} /> AI Prepare
          </button>
        )}
      </div>
    </div>
  );
}

export default function GSTReturns() {
  const [activeTab, setActiveTab] = useState("all");

  const filtered = mockGSTReturns.filter(r => {
    if (activeTab === "all") return true;
    return r.type === activeTab;
  });

  return (
    <div className="space-y-4">
      {/* AI Preparation Banner */}
      <div className="card" style={{ background: "linear-gradient(135deg, #1d4ed8, #1e40af)", color: "white", border: "none" }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap size={18} />
              <h3 className="font-bold">AI Return Preparation Engine</h3>
            </div>
            <p className="text-sm opacity-80">
              142 invoices processed · GSTR-1 April 2024 is ready · GSTR-3B needs 8 pending invoices
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg text-sm font-medium bg-white/20 hover:bg-white/30 transition-colors">
              Prepare GSTR-3B
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-blue-700 font-semibold">
              File GSTR-1 Now →
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {["all", "GSTR-1", "GSTR-3B", "GSTR-2B", "GSTR-9"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab ? "gradient-blue text-white" : ""
            }`}
            style={activeTab !== tab ? { background: "var(--card)", border: "1px solid var(--border)", color: "var(--secondary)" } : {}}
          >
            {tab === "all" ? "All Returns" : tab}
          </button>
        ))}
      </div>

      {/* Return Cards */}
      <div>
        {filtered.map(r => <ReturnCard key={r.id} gstReturn={r} />)}
      </div>
    </div>
  );
}
