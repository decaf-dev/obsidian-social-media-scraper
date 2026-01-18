# Obsidian Social Media Scraper

A powerful [Obsidian](https://obsidian.md) plugin that helps you scrape and import content from social media platforms (X/Twitter, Instagram, Threads, YouTube) directly into your vault as markdown files with frontmatter.

---

### ✨ Features

-   🌐 **Multi-Platform Support** – Scrape content from X (Twitter), Instagram, Threads, and YouTube
-   🎭 **Browser Automation** – Uses Playwright to automate browser interactions
-   🦁 **Brave Browser Support** – Use Brave for enhanced privacy and ad-blocking
-   🔐 **Authentication Support** – Store cookies for authenticated scraping or log in manually
-   ✏️ **Review & Edit** – Review scraped content in a full-width modal before importing
-   🏷️ **Custom Tags** – Add tags to each item during review
-   📝 **Markdown Export** – Creates markdown files with customizable frontmatter
-   ⚙️ **Configurable** – Choose browser type (Chromium, Firefox, WebKit, Brave), headless mode, and frontmatter structure
-   🎨 **Modern UI** – Built with Svelte 5 for a reactive, beautiful interface

---

### ✅ Requirements

Before you begin, make sure you have the following installed:

-   [**Bun**](https://bun.sh/) – required for dependency management and running build scripts
-   **Node.js v22** _(suggested)_ – for optimal compatibility with modern APIs and tooling

You can verify your environment with:

```bash
bun --version
node --version
```

---

### 📦 Installation

#### Prerequisites

**Required:**
- Node.js (v18 or higher) or Bun
- Playwright (installed globally)

**Install Playwright globally:**

With Bun (recommended):
```bash
bun install -g playwright
bunx playwright install chromium  # or firefox, webkit
```

Or with npm:
```bash
npm install -g playwright
npx playwright install chromium  # or firefox, webkit
```

#### Development Setup

1. Clone this repository
2. Install dependencies:
    ```bash
    bun install
    ```
3. Build the plugin:
    ```bash
    bun run dev
    ```
4. Create a symbolic link to your Obsidian vault:
    ```bash
    ln -s /path/to/obsidian-social-media-scraper/dist /path/to/your/vault/.obsidian/plugins/social-media-scraper
    ```
5. Open Obsidian, go to **Settings** → **Community Plugins** and enable **Social Media Scraper**

---

### 🚀 Usage

#### 1. Configure Settings

Go to **Settings** → **Social Media Scraper** and configure:

- **Browser**: Choose Chromium, Firefox, WebKit, or Brave
- **Brave Path**: If using Brave, specify the path to the Brave executable (see [BRAVE-SETUP.md](BRAVE-SETUP.md))
- **Headless Mode**: Toggle whether the browser runs visibly or in the background
- **Authentication Cookies**: Paste cookies for each platform (optional - you can log in manually if not provided)
- **Frontmatter URL Key**: Customize the property name for URLs in frontmatter (default: `url`)

#### 2. Open the Scraper

- Click the ribbon icon (file-search)
- Or use the command palette: **Open social media scraper**

#### 3. Scrape Content

1. Select a platform (X, Instagram, Threads, or YouTube)
2. Click **Scrape**
3. The browser will open to the configured URL
4. Wait for scraping to complete (progress shown in "In Progress" section)

#### 4. Review & Import

1. When scraping completes, click the job in "Ready for Review"
2. A full-width modal opens showing all scraped items
3. For each item:
   - Toggle the checkbox to include/exclude
   - Edit the title and description
   - Add tags (comma-separated)
4. Click **Import** to create markdown files in your vault root

---

### 📝 Output Format

Each imported item creates a markdown file with this structure:

```markdown
---
url: https://x.com/user/status/123456
tags:
  - imported
  - twitter
---

# Tweet Title

Description of the content...

![](https://image-url.jpg)
```

---

### 🔧 Technical Details

**Architecture:**
- **Frontend**: Svelte 5 with reactive state management
- **Browser Automation**: Playwright via Node.js `spawn` (external scripts)
- **Script Execution**: Standalone JavaScript files in `scripts/` folder
- **File Structure**: Kebab-case for files, PascalCase for types, SCREAMING_SNAKE_CASE for string literals
- **Type Safety**: Full TypeScript support with strict mode

**How It Works:**
1. Plugin spawns Node.js processes to run Playwright scripts
2. Scripts are located in `dist/scripts/` folder
3. Progress updates via stderr (`PROGRESS:XX`)
4. Results returned via stdout (JSON)
5. Scripts can be customized for specific scraping needs

**Current Limitations:**
- Requires Playwright installed globally on user's system
- DOM scraping selectors need to be implemented for each platform
- Files are created in vault root
- Basic cookie parsing (may need enhancement)

### 🔁 Setting Up GitHub Releases

To automatically generate plugin bundles when tagging a new release:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Actions** → **General**
3. Under **Workflow permissions**, select:  
   ✅ **Read and write permissions**
4. Click **Save** to apply changes

    Now, to trigger a release, simply tag a version:

    ```bash
    git tag 1.1.0
    git push 1.1.0
    ```

    This will run the `release.yml` workflow and generate your plugin build in the release assets.
