import {
	Plugin
} from "obsidian";
import { SOCIAL_MEDIA_SCRAPER_VIEW } from "./constants";
import SocialMediaScraperView from "./obsidian/social-media-scraper-view";

interface SocialMediaScraperSettings {
}

const DEFAULT_SETTINGS: SocialMediaScraperSettings = {
};

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

		// TODO add when needed
		// this.addSettingTab(new SocialMediaScraperSettingsTab(this.app, this));
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
