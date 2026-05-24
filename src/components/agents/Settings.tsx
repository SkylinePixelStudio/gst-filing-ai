"use client";
import { User, Shield, Bell, Key, Palette, Building } from "lucide-react";

const sections = [
  {
    title: "Profile & Security",
    icon: User,
    items: [
      { label: "Full Name", value: "CA Admin", type: "text" },
      { label: "Email", value: "admin@skylinepixel.in", type: "email" },
      { label: "Role", value: "Admin", type: "readonly" },
      { label: "2FA Authentication", value: "Enabled", type: "toggle" },
    ],
  },
  {
    title: "GST Portal Integration",
    icon: Building,
    items: [
      { label: "GST Portal Username", value: "29AABCS1234D1Z5", type: "text" },
      { label: "API Access Token", value: "••••••••••••••••", type: "password" },
      { label: "Auto-sync GSTR-2B", value: "true", type: "toggle" },
      { label: "Filing Mode", value: "Assisted (Human Review)", type: "select" },
    ],
  },
  {
    title: "Notifications",
    icon: Bell,
    items: [
      { label: "Due Date Reminders", value: "true", type: "toggle" },
      { label: "Mismatch Alerts", value: "true", type: "toggle" },
      { label: "Notice Alerts", value: "true", type: "toggle" },
      { label: "Email Notifications", value: "true", type: "toggle" },
    ],
  },
];

export default function Settings() {
  return (
    <div className="space-y-4 max-w-3xl">
      {sections.map(section => {
        const Icon = section.icon;
        return (
          <div key={section.title} className="card">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b" style={{ borderColor: "var(--border)" }}>
              <Icon size={18} className="text-blue-500" />
              <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>{section.title}</h3>
            </div>
            <div className="space-y-4">
              {section.items.map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{item.label}</label>
                  {item.type === "toggle" ? (
                    <div className={`w-11 h-6 rounded-full cursor-pointer transition-colors flex items-center px-1 ${item.value === "true" ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"}`}>
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${item.value === "true" ? "translate-x-5" : "translate-x-0"}`} />
                    </div>
                  ) : item.type === "readonly" ? (
                    <span className="text-sm px-3 py-1 rounded-lg" style={{ background: "var(--background)", color: "var(--secondary)" }}>{item.value}</span>
                  ) : (
                    <input
                      type={item.type}
                      defaultValue={item.value}
                      className="px-3 py-1.5 rounded-lg text-sm outline-none w-64"
                      style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="flex justify-end">
        <button className="px-6 py-2.5 rounded-lg gradient-blue text-white text-sm font-medium">
          Save Settings
        </button>
      </div>
    </div>
  );
}
