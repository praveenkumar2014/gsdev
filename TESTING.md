# Testing Guide for GSDEV (Electron Desktop App)

## Important Clarification

**GSDEV is an Electron desktop application**, not a mobile app. Therefore:
- ❌ **Mobile emulators (Android/iOS)** do not apply to this project
- ❌ **Elementor** is a WordPress page builder plugin, not relevant here
- ✅ **Desktop testing** is the correct approach

## Testing Stack

### 1. Unit Testing (Vitest)
- **Purpose**: Test React components, TypeScript logic, utilities
- **Tool**: Vitest with @testing-library/react
- **Config**: `vitest.config.ts`

**Run tests:**
```bash
bun run test              # Run all unit tests
bun run test:ui           # Run with UI interface
bun run test:coverage     # Run with coverage report
```

**Test location:** `src/**/*.{test,spec}.{ts,tsx}`

### 2. E2E Testing (Playwright)
- **Purpose**: Test the Electron app as a whole
- **Tool**: Playwright with Electron support
- **Config**: `playwright.config.ts`

**Run tests:**
```bash
bun run test:e2e          # Run E2E tests
bun run test:e2e:ui       # Run with UI interface
```

**Test location:** `src/test/e2e/*.spec.ts`

### 3. Manual Testing

#### IDE Testing
- Use the built-in DevTools (press F12 in development)
- Inspect React components with React DevTools browser extension
- Test in your IDE by running `bun run dev`

#### Browser Testing
- The renderer process uses web technologies (React)
- Test responsive design by resizing the Electron window
- Minimum window size: 500x600px (configured in main.ts)

## Platform Testing

### macOS
```bash
bun run dev               # Development mode
bun run package:mac       # Build for macOS
```

### Windows
```bash
bun run package:win       # Build for Windows
```

### Linux
```bash
bun run package:linux     # Build for Linux
```

## Writing Tests

### Unit Test Example
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### E2E Test Example
```typescript
import { test, expect } from '@playwright/test'
import { _electron as electron } from 'playwright'

test('app launches', async () => {
  const app = await electron.launch({ args: ['.'] })
  const window = await app.firstWindow()
  expect(await window.title()).toBe('GSDEV')
  await app.close()
})
```

## Coverage Target
- Aim for 80% code coverage
- Focus on critical business logic
- Test user-facing components

## Continuous Integration
- Tests run automatically on CI
- Failing tests block merges
- Coverage reports generated on each run
