import { ItemView, WorkspaceLeaf } from "obsidian";
import { SOCIAL_MEDIA_SCRAPER_VIEW } from "src/constants";
import type SocialMediaScraperPlugin from "src/main";
import { mount, unmount } from "svelte";
import SvelteApp from "../svelte/index.svelte";

export default class SocialMediaScraperView extends ItemView {
	svelteApp: ReturnType<typeof mount> | null;
	plugin: SocialMediaScraperPlugin;

	constructor(leaf: WorkspaceLeaf, plugin: SocialMediaScraperPlugin) {
		super(leaf);
		this.svelteApp = null;
		this.plugin = plugin;
		this.navigation = true;
	}

	getIcon(): string {
		return "file-search";
	}

	getViewType(): string {
		return SOCIAL_MEDIA_SCRAPER_VIEW;
	}
	getDisplayText(): string {
		return "Social Media Scraper";
	}

	async onOpen() {
		const { contentEl } = this;
		this.svelteApp = mount(SvelteApp, {
			target: contentEl,
			props: { obsidianApp: this.app },
		});
	}

	async onClose() {
		if (this.svelteApp) {
			unmount(this.svelteApp);
		}
	}
}
