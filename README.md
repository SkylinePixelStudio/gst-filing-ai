# GST Filing AI Assistant

> Enterprise-grade AI-powered GST compliance platform for Indian Private Limited Companies

**Live URL:** https://gst.rizipt.in

---

## Overview

GST Filing AI Assistant is a full-stack SaaS platform that automates Indian GST compliance using multi-agent AI architecture. It handles invoice processing, reconciliation, return preparation, notice management, and conversational tax advisory.

## Core Modules

| Module | Description |
|---|---|
| **Dashboard** | Real-time GST metrics, compliance score, upcoming filings |
| **Invoice Intelligence** | OCR scanning, GSTIN validation, duplicate detection |
| **GST Returns** | GSTR-1, GSTR-3B, GSTR-9 preparation and filing |
| **Reconciliation Engine** | Books vs GSTR-2B matching, ITC gap analysis |
| **Notice Management** | AI-powered notice interpretation and response drafts |
| **AI CFO Chat** | Conversational GST advisory in English/Hindi/Tamil |
| **Compliance Monitor** | Score tracking, due date calendar, risk assessment |
| **Upload & Import** | Excel, CSV, Tally XML, PDF OCR, accounting integrations |
| **Reports** | GST summary, ITC reconciliation, audit-ready PDFs |
| **Multi-Company** | Manage multiple GSTINs from one dashboard |

## Technology Stack

### Frontend
- **Next.js 16** (App Router, Static Export)
- **Tailwind CSS** (Dark/Light mode)
- **Recharts** (Analytics charts)
- **Framer Motion** (Animations)
- **Lucide React** (Icons)

### Backend (Recommended)
- **Node.js / FastAPI** — REST + AI orchestration APIs
- **Supabase** — PostgreSQL database + Auth + Storage
- **Redis** — Job queue for async AI processing
- **OpenAI GPT / Claude** — Multi-agent AI layer

### Deployment
- **Cloudflare Pages** — Frontend (gst.rizipt.in)
- **Cloudflare Workers** — Edge functions
- **Docker** — Containerized deployment option

---

## Quick Start

### Local Development

```bash
git clone https://github.com/your-org/gst-filing-ai
cd gst-filing-ai
npm install
cp .env.example .env.local
# Fill in your environment variables
npm run dev
```

Open http://localhost:3000

### Production Build

```bash
npm run build
# Static files output to ./out/
```

---

## Cloudflare Deployment (gst.rizipt.in)

### Option A — Cloudflare Pages (Recommended)

1. Push code to GitHub
2. Go to Cloudflare Dashboard > Pages > Create Project
3. Connect your GitHub repo
4. Set build settings:
   - Build command: `npm run build`
   - Build output directory: `out`
5. Add custom domain: `gst.rizipt.in`
6. Add secrets in Pages > Settings > Environment Variables

### Option B — GitHub Actions (Auto-Deploy)

Add these secrets to your GitHub repo:
- `CLOUDFLARE_API_TOKEN` — From Cloudflare API Tokens
- `CLOUDFLARE_ACCOUNT_ID` — From Cloudflare Dashboard URL

Every push to `main` will auto-deploy to Cloudflare Pages.

### DNS Setup (Cloudflare)

In your Cloudflare DNS for `rizipt.in`:

| Type | Name | Target |
|------|------|--------|
| CNAME | gst | your-project.pages.dev |

Or use Cloudflare Pages custom domain wizard — it sets DNS automatically.

---

## Option C — Docker

```bash
docker build -t gst-filing-ai .
docker run -p 80:80 gst-filing-ai
```

---

## Database Schema (Supabase)

```sql
-- Companies
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  gstin CHAR(15) UNIQUE NOT NULL,
  pan CHAR(10) NOT NULL,
  state TEXT NOT NULL,
  address TEXT,
  email TEXT,
  phone TEXT,
  turnover BIGINT,
  filing_frequency TEXT DEFAULT 'monthly',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT NOT NULL,
  type TEXT CHECK (type IN ('sales', 'purchase')),
  supplier_name TEXT,
  supplier_gstin CHAR(15),
  buyer_name TEXT,
  buyer_gstin CHAR(15),
  invoice_date DATE NOT NULL,
  taxable_amount NUMERIC(15,2),
  cgst NUMERIC(15,2) DEFAULT 0,
  sgst NUMERIC(15,2) DEFAULT 0,
  igst NUMERIC(15,2) DEFAULT 0,
  cess NUMERIC(15,2) DEFAULT 0,
  total_amount NUMERIC(15,2),
  hsn_code TEXT,
  supply_type TEXT,
  status TEXT DEFAULT 'pending',
  company_id UUID REFERENCES companies(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- GST Returns
CREATE TABLE gst_returns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT CHECK (type IN ('GSTR-1', 'GSTR-3B', 'GSTR-9', 'GSTR-2B')),
  period TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  due_date DATE,
  filed_date DATE,
  taxable_amount NUMERIC(15,2),
  tax_amount NUMERIC(15,2),
  late_fee NUMERIC(10,2),
  arn TEXT,
  company_id UUID REFERENCES companies(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- GST Notices
CREATE TABLE gst_notices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notice_number TEXT UNIQUE,
  type TEXT NOT NULL,
  issued_by TEXT,
  issued_date DATE,
  response_deadline DATE,
  amount NUMERIC(15,2),
  status TEXT DEFAULT 'open',
  description TEXT,
  ai_analysis TEXT,
  response_draft TEXT,
  company_id UUID REFERENCES companies(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Log
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  user_id UUID,
  changes JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## AI Agent Architecture

```
User Request
     |
     v
AI Orchestrator (GPT-4 / Claude)
     |
  +--+--+--+--+--+
  |  |  |  |  |  |
  v  v  v  v  v  v
GST  Inv Rec Not CFO File
Com  Int Eng Agt Ast Agt
pliance elligence oncile otice  iling
```

Each agent has:
- Specialized GST knowledge (RAG from CGST Act 2017)
- Access to company database
- Tool use capabilities (API calls, DB queries)
- Human-in-the-loop review before actions

---

## Security

- AES-256 encryption for GSTIN and sensitive fields
- JWT authentication with refresh tokens
- Role-based access: Super Admin / CA / Manager / Viewer
- 2FA via TOTP (Google Authenticator)
- Audit logs for all operations
- HTTPS enforced via Cloudflare

---

## License

Proprietary — Rizipt Technologies. All rights reserved.
