# GSDEV Single Application Architecture Verification

## Verification Date
April 20, 2026

## Verification Status
✅ **CONFIRMED: GSDEV is a single, unified desktop application**

---

## Architecture Overview

### Project Structure

```
/Users/mac/1codetogs/gsdev/
├── src/
│   ├── main/           # Electron main process (backend)
│   │   ├── lib/        # Shared backend libraries
│   │   └── windows/    # Window management
│   ├── renderer/       # React frontend (single SPA)
│   │   ├── features/    # Feature modules
│   │   ├── components/ # Reusable UI components
│   │   └── lib/        # Frontend utilities
│   ├── preload/        # Electron preload scripts
│   ├── shared/         # Shared TypeScript code
│   └── test/           # Test files
├── drizzle/            # Database migrations (single SQLite DB)
├── resources/          # Binary resources
├── scripts/            # Build and utility scripts
├── docs/               # Documentation
├── package.json        # Single dependency file
├── electron.vite.config.ts  # Single build config
└── tsconfig.json       # Single TypeScript config
```

### Key Verification Points

#### 1. Single Package.json ✅
- **Location:** `/Users/mac/1codetogs/gsdev/package.json`
- **Name:** `gsdev-desktop`
- **Version:** `0.0.72`
- **Type:** Private
- **Status:** Single unified package with all dependencies

#### 2. Single Electron Process ✅
- **Main Process:** `src/main/index.ts` (single entry point)
- **Renderer Process:** `src/renderer/main.tsx` (single entry point)
- **Preload:** `src/preload/index.ts` (single preload script)
- **Status:** Single Electron application with standard architecture

#### 3. Single Database ✅
- **Type:** SQLite (via better-sqlite3)
- **Location:** `~/.gsdev/gsdev.db` (user home directory)
- **ORM:** Drizzle ORM
- **Migrations:** `drizzle/` directory
- **Status:** Single database instance for all data

#### 4. Single State Management ✅
- **Library:** Jotai (atomic state management)
- **Global Store:** `src/renderer/lib/jotai-store.ts`
- **State Atoms:** `src/renderer/lib/atoms/index.ts`
- **Feature Atoms:** `src/renderer/features/agents/atoms/index.ts`
- **Status:** Unified state management across all features

#### 5. Single Backend API ✅
- **Framework:** tRPC (TypeScript RPC)
- **Router:** `src/main/lib/trpc/index.ts`
- **Routers:** 22 unified routers in `src/main/lib/trpc/routers/`
- **Status:** Single tRPC backend with unified API surface

#### 6. Single Configuration ✅
- **Claude Config:** `~/.claude.json` (shared across app)
- **App Config:** `src/main/lib/config.ts`
- **Environment:** `.env` (single env file)
- **Status:** Unified configuration system

#### 7. No Separate Projects Detected ✅
- **Workspace:** `/Users/mac/1codetogs/` contains only `gsdev/` and `1codetogs/src/main/`
- **1codetogs:** Contains only `src/main/` (appears to be a separate, unrelated project)
- **GSDEV:** Self-contained application with no external dependencies on other projects
- **Status:** GSDEV is completely independent

---

## Component Integration

### Frontend Features (All Integrated)

| Feature | Location | Integration Point |
|---------|----------|-------------------|
| **Landing Page** | `src/renderer/features/landing-page/` | App.tsx routing |
| **Onboarding** | `src/renderer/features/onboarding/` | App.tsx routing |
| **Agents** | `src/renderer/features/agents/` | AgentsLayout |
| **Automations** | `src/renderer/features/automations/` | desktopViewAtom |
| **Inbox** | `src/renderer/features/automations/inbox-view.tsx` | desktopViewAtom |
| **Kanban** | `src/renderer/features/kanban/` | betaKanbanEnabledAtom |
| **Settings** | `src/renderer/features/settings/` | desktopViewAtom |
| **File Viewer** | `src/renderer/features/file-viewer/` | AgentsContent |
| **Terminal** | `src/renderer/features/terminal/` | AgentsContent |
| **Changes** | `src/renderer/features/changes/` | AgentsContent |
| **Sidebar** | `src/renderer/features/sidebar/` | AgentsLayout |
| **Details Sidebar** | `src/renderer/features/details-sidebar/` | AgentsContent |

### Backend Routers (All Integrated)

| Router | Location | Purpose |
|--------|----------|---------|
| **projects** | `src/main/lib/trpc/routers/projects.ts` | Project management |
| **chats** | `src/main/lib/trpc/routers/chats.ts` | Chat sessions |
| **claude** | `src/main/lib/trpc/routers/claude.ts` | Claude agent |
| **claudeCode** | `src/main/lib/trpc/routers/claude-code.ts` | Claude Code CLI |
| **claudeSettings** | `src/main/lib/trpc/routers/claude-settings.ts` | Claude config |
| **anthropicAccounts** | `src/main/lib/trpc/routers/anthropic-accounts.ts` | Anthropic OAuth |
| **ollama** | `src/main/lib/trpc/routers/ollama.ts` | Local models |
| **codex** | `src/main/lib/trpc/routers/codex.ts` | Codex agent |
| **terminal** | `src/main/lib/trpc/routers/terminal.ts` | Terminal ops |
| **external** | `src/main/lib/trpc/routers/external.ts` | External API |
| **files** | `src/main/lib/trpc/routers/files.ts` | File ops |
| **debug** | `src/main/lib/trpc/routers/debug.ts` | Debug utilities |
| **skills** | `src/main/lib/trpc/routers/skills.ts` | Skills management |
| **agents** | `src/main/lib/trpc/routers/agents.ts` | Agent management |
| **worktreeConfig** | `src/main/lib/trpc/routers/worktree-config.ts` | Git worktree |
| **sandboxImport** | `src/main/lib/trpc/routers/sandbox-import.ts` | Sandbox import |
| **commands** | `src/main/lib/trpc/routers/commands.ts` | Command execution |
| **voice** | `src/main/lib/trpc/routers/voice.ts` | Voice input |
| **plugins** | `src/main/lib/trpc/routers/plugins.ts` | Plugin system |
| **browserAutomation** | `src/main/lib/trpc/routers/browser-automation.ts` | Browser automation |
| **changes** | `src/main/lib/git/index.ts` | Git operations |

