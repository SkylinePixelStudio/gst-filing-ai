
export interface Company {
  id: string;
  name: string;
  gstin: string;
  pan: string;
  state: string;
  address: string;
  email: string;
  phone: string;
  turnover: number;
  filingFrequency: "monthly" | "quarterly";
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  type: "sales" | "purchase";
  supplierName: string;
  supplierGSTIN: string;
  buyerName: string;
  buyerGSTIN: string;
  invoiceDate: string;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  cess: number;
  totalAmount: number;
  hsnCode: string;
  supplyType: "inter-state" | "intra-state" | "export" | "sez";
  status: "pending" | "matched" | "mismatch" | "filed";
  companyId: string;
}

export interface GSTReturn {
  id: string;
  type: "GSTR-1" | "GSTR-3B" | "GSTR-9" | "GSTR-2B";
  period: string;
  status: "draft" | "ready" | "filed" | "pending";
  dueDate: string;
  filedDate?: string;
  taxableAmount: number;
  taxAmount: number;
  lateFee?: number;
  companyId: string;
}

export interface ReconciliationItem {
  id: string;
  invoiceNumber: string;
  supplierName: string;
  supplierGSTIN: string;
  bookAmount: number;
  gstr2bAmount: number;
  difference: number;
  status: "matched" | "mismatch" | "missing_in_books" | "missing_in_2b";
  itcClaimable: number;
}

export interface GSTNotice {
  id: string;
  noticeNumber: string;
  type: string;
  issuedBy: string;
  issuedDate: string;
  responseDeadline: string;
  amount?: number;
  status: "open" | "responded" | "closed" | "overdue";
  description: string;
  aiAnalysis?: string;
  companyId: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  agent?: string;
}

export interface DashboardMetrics {
  totalOutputGST: number;
  totalInputITC: number;
  netPayable: number;
  pendingFilings: number;
  mismatches: number;
  complianceScore: number;
  invoicesProcessed: number;
  pendingInvoices: number;
}
