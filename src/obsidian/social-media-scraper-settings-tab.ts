import { App, PluginSettingTab, Setting } from "obsidian";
import type SocialMediaScraper from "src/main";
import type { BrowserType } from "src/types";

export default class SocialMediaScraperSettingsTab extends PluginSettingTab {
	plugin: SocialMediaScraper;

	constructor(app: App, plugin: SocialMediaScraper) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", { text: "Social Media Scraper Settings" });

		// Browser selection
		new Setting(containerEl)
			.setName("Browser")
			.setDesc("Select which browser to use for scraping")
			.addDropdown((dropdown) =>
				dropdown
					.addOption("CHROMIUM", "Chromium")
					.addOption("FIREFOX", "Firefox")
					.addOption("WEBKIT", "WebKit")
					.addOption("BRAVE", "Brave")
					.setValue(this.plugin.settings.browser)
					.onChange(async (value) => {
						this.plugin.settings.browser = value as BrowserType;
						await this.plugin.saveSettings();
						this.display(); // Refresh to show/hide Brave path
					})
			);

		// Headless mode
		new Setting(containerEl)
			.setName("Headless mode")
			.setDesc("Run browser in headless mode (no visible window)")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.headless)
					.onChange(async (value) => {
						this.plugin.settings.headless = value;
						await this.plugin.saveSettings();
					})
			);

		// Frontmatter URL key
		new Setting(containerEl)
			.setName("Frontmatter URL key")
			.setDesc("The property name to use for URLs in frontmatter")
			.addText((text) =>
				text
					.setPlaceholder("url")
					.setValue(this.plugin.settings.frontmatterUrlKey)
					.onChange(async (value) => {
						this.plugin.settings.frontmatterUrlKey = value || "url";
						await this.plugin.saveSettings();
					})
			);

		// Brave browser path (only show if Brave is selected)
		if (this.plugin.settings.browser === "BRAVE") {
			new Setting(containerEl)
				.setName("Brave browser path")
				.setDesc(
					"Full path to Brave browser executable. " +
					"macOS: /Applications/Brave Browser.app/Contents/MacOS/Brave Browser, " +
					"Linux: /usr/bin/brave-browser, " +
					"Windows: C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe"
				)
				.addText((text) =>
					text
						.setPlaceholder("/Applications/Brave Browser.app/Contents/MacOS/Brave Browser")
						.setValue(this.plugin.settings.bravePath)
						.onChange(async (value) => {
							this.plugin.settings.bravePath = value;
							await this.plugin.saveSettings();
						})
				);
		}

		// Node.js path
		new Setting(containerEl)
			.setName("Node.js path")
			.setDesc(
				"Full path to Node.js executable. Leave empty to auto-detect. " +
				"Find your path by running 'which node' in terminal."
			)
			.addText((text) =>
				text
					.setPlaceholder("/opt/homebrew/bin/node")
					.setValue(this.plugin.settings.nodePath)
					.onChange(async (value) => {
						this.plugin.settings.nodePath = value;
						await this.plugin.saveSettings();
					})
			);

		// Authentication cookies section
		containerEl.createEl("h3", { text: "Authentication Cookies" });
		containerEl.createEl("p", {
			text: "Paste your authentication cookies here to access protected content. Leave empty to log in manually when the browser opens.",
			cls: "setting-item-description",
		});

		// X (Twitter) cookies
		new Setting(containerEl)
			.setName("X (Twitter)")
			.setDesc("Authentication cookie for X.com")
			.addTextArea((text) => {
				text
					.setPlaceholder("auth_token=...")
					.setValue(this.plugin.settings.cookies.X)
					.onChange(async (value) => {
						this.plugin.settings.cookies.X = value;
						await this.plugin.saveSettings();
					});
				text.inputEl.rows = 3;
				text.inputEl.cols = 50;
			});

		// Instagram cookies
		new Setting(containerEl)
			.setName("Instagram")
			.setDesc("Authentication cookie for Instagram")
			.addTextArea((text) => {
				text
					.setPlaceholder("sessionid=...")
					.setValue(this.plugin.settings.cookies.INSTAGRAM)
					.onChange(async (value) => {
						this.plugin.settings.cookies.INSTAGRAM = value;
						await this.plugin.saveSettings();
					});
				text.inputEl.rows = 3;
				text.inputEl.cols = 50;
			});

		// Threads cookies
		new Setting(containerEl)
			.setName("Threads")
			.setDesc("Authentication cookie for Threads")
			.addTextArea((text) => {
				text
					.setPlaceholder("sessionid=...")
					.setValue(this.plugin.settings.cookies.THREADS)
					.onChange(async (value) => {
						this.plugin.settings.cookies.THREADS = value;
						await this.plugin.saveSettings();
					});
				text.inputEl.rows = 3;
				text.inputEl.cols = 50;
			});

		// YouTube cookies
		new Setting(containerEl)
			.setName("YouTube")
			.setDesc("Authentication cookie for YouTube")
			.addTextArea((text) => {
				text
					.setPlaceholder("SID=...")
					.setValue(this.plugin.settings.cookies.YOUTUBE)
					.onChange(async (value) => {
						this.plugin.settings.cookies.YOUTUBE = value;
						await this.plugin.saveSettings();
					});
				text.inputEl.rows = 3;
				text.inputEl.cols = 50;
			});
	}
}