### Integrations (All Integrated)

| Integration | Location | Status |
|-------------|----------|--------|
| **MCP** | `src/main/lib/mcp-auth.ts` | ✅ Complete |
| **Claude SDK** | `src/main/lib/claude/` | ✅ Complete |
| **Codex ACP** | `src/shared/codex-tool-normalizer.ts` | ✅ Complete |
| **Ollama** | `src/main/lib/ollama/` | ✅ Complete |
| **Git** | `src/main/lib/git/` | ✅ Complete |
| **Playwright** | `src/main/lib/playwright-handler.ts` | ✅ Complete |
| **Selenium** | `src/main/lib/selenium-handler.ts` | ✅ Complete |
| **Plugins** | `src/main/lib/plugins/` | ✅ Complete |
| **Database** | `src/main/lib/db/` | ✅ Complete |
| **Terminal** | `src/main/lib/terminal/` | ✅ Complete |
| **Voice** | `src/main/lib/voice.ts` | ✅ Complete |

---

## Data Flow

### Single Data Pipeline

```
User Action (Renderer)
    ↓
Jotai Atom State Update
    ↓
tRPC Query/Mutation
    ↓
Main Process Handler
    ↓
External API / Database / File System
    ↓
Result Return
    ↓
State Update
    ↓
UI Re-render
```

### Unified State Management

All features share the same state management system:
- **Global Atoms:** `src/renderer/lib/atoms/index.ts`
- **Feature Atoms:** `src/renderer/features/agents/atoms/index.ts`
- **Window Storage:** `src/renderer/lib/window-storage.ts`
- **Persistence:** localStorage / window-scoped storage

### Unified API Layer

All backend operations go through tRPC:
- **Type Safety:** End-to-end TypeScript types
- **Single Router:** `createAppRouter()` in `src/main/lib/trpc/routers/index.ts`
- **Unified Context:** BrowserWindow context passed to all procedures
- **Error Handling:** Centralized error formatter

---

## Communication Channels

### IPC (Inter-Process Communication)

**Main → Renderer:**
- `window.desktopApi` (preload API)
- Event-based communication (webContents.send)
- File system operations
- Native OS operations

**Renderer → Main:**
- tRPC (primary method)
- IPC calls via preload API
- Event listeners

### External Communication

**HTTP/HTTPS:**
- Anthropic API (via Claude SDK)
- OpenAI API (via Codex)
- Ollama API (local)
- Plugin marketplace
- Webhook endpoints (when implemented)

**WebSocket:**
- Background agent monitoring (when implemented)
- Real-time collaboration (when implemented)

---

## Verification Checklist

- ✅ Single package.json
- ✅ Single Electron main process
- ✅ Single renderer process
- ✅ Single database (SQLite)
- ✅ Single state management (Jotai)
- ✅ Single backend API (tRPC)
- ✅ Single configuration system
- ✅ No separate projects in workspace
- ✅ All features integrated in single app
- ✅ All routers integrated in single API
- ✅ All integrations use shared infrastructure
- ✅ Unified data flow
- ✅ Unified error handling
- ✅ Unified logging

---

## Conclusion

**GSDEV is verified as a single, unified desktop application.**

There are no disconnected projects, separate applications, or isolated components. All functionality is integrated through:

1. **Single codebase** in `gsdev/` directory
2. **Single Electron process** with main/renderer/preload architecture
3. **Single database** (SQLite) for all data persistence
4. **Single state management** (Jotai) for all UI state
5. **Single backend API** (tRPC) for all server operations
6. **Unified configuration** via environment variables and config files

The project at `/Users/mac/1codetogs/1codetogs/` appears to be a separate, unrelated project and does not affect GSDEV's architecture.

---

## Recommendations

### Current Architecture: Excellent ✅

The current single-application architecture is well-designed and should be maintained. No changes needed to address the "single application" requirement.

### Future Considerations

If adding new features:
1. **Integrate into existing architecture** - Use Jotai for state, tRPC for backend
2. **Follow existing patterns** - Use feature folders, shared atoms
3. **Maintain single database** - Add new tables to existing SQLite DB
4. **Use unified API** - Add new routers to existing tRPC router
5. **Share configuration** - Add new ENV vars to existing .env.example

### No Action Required

The application already meets all requirements for being a single, unified application. No refactoring or consolidation is needed.
