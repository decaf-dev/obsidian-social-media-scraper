import type { ScrapedItem, SocialMediaScraperSettings } from "src/types";
import { BaseScraper } from "./base-scraper";

export class XScraper extends BaseScraper {
	constructor(settings: SocialMediaScraperSettings, manifestDir: string) {
		super("X", settings, manifestDir);
	}

	async scrape(onProgress?: (progress: number, step?: string) => void): Promise<ScrapedItem[]> {
		try {
			if (onProgress) onProgress(10);

			// Run the Playwright script for X
			const results = await this.runPlaywrightScript(
				"scrape-x.js",
				onProgress
			);

			if (onProgress) onProgress(100);

			return results;
		} catch (error) {
			console.error("Error scraping X:", error);
			throw error;
		}
	}
}
