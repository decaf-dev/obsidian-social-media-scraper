# Scripts TypeScript Migration

## Overview

The scripts folder has been migrated to use TypeScript while maintaining a separate build process from the main Obsidian plugin.

## Structure

```
obsidian-social-media-scraper/
├── scripts-src/           # TypeScript source files
│   ├── scrape-instagram.ts
│   ├── scrape-threads.ts
│   ├── scrape-x.ts
│   ├── scrape-youtube.ts
│   └── README.md
├── scripts/               # Compiled JavaScript (git-ignored)
│   ├── scrape-instagram.js
│   ├── scrape-threads.js
│   ├── scrape-x.js
│   └── scrape-youtube.js
├── tsconfig.scripts.json  # TypeScript config for scripts
└── tsconfig.json          # TypeScript config for plugin
```

## Build Process

### Separate Compilation

The scripts are compiled separately from the Obsidian plugin using `tsconfig.scripts.json`:

- **Target**: ES2020 (modern Node.js)
- **Module**: CommonJS (required for Node.js scripts)
- **Output**: `scripts/` folder
- **Source**: `scripts-src/` folder

### Build Commands

```bash
# Compile scripts only
npm run build:scripts

# Development build (compiles scripts + watches plugin)
npm run dev

# Production build (compiles scripts + builds plugin)
npm run build
```

### Integration

The build process is integrated into the main build pipeline:

1. `npm run build:scripts` compiles TypeScript to JavaScript
2. Compiled `.js` files are output to `scripts/` folder
3. The esbuild config copies compiled scripts to `dist/scripts/`
4. The Obsidian plugin uses the scripts from `dist/scripts/`

## Benefits

1. **Type Safety**: Full TypeScript type checking for scraper scripts
2. **Better IDE Support**: IntelliSense, autocomplete, and refactoring
3. **Separate Builds**: Scripts compile independently from the plugin
4. **Clean Git History**: Compiled `.js` files are git-ignored
5. **Maintainability**: Easier to maintain and refactor with types

## Configuration Details

### tsconfig.scripts.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "node",
    "outDir": "./scripts",
    "rootDir": "./scripts-src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "types": ["node"]
  },
  "include": ["scripts-src/**/*"],
  "exclude": ["node_modules"]
}
```

### .gitignore

Added to ignore compiled scripts:

```
# Compiled scripts (TypeScript compiles from scripts-src to scripts)
scripts/*.js
```

## Type Improvements

The TypeScript migration adds:

- **Interface definitions** for Config and Cookie types
- **Type annotations** for all function parameters and return types
- **Type-safe imports** using `import type` for type-only imports
- **Better error handling** with typed error objects

## Example

### Before (JavaScript)

```javascript
const { chromium, firefox, webkit } = require('playwright');

async function scrapeYouTube() {
  let browser;
  // ...
}
```

### After (TypeScript)

```typescript
import { chromium, firefox, webkit } from 'playwright';
import type { Browser, BrowserType } from 'playwright';

interface Config {
  headless: boolean;
  browser: string;
  cookies: string | null;
}

async function scrapeYouTube(): Promise<void> {
  let browser: Browser | undefined;
  // ...
}
```

## Development Workflow

1. Edit TypeScript files in `scripts-src/`
2. Run `npm run build:scripts` to compile
3. Test the compiled scripts
4. Commit only the TypeScript source files (`.ts`)
5. Compiled `.js` files are automatically generated during build

## Notes

- The shebang (`#!/usr/bin/env node`) is preserved in compiled files
- Scripts remain executable after compilation
- The build process is integrated into both dev and production builds
- No changes needed to how the Obsidian plugin calls the scripts
