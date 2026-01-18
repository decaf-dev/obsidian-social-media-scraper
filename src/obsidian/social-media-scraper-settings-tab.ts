import { App, PluginSettingTab } from "obsidian";
import type SocialMediaScraper from "src/main";

export default class SocialMediaScraperSettingsTab extends PluginSettingTab {
	plugin: SocialMediaScraper;

	constructor(app: App, plugin: SocialMediaScraper) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
	}
}
