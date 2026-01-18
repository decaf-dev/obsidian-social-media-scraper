#!/usr/bin/env node

/**
 * X (Twitter) Bookmarks Scraper
 * 
 * This script uses Playwright to scrape bookmarks from X.com
 * 
 * Arguments:
 *   --headless <true|false>  Run browser in headless mode
 *   --browser <chromium|firefox|webkit>  Browser to use
 *   --cookies <string>  Cookie string for authentication
 */

import type { Browser, BrowserType } from 'playwright';
import { chromium, firefox, webkit } from 'playwright';
import { PLATFORM_DOMAINS, PLATFORM_URLS, PROGRESS_STEPS } from './shared-constants';

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

// Helper to report progress
function reportProgress(percent: number, step: string): void {
	console.error(`PROGRESS:${percent}:${step}`);
}

// Helper to parse cookies
function parseCookies(cookieString: string | null): Cookie[] {
	if (!cookieString) return [];

	return cookieString.split(';').map(cookie => {
		const [name, value] = cookie.trim().split('=');
		return {
			name: name.trim(),
			value: value.trim(),
			domain: PLATFORM_DOMAINS.X,
			path: '/',
		};
	});
}

async function scrapeXBookmarks(): Promise<void> {
	let browser: Browser | undefined;

	try {
		reportProgress(10, PROGRESS_STEPS.INITIALIZING);

		// Select browser type
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

		// Create context
		const context = await browser.newContext();

		// Add cookies if provided
		if (config.cookies) {
			const cookies = parseCookies(config.cookies);
			await context.addCookies(cookies);
		}

		reportProgress(30, PROGRESS_STEPS.ADDING_COOKIES);

		// Create page and navigate
		const page = await context.newPage();
		await page.goto(PLATFORM_URLS.X, {
			waitUntil: 'domcontentloaded',
			timeout: 60000,
		});

		reportProgress(50, PROGRESS_STEPS.NAVIGATING);

		// Wait for bookmarks to load
		console.error('[X Scraper] Waiting for tweets to load...');
		try {
			await page.waitForSelector('[data-testid="tweet"]', { timeout: 10000 });
			const initialCount = await page.evaluate(() => document.querySelectorAll('[data-testid="cellInnerDiv"]').length);
			console.error(`[X Scraper] Initial tweets found: ${initialCount}`);
		} catch (e) {
			console.error('[X Scraper] No bookmarks found or page not loaded properly');
		}

		// Scroll to load more bookmarks
		console.error('[X Scraper] Starting scroll to load more tweets...');
		let previousHeight = 0;
		let scrollAttempts = 0;
		const maxScrollAttempts = 5;

		while (scrollAttempts < maxScrollAttempts) {
			const currentHeight = await page.evaluate(() => document.body.scrollHeight);

			if (currentHeight === previousHeight) {
				console.error(`[X Scraper] Scroll ${scrollAttempts + 1}: No new content, stopping scroll`);
				break;
			}

			// Add random offset to scroll height to make it more human-like
			const randomOffset = Math.floor(Math.random() * 200) - 100; // Random offset between -100 and 100
			const scrollTarget = currentHeight + randomOffset;
			console.error(`[X Scraper] Scroll ${scrollAttempts + 1}/${maxScrollAttempts}: Scrolling to ${scrollTarget}px (offset: ${randomOffset}px)`);
			await page.evaluate((target) => window.scrollTo(0, target), scrollTarget);
			await page.waitForTimeout(2000);

			const currentCount = await page.evaluate(() => document.querySelectorAll('[data-testid="cellInnerDiv"]').length);
			console.error(`[X Scraper] Scroll ${scrollAttempts + 1}: Now have ${currentCount} tweets`);

			previousHeight = currentHeight;
			scrollAttempts++;
		}

		console.error('[X Scraper] Scrolling complete');
		reportProgress(70, PROGRESS_STEPS.LOADING_CONTENT);

		// Scrape bookmarks (limit to 20)
		console.error('[X Scraper] Starting to scrape bookmarks...');
		const results = await page.evaluate(() => {
			// Get all cellInnerDiv containers that contain tweets
			const cells = document.querySelectorAll('[data-testid="cellInnerDiv"]');
			console.error(`[X Scraper] Total cells found: ${cells.length}`);
			const maxTweets = 20;
			const cellsToProcess = Array.from(cells).slice(0, maxTweets);
			console.error(`[X Scraper] Processing ${cellsToProcess.length} cells`);

			const tweets = cellsToProcess.map(cell => {
				// Find the tweet article within the cell
				const tweet = cell.querySelector('[data-testid="tweet"]');
				if (!tweet) {
					console.error('[X Scraper] Cell without tweet found, skipping');
					return null;
				}

				// Get tweet text
				const textEl = tweet.querySelector('[data-testid="tweetText"]');
				const text = textEl ? textEl.textContent || '' : '';

				// Get tweet URL from the time element's parent link
				const timeLink = tweet.querySelector('a[href*="/status/"]');
				const tweetUrl = timeLink ? `https://x.com${timeLink.getAttribute('href')}` : '';

				// Get author info
				const userNameEl = tweet.querySelector('[data-testid="User-Name"]');
				let author = '';
				let handle = '';

				if (userNameEl) {
					const nameSpans = userNameEl.querySelectorAll('span');
					if (nameSpans.length > 0) {
						author = nameSpans[0].textContent || '';
					}
					const handleLink = userNameEl.querySelector('a[role="link"]');
					if (handleLink) {
						const href = handleLink.getAttribute('href');
						if (href) {
							handle = href.replace('/', '');
						}
					}
				}

				// Get images
				const images: string[] = [];
				const imageEls = tweet.querySelectorAll('[data-testid="tweetPhoto"] img, img[src*="pbs.twimg.com"]');
				imageEls.forEach(img => {
					const src = img.getAttribute('src');
					if (src && src.includes('pbs.twimg.com') && !src.includes('profile_images')) {
						images.push(src);
					}
				});

				// Get video thumbnail if present
				const videoEl = tweet.querySelector('[data-testid="videoPlayer"] img');
				if (videoEl) {
					const src = videoEl.getAttribute('src');
					if (src && src.includes('pbs.twimg.com')) {
						images.push(src);
					}
				}

				// Get engagement metrics
				const replyCount = tweet.querySelector('[data-testid="reply"]')?.textContent?.trim() || '0';
				const retweetCount = tweet.querySelector('[data-testid="retweet"]')?.textContent?.trim() || '0';
				const likeCount = tweet.querySelector('[data-testid="like"]')?.textContent?.trim() || '0';

				// Create title from text (first 100 chars)
				const title = text;

				return {
					url: tweetUrl,
					title: title || 'Untitled Tweet',
					description: text,
					author: author,
					handle: handle,
					imageUrl: images.length > 0 ? images[0] : '',
					images: images,
					replies: replyCount,
					retweets: retweetCount,
					likes: likeCount,
				};
			});

			const validTweets = tweets.filter(tweet => tweet && tweet.url);
			console.error(`[X Scraper] Successfully scraped ${validTweets.length} valid tweets`);
			return validTweets;
		});

		reportProgress(90, PROGRESS_STEPS.SCRAPING_DATA);

		console.error(`[X Scraper] Final result: ${results.length} tweets to return`);

		// Close browser
		await browser.close();

		reportProgress(100, PROGRESS_STEPS.COMPLETE);

		// Output results as JSON
		console.log(JSON.stringify(results));

	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		console.error('Error scraping X bookmarks:', errorMessage);
		if (browser) {
			await browser.close();
		}
		process.exit(1);
	}
}

// Run the scraper
scrapeXBookmarks();
