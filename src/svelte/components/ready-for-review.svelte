<script lang="ts">
	import type { ScrapeJob } from "src/types";
	import { PLATFORM_CONFIG } from "src/types";

	interface ReadyForReviewProps {
		jobs: ScrapeJob[];
		onReview: (job: ScrapeJob) => void;
	}

	let { jobs, onReview }: ReadyForReviewProps = $props();

	const completedJobs = $derived(
		jobs.filter((job) => job.status === "COMPLETED"),
	);
</script>

{#if completedJobs.length > 0}
	<div class="ready-for-review-section">
		<h2>Ready for Review</h2>
		<div class="job-list">
			{#each completedJobs as job}
				<button
					class="job-card"
					onclick={() => onReview(job)}
					type="button"
				>
					<div class="job-info">
						<span class="job-platform"
							>{PLATFORM_CONFIG[job.platform].name}</span
						>
						<span class="job-count">{job.results.length} items</span
						>
					</div>
					<span class="review-arrow">→</span>
				</button>
			{/each}
		</div>
	</div>
{/if}

<style>
	.ready-for-review-section {
		padding: 1rem;
	}

	h2 {
		margin: 0 0 1rem 0;
		font-size: 1.25rem;
		color: var(--text-normal);
	}

	.job-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.job-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.25rem 1.5rem;
		background: var(--background-primary);
		border: 1px solid var(--background-modifier-border);
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s ease;
		width: 100%;
		text-align: left;
		min-height: 70px;
	}

	.job-card:hover {
		background: var(--background-primary-alt);
		border-color: var(--interactive-accent);
	}

	.job-info {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		flex: 1;
		min-width: 0;
	}

	.job-platform {
		font-weight: 500;
		font-size: 1.1rem;
		color: var(--text-normal);
		line-height: 1.4;
	}

	.job-count {
		font-size: 0.9rem;
		color: var(--text-muted);
		line-height: 1.4;
	}

	.review-arrow {
		font-size: 1.5rem;
		color: var(--text-muted);
		flex-shrink: 0;
		margin-left: 1rem;
	}
</style>
