# GSDEV Page Routing & Navigation Guide

## Overview

GSDEV uses **state-based routing** (not URL-based) since it's a desktop Electron application. Navigation is managed through Jotai atoms and state transitions.

---

## Table of Contents

1. [Routing Architecture](#routing-architecture)
2. [Page Components](#page-components)
3. [Navigation State](#navigation-state)
4. [Page Transitions](#page-transitions)
5. [External URLs](#external-urls)
6. [Navigation Examples](#navigation-examples)

---

## Routing Architecture

### State-Based Routing

Unlike web applications that use URL routing (e.g., React Router), GSDEV uses React state atoms to control which page is displayed:

```typescript
// Main routing logic in App.tsx
if (showLandingPage) {
  return <LandingPage />
}

if (!billingMethod) {
  return <BillingMethodPage />
}

if (billingMethod === "claude-subscription" && !anthropicOnboardingCompleted) {
  return <AnthropicOnboardingPage />
}

if (!validatedProject && !isLoadingProjects) {
  return <SelectRepoPage />
}

return <AgentsLayout />
```

### Desktop View Navigation

Within the main application (`AgentsLayout`), navigation is controlled by `desktopViewAtom`:

```typescript
type DesktopView = "automations" | "automations-detail" | "inbox" | "settings" | null
```

---

## Page Components

### 1. Landing Page

**Component:** `LandingPage`  
**Location:** `src/renderer/features/landing-page/landing-page.tsx`  
**State Control:** `showLandingPageAtom` (atomWithStorage)

**Sections:**
- Hero section with "Get Started" CTA
- Features section (4 feature cards)
- Agents section (3 agent types)
- Platform section (Desktop, Mobile, Web)
- Social section (GitHub, Twitter, Facebook, LinkedIn)
- Dashboard preview section
- Models section (Claude, GPT-4, Codex)
- Pricing section (Free, Pro, Enterprise)
- Mobile app section (iOS, Android)
- CTA section

**Navigation:**
- Click "Get Started" → Opens auth modal
- Click "Sign In" → Opens auth modal
- Click pricing plans → Opens cart modal
- Click navigation links → Scrolls to section

### 2. Billing Method Page

**Component:** `BillingMethodPage`  
**Location:** `src/renderer/features/onboarding/billing-method-page.tsx`  
**State Control:** `billingMethodAtom`

**Options:**
- Claude Subscription (Anthropic)
- Codex Subscription (OpenAI)
- API Key (Bring Your Own Key)
- Custom Model (BYOK)

**Navigation:**
- Select option → Sets `billingMethodAtom` → Navigates to corresponding onboarding page

### 3. Anthropic Onboarding Page

**Component:** `AnthropicOnboardingPage`  
**Location:** `src/renderer/features/onboarding/anthropic-onboarding-page.tsx`  
**State Control:** `anthropicOnboardingCompletedAtom`

**Flow:**
1. OAuth login with Anthropic
2. Grant permissions
3. Complete onboarding
4. Navigate to SelectRepoPage

**Navigation:**
- Complete OAuth → Sets `anthropicOnboardingCompletedAtom = true` → Navigates to SelectRepoPage
- Click "Back" → Returns to BillingMethodPage

### 4. Codex Onboarding Page

**Component:** `CodexOnboardingPage`  
**Location:** `src/renderer/features/onboarding/codex-onboarding-page.tsx`  
**State Control:** `codexOnboardingCompletedAtom`

**Flow:**
1. OAuth login with Codex
2. Grant permissions
3. Complete onboarding
4. Navigate to SelectRepoPage

**Navigation:**
- Complete OAuth → Sets `codexOnboardingCompletedAtom = true` → Navigates to SelectRepoPage

### 5. API Key Onboarding Page

**Component:** `ApiKeyOnboardingPage`  
**Location:** `src/renderer/features/onboarding/api-key-onboarding-page.tsx`  
**State Control:** `apiKeyOnboardingCompletedAtom`

**Flow:**
1. Enter API key
2. Validate key
3. Select model provider
4. Complete onboarding
5. Navigate to SelectRepoPage

**Navigation:**
- Submit valid key → Sets `apiKeyOnboardingCompletedAtom = true` → Navigates to SelectRepoPage
- Click "Back" → Returns to BillingMethodPage

### 6. Select Repo Page

**Component:** `SelectRepoPage`  
**Location:** `src/renderer/features/onboarding/select-repo-page.tsx`  
**State Control:** `selectedProjectAtom`

**Options:**
- Clone from GitHub
- Open local folder
- Import from URL

**Navigation:**
- Select project → Sets `selectedProjectAtom` → Navigates to AgentsLayout

### 7. Agents Layout (Main Application)

**Component:** `AgentsLayout`  
**Location:** `src/renderer/features/layout/agents-layout.tsx`  
**State Control:** `desktopViewAtom`

**Sub-Views:**
- **Agents Content** (`desktopViewAtom = null`) - Main chat interface
- **Automations** (`desktopViewAtom = "automations"`) - Automation management
- **Automation Detail** (`desktopViewAtom = "automations-detail"`) - Automation details
- **Inbox** (`desktopViewAtom = "inbox"`) - Message inbox
- **Settings** (`desktopViewAtom = "settings"`) - Application settings

**Components:**
- Left Sidebar (AgentsSidebar or SettingsSidebar)
- Main Content (AgentsContent)
- Queue Processor (background task queue)
- Claude Login Modal
- Codex Login Modal
- Update Banner

### 8. Automations View

**Component:** `AutomationsView`  
**Location:** `src/renderer/features/automations/automations-view.tsx`  
**State Control:** `desktopViewAtom = "automations"`

**Features:**
- List of automations
- Create new automation
- Filter/search automations
- Automation status indicators

**Navigation:**
- Click automation → Sets `desktopViewAtom = "automations-detail"` → Opens AutomationsDetailView
- Click "Back" → Sets `desktopViewAtom = null` → Returns to AgentsLayout

### 9. Automation Detail View

**Component:** `AutomationsDetailView`  
**Location:** `src/renderer/features/automations/automations-detail-view.tsx`  
**State Control:** `desktopViewAtom = "automations-detail"`, `automationDetailIdAtom`

**Features:**
- Automation configuration
- Trigger settings
- Execution history
- Logs and outputs

**Navigation:**
- Click "Back" → Sets `desktopViewAtom = "automations"` → Returns to AutomationsView
- Click "Run" → Executes automation

### 10. Inbox View

**Component:** `InboxView`  
**Location:** `src/renderer/features/automations/inbox-view.tsx`  
**State Control:** `desktopViewAtom = "inbox"`, `inboxSelectedChatIdAtom`

**Features:**
- List of incoming messages
- Message filtering
- Quick actions
- Archive functionality

**Navigation:**
- Click message → Opens in chat
- Click "Back" → Sets `desktopViewAtom = null` → Returns to AgentsLayout

### 11. Settings Sidebar

**Component:** `SettingsSidebar`  
**Location:** `src/renderer/features/settings/settings-sidebar.tsx`  
**State Control:** `desktopViewAtom = "settings"`, `agentsSettingsDialogActiveTabAtom`

**Tabs:**
- General
- Projects
- Models
- MCP
- Plugins
- Account

**Navigation:**
- Click tab → Sets `agentsSettingsDialogActiveTabAtom` → Shows corresponding settings panel
- Click "Close" → Sets `desktopViewAtom = null` → Returns to AgentsLayout

### 12. Kanban View

**Component:** `KanbanView`  
**Location:** `src/renderer/features/kanban/kanban-view.tsx`  
**State Control:** `betaKanbanEnabledAtom`, `showNewChatFormAtom`

**Features:**
- Visual task board
- Drag and drop
- Column management
- Task filtering

**Navigation:**
- Toggle kanban → Sets `showNewChatFormAtom = false` → Shows KanbanView
- Click "New Chat" → Sets `showNewChatFormAtom = true` → Shows new chat form

---

## Navigation State

### Global State Atoms

```typescript
// Landing page visibility
showLandingPageAtom: atomWithStorage<boolean>("show-landing-page", true)

// Billing method selection
billingMethodAtom: atomWithStorage<BillingMethod | null>("billing-method", null)

// Onboarding completion states
anthropicOnboardingCompletedAtom: atomWithStorage<boolean>("anthropic-onboarding-completed", false)
codexOnboardingCompletedAtom: atomWithStorage<boolean>("codex-onboarding-completed", false)
apiKeyOnboardingCompletedAtom: atomWithStorage<boolean>("api-key-onboarding-completed", false)

// Project selection
selectedProjectAtom: atomWithStorage<SelectedProject | null>("selected-project", null)

// Desktop view navigation
desktopViewAtom: atom<DesktopView>(null)

// Automation detail
automationDetailIdAtom: atom<string | null>(null)

// Inbox selection
inboxSelectedChatIdAtom: atom<string | null>(null)

// Settings tab
agentsSettingsDialogActiveTabAtom: atom<string>("general")

// Kanban toggle
betaKanbanEnabledAtom: atomWithStorage<boolean>("beta-kanban-enabled", false)
showNewChatFormAtom: atom<boolean>(true)
```

### State Types

```typescript
type BillingMethod = 
  | "claude-subscription"
  | "codex-subscription"
  | "codex-api-key"
  | "api-key"
  | "custom-model"

type DesktopView = 
  | "automations"
  | "automations-detail"
  | "inbox"
  | "settings"
  | null

type SelectedProject = {
  id: string
  name: string
  path: string
  provider: string
}
```

---

## Page Transitions

### Onboarding Flow

```
LandingPage
  ↓ (click "Get Started")
BillingMethodPage
  ↓ (select billing method)
  ├─→ AnthropicOnboardingPage (if "claude-subscription")
  ├─→ CodexOnboardingPage (if "codex-subscription" or "codex-api-key")
  └─→ ApiKeyOnboardingPage (if "api-key" or "custom-model")
  ↓ (complete onboarding)
SelectRepoPage
  ↓ (select project)
AgentsLayout (desktopViewAtom = null)
```

### Main Application Navigation

```
AgentsLayout (desktopViewAtom = null)
  ↓ (click automations in sidebar)
AutomationsView (desktopViewAtom = "automations")
  ↓ (click automation)
AutomationsDetailView (desktopViewAtom = "automations-detail")
  ↓ (click back)
AutomationsView
  ↓ (click back)
AgentsLayout

AgentsLayout (desktopViewAtom = null)
  ↓ (click inbox in sidebar)
InboxView (desktopViewAtom = "inbox")
  ↓ (click back)
AgentsLayout

AgentsLayout (desktopViewAtom = null)
  ↓ (click settings in sidebar)
SettingsSidebar (desktopViewAtom = "settings")
  ↓ (click close)
AgentsLayout
```

### Keyboard Navigation

```typescript
// Keyboard shortcuts mapped to navigation
{
  "⌘\\": () => setSidebarOpen(!open),           // Toggle sidebar
  "⌘K": () => toggleChatSearch(),                // Open search
  "⌘P": () => togglePreview(),                  // Toggle preview
  "⌘J": () => toggleTerminal(),                 // Toggle terminal
  "⌘O": () => openInEditor(),                   // Open in editor
  "⌘N": () => setShowNewChatForm(true),         // New chat
  "⌘,": () => setDesktopView("settings"),       // Open settings
  "⌘A": () => setDesktopView("automations"),    // Open automations
  "⌘I": () => setDesktopView("inbox"),          // Open inbox
}
```

---

## External URLs

Since GSDEV is a desktop app, external links open in the default browser:

### Marketing & Documentation

| Purpose | URL |
|---------|-----|
| Landing Page | `https://gsdev.dev` |
| Documentation | `https://gsdev.dev/docs` |
| API Documentation | `https://gsdev.dev/docs/api` |
| Pricing | `https://gsdev.dev/pricing` |
| Blog | `https://gsdev.dev/blog` |
| About | `https://gsdev.dev/about` |
| Careers | `https://gsdev.dev/careers` |

### Support & Community

| Purpose | URL |
|---------|-----|
| Discord | `https://discord.gg/8ektTZGnj4` |
| GitHub Repository | `https://github.com/gsdev-dev/gsdev` |
| GitHub Issues | `https://github.com/gsdev-dev/gsdev/issues` |
| Support Email | `mailto:support@gsdev.dev` |

### External Services

| Service | URL |
|---------|-----|
| Anthropic Console | `https://console.anthropic.com` |
| Anthropic Docs | `https://docs.anthropic.com` |
| OpenAI Platform | `https://platform.openai.com` |
| OpenAI Docs | `https://platform.openai.com/docs` |
| Stripe Dashboard | `https://dashboard.stripe.com` |
| HubSpot Portal | `https://app.hubspot.com` |

### Social Media

| Platform | URL |
|----------|-----|
| GitHub | `https://github.com/gsdev-dev/gsdev` |
| Twitter | `https://twitter.com/gsdev` |
| Facebook | `https://facebook.com/gsdev` |
| LinkedIn | `https://linkedin.com/company/gsdev` |

---

## Navigation Examples

### Programmatic Navigation

```typescript
// In React components
import { useSetAtom } from 'jotai'
import { 
  desktopViewAtom, 
  selectedProjectAtom,
  selectedAgentChatIdAtom,
  billingMethodAtom 
} from '@/lib/atoms'

// Navigate to settings
const setDesktopView = useSetAtom(desktopViewAtom)
setDesktopView("settings")

// Navigate to automations
setDesktopView("automations")

// Navigate to automation detail
setDesktopView("automations-detail")
setAutomationDetailId("automation-123")

// Select a project
const setSelectedProject = useSetAtom(selectedProjectAtom)
setSelectedProject({
  id: "project-123",
  name: "My Project",
  path: "/path/to/project",
  provider: "anthropic"
})

// Select a chat
const setSelectedChatId = useSetAtom(selectedAgentChatIdAtom)
setSelectedChatId("chat-456")

// Reset to main view
setDesktopView(null)
```

### Navigation from User Actions

```typescript
// Example: Settings button click
const handleOpenSettings = () => {
  setSettingsActiveTab("general")
  setSettingsDialogOpen(true)
  setDesktopView("settings")
}

// Example: Automation click
const handleAutomationClick = (automationId: string) => {
  setAutomationDetailId(automationId)
  setDesktopView("automations-detail")
}

// Example: Sign out
const handleSignOut = async () => {
  setSelectedProject(null)
  setSelectedChatId(null)
  setBillingMethod(null)
  setAnthropicOnboardingCompleted(false)
  setApiKeyOnboardingCompleted(false)
  setCodexOnboardingCompleted(false)
  if (window.desktopApi?.logout) {
    await window.desktopApi.logout()
  }
}
```

### Navigation from Hotkeys

```typescript
// Example: Open settings with ⌘,
if (hotkey === "⌘,") {
  setDesktopView("settings")
}

// Example: Open automations with ⌘A
if (hotkey === "⌘A") {
  setDesktopView("automations")
}

// Example: Open inbox with ⌘I
if (hotkey === "⌘I") {
  setDesktopView("inbox")
}

// Example: Return to main view with Escape
if (hotkey === "Escape") {
  setDesktopView(null)
}
```

---

## Deep Links

GSDEV supports custom protocol deep links:

### Protocol Scheme

```
twentyfirst-agents://
```

### Deep Link Formats

```typescript
// Open specific chat
twentyfirst-agents://chat/{chatId}

// Open specific project
twentyfirst-agents://project/{projectId}

// Open settings
twentyfirst-agents://settings

// Open automations
twentyfirst-agents://automations

// Open specific automation
twentyfirst-agents://automation/{automationId}
```

### Deep Link Handling

```typescript
// In main process (Electron)
app.on('open-url', (event, url) => {
  event.preventDefault()
  
  if (url.startsWith('twentyfirst-agents://')) {
    const parsed = parseDeepLink(url)
    
    // Send to renderer
    mainWindow.webContents.send('deep-link', parsed)
  }
})

// In renderer
window.desktopApi.onDeepLink?.((link) => {
  if (link.type === 'chat') {
    setSelectedChatId(link.chatId)
    setDesktopView(null)
  } else if (link.type === 'automation') {
    setAutomationDetailId(link.automationId)
    setDesktopView('automations-detail')
  }
})
```

---

## Summary

- **Routing Method:** State-based (Jotai atoms), not URL-based
- **Main Navigation:** Controlled by `desktopViewAtom` in AgentsLayout
- **Onboarding Flow:** Sequential state transitions through onboarding pages
- **External Links:** Open in default browser
- **Deep Links:** Custom protocol `twentyfirst-agents://`
- **Keyboard Shortcuts:** Mapped to navigation functions via hotkey manager

All pages are connected through state transitions, ensuring a seamless user experience within the single desktop application.
