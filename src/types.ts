export type Platform = "X" | "INSTAGRAM" | "THREADS" | "YOUTUBE";
export type BrowserType = "CHROMIUM" | "FIREFOX" | "WEBKIT" | "BRAVE";
export type ScrapeStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

export interface ScrapedItem {
	url: string;
	title: string;
	description: string;
	imageUrl: string;
}

export interface ScrapeJob {
	id: string;
	platform: Platform;
	status: ScrapeStatus;
	progress: number;
	currentStep?: string;
	results: ScrapedItem[];
	error?: string;
}

export interface ReviewItem extends ScrapedItem {
	selected: boolean;
	tags: string[];
}

export interface SocialMediaScraperSettings {
	browser: BrowserType;
	headless: boolean;
	cookies: Record<Platform, string>;
	frontmatterUrlKey: string;
	nodePath: string;
	bravePath: string;
}

export const DEFAULT_SETTINGS: SocialMediaScraperSettings = {
	browser: "CHROMIUM",
	headless: false,
	cookies: {
		X: "",
		INSTAGRAM: "",
		THREADS: "",
		YOUTUBE: "",
	},
	frontmatterUrlKey: "url",
	nodePath: "",
	bravePath: "",
};

import { PLATFORM_URLS } from "./constants";

export const PLATFORM_CONFIG: Record<Platform, { name: string; icon: string; url: string }> = {
	X: {
		name: "X (Twitter)",
		icon: "twitter",
		url: PLATFORM_URLS.X,
	},
	INSTAGRAM: {
		name: "Instagram",
		icon: "instagram",
		url: PLATFORM_URLS.INSTAGRAM,
	},
	THREADS: {
		name: "Threads",
		icon: "at-sign",
		url: PLATFORM_URLS.THREADS,
	},
	YOUTUBE: {
		name: "YouTube",
		icon: "youtube",
		url: PLATFORM_URLS.YOUTUBE,
	},
};
