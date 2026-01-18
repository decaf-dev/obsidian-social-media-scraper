<script lang="ts">
	import { type App } from "obsidian";

	interface AppProps {
		obsidianApp: App;
	}

	let { obsidianApp }: AppProps = $props();
</script>

<div>
	<h1>Social Media Scraper</h1>
	<hr />
	<p>This is a social media scraper.</p>
</div>

<style>
	h1 {
		font-size: 2rem;
	}

	hr {
		margin: 1.1rem 0;
	}
</style>
