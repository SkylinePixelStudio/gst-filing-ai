"use client";
import { useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, Zap, X } from "lucide-react";

const integrations = [
  { name: "Tally ERP", icon: "📊", status: "connected", desc: "Sync sales and purchase register" },
  { name: "Zoho Books", icon: "📚", status: "disconnected", desc: "Import invoices automatically" },
  { name: "QuickBooks", icon: "💼", status: "disconnected", desc: "Sync accounting data" },
  { name: "Razorpay", icon: "💳", status: "disconnected", desc: "Import payment settlements" },
  { name: "Bank Statement", icon: "🏦", status: "connected", desc: "Upload OFX/PDF statements" },
  { name: "Email Ingestion", icon: "📧", status: "connected", desc: "Auto-fetch from inbox" },
];

const uploadHistory = [
  { name: "March_Invoices.xlsx", type: "Excel", records: 87, status: "processed", time: "2h ago" },
  { name: "Purchase_Register.csv", type: "CSV", records: 45, status: "processed", time: "5h ago" },
  { name: "Tally_Export_Mar24.xml", type: "Tally XML", records: 132, status: "processing", time: "Just now" },
  { name: "GST_Portal_GSTR2B.json", type: "JSON", records: 56, status: "processed", time: "1d ago" },
];

export default function UploadCenter() {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<string[]>([]);

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={`card border-2 border-dashed text-center py-12 transition-all cursor-pointer ${
          dragging ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""
        }`}
        style={{ borderColor: dragging ? "#2563eb" : "var(--border)" }}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); }}
      >
        <div className="w-16 h-16 rounded-2xl gradient-blue flex items-center justify-center mx-auto mb-4">
          <Upload size={28} className="text-white" />
        </div>
        <h3 className="font-bold text-lg mb-2" style={{ color: "var(--foreground)" }}>
          Drop Files to Upload
        </h3>
        <p className="text-sm mb-4" style={{ color: "var(--secondary)" }}>
          Supports Excel (.xlsx), CSV, PDF invoices, Tally XML, GSTN JSON, Bank OFX
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <button className="px-5 py-2 rounded-lg gradient-blue text-white text-sm font-medium">
            Browse Files
          </button>
          <button className="px-5 py-2 rounded-lg text-sm font-medium" style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
            Bulk Upload (ZIP)
          </button>
        </div>
        <p className="text-xs mt-4" style={{ color: "var(--secondary)" }}>
          Max 50MB per file · AI-powered auto-classification · OCR for PDF invoices
        </p>
      </div>

      {/* AI Processing Capabilities */}
      <div className="card" style={{ background: "linear-gradient(135deg, #1d4ed8, #1e40af)", color: "white", border: "none" }}>
        <div className="flex items-center gap-2 mb-3">
          <Zap size={18} />
          <h3 className="font-bold">AI Document Processing</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { title: "OCR Invoice Scan", desc: "Extract data from PDFs & images" },
            { title: "Auto-Classification", desc: "B2B, B2C, Export, RCM detection" },
            { title: "GSTIN Validation", desc: "Real-time GSTN API verification" },
            { title: "Duplicate Detection", desc: "AI finds duplicate invoices" },
          ].map(item => (
            <div key={item.title} className="p-3 rounded-lg bg-white/10">
              <p className="font-semibold text-sm mb-0.5">{item.title}</p>
              <p className="text-xs opacity-75">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Integrations */}
      <div className="card">
        <h3 className="font-semibold mb-4" style={{ color: "var(--foreground)" }}>Accounting Integrations</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {integrations.map(intg => (
            <div key={intg.name} className="p-4 rounded-xl" style={{ background: "var(--background)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{intg.icon}</span>
                  <span className="font-medium text-sm" style={{ color: "var(--foreground)" }}>{intg.name}</span>
                </div>
                <span className={`w-2 h-2 rounded-full ${intg.status === "connected" ? "bg-green-500" : "bg-gray-300"}`}></span>
              </div>
              <p className="text-xs mb-3" style={{ color: "var(--secondary)" }}>{intg.desc}</p>
              <button className={`w-full py-1.5 rounded-lg text-xs font-medium transition-colors ${
                intg.status === "connected"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "gradient-blue text-white"
              }`}>
                {intg.status === "connected" ? "✓ Connected — Sync Now" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Upload History */}
      <div className="card">
        <h3 className="font-semibold mb-4" style={{ color: "var(--foreground)" }}>Recent Uploads</h3>
        <div className="space-y-2">
          {uploadHistory.map(file => (
            <div key={file.name} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "var(--background)" }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText size={16} style={{ color: "var(--secondary)" }} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{file.name}</p>
                  <p className="text-xs" style={{ color: "var(--secondary)" }}>{file.type} · {file.records} records · {file.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {file.status === "processed" ? (
                  <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                    <CheckCircle size={13} /> Processed
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-blue-600 font-medium animate-pulse">
                    <Zap size={13} /> Processing...
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
