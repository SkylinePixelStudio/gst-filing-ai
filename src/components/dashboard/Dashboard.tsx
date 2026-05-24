"use client";
import { useState, useEffect } from "react";
import {
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
  FileText, Clock, Activity, ArrowUpRight, Zap, RefreshCw
} from "lucide-react";
import { mockDashboardMetrics, mockGSTReturns, mockNotices, mockInvoices } from "@/data/mockData";
import { formatCurrency } from "@/lib/utils";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

const monthlyData = [
  { month: "Oct", output: 680000, itc: 210000, payable: 470000 },
  { month: "Nov", output: 720000, itc: 245000, payable: 475000 },
  { month: "Dec", output: 890000, itc: 280000, payable: 610000 },
  { month: "Jan", output: 750000, itc: 260000, payable: 490000 },
  { month: "Feb", output: 820000, itc: 295000, payable: 525000 },
  { month: "Mar", output: 895000, itc: 312500, payable: 582500 },
];

const supplyBreakdown = [
  { name: "Intra-State", value: 45, color: "#2563eb" },
  { name: "Inter-State", value: 38, color: "#10b981" },
  { name: "Export", value: 12, color: "#f59e0b" },
  { name: "Exempt", value: 5, color: "#94a3b8" },
];

const dueDates = [
  { return: "GSTR-1", period: "April 2024", due: "11 May 2024", status: "ready", daysLeft: 3 },
  { return: "GSTR-3B", period: "April 2024", due: "20 May 2024", status: "draft", daysLeft: 12 },
  { return: "GSTR-9", period: "FY 2023-24", due: "31 Dec 2024", status: "pending", daysLeft: 226 },
];

