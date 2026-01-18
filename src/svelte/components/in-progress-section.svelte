<script lang="ts">
	import type { ScrapeJob } from "src/types";
	import { PLATFORM_CONFIG } from "src/types";

	interface InProgressSectionProps {
		jobs: ScrapeJob[];
		onCancel: (jobId: string) => void;
	}

	let { jobs, onCancel }: InProgressSectionProps = $props();

	const activeJobs = $derived(
		jobs.filter((job) => job.status === "IN_PROGRESS"),
	);
</script>

{#if activeJobs.length > 0}
	<div class="in-progress-section">
		<h2>In Progress</h2>
		{#each activeJobs as job}
			<div class="job-item">
				<div class="job-header">
					<span class="job-platform"
						>{PLATFORM_CONFIG[job.platform].name} - {job.progress}%</span
					>
					<button
						class="cancel-button"
						onclick={() => onCancel(job.id)}
						aria-label="Cancel scraping"
					>
						✕
					</button>
				</div>
				{#if job.currentStep}
					<div class="job-step">{job.currentStep}</div>
				{/if}
			</div>
		{/each}
	</div>
{/if}

<style>
	.in-progress-section {
		padding: 1rem;
		border-bottom: 1px solid var(--background-modifier-border);
	}

	h2 {
		margin: 0 0 1rem 0;
		font-size: 1.25rem;
		color: var(--text-normal);
	}

	.job-item {
		margin-bottom: 1rem;
	}

	.job-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.25rem;
	}

	.job-platform {
		font-weight: 500;
		color: var(--text-normal);
		flex: 1;
	}

	.cancel-button {
		background: none;
		border: none;
		color: var(--text-muted);
		cursor: pointer;
		padding: 0.25rem 0.5rem;
		font-size: 1.2rem;
		line-height: 1;
		border-radius: 4px;
		transition: all 0.2s ease;
	}

	.cancel-button:hover {
		color: var(--text-error);
	}

	.job-step {
		font-size: 0.85rem;
		color: var(--text-muted);
		font-style: italic;
		margin-bottom: 0.5rem;
	}
</style>
