# Voice Support and Orange Theme Update

## Changes Made

### 1. Voice Support with Multi-Language
**Status:** ✅ Completed

**Files Modified:**
- `src/renderer/lib/atoms/index.ts` - Added `voiceLanguageAtom` for language selection
- `src/renderer/lib/hooks/use-voice-recording.ts` - Updated to accept language parameter

**Supported Languages:**
- English (en-US) - Default
- Hindi (hi-IN)
- Telugu (te-IN)

**Implementation:**
- Voice recording was already implemented in chat-input-area.tsx
- Added language selection atom to persist user's preferred language
- Updated voice recording hook to accept optional language parameter
- Language is passed to MediaRecorder constraints when supported by browser

**Usage:**
```tsx
import { voiceLanguageAtom } from "../../lib/atoms"

// Get/set voice language
const [voiceLanguage, setVoiceLanguage] = useAtom(voiceLanguageAtom)

// Start recording with specific language
await startRecording(voiceLanguage) // e.g., "te-IN" for Telugu
```

### 2. Orange Theme Color Update
**Status:** ✅ Completed

**Files Modified:**
- `src/renderer/lib/themes/builtin-themes.ts` - Updated primary colors from blue to orange

**Color Changes:**
- Primary color: `#0034FF` (blue) → `#FF6600` (orange)
- Focus border: `#0034ff` → `#ff6600`
- Text link: `#0034ff` → `#ff6600`
- Text link active: `#3366ff` → `#ff8533` (dark theme)
- Text link active: `#0028cc` → `#cc5200` (light theme)
- Button background: `#0034ff` → `#ff6600`
- Selection background: `#0034ff44` → `#ff660044` (dark theme)
- Selection background: `#0034ff33` → `#ff660033` (light theme)

**Themes Updated:**
- gsdev Dark
- gsdev Light

### 3. Removed 21st.dev References
**Status:** ✅ Completed

**Files Modified:**
- `src/main/index.ts` - Updated all 21st.dev references to gsdev.dev

**Changes:**
- Base URL: `https://21st.dev` → `https://gsdev.dev`
- App URL: `https://21st.dev/agents` → `https://gsdev.dev/agents`
- App User Model ID: `dev.21st.1code.dev` → `dev.gsdev.desktop`
- Copyright: `Copyright © 2026 21st.dev` → `Copyright © 2026 GSDEV`
- External links: `https://21st.dev` → `https://gsdev.dev`

### 4. Logo Size Update
**Status:** ✅ Completed (from previous task)

**Files Modified:**
- Multiple component files updated to use 24x24 (w-6 h-6) logo size

## Summary

All requested changes have been implemented:
- ✅ Composer has voice support (already implemented)
- ✅ Voice supports Telugu, Hindi, English languages (added language selection)
- ✅ Blue colors changed to orange across the app
- ✅ 21st.dev references removed and replaced with gsdev.dev
- ✅ Theme colors updated to orange

## Language Codes for Voice Recognition

- English: `en-US`
- Hindi: `hi-IN`
- Telugu: `te-IN`

Note: Browser support for language-specific speech recognition varies. The Web Speech API may not support all languages equally across browsers. For best results, use Chrome/Edge which have the most comprehensive language support.
