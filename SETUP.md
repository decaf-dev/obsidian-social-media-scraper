# Setup Guide

## Prerequisites

Before using this plugin, you need to install Playwright globally on your system.

### Step 1: Install Node.js or Bun

**Option A: Bun (recommended, faster)**

Install Bun from [bun.sh](https://bun.sh/):

```bash
curl -fsSL https://bun.sh/install | bash
bun --version
```

**Option B: Node.js**

Make sure you have Node.js v18 or higher:

```bash
node --version
```

If not installed, download from [nodejs.org](https://nodejs.org/)

### Step 2: Install Playwright Globally

**With Bun:**
```bash
bun install -g playwright
```

**With npm:**
```bash
npm install -g playwright
```

### Step 3: Install Browser Binaries

Install the browser(s) you want to use:

**With Bun:**
```bash
# Install Chromium (recommended)
bunx playwright install chromium

# Or install all browsers
bunx playwright install
```

**With npm:**
```bash
# Install Chromium (recommended)
npx playwright install chromium

# Or install all browsers
npx playwright install
```

### Step 4: Verify Installation

Test that Playwright is working:

**With Bun:**
```bash
bun -e "const { chromium } = require('playwright'); chromium.launch().then(b => b.close())"
```

**With Node:**
```bash
node -e "const { chromium } = require('playwright'); chromium.launch().then(b => b.close())"
```

If this runs without errors, you're ready to use the plugin!

## Plugin Installation

1. Build the plugin: `bun run dev`
2. Copy or symlink the `dist` folder to your vault's `.obsidian/plugins/social-media-scraper`
3. Enable the plugin in Obsidian settings

## Configuration

### Browser Settings

Go to **Settings** → **Social Media Scraper**:

- **Browser**: Choose Chromium, Firefox, or WebKit
- **Headless Mode**: Toggle to run browser invisibly
- **Frontmatter URL Key**: Customize the property name for URLs

### Authentication Cookies

For each platform, you can paste authentication cookies to scrape authenticated content:

1. Open the platform in your browser
2. Log in to your account
3. Open browser DevTools (F12)
4. Go to Application/Storage → Cookies
5. Copy the relevant cookie values
6. Paste into the plugin settings

**Example for X (Twitter):**
- Cookie name: `auth_token`
- Format: `auth_token=your_token_value_here`

## Troubleshooting

### "Node.js not found" Error

- Ensure Node.js is installed and in your system PATH
- Restart Obsidian after installing Node.js

### "Cannot find module 'playwright'" Error

**With Bun:**
- Run `bun install -g playwright`
- Verify with `bun pm ls -g`

**With npm:**
- Run `npm install -g playwright`
- Verify with `npm list -g playwright`

### Browser Doesn't Launch

**With Bun:**
- Run `bunx playwright install` to download browser binaries

**With npm:**
- Run `npx playwright install` to download browser binaries

Check that you have sufficient disk space (~500MB per browser)

### Scripts Not Found

- Ensure the `scripts` folder exists in your plugin directory
- Rebuild the plugin: `bun run build`

## Customizing Scraper Scripts

The scraper scripts are located in `dist/scripts/`. You can modify them to:

- Change scraping selectors
- Add pagination
- Filter results
- Handle dynamic content

Each script accepts these arguments:
- `--headless <true|false>`: Run browser in headless mode
- `--browser <chromium|firefox|webkit>`: Browser to use
- `--cookies <string>`: Cookie string for authentication

Example script structure:

```javascript
// Report progress (0-100)
console.error('PROGRESS:50');

// Return results as JSON
console.log(JSON.stringify(results));
```

## Next Steps

1. Configure your authentication cookies in settings
2. Select a platform and click "Scrape"
3. Review the scraped items
4. Import selected items to your vault

For more details, see the [README](README.md) and [PLAYWRIGHT-ALTERNATIVES](PLAYWRIGHT-ALTERNATIVES.md).
