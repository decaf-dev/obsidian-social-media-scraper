<script lang="ts">
	import { type App, FileSystemAdapter } from "obsidian";
	import * as path from "path";
	import type SocialMediaScraper from "src/main";
	import type { Platform, ScrapeJob } from "src/types";
	import InProgressSection from "./components/in-progress-section.svelte";
	import ReadyForReview from "./components/ready-for-review.svelte";
	import ScrapeSection from "./components/scrape-section.svelte";

	interface AppProps {
		obsidianApp: App;
		plugin: SocialMediaScraper;
	}

	let { obsidianApp, plugin }: AppProps = $props();

	let selectedPlatform = $state<Platform | null>(null);
	let jobs = $state<ScrapeJob[]>([]);
	let scraperInstances = new Map<string, any>();

	function handleSelectPlatform(platform: Platform) {
		selectedPlatform = platform;
	}

	async function handleScrape() {
		if (!selectedPlatform) return;

		const newJob: ScrapeJob = {
			id: Date.now().toString(),
			platform: selectedPlatform,
			status: "IN_PROGRESS",
			progress: 0,
			currentStep: undefined,
			results: [],
		};

		jobs = [...jobs, newJob];

		try {
			// Dynamic import of the scraper
			let scraper;
			// Construct absolute path to plugin directory
			const adapter = obsidianApp.vault.adapter as FileSystemAdapter;
			const vaultPath = adapter.getBasePath();
			const manifestDir = path.join(vaultPath, plugin.manifest.dir || "");

			switch (selectedPlatform) {
				case "X":
					const { XScraper } = await import("src/scrapers/x-scraper");
					scraper = new XScraper(plugin.settings, manifestDir);
					break;
				case "INSTAGRAM":
					const { InstagramScraper } = await import(
						"src/scrapers/instagram-scraper"
					);
					scraper = new InstagramScraper(
						plugin.settings,
						manifestDir,
					);
					break;
				case "THREADS":
					const { ThreadsScraper } = await import(
						"src/scrapers/threads-scraper"
					);
					scraper = new ThreadsScraper(plugin.settings, manifestDir);
					break;
				case "YOUTUBE":
					const { YouTubeScraper } = await import(
						"src/scrapers/youtube-scraper"
					);
					scraper = new YouTubeScraper(plugin.settings, manifestDir);
					break;
			}

			// Store the scraper instance
			scraperInstances.set(newJob.id, scraper);

			const results = await scraper.scrape((progress, step) => {
				jobs = jobs.map((job) =>
					job.id === newJob.id
						? { ...job, progress, currentStep: step }
						: job,
				);
			});

			jobs = jobs.map((job) =>
				job.id === newJob.id
					? { ...job, status: "COMPLETED", progress: 100, results }
					: job,
			);

			// Clean up scraper instance
			scraperInstances.delete(newJob.id);
		} catch (error) {
			console.error("Scraping error:", error);
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			jobs = jobs.map((job) =>
				job.id === newJob.id
					? { ...job, status: "FAILED", error: errorMessage }
					: job,
			);

			// Clean up scraper instance
			scraperInstances.delete(newJob.id);
		}
	}

	async function handleCancel(jobId: string) {
		const scraper = scraperInstances.get(jobId);
		if (scraper) {
			await scraper.cancel();
			scraperInstances.delete(jobId);

			// Update job status
			jobs = jobs.map((job) =>
				job.id === jobId
					? { ...job, status: "FAILED", error: "Cancelled by user" }
					: job,
			);
		}
	}

	async function handleReview(job: ScrapeJob) {
		const { ReviewModal } = await import("src/obsidian/review-modal");
		const modal = new ReviewModal(obsidianApp, job, plugin);
		modal.open();
	}
</script>

<div class="social-media-scraper">
	<ScrapeSection
		{selectedPlatform}
		onSelectPlatform={handleSelectPlatform}
		onScrape={handleScrape}
	/>
	<InProgressSection {jobs} onCancel={handleCancel} />
	<ReadyForReview {jobs} onReview={handleReview} />
</div>

<style>
	.social-media-scraper {
		height: 100%;
		overflow-y: auto;
	}
</style>
