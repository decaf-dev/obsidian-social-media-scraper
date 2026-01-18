import type { ScrapedItem, SocialMediaScraperSettings } from "src/types";
import { BaseScraper } from "./base-scraper";

export class ThreadsScraper extends BaseScraper {
	constructor(settings: SocialMediaScraperSettings, manifestDir: string) {
		super("THREADS", settings, manifestDir);
	}

	async scrape(onProgress?: (progress: number, step?: string) => void): Promise<ScrapedItem[]> {
		try {
			if (onProgress) onProgress(10);

			const results = await this.runPlaywrightScript(
				"scrape-threads.js",
				onProgress
			);

			if (onProgress) onProgress(100);

			return results;
		} catch (error) {
			console.error("Error scraping Threads:", error);
			throw error;
		}
	}
}
