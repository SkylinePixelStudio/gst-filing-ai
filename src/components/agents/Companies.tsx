"use client";
import { useState } from "react";
import { Building2, Plus, CheckCircle, Settings } from "lucide-react";
import { mockCompanies } from "@/data/mockData";
import { formatCurrency, maskGSTIN } from "@/lib/utils";

export default function Companies() {
  const [active, setActive] = useState("1");

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg" style={{ color: "var(--foreground)" }}>Manage Companies</h2>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-blue text-white text-sm font-medium">
          <Plus size={16} /> Add Company
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockCompanies.map(company => (
          <div
            key={company.id}
            className={`card cursor-pointer transition-all ${active === company.id ? "ring-2 ring-blue-500" : ""}`}
            onClick={() => setActive(company.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl gradient-blue flex items-center justify-center">
                  <Building2 size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold" style={{ color: "var(--foreground)" }}>{company.name}</h3>
                  <p className="text-xs font-mono" style={{ color: "var(--secondary)" }}>{maskGSTIN(company.gstin)}</p>
                </div>
              </div>
              {active === company.id && <CheckCircle size={20} className="text-blue-500" />}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "PAN", value: company.pan },
                { label: "State", value: company.state },
                { label: "Turnover", value: formatCurrency(company.turnover) },
                { label: "Filing", value: company.filingFrequency.charAt(0).toUpperCase() + company.filingFrequency.slice(1) },
              ].map(item => (
                <div key={item.label} className="p-2 rounded-lg" style={{ background: "var(--background)" }}>
                  <p className="text-xs" style={{ color: "var(--secondary)" }}>{item.label}</p>
                  <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{item.value}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-3 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium gradient-blue text-white">
                Switch to Company
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}>
                <Settings size={13} /> Settings
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Onboarding Form Stub */}
      <div className="card" style={{ border: "2px dashed var(--border)" }}>
        <div className="text-center py-8">
          <div className="w-14 h-14 rounded-2xl gradient-blue flex items-center justify-center mx-auto mb-3">
            <Plus size={24} className="text-white" />
          </div>
          <h3 className="font-bold mb-1" style={{ color: "var(--foreground)" }}>Add New Company</h3>
          <p className="text-sm mb-4" style={{ color: "var(--secondary)" }}>
            Onboard another Pvt Ltd, LLP, or Proprietorship for multi-company GST management
          </p>
          <button className="px-5 py-2.5 rounded-lg gradient-blue text-white text-sm font-medium">
            Start Onboarding
          </button>
        </div>
      </div>
    </div>
  );
}
