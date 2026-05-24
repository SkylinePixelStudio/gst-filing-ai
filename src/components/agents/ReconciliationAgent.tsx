"use client";
import { useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Zap, Download } from "lucide-react";
import { mockReconciliation } from "@/data/mockData";
import { formatCurrency, maskGSTIN } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const reconData = [
  { period: "Oct-23", matched: 85, mismatch: 8, missing: 3 },
  { period: "Nov-23", matched: 92, mismatch: 5, missing: 2 },
  { period: "Dec-23", matched: 78, mismatch: 12, missing: 6 },
  { period: "Jan-24", matched: 95, mismatch: 3, missing: 1 },
  { period: "Feb-24", matched: 88, mismatch: 7, missing: 4 },
  { period: "Mar-24", matched: 90, mismatch: 5, missing: 3 },
];

export default function ReconciliationAgent() {
  const [running, setRunning] = useState(false);
  const [ran, setRan] = useState(true);

  const matched = mockReconciliation.filter(r => r.status === "matched").length;
  const mismatch = mockReconciliation.filter(r => r.status === "mismatch").length;
  const missing = mockReconciliation.filter(r => r.status === "missing_in_books" || r.status === "missing_in_2b").length;

  const handleRun = () => {
    setRunning(true);
    setTimeout(() => { setRunning(false); setRan(true); }, 2500);
  };

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg" style={{ color: "var(--foreground)" }}>GSTR-2B vs Books Reconciliation</h3>
            <p className="text-sm mt-0.5" style={{ color: "var(--secondary)" }}>
              Match purchase invoices in your books against GSTR-2B auto-populated data
            </p>
          </div>
          <div className="flex gap-2">
            <select className="px-3 py-1.5 rounded-lg text-sm outline-none" style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
              <option>March 2024</option>
              <option>February 2024</option>
              <option>January 2024</option>
            </select>
            <button
              onClick={handleRun}
              disabled={running}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium gradient-blue text-white disabled:opacity-60"
            >
              {running ? (
                <><RefreshCw size={14} className="animate-spin" /> Running AI Recon...</>
              ) : (
                <><Zap size={14} /> Run Reconciliation</>
              )}
            </button>
            {ran && (
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium" style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
                <Download size={14} /> Export Report
              </button>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          {[
            { label: "Total Records", value: mockReconciliation.length, color: "#2563eb" },
            { label: "Matched", value: matched, color: "#10b981" },
            { label: "Mismatches", value: mismatch, color: "#ef4444" },
            { label: "Missing in Books", value: missing, color: "#f59e0b" },
          ].map(item => (
            <div key={item.label} className="p-3 rounded-xl text-center" style={{ background: "var(--background)" }}>
              <p className="text-2xl font-bold" style={{ color: item.color }}>{item.value}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--secondary)" }}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="card">
        <h3 className="font-semibold mb-4" style={{ color: "var(--foreground)" }}>Reconciliation Trend — Last 6 Months</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={reconData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="period" tick={{ fontSize: 11, fill: "var(--secondary)" }} />
            <YAxis tick={{ fontSize: 11, fill: "var(--secondary)" }} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
            <Bar dataKey="matched" fill="#10b981" name="Matched" radius={[3, 3, 0, 0]} />
            <Bar dataKey="mismatch" fill="#ef4444" name="Mismatch" radius={[3, 3, 0, 0]} />
            <Bar dataKey="missing" fill="#f59e0b" name="Missing" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Reconciliation Table */}
      <div className="card">
        <h3 className="font-semibold mb-4" style={{ color: "var(--foreground)" }}>Reconciliation Details — March 2024</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                {["Invoice #", "Supplier", "GSTIN", "Books Amount", "GSTR-2B Amount", "Difference", "ITC Claimable", "Status", "Action"].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs font-semibold" style={{ color: "var(--secondary)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockReconciliation.map(item => (
                <tr key={item.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors" style={{ borderColor: "var(--border)" }}>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: "var(--foreground)" }}>{item.invoiceNumber}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: "var(--foreground)" }}>{item.supplierName}</td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: "var(--secondary)" }}>{maskGSTIN(item.supplierGSTIN)}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: "var(--foreground)" }}>{formatCurrency(item.bookAmount)}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: "var(--foreground)" }}>{formatCurrency(item.gstr2bAmount)}</td>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: item.difference === 0 ? "#10b981" : "#ef4444" }}>
                    {item.difference === 0 ? "Nil" : formatCurrency(Math.abs(item.difference))}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-green-600">{formatCurrency(item.itcClaimable)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 w-fit ${
                      item.status === "matched" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                      item.status === "mismatch" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}>
                      {item.status === "matched" ? <CheckCircle size={11} /> : item.status === "mismatch" ? <XCircle size={11} /> : <AlertTriangle size={11} />}
                      {item.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {item.status !== "matched" && (
                      <button className="text-xs px-2 py-1 rounded-lg gradient-blue text-white">
                        AI Fix
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Recommendations */}
        <div className="mt-4 p-4 rounded-xl border-l-4 border-blue-500" style={{ background: "var(--background)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Zap size={16} className="text-blue-500" />
            <span className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>AI Reconciliation Insights</span>
          </div>
          <ul className="space-y-1.5">
            {[
              "Google Cloud India invoice (₹16,500 in 2B vs ₹15,000 in books) — likely a rate revision. Update your books to match GSTR-2B.",
              "Microsoft India invoice missing in books — locate and book the purchase to claim ₹12,000 ITC.",
              "Total unclaimed ITC due to mismatches: ₹13,500 — resolve before filing GSTR-3B.",
            ].map((insight, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--secondary)" }}>
                <span className="text-blue-500 font-bold mt-0.5">→</span> {insight}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
