"use client";
import { Download, BarChart2, FileText, PieChart, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const quarterlyData = [
  { quarter: "Q1 FY24", output: 2100000, itc: 750000, payable: 1350000 },
  { quarter: "Q2 FY24", output: 2800000, itc: 920000, payable: 1880000 },
  { quarter: "Q3 FY24", output: 3200000, itc: 1050000, payable: 2150000 },
  { quarter: "Q4 FY24", output: 2500000, itc: 870000, payable: 1630000 },
];

const vendorData = [
  { vendor: "AWS India", amount: 85000, mismatches: 1 },
  { vendor: "Google Cloud", amount: 62000, mismatches: 2 },
  { vendor: "Microsoft", amount: 45000, mismatches: 1 },
  { vendor: "Adobe", amount: 28000, mismatches: 0 },
];

const reports = [
  { title: "GST Summary Report", desc: "Month-wise output tax, ITC, and net payable", icon: BarChart2, color: "gradient-blue" },
  { title: "ITC Reconciliation Report", desc: "Books vs GSTR-2B matching analysis", icon: PieChart, color: "gradient-green" },
  { title: "Vendor Mismatch Report", desc: "Supplier-wise ITC discrepancies", icon: TrendingUp, color: "gradient-orange" },
  { title: "Filing History Report", desc: "Complete filing log with acknowledgements", icon: FileText, color: "gradient-purple" },
  { title: "Audit Trail Report", desc: "All changes and approvals with timestamps", icon: FileText, color: "gradient-red" },
  { title: "Tax Analytics Dashboard", desc: "AI-powered tax liability forecasting", icon: BarChart2, color: "gradient-blue" },
];

export default function Reports() {
  return (
    <div className="space-y-4">
      {/* Report Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {reports.map(report => {
          const Icon = report.icon;
          return (
            <div key={report.title} className="card hover:shadow-lg transition-shadow cursor-pointer group">
              <div className={`w-11 h-11 rounded-xl ${report.color} flex items-center justify-center mb-3`}>
                <Icon size={20} className="text-white" />
              </div>
              <h4 className="font-semibold text-sm mb-1" style={{ color: "var(--foreground)" }}>{report.title}</h4>
              <p className="text-xs mb-3" style={{ color: "var(--secondary)" }}>{report.desc}</p>
              <div className="flex gap-2">
                <button className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg gradient-blue text-white font-medium flex-1 justify-center">
                  <Download size={12} /> PDF
                </button>
                <button className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium flex-1 justify-center" style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}>
                  <Download size={12} /> Excel
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Annual Chart */}
      <div className="card">
        <h3 className="font-semibold mb-4" style={{ color: "var(--foreground)" }}>Annual GST Analytics — FY 2023-24</h3>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "Annual Output GST", value: formatCurrency(10600000) },
            { label: "Annual ITC Claimed", value: formatCurrency(3590000) },
            { label: "Net Tax Paid", value: formatCurrency(7010000) },
          ].map(item => (
            <div key={item.label} className="p-3 rounded-lg text-center" style={{ background: "var(--background)" }}>
              <p className="text-xl font-bold" style={{ color: "var(--foreground)" }}>{item.value}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--secondary)" }}>{item.label}</p>
            </div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={quarterlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: "var(--secondary)" }} />
            <YAxis tickFormatter={v => `${(v/100000).toFixed(0)}L`} tick={{ fontSize: 11, fill: "var(--secondary)" }} />
            <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
            <Bar dataKey="output" fill="#2563eb" name="Output GST" radius={[4, 4, 0, 0]} />
            <Bar dataKey="itc" fill="#10b981" name="ITC" radius={[4, 4, 0, 0]} />
            <Bar dataKey="payable" fill="#f59e0b" name="Net Payable" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Vendor Table */}
      <div className="card">
        <h3 className="font-semibold mb-4" style={{ color: "var(--foreground)" }}>Top Vendors — ITC Summary</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--border)" }}>
              {["Vendor", "ITC Amount", "Mismatches", "Action"].map(h => (
                <th key={h} className="px-4 py-2 text-left text-xs font-semibold" style={{ color: "var(--secondary)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vendorData.map(v => (
              <tr key={v.vendor} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50" style={{ borderColor: "var(--border)" }}>
                <td className="px-4 py-3 font-medium text-sm" style={{ color: "var(--foreground)" }}>{v.vendor}</td>
                <td className="px-4 py-3 text-sm" style={{ color: "var(--foreground)" }}>{formatCurrency(v.amount)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${v.mismatches === 0 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                    {v.mismatches === 0 ? "No Issues" : `${v.mismatches} Mismatch`}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-xs px-3 py-1 rounded-lg gradient-blue text-white">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
