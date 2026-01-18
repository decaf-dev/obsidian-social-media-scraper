<script lang="ts">
	import type { ReviewItem } from "src/types";

	interface ReviewModalContentProps {
		initialItems: ReviewItem[];
		onImport: (items: ReviewItem[]) => void;
		isImporting: boolean;
	}

	let { initialItems, onImport, isImporting }: ReviewModalContentProps =
		$props();

	let items = $state<ReviewItem[]>(initialItems);
	let selectedCount = $state(items.filter((item) => item.selected).length);

	function toggleItem(index: number) {
		items[index].selected = !items[index].selected;
		selectedCount = items.filter((item) => item.selected).length;
	}

	function updateTitle(index: number, value: string) {
		items[index].title = value;
	}

	function updateDescription(index: number, value: string) {
		items[index].description = value;
	}

	function updateTags(index: number, value: string) {
		items[index].tags = value
			.split(",")
			.map((tag) => tag.trim())
			.filter(Boolean);
		console.log(`Updated tags for item ${index}:`, items[index].tags);
	}

	function selectAll() {
		items.forEach((item) => {
			item.selected = true;
		});
		selectedCount = items.length;
	}

	function unselectAll() {
		items.forEach((item) => {
			item.selected = false;
		});
		selectedCount = 0;
	}

	async function copyUrlToClipboard(url: string) {
		try {
			await navigator.clipboard.writeText(url);
			// @ts-ignore - Notice is available in Obsidian API
			new Notice("Link copied to clipboard");
		} catch (err) {
			console.error("Failed to copy URL:", err);
			// @ts-ignore - Notice is available in Obsidian API
			new Notice("Failed to copy link");
		}
	}
</script>

<div class="review-modal-content">
	<div class="modal-header">
		<h2>Review Scraped Items</h2>
		<div class="header-controls">
			<p class="item-count">{selectedCount} of {items.length} selected</p>
			<div class="selection-buttons">
				<button
					class="select-all-button"
					onclick={selectAll}
					disabled={selectedCount === items.length}
					type="button"
				>
					Select All
				</button>
				<button
					class="unselect-all-button"
					onclick={unselectAll}
					disabled={selectedCount === 0}
					type="button"
				>
					Unselect All
				</button>
			</div>
		</div>
	</div>

	<div class="items-container">
		{#each items as item, index}
			<div class="item-row" class:selected={item.selected}>
				<div class="item-checkbox">
					<input
						type="checkbox"
						checked={item.selected}
						onchange={() => toggleItem(index)}
					/>
				</div>
				<div class="item-image">
					{#if item.imageUrl}
						<img src={item.imageUrl} alt={item.title} />
					{:else}
						<div class="no-image">No image</div>
					{/if}
				</div>
				<div class="item-details">
					<input
						type="text"
						class="item-title-input"
						value={item.title}
						oninput={(e) =>
							updateTitle(index, e.currentTarget.value)}
						placeholder="Title"
					/>
					<textarea
						class="item-description-input"
						value={item.description}
						oninput={(e) =>
							updateDescription(index, e.currentTarget.value)}
						placeholder="Description"
						rows="2"
					></textarea>
					<input
						type="text"
						class="item-tags-input"
						value={item.tags.join(", ")}
						oninput={(e) =>
							updateTags(index, e.currentTarget.value)}
						placeholder="Tags (comma-separated)"
					/>
					<button
						class="item-url"
						onclick={() => copyUrlToClipboard(item.url)}
						title="Click to copy URL"
						type="button"
					>
						<svg
							class="copy-icon"
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<rect
								x="9"
								y="9"
								width="13"
								height="13"
								rx="2"
								ry="2"
							></rect>
							<path
								d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
							></path>
						</svg>
						<span class="url-text">{item.url}</span>
					</button>
				</div>
			</div>
		{/each}
	</div>

	<div class="modal-footer">
		<button
			class="import-button"
			onclick={() => onImport(items)}
			disabled={selectedCount === 0 || isImporting}
			type="button"
		>
			{isImporting
				? "Importing..."
				: `Import ${selectedCount} Item${selectedCount !== 1 ? "s" : ""}`}
		</button>
	</div>
</div>

<style>
	.review-modal-content {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.modal-header {
		padding: 1rem;
		border-bottom: 1px solid var(--background-modifier-border);
	}

	.modal-header h2 {
		margin: 0 0 0.5rem 0;
		font-size: 1.5rem;
		color: var(--text-normal);
	}

	.header-controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	.item-count {
		margin: 0;
		font-size: 0.9rem;
		color: var(--text-muted);
	}

	.selection-buttons {
		display: flex;
		gap: 0.5rem;
	}

	.select-all-button,
	.unselect-all-button {
		padding: 0.4rem 0.8rem;
		background: var(--background-secondary);
		color: var(--text-normal);
		border: 1px solid var(--background-modifier-border);
		border-radius: 4px;
		font-size: 0.85rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.select-all-button:hover:not(:disabled),
	.unselect-all-button:hover:not(:disabled) {
		background: var(--background-modifier-hover);
		border-color: var(--interactive-accent);
	}

	.select-all-button:disabled,
	.unselect-all-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.items-container {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
	}

	.item-row {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		margin-bottom: 1rem;
		background: var(--background-primary);
		border: 1px solid #808080;
		border-radius: 6px;
		transition: all 0.2s ease;
	}

	.item-row.selected {
		border-color: var(--interactive-accent);
		background: var(--background-primary-alt);
	}

	.item-checkbox {
		display: flex;
		align-items: center;
	}

	.item-checkbox input[type="checkbox"] {
		width: 18px;
		height: 18px;
		cursor: pointer;
	}

	.item-image {
		flex-shrink: 0;
		width: 120px;
		height: 120px;
		border-radius: 4px;
		overflow: hidden;
		background: var(--background-secondary);
	}

	.item-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.no-image {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-muted);
		font-size: 0.85rem;
	}

	.item-details {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.item-title-input,
	.item-description-input,
	.item-tags-input {
		width: 100%;
		padding: 0.5rem;
		background: var(--background-primary);
		border: 1px solid var(--background-modifier-border);
		border-radius: 4px;
		color: var(--text-normal);
		font-family: var(--font-interface);
	}

	.item-title-input {
		font-size: 1rem;
		font-weight: 500;
	}

	.item-description-input {
		font-size: 0.9rem;
		resize: vertical;
	}

	.item-tags-input {
		font-size: 0.85rem;
	}

	.item-url {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8rem;
		color: var(--text-accent);
		word-break: break-all;
		background: none;
		border: none;
		padding: 0.25rem 0;
		text-align: left;
		cursor: pointer;
		transition: color 0.2s ease;
		width: 100%;
		font-family: var(--font-interface);
	}

	.item-url:hover {
		color: var(--text-accent-hover);
	}

	.copy-icon {
		flex-shrink: 0;
		opacity: 0.7;
		transition: opacity 0.2s ease;
	}

	.item-url:hover .copy-icon {
		opacity: 1;
	}

	.url-text {
		text-decoration: underline;
	}

	.modal-footer {
		padding: 1rem;
		border-top: 1px solid var(--background-modifier-border);
		background: var(--background-primary);
	}

	.import-button {
		padding: 0.75rem 1.5rem;
		background: var(--interactive-accent);
		color: var(--text-on-accent);
		border: none;
		border-radius: 6px;
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.import-button:hover:not(:disabled) {
		background: var(--interactive-accent-hover);
	}

	.import-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
