# Playwright Limitations in Obsidian Plugins

## The Problem

Obsidian plugins run in an Electron environment with limited access to native Node.js modules like Playwright. The main issues are:

1. **Native Binaries** - Playwright includes browser executables that can't be bundled with the plugin
2. **Module Resolution** - Playwright's dependencies can't be resolved in the bundled plugin environment
3. **Complex Dependencies** - Playwright has many native dependencies that don't work in Obsidian's context

**However**, Obsidian plugins CAN:
- Execute system commands via `child_process` (exec, spawn)
- Access Node.js built-in modules
- Run external executables installed on the system

## Current Implementation

The current implementation uses `window.open()` to open URLs in the system's default browser. This is a simple fallback but doesn't provide automated scraping capabilities.

## Alternative Approaches

### Option 1: System Command with Playwright CLI (Feasible!)

Install Playwright globally and call it via system commands:

```bash
# Install Playwright globally
npm install -g playwright
npx playwright install chromium
```

Then in your plugin, use `child_process` to run Playwright scripts:

```typescript
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runPlaywrightScript(scriptPath: string) {
  try {
    const { stdout, stderr } = await execAsync(`node ${scriptPath}`);
    return JSON.parse(stdout);
  } catch (error) {
    console.error('Playwright execution failed:', error);
    throw error;
  }
}
```

**Pros:**
- Works within Obsidian's plugin system
- Full Playwright capabilities
- User controls browser visibility

**Cons:**
- Requires Playwright to be installed globally
- More complex setup for users
- Platform-specific (need to handle Windows/Mac/Linux paths)

### Option 2: Companion Browser Extension

Create a browser extension that:
- Runs in the user's actual browser (Chrome/Firefox)
- Scrapes content from social media sites
- Communicates with the Obsidian plugin via local WebSocket or HTTP

**Pros:**
- Works with authenticated sessions
- Can scrape dynamic content
- Uses user's existing browser cookies

**Cons:**
- Requires separate browser extension installation
- More complex architecture

### Option 2: Local Node.js Server

Create a separate Node.js server that:
- Runs Playwright in a proper Node.js environment
- Exposes an HTTP API for the plugin to call
- Handles browser automation separately

**Pros:**
- Full Playwright capabilities
- Can run headless or visible browsers
- Complete control over scraping

**Cons:**
- Requires users to run a separate server
- More complex setup
- Port management

### Option 3: Manual Workflow

Guide users to:
1. Open the social media site in their browser
2. Manually copy content or use browser DevTools
3. Paste into the plugin for processing

**Pros:**
- Simple, no external dependencies
- Works immediately
- No authentication issues

**Cons:**
- Manual process
- Not automated
- Time-consuming for many items

### Option 4: API-Based Approach

Use official APIs where available:
- Twitter/X API
- YouTube Data API
- Instagram Graph API

**Pros:**
- Reliable and official
- No scraping needed
- Better rate limiting

**Cons:**
- Requires API keys
- Limited to what APIs provide
- May have costs

## Recommended Path Forward

1. **Short-term**: Keep current `window.open()` approach with manual workflow
2. **Medium-term**: Build a companion browser extension
3. **Long-term**: Offer both browser extension and API-based options

## Implementation Notes

If you want to implement Playwright-based scraping, you'll need to:

1. Create a separate Node.js application/server
2. Have the Obsidian plugin communicate with it via HTTP/WebSocket
3. Package both together with clear installation instructions

Example architecture:
```
┌─────────────────┐         HTTP/WS        ┌──────────────────┐
│ Obsidian Plugin │ ◄──────────────────► │ Node.js Server   │
│                 │                        │ (with Playwright)│
└─────────────────┘                        └──────────────────┘
                                                    │
                                                    ▼
                                           ┌──────────────────┐
                                           │ Browser Instance │
                                           │ (Chromium/etc)   │
                                           └──────────────────┘
```
