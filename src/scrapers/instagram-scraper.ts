import type { ScrapedItem, SocialMediaScraperSettings } from "src/types";
import { BaseScraper } from "./base-scraper";

export class InstagramScraper extends BaseScraper {
	constructor(settings: SocialMediaScraperSettings, manifestDir: string) {
		super("INSTAGRAM", settings, manifestDir);
	}

	async scrape(onProgress?: (progress: number, step?: string) => void): Promise<ScrapedItem[]> {
		try {
			if (onProgress) onProgress(10);

			const results = await this.runPlaywrightScript(
				"scrape-instagram.js",
				onProgress
			);

			if (onProgress) onProgress(100);

			return results;
		} catch (error) {
			console.error("Error scraping Instagram:", error);
			throw error;
		}
	}
}
