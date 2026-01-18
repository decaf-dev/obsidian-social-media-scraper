import type { ScrapedItem, SocialMediaScraperSettings } from "src/types";
import { BaseScraper } from "./base-scraper";

export class YouTubeScraper extends BaseScraper {
	constructor(settings: SocialMediaScraperSettings, manifestDir: string) {
		super("YOUTUBE", settings, manifestDir);
	}

	async scrape(onProgress?: (progress: number, step?: string) => void): Promise<ScrapedItem[]> {
		try {
			if (onProgress) onProgress(10);

			const results = await this.runPlaywrightScript(
				"scrape-youtube.js",
				onProgress
			);

			if (onProgress) onProgress(100);

			return results;
		} catch (error) {
			console.error("Error scraping YouTube:", error);
			throw error;
		}
	}
}
