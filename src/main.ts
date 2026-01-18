import {
	Plugin
} from "obsidian";
import { SOCIAL_MEDIA_SCRAPER_VIEW } from "./constants";
import SocialMediaScraperSettingsTab from "./obsidian/social-media-scraper-settings-tab";
import SocialMediaScraperView from "./obsidian/social-media-scraper-view";
import type { SocialMediaScraperSettings } from "./types";
import { DEFAULT_SETTINGS } from "./types";

export default class SocialMediaScraper extends Plugin {
	settings: SocialMediaScraperSettings = DEFAULT_SETTINGS;

	async onload() {
		await this.loadSettings();

		this.registerView(
			SOCIAL_MEDIA_SCRAPER_VIEW,
			(leaf) => new SocialMediaScraperView(leaf, this)
		);

		this.addCommand({
			id: "open",
			name: "Open social media scraper",
			callback: async () => {
				this.openScraperView();
			},
		});

		this.addRibbonIcon("file-search", "Open social media scraper", async () => {
			this.openScraperView();
		});

		this.addSettingTab(new SocialMediaScraperSettingsTab(this.app, this));
	}

	private openScraperView() {
		const leaves = this.app.workspace.getLeavesOfType(
			SOCIAL_MEDIA_SCRAPER_VIEW
		);
		if (leaves.length !== 0) {
			const leaf = leaves[0];
			this.app.workspace.revealLeaf(leaf);
		} else {
			this.app.workspace.getLeaf("tab").setViewState({
				type: SOCIAL_MEDIA_SCRAPER_VIEW,
				active: true,
			});
		}
	}

	onunload() { }

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
