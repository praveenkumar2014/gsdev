# Social Authentication Implementation Summary

## Overview

This document summarizes the social authentication implementation for GSDEV, replacing external OAuth flows with in-app authentication windows for Google, Facebook, Instagram, and GitHub.

## Changes Made

### 1. Social Authentication Providers

Created complete OAuth 2.0 authentication providers in `src/main/lib/social-auth/`:

- **`google.ts`** - Google OAuth 2.0 with PKCE
- **`facebook.ts`** - Facebook OAuth 2.0
- **`instagram.ts`** - Instagram Basic Display API OAuth
- **`github.ts`** - GitHub OAuth 2.0
- **`index.ts`** - Unified social auth manager
- **`callback-server.ts`** - Local HTTP server for OAuth callbacks

### 2. tRPC Router

Created `src/main/lib/trpc/routers/social-auth.ts` with endpoints:
- `getProviders` - List configured providers
- `authenticate` - Authenticate with specific provider
- `isProviderConfigured` - Check if provider is configured

### 3. Environment Variables

Updated `.env.example` with social auth variables:
```env
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI

FACEBOOK_APP_ID
FACEBOOK_APP_SECRET
FACEBOOK_REDIRECT_URI

INSTAGRAM_APP_ID
INSTAGRAM_APP_SECRET
INSTAGRAM_REDIRECT_URI

GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
GITHUB_REDIRECT_URI
```

### 4. External Links Removal

Modified `src/renderer/features/landing-page/landing-page.tsx`:
- Replaced external `href` links with internal button navigation
- Removed browser-opening links from header and footer
- Links now use onClick handlers for internal navigation

### 5. OAuth Flow Fix

The new social auth providers use in-app BrowserWindow instead of `shell.openExternal`:
- OAuth opens in a controlled Electron window
- Callbacks are handled via local HTTP server (port 8914)
- No external browser launches required

## Integration Status

### Completed ✅
- Social auth providers implemented
- tRPC router created and integrated
- Environment variables documented
- External links removed from landing page
- OAuth callback server implemented
- In-app OAuth windows (no external browser)

### Pending ⏳
- Update auth modal UI to show social auth options
- Connect social auth to existing auth flow
- Test all social auth providers
- Update auth-manager.ts to support social auth
- Create social auth settings page

## Usage

### Frontend Integration

```typescript
import { trpc } from '@/lib/trpc'

// Get available providers
const { data: providers } = trpc.socialAuth.getProviders.useQuery()

// Authenticate with Google
const authenticate = trpc.socialAuth.authenticate.useMutation()

await authenticate.mutateAsync({ provider: 'google' })
```

### Backend Integration

```typescript
import { createSocialAuthManager } from '@/main/lib/social-auth'

const manager = createSocialAuthManager()

// Check if provider is configured
if (manager.isProviderConfigured('google')) {
  // Authenticate
  const result = await manager.authenticate('google')
  console.log(result.userInfo)
}
```

## Next Steps

1. **Add social auth buttons to auth modal** - Update the auth modal component to show Google, Facebook, Instagram, GitHub login options
2. **Integrate with existing auth flow** - Connect social auth to the auth-manager.ts
3. **Add settings page** - Create UI for configuring social auth providers
4. **Test end-to-end** - Test all social auth flows with real credentials
5. **Handle token refresh** - Implement token refresh for providers that support it (Google, Instagram)

## Security Notes

- All OAuth flows use PKCE (Proof Key for Code Exchange) where supported
- State parameters prevent CSRF attacks
- Callback server runs on localhost only
- Tokens are stored securely in Electron userData
- No external browser launches - all OAuth happens in-app

## Migration from Existing OAuth

The existing Anthropic/Codex OAuth flows use `shell.openExternal` which opens the external browser. To migrate:

1. Replace `shell.openExternal` calls with new social auth providers
2. Update auth-manager.ts to use SocialAuthManager
3. Remove old OAuth handlers
4. Test new in-app OAuth flows

## Testing

To test social authentication:

1. Set up OAuth apps on each provider's developer console
2. Add environment variables for each provider
3. Configure redirect URIs to `http://localhost:8914/callback`
4. Test authentication flow from auth modal
5. Verify user info is correctly retrieved
6. Test token refresh (for applicable providers)
