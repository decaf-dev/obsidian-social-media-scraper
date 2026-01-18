import { App, Modal } from "obsidian";
import type SocialMediaScraper from "src/main";
import ReviewModalContent from "src/svelte/components/review-modal-content.svelte";
import type { ReviewItem, ScrapeJob } from "src/types";
import { createMarkdownFile } from "src/utils/create-markdown-file";
import { mount, unmount } from "svelte";

export class ReviewModal extends Modal {
	private svelteComponent: ReturnType<typeof mount> | null = null;
	private job: ScrapeJob;
	private plugin: SocialMediaScraper;
	private items: ReviewItem[];
	private isImporting = false;

	constructor(app: App, job: ScrapeJob, plugin: SocialMediaScraper) {
		super(app);
		this.job = job;
		this.plugin = plugin;
		this.items = job.results.map((item) => ({
			...item,
			selected: true,
			tags: [],
		}));
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.addClass("review-modal");

		this.svelteComponent = mount(ReviewModalContent, {
			target: contentEl,
			props: {
				initialItems: this.items,
				onImport: (items: ReviewItem[]) => this.handleImport(items),
				isImporting: this.isImporting,
			},
		});

		// Apply modal styling
		const modalEl = contentEl.closest(".modal") as HTMLElement;
		if (modalEl) {
			modalEl.style.width = "800px";
			modalEl.style.maxWidth = "90vw";
			modalEl.style.height = "80vh";
		}

		const modalContentEl = contentEl.closest(".modal-content") as HTMLElement;
		if (modalContentEl) {
			modalContentEl.style.height = "100%";
			modalContentEl.style.display = "flex";
			modalContentEl.style.flexDirection = "column";
		}
	}

	async handleImport(items: ReviewItem[]) {
		this.isImporting = true;

		const selectedItems = items.filter((item) => item.selected);
		console.log("Importing items:", selectedItems.map(item => ({
			title: item.title,
			tags: item.tags,
			tagsLength: item.tags?.length || 0,
		})));
		
		let successCount = 0;
		let failedCount = 0;
		const failedItems: string[] = [];

		try {
			for (const item of selectedItems) {
				try {
					await createMarkdownFile(
						this.app,
						item,
						this.plugin.settings.frontmatterUrlKey
					);
					successCount++;
				} catch (error) {
					failedCount++;
					failedItems.push(item.title);
					const errorMessage = error instanceof Error ? error.message : String(error);
					console.log(`Failed to import "${item.title}": ${errorMessage}`);
					// @ts-ignore - Notice is available in Obsidian API
					new Notice(`Skipped: ${item.title} (file already exists)`);
				}
			}

			// Show summary notification
			if (successCount > 0 && failedCount === 0) {
				// @ts-ignore - Notice is available in Obsidian API
				new Notice(`Successfully imported ${successCount} item(s)`);
			} else if (successCount > 0 && failedCount > 0) {
				// @ts-ignore - Notice is available in Obsidian API
				new Notice(`Imported ${successCount} item(s), skipped ${failedCount} duplicate(s)`);
			} else if (failedCount > 0) {
				// @ts-ignore - Notice is available in Obsidian API
				new Notice(`All ${failedCount} item(s) were skipped (files already exist)`);
			}

			this.close();
		} catch (error) {
			console.error("Error importing items:", error);
			const errorMessage = error instanceof Error ? error.message : String(error);
			// @ts-ignore - Notice is available in Obsidian API
			new Notice(`Error importing items: ${errorMessage}`);
		} finally {
			this.isImporting = false;
		}
	}

	onClose() {
		if (this.svelteComponent) {
			unmount(this.svelteComponent);
		}
		const { contentEl } = this;
		contentEl.empty();
	}
}
