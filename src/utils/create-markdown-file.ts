import { App, TFile } from "obsidian";
import type { ReviewItem } from "src/types";

export async function createMarkdownFile(
	app: App,
	item: ReviewItem,
	frontmatterUrlKey: string
): Promise<TFile | null> {
	console.log("Creating markdown file for item:", {
		title: item.title,
		tags: item.tags,
		tagsLength: item.tags?.length || 0,
	});

	// Sanitize title for filename
	const sanitizedTitle = sanitizeFilename(item.title);
	const filename = `${sanitizedTitle}.md`;

	// Check if file already exists - if so, skip it
	if (app.vault.getAbstractFileByPath(filename)) {
		const errorMsg = `File already exists: ${filename}`;
		console.log(errorMsg);
		throw new Error(errorMsg);
	}

	// Build frontmatter
	const frontmatter = buildFrontmatter(item, frontmatterUrlKey);
	console.log("Generated frontmatter:", frontmatter);

	// Build content
	const content = buildMarkdownContent(item, frontmatter);

	// Create file in vault root
	try {
		const file = await app.vault.create(filename, content);
		return file;
	} catch (error) {
		console.error("Error creating markdown file:", error);
		throw error;
	}
}

function sanitizeFilename(title: string): string {
	// Replace newlines and line breaks with spaces
	title = title.replace(/[\r\n]+/g, " ");
	// Replace colon with hyphen
	title = title.replace(/:/g, "-");
	// Replace bach slash with space
	title = title.replace(/\\/g, " ");
	// Replace forward slash with space
	title = title.replace(/\//g, " ");
	// Replace carrot with nothing
	title = title.replace(/\^/g, "");
	// Replace left bracket with nothing
	title = title.replace(/\[/g, "");
	// Replace right bracket with nothing
	title = title.replace(/\]/g, "");
	// Replace hash tag with nothing
	title = title.replace(/#/g, "");
	// Replace pipe with nothing
	title = title.replace(/\|/g, "");
	// Replace multiple spaces with single space
	title = title.replace(/\s+/g, " ");

	return title.trim().substring(0, 100); // Limit length and trim
}

function buildFrontmatter(item: ReviewItem, urlKey: string): string {
	const lines: string[] = ["---"];

	// Add URL
	lines.push(`${urlKey}: ${item.url}`);

	// Add tags if present
	if (item.tags && item.tags.length > 0) {
		lines.push("tags:");
		item.tags.forEach((tag) => {
			lines.push(`  - ${tag}`);
		});
	}

	lines.push("---");
	return lines.join("\n");
}

function buildMarkdownContent(item: ReviewItem, frontmatter: string): string {
	// Return only frontmatter with a trailing newline
	return frontmatter + "\n";
}
