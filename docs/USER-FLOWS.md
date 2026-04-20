# GSDEV User Flows Documentation

## Overview

This document outlines the user flows for GSDEV, an AI-powered development platform.

## Table of Contents

1. [Authentication Flow](#authentication-flow)
2. [Project Setup Flow](#project-setup-flow)
3. [Agent Chat Flow](#agent-chat-flow)
4. [Payment Flow](#payment-flow)
5. [Landing Page Flow](#landing-page-flow)

---

## Authentication Flow

### Sign In Process

1. **Landing Page Entry**
   - User lands on the GSDEV landing page
   - Clicks "Sign In" button in header
   - Authentication modal opens

2. **Left/Right Authentication**
   - **Left Panel**: Enter email and password
   - **Right Panel**: QR code scanning option (mobile)
   - Social login options: GitHub, Google, etc.

3. **OAuth Flow**
   - Redirects to gsdev.dev authentication
   - User authorizes application
   - Deep link returns to Electron app
   - Session established

4. **Post-Authentication**
   - User redirected to onboarding (if first-time user)
   - Billing method selection
   - Project selection or creation
   - Main dashboard access

### Sign Up Process

1. Click "Sign Up" tab in authentication modal
2. Enter email, password, and confirm password
3. Complete email verification
4. Follow same OAuth flow as sign in

---

## Project Setup Flow

### Creating a New Project

1. **Dashboard Entry**
   - After authentication, user sees project dashboard
   - Click "New Project" button

2. **Project Options**
   - **Clone from GitHub**: Enter repository URL
   - **Open Local Folder**: Browse to local directory
   - **Import from URL**: Paste project URL

3. **Git Worktree Setup**
   - System creates isolated worktree
   - Location: `~/.gsdev/worktrees/{projectSlug}/{worktreeFolder}/`
   - Automatic branch creation
   - Git configuration

4. **Project Selection**
   - Project appears in sidebar
   - Click to activate
   - Agent chat session starts

---

## Agent Chat Flow

### Starting an Agent Session

1. **Project Selection**
   - Select project from sidebar
   - Agent chat interface opens

2. **Agent Mode Selection**
   - **Plan Mode**: AI plans before executing
   - **Agent Mode**: AI executes tools directly

3. **Interaction Flow**
   - Type prompt in chat input
   - AI analyzes request
   - Tools executed (bash, file edits, web search, etc.)
   - Real-time output display
   - Diff previews for code changes

4. **Tool Execution**
   - **Bash**: Terminal commands
   - **File Edit**: Code modifications
   - **Web Search**: Information gathering
   - **Browser**: Playwright/Selenium automation

5. **Sub-Chat Sessions**
   - Create focused sub-chats for specific tasks
   - Isolated worktree for each sub-chat
   - Switch between sub-chats easily

---

## Payment Flow

### Pricing Selection

1. **Pricing Page**
   - View Free, Pro, and Enterprise plans
   - Compare features
   - Select desired plan

2. **Cart Modal**
   - Selected plan added to cart
   - Review order
   - Click "Proceed to Payment"

3. **Payment Options**
   - **UPI Integration**
   - Enter UPI ID
   - Complete payment
   - Confirmation

4. **Post-Payment**
   - Authentication step (if not authenticated)
   - Access to Pro features
   - Receipt generation

---

## Landing Page Flow

### Visitor Experience

1. **Hero Section**
   - View "Build Anything" messaging
   - AI prompt input for quick demo
   - "Get Started" CTA

2. **Feature Exploration**
   - Scroll through 10 sections
   - Learn about agents, models, platforms
   - View pricing options

3. **Social Integration**
   - Connect via social media
   - Share on GitHub, Twitter, LinkedIn

4. **Mobile Experience**
   - Responsive design for mobile
   - Native iOS/Android app download options
   - Touch-optimized interface

5. **Dark/Light Mode**
   - Toggle theme preference
   - Smooth transitions
   - System preference detection

---

## Dashboard Navigation

### Main Dashboard

1. **Sidebar Navigation**
   - Projects list
   - Agent sessions
   - Automations (beta feature)
   - Settings

2. **User Dashboard**
   - Collapsible side panel
   - User role selection (developer/designer/manager)
   - Quick stats and metrics

3. **Project Management**
   - Add/clone projects
   - Switch between projects
   - View project details

---

## Mobile App Flow

### iOS/Android Native Apps

1. **Download**
   - Click download button on landing page
   - Redirect to App Store or Play Store

2. **Installation**
   - Install app on device
   - Sign in with existing account
   - Sync with desktop session

3. **Mobile Features**
   - Full feature parity with desktop
   - Touch-optimized interface
   - Background agent support

---

## Quick Start Guide

### For New Users

1. Download and install GSDEV
2. Sign in with GitHub or email
3. Select billing method (free tier available)
4. Clone or open a project
5. Start chatting with AI agents
6. Watch AI write, edit, and debug code in real-time

### For Advanced Users

1. Configure CLI integration
2. Set up custom models (BYOK)
3. Configure MCP servers
4. Use keyboard shortcuts
5. Customize worktree settings

---

## Troubleshooting

### Common Issues

**Authentication Issues**
- Clear app data: `rm -rf ~/Library/Application\ Support/Agents\ Dev/`
- Reset protocol handler
- Check network connectivity

**Project Not Loading**
- Verify git repository access
- Check worktree permissions
- Ensure sufficient disk space

**Agent Not Responding**
- Check API key configuration
- Verify internet connection
- Review agent logs in console

---

## Support Resources

- **Documentation**: https://gsdev.dev/docs
- **GitHub Issues**: https://github.com/gsdev-dev/gsdev/issues
- **Community Discord**: [Link to discord]
- **Email**: support@gsdev.dev

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| ⌘O | Open in editor |
| ⌘P | Toggle preview |
| ⌘S | Save changes |
| ⌘K | Stop current task |
| ⌘D | Delete file |
| ⌘N | New chat |

---

## API Integration

### Using GSDEV API

1. Get API key from settings
2. Configure in environment variables
3. Use in custom integrations
4. Rate limits: 100 requests/minute (free tier)

### Webhooks

- Configure webhook URLs in settings
- Events: chat created, task completed, error
- Payload format: JSON

---

## Security

### Data Privacy

- Local-first architecture
- End-to-end encryption
- No code storage on cloud (optional)
- GDPR compliant

### Best Practices

- Never share API keys
- Use strong passwords
- Enable 2FA when available
- Regular security updates

---

## Updates and Maintenance

### Auto-Update

- Updates checked on startup
- Automatic download for major versions
- Manual approval for security updates
- Changelog available in settings

### Backup

- Worktrees are local Git clones
- Project data in SQLite database
- Export settings from settings menu

---

## Conclusion

This documentation covers the main user flows in GSDEV. For detailed API documentation, see the [API Docs](https://gsdev.dev/docs/api).

For questions or issues, contact support@gsdev.dev.
