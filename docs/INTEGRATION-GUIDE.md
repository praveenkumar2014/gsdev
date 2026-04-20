# GSDEV Integration Guide

## Overview

This document provides comprehensive information about all integrations, pages, workflows, and environment variables for the GSDEV application.

---

## Table of Contents

1. [Application Architecture](#application-architecture)
2. [Page Routing Structure](#page-routing-structure)
3. [User Journey Flow](#user-journey-flow)
4. [Backend API Endpoints](#backend-api-endpoints)
5. [Integrations Status](#integrations-status)
6. [Environment Variables](#environment-variables)
7. [Missing Integrations](#missing-integrations)
8. [Recommended Additions](#recommended-additions)

---

## Application Architecture

### Single Application Structure

GSDEV is a **single Electron desktop application** with no separate projects or folders. All functionality is contained within the `gsdev/` directory.

**Project Structure:**
```
gsdev/
├── src/
│   ├── main/           # Electron main process (backend)
│   ├── renderer/       # React frontend
│   ├── preload/        # Electron preload scripts
│   ├── shared/         # Shared TypeScript code
│   └── test/           # Test files
├── drizzle/            # Database migrations
├── resources/          # Binary resources
├── scripts/            # Build and utility scripts
└── docs/               # Documentation
```

### Communication Architecture

- **Frontend → Backend**: tRPC (TypeScript RPC)
- **Main → Renderer**: Electron IPC
- **External APIs**: REST/GraphQL via custom handlers

---

## Page Routing Structure

GSDEV uses **state-based routing** (not URL-based routing) since it's a desktop application.

### Page Views

| View | Component | State Atom | Navigation Trigger |
|------|-----------|------------|-------------------|
| **Landing Page** | `LandingPage` | `showLandingPageAtom` | First visit, manual toggle |
| **Billing Method** | `BillingMethodPage` | `billingMethodAtom` | After landing page |
| **Anthropic Onboarding** | `AnthropicOnboardingPage` | `anthropicOnboardingCompletedAtom` | Selected "Claude Subscription" |
| **Codex Onboarding** | `CodexOnboardingPage` | `codexOnboardingCompletedAtom` | Selected "Codex Subscription" |
| **API Key Onboarding** | `ApiKeyOnboardingPage` | `apiKeyOnboardingCompletedAtom` | Selected "API Key" or "Custom Model" |
| **Select Repo** | `SelectRepoPage` | `selectedProjectAtom` | After provider setup |
| **Main App (Agents)** | `AgentsLayout` | `desktopViewAtom = null` | After project selection |
| **Automations** | `AutomationsView` | `desktopViewAtom = "automations"` | Sidebar navigation |
| **Automation Detail** | `AutomationsDetailView` | `desktopViewAtom = "automations-detail"` | Click automation |
| **Inbox** | `InboxView` | `desktopViewAtom = "inbox"` | Sidebar navigation |
| **Settings** | `SettingsSidebar` | `desktopViewAtom = "settings"` | Settings button |
| **Kanban** | `KanbanView` | `betaKanbanEnabledAtom` | Toggle kanban view |

### Desktop View States

```typescript
type DesktopView = "automations" | "automations-detail" | "inbox" | "settings" | null
```

---

## User Journey Flow

### Complete User Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     LANDING PAGE                            │
│  - Hero section with "Get Started"                          │
│  - Features, Agents, Pricing sections                       │
│  - Dark/Light mode toggle                                   │
│  - Cart modal for plan selection                            │
│  - Auth modal (left/right panel)                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  BILLING METHOD PAGE                         │
│  Options:                                                   │
│  - Claude Subscription (Anthropic)                         │
│  - Codex Subscription (OpenAI)                              │
│  - API Key (Bring Your Own Key)                             │
│  - Custom Model (BYOK)                                      │
└─────┬──────────────┬──────────────┬──────────────┬──────────┘
      │              │              │              │
      ▼              ▼              ▼              ▼
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│Anthropic │   │  Codex   │   │ API Key  │   │  Custom  │
│Onboarding│   │Onboarding│   │Onboarding│   │  Model   │
└────┬─────┘   └────┬─────┘   └────┬─────┘   └────┬─────┘
     │              │              │              │
     └──────────────┴──────────────┴──────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   SELECT REPO PAGE                            │
│  - Clone from GitHub                                         │
│  - Open local folder                                        │
│  - Import from URL                                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   MAIN APPLICATION                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  SIDEBAR (Left)                                      │   │
│  │  - Projects list                                     │   │
│  │  - Agent sessions                                    │   │
│  │  - Automations (beta)                                │   │
│  │  - Inbox                                             │   │
│  │  - Settings                                          │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  MAIN CONTENT                                        │   │
│  │  - Chat interface                                    │   │
│  │  - Diff viewer                                       │   │
│  │  - File viewer                                       │   │
│  │  - Terminal                                          │   │
│  │  - Preview pane                                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Navigation Actions

**Keyboard Shortcuts:**
- `⌘\` - Toggle sidebar
- `⌘K` - Open chat search
- `⌘P` - Toggle file preview
- `⌘J` - Toggle terminal
- `⌘O` - Open in editor
- `⌘N` - New chat

**Navigation Functions:**
```typescript
// Navigate to different views
setDesktopView("automations")    // Open automations
setDesktopView("inbox")          // Open inbox
setDesktopView("settings")       // Open settings
setDesktopView(null)             // Back to main agents view

// Project selection
setSelectedProject(project)      // Select a project
setSelectedChatId(chatId)        // Select a chat
```

---

## Backend API Endpoints

### tRPC Routers

All backend communication uses tRPC. Available routers:

| Router | Purpose | Key Endpoints |
|--------|---------|---------------|
| **projects** | Project management | `list`, `create`, `update`, `delete`, `import` |
| **chats** | Chat sessions | `list`, `create`, `update`, `delete`, `archive` |
| **claude** | Claude agent operations | `sendMessage`, `streamMessage`, `cancel` |
| **claudeCode** | Claude Code integration | `hasExistingCliConfig`, `getVersion` |
| **claudeSettings** | Claude configuration | `getSettings`, `updateSettings` |
| **anthropicAccounts** | Anthropic OAuth | `login`, `logout`, `getAccounts` |
| **ollama** | Local model support | `listModels`, `generate` |
| **codex** | Codex agent operations | `sendMessage`, `streamMessage`, `cancel` |
| **terminal** | Terminal operations | `create`, `write`, `resize`, `close` |
| **external** | External API calls | `fetch`, `webhook` |
| **files** | File operations | `read`, `write`, `delete`, `list` |
| **debug** | Debug utilities | `getLogs`, `clearLogs` |
| **skills** | Skills management | `list`, `create`, `update`, `delete` |
| **agents** | Agent management | `list`, `create`, `update`, `delete` |
| **worktreeConfig** | Git worktree config | `getConfig`, `updateConfig` |
| **sandboxImport** | Sandbox import | `import`, `getStatus` |
| **commands** | Command execution | `execute`, `cancel` |
| **voice** | Voice input | `startRecording`, `stopRecording`, `transcribe` |
| **plugins** | Plugin management | `list`, `install`, `uninstall`, `clearCache` |
| **browserAutomation** | Browser automation | `execute`, `getConfig`, `cleanup` |
| **changes** | Git operations | `getStatus`, `commit`, `push`, `pull`, `createBranch` |

### API Usage Example

```typescript
// In React components
const { data: projects } = trpc.projects.list.useQuery()
const createProject = trpc.projects.create.useMutation()

// Calling mutations
await createProject.mutateAsync({
  name: "My Project",
  path: "/path/to/repo",
})
```

---

## Integrations Status

### ✅ Implemented Integrations

| Integration | Status | Location | Notes |
|-------------|--------|----------|-------|
| **MCP (Model Context Protocol)** | ✅ Complete | `src/main/lib/mcp-auth.ts` | OAuth, token refresh, server management |
| **Claude (Anthropic)** | ✅ Complete | `src/main/lib/claude/` | Full SDK integration |
| **Codex (OpenAI)** | ✅ Complete | `src/main/lib/codex/` | Full SDK integration |
| **Ollama (Local Models)** | ✅ Complete | `src/main/lib/ollama/` | Local model support |
| **Git Operations** | ✅ Complete | `src/main/lib/git/` | Full git workflow support |
| **Browser Automation** | ✅ Complete | `src/main/lib/playwright-handler.ts` | Playwright & Selenium |
| **Plugin System** | ✅ Complete | `src/main/lib/plugins/` | Marketplace support |
| **Database** | ✅ Complete | `src/main/lib/db/` | SQLite with Drizzle ORM |
| **Terminal** | ✅ Complete | `src/main/lib/terminal/` | xterm.js integration |
| **Voice Input** | ✅ Complete | `src/main/lib/voice.ts` | OpenAI Whisper |

### ❌ Missing Integrations

| Integration | Priority | Use Case | Recommendation |
|-------------|----------|----------|----------------|
| **Payment Processing** | HIGH | Subscription billing | Add Stripe/Razorpay integration |
| **HubSpot CRM** | MEDIUM | Lead management | Add for sales/marketing |
| **Webhook System** | HIGH | Automation triggers | Implement webhook endpoints |
| **Email Service** | MEDIUM | Notifications | Add SendGrid/Mailgun |
| **Analytics** | LOW | User tracking | PostHog already configured |
| **CDN/Storage** | MEDIUM | File storage | Add AWS S3/Cloudflare R2 |

---

## Environment Variables

### Current .env.example

```env
# =============================================================================
# Open Source Build Configuration
# =============================================================================
# All variables below are OPTIONAL - the app works without them.
# Set them only if you need code signing, analytics, or error tracking.
# =============================================================================

# Apple Developer credentials (required for macOS code signing & notarization)
APPLE_ID=your-email@example.com
APPLE_APP_SPECIFIC_PASSWORD=xxxx-xxxx-xxxx-xxxx
APPLE_TEAM_ID=XXXXXXXXXX
APPLE_IDENTITY=Developer ID Application: Your Name (TEAM_ID)

# Sentry error tracking (optional - disabled if not set)
MAIN_VITE_SENTRY_DSN=https://xxxxx@xxx.ingest.sentry.io/xxxxx

# PostHog analytics (optional - disabled if not set)
MAIN_VITE_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MAIN_VITE_POSTHOG_HOST=https://us.i.posthog.com
VITE_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_POSTHOG_HOST=https://us.i.posthog.com

# Feedback URL (optional - defaults to open source Discord if not set)
VITE_FEEDBACK_URL=https://discord.gg/your-private-invite

# API URL (optional - defaults to https://gsdev.dev)
MAIN_VITE_API_URL=http://localhost:3000

# Voice Input (optional - uses OpenAI Whisper API)
MAIN_VITE_OPENAI_API_KEY=sk-...
```

### Recommended Additional ENV Variables

```env
# =============================================================================
# PAYMENT PROCESSING
# =============================================================================
# Stripe for subscription billing
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Razorpay for UPI payments (India)
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...

# =============================================================================
# CRM INTEGRATION
# =============================================================================
# HubSpot for lead management
HUBSPOT_API_KEY=pat-na1-...
HUBSPOT_PORTAL_ID=123456

# =============================================================================
# EMAIL SERVICE
# =============================================================================
# SendGrid for transactional emails
SENDGRID_API_KEY=SG.xxxxxxxx
SENDGRID_FROM_EMAIL=noreply@gsdev.dev

# =============================================================================
# STORAGE
# =============================================================================
# AWS S3 for file storage
AWS_ACCESS_KEY_ID=AKIAXXXXX
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_REGION=us-east-1
AWS_S3_BUCKET=gsdev-uploads

# =============================================================================
# WEBHOOKS
# =============================================================================
# Webhook secret for signature verification
WEBHOOK_SECRET=your-webhook-secret

# =============================================================================
# DATABASE (if using external DB)
# =============================================================================
# PostgreSQL for production (optional, currently uses SQLite)
DATABASE_URL=postgresql://user:password@host:5432/gsdev

# =============================================================================
# CACHE
# =============================================================================
# Redis for caching (optional)
REDIS_URL=redis://localhost:6379

# =============================================================================
# AUTOMATIONS
# =============================================================================
# GitHub for automation triggers
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxx
GITHUB_WEBHOOK_SECRET=your-github-webhook-secret

# Linear for automation triggers
LINEAR_API_KEY=lin_api_xxxxxxxxxxxxxxxxxx

# Slack for automation triggers
SLACK_BOT_TOKEN=xoxb-xxxxxxxxxxxxxxxxx
SLACK_SIGNING_SECRET=xxxxxxxxxxxxxxxxx
```

---

## Missing Integrations

### 1. Payment Processing (HIGH PRIORITY)

**Current State:** Only UI exists in landing page, no backend integration.

**Required Implementation:**
- Stripe subscription management
- Razorpay UPI integration (for India)
- Webhook handling for payment events
- Invoice generation
- Plan upgrade/downgrade logic

**Recommended Stack:**
- Stripe (global payments)
- Razorpay (UPI for India)

**Files to Create:**
```
src/main/lib/payments/
├── stripe.ts
├── razorpay.ts
├── webhooks.ts
└── index.ts
```

### 2. HubSpot CRM Integration (MEDIUM PRIORITY)

**Current State:** Not implemented.

**Required Implementation:**
- Contact creation on signup
- Deal creation for subscription purchases
- Activity tracking
- Lead scoring

**Recommended Stack:**
- HubSpot Node.js SDK

**Files to Create:**
```
src/main/lib/crm/
├── hubspot.ts
└── index.ts
```

### 3. Webhook System (HIGH PRIORITY)

**Current State:** Basic webhook mentions in docs, no implementation.

**Required Implementation:**
- Webhook endpoint server
- Signature verification
- Event dispatching
- Retry logic
- Webhook management UI

**Recommended Stack:**
- Express.js for webhook server
- Crypto for signature verification

**Files to Create:**
```
src/main/lib/webhooks/
├── server.ts
├── verifier.ts
├── dispatcher.ts
└── index.ts
```

### 4. Email Service (MEDIUM PRIORITY)

**Current State:** Not implemented.

**Required Implementation:**
- Welcome emails
- Subscription receipts
- Password reset
- Notification emails

**Recommended Stack:**
- SendGrid or Mailgun

**Files to Create:**
```
src/main/lib/email/
├── sendgrid.ts
├── templates/
│   ├── welcome.html
│   ├── receipt.html
│   └── reset.html
└── index.ts
```

---

## Recommended Additions

### 1. Long-Chain Agent Workflows

**Description:** Enable multi-step agent workflows that can span multiple sessions.

**Implementation:**
```typescript
// src/main/lib/long-chain/
interface LongChainWorkflow {
  id: string
  steps: WorkflowStep[]
  state: WorkflowState
  context: Record<string, any>
}

interface WorkflowStep {
  id: string
  agent: string
  prompt: string
  dependencies: string[]
  status: 'pending' | 'running' | 'completed' | 'failed'
}
```

### 2. Enhanced MCP Integration

**Current State:** Basic MCP support exists.

**Enhancements Needed:**
- MCP server marketplace UI
- MCP server health monitoring
- MCP tool caching
- MCP server auto-discovery

### 3. Background Agent Monitoring

**Description:** Real-time monitoring of background agents running in cloud sandboxes.

**Implementation:**
- WebSocket connection to cloud API
- Real-time status updates
- Resource usage metrics
- Error notifications

### 4. Team Collaboration

**Description:** Multi-user collaboration features.

**Implementation:**
- Team workspaces
- Real-time collaboration (via WebSockets)
- Permission management
- Activity feed

---

## Page URL Mapping (External Links)

Since GSDEV is a desktop app, it doesn't use URL routing internally. However, external links should point to:

| Page/Feature | External URL | Purpose |
|--------------|--------------|---------|
| **Landing Page** | `https://gsdev.dev` | Marketing site |
| **Documentation** | `https://gsdev.dev/docs` | User documentation |
| **API Docs** | `https://gsdev.dev/docs/api` | API reference |
| **Pricing** | `https://gsdev.dev/pricing` | Pricing plans |
| **Blog** | `https://gsdev.dev/blog` | Blog posts |
| **Support** | `https://discord.gg/8ektTZGnj4` | Discord community |
| **GitHub** | `https://github.com/gsdev-dev/gsdev` | Source code |
| **Issues** | `https://github.com/gsdev-dev/gsdev/issues` | Bug reports |
| **Anthropic Console** | `https://console.anthropic.com` | API key management |
| **Claude Docs** | `https://docs.anthropic.com` | Claude documentation |

---

## Single Application Verification

✅ **CONFIRMED:** GSDEV is a single, unified application with no disconnected projects or separate folders.

**Verification:**
- All code in single `gsdev/` directory
- Shared state management via Jotai atoms
- Unified tRPC backend
- Single Electron main process
- Single React renderer process
- Shared database (SQLite)
- Shared configuration (~/.claude.json)

**No separate projects detected.**

---

## Next Steps

### Immediate Actions (HIGH PRIORITY)

1. **Implement Payment Processing**
   - Add Stripe integration for global payments
   - Add Razorpay for UPI (India)
   - Implement webhook handlers
   - Connect to billing method page

2. **Implement Webhook System**
   - Create webhook server
   - Add signature verification
   - Implement retry logic
   - Add webhook management UI

3. **Enhance ENV Documentation**
   - Add all recommended variables
   - Provide setup instructions
   - Add validation logic

### Short-term Actions (MEDIUM PRIORITY)

4. **Add HubSpot Integration**
   - Implement contact sync
   - Add deal tracking
   - Connect to signup flow

5. **Add Email Service**
   - Implement SendGrid integration
   - Create email templates
   - Connect to key events

### Long-term Actions (LOW PRIORITY)

6. **Implement Long-Chain Workflows**
   - Design workflow engine
   - Create workflow editor
   - Add workflow templates

7. **Enhance MCP Integration**
   - Build marketplace UI
   - Add health monitoring
   - Implement auto-discovery

---

## Summary

GSDEV is a well-architected single application with:
- ✅ Complete MCP integration
- ✅ Comprehensive agent support (Claude, Codex, Ollama)
- ✅ Full git workflow integration
- ✅ Browser automation capabilities
- ✅ Plugin system with marketplace
- ✅ Database and state management
- ✅ Terminal and file operations

**Missing Critical Integrations:**
- ❌ Payment processing (Stripe/Razorpay)
- ❌ Webhook system
- ❌ HubSpot CRM
- ❌ Email service

**Recommendation:** Prioritize payment processing and webhook system implementation to enable subscription billing and automation triggers.
