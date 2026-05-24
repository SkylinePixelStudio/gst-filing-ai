"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Zap, User, Mic, Paperclip, RefreshCw } from "lucide-react";
import { ChatMessage } from "@/types";

const quickQuestions = [
  "How much GST payable this month?",
  "Which vendors have mismatches?",
  "What are my pending filings?",
  "Show me ITC available",
  "When is GSTR-1 due?",
  "Explain DRC-01A notice",
];

interface AIResponse {
  content: string;
}

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("gst payable") || lower.includes("how much")) {
    return "Based on your April 2024 data:\n\nOutput GST (Sales): Rs 8,95,000\nInput Tax Credit (ITC): Rs 3,12,500\nNet GST Payable: Rs 5,82,500\n\nBreakdown:\n- CGST Payable: Rs 1,85,000\n- SGST Payable: Rs 1,85,000\n- IGST Payable: Rs 2,12,500\n\nNote: 3 purchase invoices with Rs 33,600 ITC are unreconciled. Resolving these could reduce payable to Rs 5,48,900.";
  }
  if (lower.includes("mismatch") || lower.includes("vendor")) {
    return "I found 2 vendor mismatches in March 2024:\n\n1. Google Cloud India (27AABCG4338M1ZO)\n   Books: Rs 15,000 | GSTR-2B: Rs 16,500\n   Difference: Rs 1,500 (likely rate revision)\n   Action: Update books to match 2B\n\n2. Microsoft India (29AABCM4220E1ZX)\n   Books: Rs 0 | GSTR-2B: Rs 12,000\n   Invoice missing in books entirely\n   Action: Locate and book the purchase\n\nTotal unclaimed ITC at risk: Rs 13,500";
  }
  if (lower.includes("pending") || lower.includes("filing")) {
    return "You have 2 pending filings for April 2024:\n\n1. GSTR-1 - Due: 11 May 2024\n   Status: Ready to file\n   142 invoices prepared\n   Taxable Amount: Rs 18,00,000\n\n2. GSTR-3B - Due: 20 May 2024\n   Status: Draft (8 invoices pending)\n   Net Payable: Rs 5,82,500\n\nRecommendation: File GSTR-1 immediately (3 days left). Resolve pending invoices for GSTR-3B before 15 May.";
  }
  if (lower.includes("itc") || lower.includes("input tax")) {
    return "Your Input Tax Credit (ITC) Summary for April 2024:\n\nTotal ITC Available: Rs 3,12,500\n\nBreakdown:\n- CGST Credit: Rs 98,000\n- SGST Credit: Rs 98,000\n- IGST Credit: Rs 1,16,500\n\nITC by Category:\n- Capital Goods: Rs 45,000\n- Input Services: Rs 1,87,500\n- Inputs (Goods): Rs 80,000\n\nBlocked Credit (Rule 17(5)): Rs 12,000 (motor vehicle - not claimable)\nPending reconciliation: Rs 33,600 (resolve to claim additional ITC)";
  }
  if (lower.includes("gstr-1") || lower.includes("due")) {
    return "GSTR-1 Due Dates for your company:\n\nYou file monthly (turnover > Rs 5 Cr)\n\n- April 2024: 11 May 2024 (3 days left)\n- May 2024: 11 June 2024\n- June 2024: 11 July 2024\n\nStatus: April GSTR-1 is ready to file with 142 invoices.\n\nShall I initiate the filing workflow?";
  }
  if (lower.includes("drc") || lower.includes("notice")) {
    return "DRC-01A is a pre-notice communication issued by GST authorities before raising an actual demand.\n\nWhat it means:\nThe officer has identified a discrepancy (in your case, ITC mismatch of Rs 1,25,000) and is giving you an opportunity to:\n1. Pay the short-paid tax voluntarily (reduced penalty)\n2. Explain why the discrepancy exists\n\nYour action options:\n- Option A: Accept the demand - Pay with 25% reduced penalty\n- Option B: Respond with explanation + reconciliation - If accepted, no demand\n- Option C: File DRC-01A reply within 30 days - Extends the process\n\nMy recommendation: File a detailed reply with reconciliation statement. The ITC difference appears to be timing-related (supplier late filing), which is a valid defense under Rule 37A.\n\nShall I draft the response letter?";
  }

  return "I understand your query about GST compliance. Based on your Skyline Pixel Studio Pvt Ltd data for April 2024:\n\nYour compliance score is 87%, with Rs 5,82,500 net GST payable this month. You have 2 pending filings (GSTR-1 due in 3 days) and 3 reconciliation mismatches to resolve.\n\nI can help you with:\n- Tax calculations and liability analysis\n- Invoice reconciliation and ITC claims\n- Filing workflows and due dates\n- Notice interpretation and response drafts\n- HSN/SAC classification queries\n\nPlease ask a more specific question or choose from the quick options above.";
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isAI = message.role === "assistant";

  const lines = message.content.split("\n");

  return (
    <div className={`flex gap-3 mb-4 ${isAI ? "" : "flex-row-reverse"}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isAI ? "gradient-blue" : "gradient-purple"
        }`}
      >
        {isAI ? (
          <Zap size={14} className="text-white" />
        ) : (
          <User size={14} className="text-white" />
        )}
      </div>
      <div className={`max-w-[80%]`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium" style={{ color: "var(--secondary)" }}>
            {isAI ? "GST AI CFO" : "You"}
          </span>
          <span className="text-xs" style={{ color: "var(--secondary)" }}>
            {message.timestamp}
          </span>
        </div>
        <div
          className="px-4 py-3 rounded-2xl"
          style={{
            background: isAI
              ? "var(--card)"
              : "linear-gradient(135deg, #2563eb, #1d4ed8)",
            border: isAI ? "1px solid var(--border)" : "none",
            color: isAI ? "var(--foreground)" : "white",
            borderRadius: isAI
              ? "4px 18px 18px 18px"
              : "18px 4px 18px 18px",
          }}
        >
          {lines.map((line, i) => {
            if (line === "") return <br key={i} />;
            if (line.startsWith("- ") || line.startsWith("• ")) {
              return (
                <p key={i} className="text-sm ml-3 mb-0.5" style={{ color: isAI ? "var(--foreground)" : "white" }}>
                  {"• " + line.slice(2)}
                </p>
              );
            }
            return (
              <p key={i} className="text-sm mb-0.5" style={{ color: isAI ? "var(--foreground)" : "white" }}>
                {line}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Namaste! I am your AI CFO Assistant specialized in Indian GST compliance.\n\nI have full access to your company data - Skyline Pixel Studio Pvt Ltd (GSTIN: 29AABCS1234D1Z5).\n\nI can help you with:\n- Real-time GST liability calculations\n- Invoice reconciliation and ITC analysis\n- Filing due dates and workflows\n- Notice interpretation and responses\n- Tax-saving strategies\n- Compliance risk assessment\n\nWhat would you like to know?",
      timestamp: "Now",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: msg,
      timestamp: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(msg),
        timestamp: new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        agent: "GST AI CFO",
      };
      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
    }, 1200 + Math.random() * 800);
  };

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 120px)" }}>
      {/* Header */}
      <div className="card mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-blue flex items-center justify-center">
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold" style={{ color: "var(--foreground)" }}>
              AI CFO Assistant
            </h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs" style={{ color: "var(--secondary)" }}>
                Online · GST Knowledge Base Active · RAG Enabled
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <span
            className="text-xs px-2 py-1 rounded-full font-medium"
            style={{
              background: "rgba(37,99,235,0.1)",
              color: "#2563eb",
            }}
          >
            April 2024 Context
          </span>
          <button
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            style={{ color: "var(--secondary)" }}
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="flex gap-2 flex-wrap mb-3">
        {quickQuestions.map((q) => (
          <button
            key={q}
            onClick={() => sendMessage(q)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:opacity-80"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              color: "var(--secondary)",
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto card p-4"
        style={{ minHeight: 0 }}
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {loading && (
          <div className="flex gap-3 mb-4">
            <div className="w-8 h-8 rounded-full gradient-blue flex items-center justify-center flex-shrink-0">
              <Zap size={14} className="text-white" />
            </div>
            <div
              className="px-4 py-3 rounded-2xl"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex gap-1.5 items-center">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
                <span
                  className="text-xs ml-2"
                  style={{ color: "var(--secondary)" }}
                >
                  Analyzing your GST data...
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-3 card">
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            style={{ color: "var(--secondary)" }}
          >
            <Paperclip size={18} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && sendMessage()
            }
            placeholder="Ask about GST liability, ITC, notices, filing status..."
            className="flex-1 outline-none text-sm bg-transparent"
            style={{ color: "var(--foreground)" }}
          />
          <button
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            style={{ color: "var(--secondary)" }}
          >
            <Mic size={18} />
          </button>
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="p-2 rounded-lg gradient-blue text-white disabled:opacity-40 transition-all"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-xs mt-2" style={{ color: "var(--secondary)" }}>
          Supports English, Hindi, Tamil · AI responses based on CGST Act 2017 and Rules
        </p>
      </div>
    </div>
  );
}
