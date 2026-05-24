"use client";
import { useState } from "react";
import { Search, Filter, Upload, CheckCircle, AlertTriangle, XCircle, Eye, Zap } from "lucide-react";
import { mockInvoices } from "@/data/mockData";
import { formatCurrency, formatDate, maskGSTIN } from "@/lib/utils";
import { Invoice } from "@/types";

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  matched: { label: "Matched", color: "#10b981", bg: "bg-green-100 dark:bg-green-900/30", icon: CheckCircle },
  mismatch: { label: "Mismatch", color: "#ef4444", bg: "bg-red-100 dark:bg-red-900/30", icon: XCircle },
  pending: { label: "Pending", color: "#f59e0b", bg: "bg-yellow-100 dark:bg-yellow-900/30", icon: AlertTriangle },
  filed: { label: "Filed", color: "#2563eb", bg: "bg-blue-100 dark:bg-blue-900/30", icon: CheckCircle },
};

function InvoiceRow({ invoice }: { invoice: Invoice }) {
  const status = statusConfig[invoice.status];
  const StatusIcon = status.icon;

  return (
    <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors" style={{ borderColor: "var(--border)" }}>
      <td className="px-4 py-3">
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{invoice.invoiceNumber}</p>
          <p className="text-xs" style={{ color: "var(--secondary)" }}>{formatDate(invoice.invoiceDate)}</p>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${invoice.type === "sales" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"}`}>
          {invoice.type.toUpperCase()}
        </span>
      </td>
      <td className="px-4 py-3">
        <div>
          <p className="text-sm" style={{ color: "var(--foreground)" }}>
            {invoice.type === "sales" ? invoice.buyerName : invoice.supplierName}
          </p>
          <p className="text-xs font-mono" style={{ color: "var(--secondary)" }}>
            {maskGSTIN(invoice.type === "sales" ? invoice.buyerGSTIN : invoice.supplierGSTIN)}
          </p>
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{formatCurrency(invoice.taxableAmount)}</p>
      </td>
      <td className="px-4 py-3">
        <div className="text-xs space-y-0.5">
          {invoice.cgst > 0 && <div style={{ color: "var(--secondary)" }}>CGST: {formatCurrency(invoice.cgst)}</div>}
          {invoice.sgst > 0 && <div style={{ color: "var(--secondary)" }}>SGST: {formatCurrency(invoice.sgst)}</div>}
          {invoice.igst > 0 && <div style={{ color: "var(--secondary)" }}>IGST: {formatCurrency(invoice.igst)}</div>}
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>{formatCurrency(invoice.totalAmount)}</p>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs font-mono" style={{ color: "var(--secondary)" }}>{invoice.hsnCode}</span>
      </td>
      <td className="px-4 py-3">
        <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 w-fit ${status.bg}`} style={{ color: status.color }}>
          <StatusIcon size={11} />
          {status.label}
        </span>
      </td>
      <td className="px-4 py-3">
        <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" style={{ color: "var(--secondary)" }}>
          <Eye size={15} />
        </button>
      </td>
    </tr>
  );
}

export default function InvoiceAgent() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showOCR, setShowOCR] = useState(false);

  const filtered = mockInvoices.filter(inv => {
    if (filter !== "all" && inv.status !== filter) return false;
    if (search && !inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) &&
        !inv.supplierName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* AI OCR Scanner */}
      {showOCR && (
        <div className="card border-2 border-dashed border-blue-300 dark:border-blue-700 text-center py-10">
          <div className="w-16 h-16 rounded-2xl gradient-blue flex items-center justify-center mx-auto mb-4">
            <Zap size={28} className="text-white" />
          </div>
          <h3 className="font-semibold text-lg mb-2" style={{ color: "var(--foreground)" }}>AI Invoice Scanner</h3>
          <p className="text-sm mb-6" style={{ color: "var(--secondary)" }}>
            Drop PDF/image invoices here — AI will extract GSTIN, invoice number, HSN codes, and tax breakup automatically
          </p>
          <div className="flex justify-center gap-3">
            <button className="px-4 py-2 rounded-lg text-sm gradient-blue text-white font-medium">
              Browse Files
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
              Paste from Clipboard
            </button>
          </div>
          <p className="text-xs mt-4" style={{ color: "var(--secondary)" }}>Supports PDF, PNG, JPG, TIFF • Max 50MB per file</p>
        </div>
      )}

      {/* Controls */}
      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {["all", "matched", "pending", "mismatch", "filed"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                  filter === f ? "gradient-blue text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                style={filter !== f ? { color: "var(--secondary)", border: "1px solid var(--border)" } : {}}
              >
                {f === "all" ? `All (${mockInvoices.length})` : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--secondary)" }} />
              <input
                type="text"
                placeholder="Search invoices..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-4 py-1.5 rounded-lg text-sm outline-none"
                style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)", width: 200 }}
              />
            </div>
            <button
              onClick={() => setShowOCR(!showOCR)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium gradient-blue text-white"
            >
              <Upload size={14} /> Upload Invoice
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            { label: "Total Invoices", value: mockInvoices.length, color: "#2563eb" },
            { label: "Matched", value: mockInvoices.filter(i => i.status === "matched").length, color: "#10b981" },
            { label: "Mismatches", value: mockInvoices.filter(i => i.status === "mismatch").length, color: "#ef4444" },
            { label: "Pending", value: mockInvoices.filter(i => i.status === "pending").length, color: "#f59e0b" },
          ].map(item => (
            <div key={item.label} className="p-3 rounded-lg text-center" style={{ background: "var(--background)" }}>
              <p className="text-2xl font-bold" style={{ color: item.color }}>{item.value}</p>
              <p className="text-xs" style={{ color: "var(--secondary)" }}>{item.label}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                {["Invoice #", "Type", "Party", "Taxable", "Tax", "Total", "HSN", "Status", ""].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs font-semibold" style={{ color: "var(--secondary)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => <InvoiceRow key={inv.id} invoice={inv} />)}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12" style={{ color: "var(--secondary)" }}>
              No invoices found matching your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
