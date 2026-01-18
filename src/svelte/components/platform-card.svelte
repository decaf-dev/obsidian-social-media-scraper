<script lang="ts">
	import { PLATFORM_CONFIG } from "src/types";
	import type { Platform } from "src/types";
	import { setIcon } from "obsidian";
	import { onMount } from "svelte";

	interface PlatformCardProps {
		platform: Platform;
		selected: boolean;
		onclick: () => void;
	}

	let { platform, selected, onclick }: PlatformCardProps = $props();
	let iconEl: HTMLSpanElement;

	const config = PLATFORM_CONFIG[platform];

	onMount(() => {
		if (iconEl) {
			setIcon(iconEl, config.icon);
		}
	});
</script>

<button
	class="platform-card"
	class:selected
	onclick={onclick}
	type="button"
>
	<span class="platform-icon" bind:this={iconEl}></span>
	<span class="platform-name">{config.name}</span>
</button>

<style>
	.platform-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding: 1.5rem 1rem;
		border: 2px solid var(--background-modifier-border);
		border-radius: 8px;
		background: var(--background-primary);
		cursor: pointer;
		transition: all 0.2s ease;
		width: 100%;
		min-height: 100px;
	}

	.platform-card:hover {
		border-color: var(--interactive-accent);
		background: var(--background-primary-alt);
	}

	.platform-card.selected {
		border-color: var(--interactive-accent);
		background: var(--background-modifier-hover);
		box-shadow: 0 0 0 2px var(--interactive-accent-hover);
	}

	.platform-icon {
		font-size: 1.75rem;
		color: var(--text-normal);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.platform-name {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-normal);
		text-align: center;
		word-wrap: break-word;
	}
</style>
