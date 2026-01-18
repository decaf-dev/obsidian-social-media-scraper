<script lang="ts">
	import type { Platform } from "src/types";
	import PlatformCard from "./platform-card.svelte";

	interface ScrapeSectionProps {
		selectedPlatform: Platform | null;
		onSelectPlatform: (platform: Platform) => void;
		onScrape: () => void;
	}

	let { selectedPlatform, onSelectPlatform, onScrape }: ScrapeSectionProps = $props();

	const platforms: Platform[] = ["X", "INSTAGRAM", "THREADS", "YOUTUBE"];
</script>

<div class="scrape-section">
	<h2>Select Platform</h2>
	<div class="platform-grid">
		{#each platforms as platform}
			<PlatformCard
				{platform}
				selected={selectedPlatform === platform}
				onclick={() => onSelectPlatform(platform)}
			/>
		{/each}
	</div>
	<button
		class="scrape-button"
		disabled={!selectedPlatform}
		onclick={onScrape}
		type="button"
	>
		Scrape
	</button>
</div>

<style>
	.scrape-section {
		padding: 1rem;
		border-bottom: 1px solid var(--background-modifier-border);
	}

	h2 {
		margin: 0 0 1rem 0;
		font-size: 1.25rem;
		color: var(--text-normal);
	}

	.platform-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.scrape-button {
		max-width: 200px;
		padding: 0.75rem 2rem;
		background: var(--interactive-accent);
		color: var(--text-on-accent);
		border: none;
		border-radius: 6px;
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.scrape-button:hover:not(:disabled) {
		background: var(--interactive-accent-hover);
	}

	.scrape-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
