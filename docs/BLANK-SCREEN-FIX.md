# Blank Screen Fix - GSDEV Renaming and Model Integration

## Issue
User reported blank screen after login after converting from "one code agent" to "GSDEV". User wants:
- Local models integration
- Claude model integration
- OpenRouter integration
- OpenCode/OpenAI model integration
- All model providers working correctly

## Root Cause Analysis
1. App was showing "Not logged in · Please run /login" error
2. API key onboarding was not showing properly
3. Default billing method was null, causing routing issues
4. API key validation only supported Anthropic keys

## Fixes Applied

### 1. Default Billing Method
**File:** `src/renderer/features/agents/atoms/index.ts`
- Changed `billingMethodAtom` default from `null` to `"api-key"`
- This ensures users can use API key mode for all model providers

### 2. API Key Onboarding
**File:** `src/renderer/lib/atoms/index.ts`
- Set `apiKeyOnboardingCompletedAtom` default to `false`
- Forces users to complete API key setup on first run

### 3. Multi-Provider API Key Validation
**File:** `src/renderer/features/onboarding/api-key-onboarding-page.tsx`
- Updated `isValidApiKey()` to support multiple providers:
  - `anthropic`: keys starting with `sk-ant-`
  - `openai`/`openrouter`: keys starting with `sk-`
  - `ollama`: any non-empty string (no API key needed)
  - Custom providers: any non-empty string
- Updated all function calls to include provider parameter

## Model Provider Status

### Local Models (Ollama)
- **Status:** ✅ Implemented
- **Files:**
  - `src/main/lib/local-model-handlers.ts` - Local model handler for Ollama, LM Studio, LocalAI
  - `src/main/lib/ollama/detector.ts` - Ollama status checker
  - `src/renderer/lib/atoms/index.ts` - `selectedOllamaModelAtom`, `OFFLINE_PROFILE`
- **Default Model:** qwen2.5-coder:7b
- **Port:** http://localhost:11434

### Claude Models
- **Status:** ✅ Implemented
- **Files:**
  - `src/main/lib/claude/` - Claude integration
  - `src/renderer/features/onboarding/anthropic-onboarding-page.tsx`
  - `src/renderer/lib/atoms/index.ts` - `anthropicOnboardingCompletedAtom`
- **Default Model:** claude-sonnet-4-6
- **API:** https://api.anthropic.com

### OpenRouter
- **Status:** ⚠️ Partially Implemented
- **Current:** Can be configured via custom model mode
- **Files:** `src/renderer/features/onboarding/api-key-onboarding-page.tsx` (custom model mode)
- **Base URL:** https://openrouter.ai/api/v1
- **Needs:** Dedicated integration in UI

### OpenAI/OpenCode
- **Status:** ⚠️ Partially Implemented
- **Current:** Can be configured via custom model mode
- **Files:** `src/renderer/features/onboarding/api-key-onboarding-page.tsx` (custom model mode)
- **Base URL:** https://api.openai.com/v1
- **Needs:** Dedicated integration in UI

## Next Steps

1. **Add Dedicated OpenRouter Integration**
   - Create OpenRouter-specific onboarding page
   - Add OpenRouter to billing method options
   - Support OpenRouter model list

2. **Add Dedicated OpenAI Integration**
   - Create OpenAI-specific onboarding page
   - Add OpenAI to billing method options
   - Support OpenAI model list

3. **Improve Local Model UI**
   - Add local model selector in main UI
   - Show Ollama status in settings
   - Auto-detect available local models

4. **Test Complete Flow**
   - Verify API key onboarding shows correctly
   - Test each model provider integration
   - Ensure all panels (left sidebar, bottom panel, charts) render properly

## Configuration

To use different providers, configure via custom model mode:

**Claude:**
- Base URL: https://api.anthropic.com
- Model: claude-sonnet-4-6
- Token: sk-ant-...

**OpenRouter:**
- Base URL: https://openrouter.ai/api/v1
- Model: anthropic/claude-sonnet-4
- Token: sk-or-...

**OpenAI:**
- Base URL: https://api.openai.com/v1
- Model: gpt-4
- Token: sk-...

**Ollama (Local):**
- Base URL: http://localhost:11434
- Model: qwen2.5-coder:7b
- Token: ollama
