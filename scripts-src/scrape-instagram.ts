#!/usr/bin/env node

/**
 * Instagram Saved Posts Scraper
 * 
 * This script uses Playwright to scrape saved posts from Instagram
 */

import { chromium, firefox, webkit } from 'playwright';
import type { Browser, BrowserType } from 'playwright';
import { PLATFORM_URLS, PLATFORM_DOMAINS, PROGRESS_STEPS } from './shared-constants';

interface Config {
	headless: boolean;
	browser: string;
	cookies: string | null;
	bravePath: string | null;
}

interface Cookie {
	name: string;
	value: string;
	domain: string;
	path: string;
}

// Parse command line arguments
const args = process.argv.slice(2);
const config: Config = {
	headless: false,
	browser: 'chromium',
	cookies: null,
	bravePath: null,
};

for (let i = 0; i < args.length; i += 2) {
	const key = args[i].replace('--', '');
	const value = args[i + 1];
	
	if (key === 'headless') {
		config.headless = value === 'true';
	} else if (key === 'browser') {
		config.browser = value.toLowerCase();
	} else if (key === 'cookies') {
		config.cookies = value;
	} else if (key === 'bravePath') {
		config.bravePath = value;
	}
}

function reportProgress(percent: number, step: string): void {
	console.error(`PROGRESS:${percent}:${step}`);
}

function parseCookies(cookieString: string | null): Cookie[] {
	if (!cookieString) return [];
	
	return cookieString.split(';').map(cookie => {
		const [name, value] = cookie.trim().split('=');
		return {
			name: name.trim(),
			value: value.trim(),
			domain: PLATFORM_DOMAINS.INSTAGRAM,
			path: '/',
		};
	});
}

async function scrapeInstagram(): Promise<void> {
	let browser: Browser | undefined;
	
	try {
		reportProgress(10, PROGRESS_STEPS.INITIALIZING);
		
		const browserType: BrowserType = config.browser === 'firefox' ? firefox :
		                    config.browser === 'webkit' ? webkit :
		                    chromium;
		
		// Launch browser with Brave support
		const launchOptions: any = {
			headless: config.headless,
		};
		
		// If using Brave, set the executable path
		if (config.browser === 'brave' && config.bravePath) {
			launchOptions.executablePath = config.bravePath;
		}
		
		browser = await browserType.launch(launchOptions);
		
		reportProgress(20, PROGRESS_STEPS.BROWSER_LAUNCHED);
		
		const context = await browser.newContext();
		
		if (config.cookies) {
			const cookies = parseCookies(config.cookies);
			await context.addCookies(cookies);
		}
		
		reportProgress(30, PROGRESS_STEPS.ADDING_COOKIES);
		
		const page = await context.newPage();
		await page.goto(PLATFORM_URLS.INSTAGRAM, {
			waitUntil: 'networkidle',
			timeout: 60000,
		});
		
		reportProgress(50, PROGRESS_STEPS.NAVIGATING);
		
		await page.waitForTimeout(3000);
		
		reportProgress(70, PROGRESS_STEPS.LOADING_CONTENT);
		
		// TODO: Implement Instagram scraping logic
		const results: any[] = [];
		
		reportProgress(90, PROGRESS_STEPS.SCRAPING_DATA);
		
		await browser.close();
		
		reportProgress(100, PROGRESS_STEPS.COMPLETE);
		
		console.log(JSON.stringify(results));
		
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		console.error('Error scraping Instagram:', errorMessage);
		if (browser) {
			await browser.close();
		}
		process.exit(1);
	}
}

scrapeInstagram();
