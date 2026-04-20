# Application Structure Analysis

## Overview

Scanned entire `/Users/mac/1codetogs/` directory to identify all applications.

## Applications Found

### 1. GSDEV (Main Application) ⭐
**Location:** `/Users/mac/1codetogs/gsdev/`

**Type:** Electron Desktop Application

**Package:** `gsdev-desktop` (v0.0.72)

**Description:** UI for parallel work with AI agents

**Key Files:**
- `package.json` - Main package configuration
- `electron.vite.config.ts` - Electron + Vite config
- `electron-builder.yml` - Build configuration
- `src/` - Source code (565 items)
- `drizzle/` - Database ORM
- `docs/` - Documentation (9 items)

**Scripts:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Technologies:**
- Electron (Desktop framework)
- React (UI)
- Vite (Build tool)
- Drizzle ORM (Database)
- tRPC (API)
- Jotai (State management)

---

### 2. 1codetogs (Component/Module)
**Location:** `/Users/mac/1codetogs/1codetogs/`

**Type:** Minimal component/module

**Structure:**
- `src/main/lib/trpc/routers/browser-automation.ts` - Browser automation router

**Purpose:** Appears to be a shared browser automation component that's already integrated into GSDEV

**Note:** This is NOT a separate application - it's a component that's already part of GSDEV's codebase

---

### 3. PHP Project (WordPress Standards)
**Location:** `/Users/mac/1codetogs/`

**Type:** PHP coding standards configuration

**Key Files:**
- `composer.json` - PHP dependency manager
- `composer.lock` - Locked dependencies
- `phpcs.xml` - PHP CodeSniffer config
- `vendor/` - PHP dependencies (2222 items)
- `.eslintrc.json` - WordPress/React ESLint config

**Purpose:** WordPress coding standards for PHP development

**Note:** This is NOT a standalone application - it's just coding standards configuration

---

## Summary

**Total Applications:** 1

1. **GSDEV** - The main Electron desktop application
   - Fully functional application
   - Can be run with `npm run dev`
   - Has complete source code and dependencies

**Other Items:**
- **1codetogs** - Component module (already integrated into GSDEV)
- **PHP project** - Coding standards only (not an application)

**Conclusion:** There is only ONE application - GSDEV. The 1codetogs folder is a component that's already integrated, and the PHP files are just coding standards configuration.