function MetricCard({ title, value, subtitle, icon: Icon, gradient, trend }: {
  title: string; value: string; subtitle: string; icon: any; gradient: string; trend?: "up" | "down" | "neutral";
}) {
  return (
    <div className="card" style={{ position: "relative", overflow: "hidden" }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--secondary)" }}>{title}</p>
          <p className="text-2xl font-bold mb-1" style={{ color: "var(--foreground)" }}>{value}</p>
          <p className="text-xs" style={{ color: "var(--secondary)" }}>{subtitle}</p>
        </div>
        <div className={`w-11 h-11 rounded-xl ${gradient} flex items-center justify-center shadow-lg`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1 mt-3">
          {trend === "up" && <TrendingUp size={14} className="text-green-500" />}
          {trend === "down" && <TrendingDown size={14} className="text-red-500" />}
          <span className="text-xs" style={{ color: trend === "up" ? "#10b981" : trend === "down" ? "#ef4444" : "var(--secondary)" }}>
            vs last month
          </span>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const metrics = mockDashboardMetrics;
  const [aiInsight, setAiInsight] = useState(0);
  const insights = [
    "⚡ 3 supplier invoices in GSTR-2B not found in your books — potential missed ITC of ₹33,600",
    "📊 Your compliance score is 87% — improve by reconciling pending invoices before 11 May",
    "💰 Tax liability this month: ₹5.82L — 12% higher than last month due to increased sales",
    "🔔 GSTR-1 due in 3 days. 142 invoices ready. 8 invoices need review before filing.",
  ];

  useEffect(() => {
    const timer = setInterval(() => setAiInsight(prev => (prev + 1) % insights.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* AI Insight Banner */}
      <div className="rounded-xl p-4 flex items-center gap-4" style={{ background: "linear-gradient(135deg, #1d4ed8, #1e40af)", color: "white" }}>
        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
          <Zap size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium opacity-75 mb-0.5">AI INSIGHT</p>
          <p className="text-sm font-medium transition-all">{insights[aiInsight]}</p>
        </div>
        <button className="text-xs bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30 transition-colors flex-shrink-0">
          View Details →
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Output GST (Sales)"
          value={formatCurrency(metrics.totalOutputGST)}
          subtitle="April 2024"
          icon={TrendingUp}
          gradient="gradient-blue"
          trend="up"
        />
        <MetricCard
          title="Input Tax Credit"
          value={formatCurrency(metrics.totalInputITC)}
          subtitle="ITC Available"
          icon={CheckCircle}
          gradient="gradient-green"
          trend="up"
        />
        <MetricCard
          title="Net GST Payable"
          value={formatCurrency(metrics.netPayable)}
          subtitle="After ITC set-off"
          icon={Activity}
          gradient="gradient-orange"
          trend="up"
        />
        <MetricCard
          title="Compliance Score"
          value={`${metrics.complianceScore}%`}
          subtitle="Good — 3 alerts"
          icon={AlertTriangle}
          gradient="gradient-purple"
          trend="neutral"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly Trend */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>GST Trend — Last 6 Months</h3>
            <div className="flex items-center gap-3 text-xs" style={{ color: "var(--secondary)" }}>
              <span className="flex items-center gap-1"><span className="w-3 h-1 rounded bg-blue-500 inline-block"></span>Output</span>
              <span className="flex items-center gap-1"><span className="w-3 h-1 rounded bg-green-500 inline-block"></span>ITC</span>
              <span className="flex items-center gap-1"><span className="w-3 h-1 rounded bg-orange-500 inline-block"></span>Payable</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="outputGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="itcGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--secondary)" }} />
              <YAxis tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} tick={{ fontSize: 11, fill: "var(--secondary)" }} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Area type="monotone" dataKey="output" stroke="#2563eb" strokeWidth={2} fill="url(#outputGrad)" name="Output GST" />
              <Area type="monotone" dataKey="itc" stroke="#10b981" strokeWidth={2} fill="url(#itcGrad)" name="ITC" />
              <Line type="monotone" dataKey="payable" stroke="#f59e0b" strokeWidth={2} dot={false} name="Net Payable" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Supply Breakdown */}
        <div className="card">
          <h3 className="font-semibold mb-4" style={{ color: "var(--foreground)" }}>Supply Type Breakdown</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={supplyBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {supplyBreakdown.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {supplyBreakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }}></span>
                  <span style={{ color: "var(--secondary)" }}>{item.name}</span>
                </div>
                <span className="font-medium" style={{ color: "var(--foreground)" }}>{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Filing Calendar */}
        <div className="card">
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
            <Clock size={16} className="text-blue-500" /> Upcoming Filings
          </h3>
          <div className="space-y-3">
            {dueDates.map((item) => (
              <div key={item.return} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "var(--background)" }}>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>{item.return}</p>
                  <p className="text-xs" style={{ color: "var(--secondary)" }}>{item.period}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--secondary)" }}>Due: {item.due}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    item.status === "ready" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                    item.status === "draft" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  }`}>{item.status}</span>
                  <p className="text-xs mt-1" style={{ color: item.daysLeft <= 5 ? "#ef4444" : "var(--secondary)" }}>
                    {item.daysLeft}d left
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice Stats */}
        <div className="card">
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
            <FileText size={16} className="text-green-500" /> Invoice Status
          </h3>
          <div className="space-y-3">
            {[
              { label: "Matched & Filed", count: 98, color: "#10b981" },
              { label: "Pending Review", count: 8, color: "#f59e0b" },
              { label: "Mismatches", count: 3, color: "#ef4444" },
              { label: "Duplicates Found", count: 1, color: "#8b5cf6" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: "var(--secondary)" }}>{item.label}</span>
                  <span className="font-semibold" style={{ color: "var(--foreground)" }}>{item.count}</span>
                </div>
                <div className="w-full h-1.5 rounded-full" style={{ background: "var(--border)" }}>
                  <div className="h-1.5 rounded-full transition-all" style={{
                    width: `${(item.count / 110) * 100}%`,
                    background: item.color
                  }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t flex justify-between text-sm" style={{ borderColor: "var(--border)" }}>
            <span style={{ color: "var(--secondary)" }}>Total Invoices</span>
            <span className="font-bold" style={{ color: "var(--foreground)" }}>110</span>
          </div>
        </div>

        {/* Open Notices */}
        <div className="card">
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
            <AlertTriangle size={16} className="text-red-500" /> Active Notices
          </h3>
          <div className="space-y-3">
            {mockNotices.map((notice) => (
              <div key={notice.id} className="p-3 rounded-lg border-l-4" style={{
                background: "var(--background)",
                borderLeftColor: notice.status === "open" ? "#ef4444" : "#10b981"
              }}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-bold" style={{ color: "var(--foreground)" }}>{notice.type}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                    notice.status === "open" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-green-100 text-green-700"
                  }`}>{notice.status}</span>
                </div>
                <p className="text-xs mb-1" style={{ color: "var(--secondary)" }} title={notice.description}>
                  {notice.description.substring(0, 60)}...
                </p>
                <p className="text-xs font-medium" style={{ color: "#ef4444" }}>
                  Deadline: {notice.responseDeadline}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
