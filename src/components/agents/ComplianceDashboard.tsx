"use client";
import { Shield, CheckCircle, AlertTriangle, XCircle, Clock, TrendingUp } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";

const complianceData = [
  { subject: "GSTR-1 Filing", value: 95 },
  { subject: "GSTR-3B Filing", value: 92 },
  { subject: "ITC Reconciliation", value: 78 },
  { subject: "Invoice Validation", value: 88 },
  { subject: "E-Invoice", value: 100 },
  { subject: "Notice Response", value: 70 },
];

const complianceChecks = [
  { check: "GSTIN is active and valid", status: "pass" },
  { check: "All outward supplies reported in GSTR-1", status: "pass" },
  { check: "GSTR-3B filed for last 12 months", status: "pass" },
  { check: "ITC reconciled with GSTR-2B", status: "warn", detail: "3 pending mismatches" },
  { check: "No excess ITC claimed", status: "warn", detail: "₹13,500 under review" },
  { check: "E-invoice generated for eligible transactions", status: "pass" },
  { check: "Reverse Charge Mechanism compliance", status: "pass" },
  { check: "Open GST notices responded", status: "fail", detail: "2 notices pending response" },
  { check: "Late fee for delayed filings", status: "pass", detail: "No late fees" },
  { check: "HSN/SAC codes on all invoices", status: "pass" },
];

const dueDates = [
  { event: "GSTR-1 (April 2024)", date: "11 May 2024", daysLeft: 3, urgent: true },
  { event: "GSTR-3B (April 2024)", date: "20 May 2024", daysLeft: 12, urgent: false },
  { event: "DRC-01A Response", date: "20 Apr 2024", daysLeft: -15, urgent: true },
  { event: "GSTR-9 (FY 2023-24)", date: "31 Dec 2024", daysLeft: 226, urgent: false },
  { event: "ASMT-10 Response", date: "01 May 2024", daysLeft: -6, urgent: true },
];

export default function ComplianceDashboard() {
  const score = 87;

  return (
    <div className="space-y-4">
      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center py-6">
          <div className="relative inline-flex items-center justify-center mb-3">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="10" />
              <circle
                cx="50" cy="50" r="40" fill="none"
                stroke={score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444"}
                strokeWidth="10"
                strokeDasharray={`${(score / 100) * 251} 251`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                style={{ transition: "stroke-dasharray 1s ease" }}
              />
            </svg>
            <div className="absolute text-center">
              <p className="text-2xl font-black" style={{ color: score >= 80 ? "#10b981" : "#f59e0b" }}>{score}</p>
              <p className="text-xs" style={{ color: "var(--secondary)" }}>/ 100</p>
            </div>
          </div>
          <h3 className="font-bold text-lg" style={{ color: "var(--foreground)" }}>Compliance Score</h3>
          <p className="text-sm" style={{ color: "#10b981" }}>Good Standing</p>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-3" style={{ color: "var(--foreground)" }}>Compliance Radar</h3>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={complianceData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: "var(--secondary)" }} />
              <Radar name="Score" dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-3" style={{ color: "var(--foreground)" }}>Score Breakdown</h3>
          <div className="space-y-3">
            {[
              { label: "Filing Compliance", score: 94, color: "#10b981" },
              { label: "ITC Accuracy", score: 82, color: "#2563eb" },
              { label: "Invoice Quality", score: 91, color: "#8b5cf6" },
              { label: "Notice Management", score: 65, color: "#f59e0b" },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: "var(--secondary)" }}>{item.label}</span>
                  <span className="font-semibold" style={{ color: item.color }}>{item.score}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full" style={{ background: "var(--border)" }}>
                  <div className="h-1.5 rounded-full" style={{ width: `${item.score}%`, background: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance Checklist */}
      <div className="card">
        <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
          <Shield size={18} className="text-blue-500" /> Compliance Checklist
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {complianceChecks.map(item => (
            <div key={item.check} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: "var(--background)" }}>
              {item.status === "pass" && <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />}
              {item.status === "warn" && <AlertTriangle size={16} className="text-yellow-500 flex-shrink-0 mt-0.5" />}
              {item.status === "fail" && <XCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />}
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{item.check}</p>
                {item.detail && (
                  <p className="text-xs mt-0.5" style={{ color: item.status === "pass" ? "#10b981" : item.status === "warn" ? "#f59e0b" : "#ef4444" }}>
                    {item.detail}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Calendar */}
      <div className="card">
        <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
          <Clock size={18} className="text-orange-500" /> Compliance Calendar
        </h3>
        <div className="space-y-2">
          {dueDates.map(item => (
            <div key={item.event} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "var(--background)" }}>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-10 rounded-full ${item.daysLeft < 0 ? "bg-red-500" : item.urgent ? "bg-yellow-500" : "bg-green-500"}`} />
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{item.event}</p>
                  <p className="text-xs" style={{ color: "var(--secondary)" }}>Due: {item.date}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                item.daysLeft < 0 ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                item.daysLeft <= 7 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              }`}>
                {item.daysLeft < 0 ? `${Math.abs(item.daysLeft)}d overdue` : `${item.daysLeft}d left`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
