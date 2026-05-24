"use client";
import { useState } from "react";
import { AlertTriangle, FileText, Zap, Clock, ChevronDown, ChevronUp, Shield } from "lucide-react";
import { mockNotices } from "@/data/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";
import { GSTNotice } from "@/types";

function NoticeCard({ notice }: { notice: GSTNotice }) {
  const [expanded, setExpanded] = useState(false);
  const isOverdue = new Date(notice.responseDeadline) < new Date();
  const daysLeft = Math.ceil((new Date(notice.responseDeadline).getTime() - Date.now()) / 86400000);

  return (
    <div className="card mb-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
            notice.status === "open" ? "gradient-red" : "gradient-green"
          }`}>
            <Shield size={22} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-bold text-sm" style={{ color: "var(--foreground)" }}>{notice.type}</span>
              <span className="text-xs font-mono" style={{ color: "var(--secondary)" }}>{notice.noticeNumber}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                notice.status === "open" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                notice.status === "responded" ? "bg-yellow-100 text-yellow-700" :
                "bg-green-100 text-green-700"
              }`}>{notice.status.toUpperCase()}</span>
            </div>
            <p className="text-sm" style={{ color: "var(--secondary)" }}>{notice.issuedBy}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--secondary)" }}>
              Issued: {formatDate(notice.issuedDate)}
            </p>
          </div>
        </div>
        <div className="text-right">
          {notice.amount && (
            <p className="font-bold text-base" style={{ color: "#ef4444" }}>{formatCurrency(notice.amount)}</p>
          )}
          <p className="text-xs mt-1" style={{ color: isOverdue ? "#ef4444" : daysLeft <= 7 ? "#f59e0b" : "var(--secondary)" }}>
            {isOverdue ? "OVERDUE" : `${daysLeft} days left`}
          </p>
          <p className="text-xs" style={{ color: "var(--secondary)" }}>Due: {formatDate(notice.responseDeadline)}</p>
        </div>
      </div>

      {/* Description */}
      <div className="mt-3 p-3 rounded-lg" style={{ background: "var(--background)" }}>
        <p className="text-sm" style={{ color: "var(--foreground)" }}>{notice.description}</p>
      </div>

      {/* AI Analysis */}
      {notice.aiAnalysis && (
        <div className="mt-3 p-3 rounded-lg border-l-4 border-blue-500" style={{ background: "rgba(37, 99, 235, 0.05)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-blue-500" />
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">AI ANALYSIS</span>
          </div>
          <p className="text-sm" style={{ color: "var(--foreground)" }}>{notice.aiAnalysis}</p>
        </div>
      )}

      {/* Response Draft (expandable) */}
      {expanded && (
        <div className="mt-3 p-3 rounded-lg" style={{ background: "var(--background)", border: "1px solid var(--border)" }}>
          <p className="text-xs font-bold mb-2" style={{ color: "var(--secondary)" }}>AI-GENERATED RESPONSE DRAFT</p>
          <div className="text-sm space-y-2" style={{ color: "var(--foreground)" }}>
            <p>To,<br />The Proper Officer,<br />{notice.issuedBy}</p>
            <p><strong>Sub: Response to Notice No. {notice.noticeNumber} dated {formatDate(notice.issuedDate)}</strong></p>
            <p>This is in reference to the above-cited notice regarding discrepancy in ITC claimed. We hereby submit our response:</p>
            <p>The discrepancy arose due to invoices uploaded by our suppliers after the GSTR-2B cut-off date. As per Rule 37A of CGST Rules, ITC can be claimed in subsequent months upon reflection in GSTR-2B. We attach the reconciliation statement herewith.</p>
            <p>We request the Honorable Officer to consider our reply and drop the proceedings.</p>
            <p>Yours faithfully,<br />Authorized Signatory<br />Skyline Pixel Studio Pvt Ltd</p>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="px-3 py-1.5 rounded-lg text-xs gradient-blue text-white font-medium">Download Draft</button>
            <button className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}>Edit Draft</button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium gradient-blue text-white"
        >
          <Zap size={13} /> AI Draft Response
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
          <FileText size={13} /> Attach Documents
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
          <Clock size={13} /> Set Reminder
        </button>
      </div>
    </div>
  );
}

export default function NoticeAgent() {
  return (
    <div className="space-y-4">
      {/* Risk Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Open Notices", value: 2, color: "#ef4444", gradient: "gradient-red" },
          { label: "Total Demand", value: "₹1.7L", color: "#f59e0b", gradient: "gradient-orange" },
          { label: "Response Due", value: "1", color: "#f59e0b", gradient: "gradient-orange" },
          { label: "Risk Score", value: "Medium", color: "#8b5cf6", gradient: "gradient-purple" },
        ].map(item => (
          <div key={item.label} className="card text-center">
            <p className="text-2xl font-bold" style={{ color: item.color }}>{item.value}</p>
            <p className="text-xs mt-1" style={{ color: "var(--secondary)" }}>{item.label}</p>
          </div>
        ))}
      </div>

      {/* AI Risk Assessment */}
      <div className="card" style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "white", border: "none" }}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold mb-1">AI Risk Assessment — May 2024</h3>
            <p className="text-sm opacity-80 mb-3">
              Medium compliance risk detected. 2 open notices with ₹1.7L demand. 
              Primary risk: ITC reconciliation gaps from FY 2022-23. 
              No fraud indicators detected. Penalty risk: Low if responded within deadline.
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/20 hover:bg-white/30">
                View Full Report
              </button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-purple-700 font-semibold">
                Generate Response Package
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notice Cards */}
      {mockNotices.map(notice => <NoticeCard key={notice.id} notice={notice} />)}
    </div>
  );
}
