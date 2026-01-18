# Scripts Source

This directory contains the TypeScript source files for the scraper scripts.

## Build Process

The TypeScript files in this directory are compiled to JavaScript and output to the `scripts/` folder.

### Commands

- `npm run build:scripts` - Compile TypeScript scripts to JavaScript
- `npm run dev` - Compile scripts and start development build (with watch mode)
- `npm run build` - Compile scripts and create production build

## Configuration

The scripts are compiled using `tsconfig.scripts.json` which extends the main TypeScript configuration but overrides specific settings:

- **Module**: CommonJS (required for Node.js scripts)
- **Output**: `scripts/` folder
- **Source Maps**: Disabled for cleaner output
- **verbatimModuleSyntax**: Disabled to allow ESM import syntax with CommonJS output

## Shared Constants

The `shared-constants.ts` file contains platform URLs and domains that are shared between:
- The scraper scripts (compiled to CommonJS)
- The main plugin code (via `src/constants.ts`)

This ensures consistency across the codebase - if a platform URL changes, it only needs to be updated in one place.

## Output

Compiled JavaScript files are output to the `scripts/` folder and are:
- Ignored by git (see `.gitignore`)
- Copied to `dist/scripts/` during the plugin build process
- Executable as standalone Node.js scripts

## Scripts

- `scrape-instagram.ts` - Scrapes saved posts from Instagram
- `scrape-threads.ts` - Scrapes saved posts from Threads
- `scrape-x.ts` - Scrapes bookmarks from X (Twitter)
- `scrape-youtube.ts` - Scrapes Watch Later playlist from YouTube
- `shared-constants.ts` - Platform URLs and domains used by all scripts
