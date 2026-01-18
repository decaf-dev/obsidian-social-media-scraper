/**
 * Shared constants between scraper scripts and the main plugin
 * This file is compiled separately for use in Node.js scripts
 */

export const PLATFORM_URLS = {
	X: 'https://x.com/i/bookmarks',
	INSTAGRAM: 'https://www.instagram.com/your_activity/saved',
	THREADS: 'https://www.threads.net/saved',
	YOUTUBE: 'https://www.youtube.com/playlist?list=WL',
} as const;

export const PLATFORM_DOMAINS = {
	X: '.x.com',
	INSTAGRAM: '.instagram.com',
	THREADS: '.threads.net',
	YOUTUBE: '.youtube.com',
} as const;

export const PROGRESS_STEPS = {
	INITIALIZING: 'Initializing browser',
	BROWSER_LAUNCHED: 'Browser launched',
	ADDING_COOKIES: 'Adding authentication cookies',
	NAVIGATING: 'Navigating to page',
	LOADING_CONTENT: 'Loading content',
	SCRAPING_DATA: 'Scraping data',
	FINALIZING: 'Finalizing results',
	COMPLETE: 'Complete',
} as const;

export type Platform = keyof typeof PLATFORM_URLS;
