import { ChildProcess, spawn } from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import type { Platform, ScrapedItem, SocialMediaScraperSettings } from "src/types";

function getNodeExecutable(configuredPath: string): string {
	if (!configuredPath || !configuredPath.trim()) {
		throw new Error(
			"Node.js path is not configured. Please set the Node.js path in plugin settings."
		);
	}

	const resolvedPath = configuredPath.startsWith("~")
		? path.join(os.homedir(), configuredPath.slice(1))
		: configuredPath;

	if (!fs.existsSync(resolvedPath)) {
		throw new Error(
			`Node.js executable not found at: ${configuredPath}. Please check your settings.`
		);
	}

	return resolvedPath;
}

export abstract class BaseScraper {
	protected platform: Platform;
	protected settings: SocialMediaScraperSettings;
	protected process: ChildProcess | null = null;
	protected manifestDir: string;

	constructor(
		platform: Platform,
		settings: SocialMediaScraperSettings,
		manifestDir: string
	) {
		this.platform = platform;
		this.settings = settings;
		this.manifestDir = manifestDir;
	}

	abstract scrape(onProgress?: (progress: number, step?: string) => void): Promise<ScrapedItem[]>;

	protected async runPlaywrightScript(
		scriptName: string,
		onProgress?: (progress: number, step?: string) => void
	): Promise<ScrapedItem[]> {
		return new Promise((resolve, reject) => {
			const scriptPath = path.join(
				this.manifestDir,
				"scripts",
				scriptName
			);

			// Prepare arguments for the script
			const args = [
				scriptPath,
				"--headless",
				this.settings.headless.toString(),
				"--browser",
				this.settings.browser,
			];

			// Add Brave path if using Brave browser
			if (this.settings.browser === "BRAVE" && this.settings.bravePath) {
				args.push("--bravePath", this.settings.bravePath);
			}

			// Add cookies if available
			const cookies = this.settings.cookies[this.platform];
			if (cookies) {
				args.push("--cookies", cookies);
			}

			// Get the Node.js executable
			let nodeExecutable: string;
			try {
				nodeExecutable = getNodeExecutable(this.settings.nodePath);
			} catch (error) {
				reject(error);
				return;
			}

			// Spawn the Node process
			this.process = spawn(nodeExecutable, args);

			let stdout = "";
			let stderr = "";

			// Collect stdout (JSON results)
			this.process.stdout?.on("data", (data) => {
				stdout += data.toString();
			});

			// Collect stderr (logs and progress)
			this.process.stderr?.on("data", (data) => {
				const message = data.toString();
				stderr += message;

				// Check for progress updates with step name
				const progressMatch = message.match(/PROGRESS:(\d+):(.+)/);
				if (progressMatch && onProgress) {
					const progress = parseInt(progressMatch[1], 10);
					const step = progressMatch[2].trim();
					onProgress(progress, step);
				}

				// Log other messages
				if (!progressMatch) {
					console.log(`[${this.platform}]:`, message.trim());
				}
			});

			this.process.on("close", (code) => {
				this.process = null;

				if (code === 0) {
					try {
						const results = JSON.parse(stdout);
						resolve(results);
					} catch (error) {
						reject(
							new Error(
								`Failed to parse results: ${error}. Output: ${stdout}`
							)
						);
					}
				} else {
					reject(
						new Error(
							`Playwright process exited with code ${code}. Error: ${stderr}`
						)
					);
				}
			});

			this.process.on("error", (error) => {
				this.process = null;

				// Check if it's a "command not found" error
				if (error.message.includes("ENOENT")) {
					reject(
						new Error(
							"Node.js not found. Please ensure Node.js is installed and in your PATH."
						)
					);
				} else {
					reject(error);
				}
			});
		});
	}

	protected getDomain(): string {
		switch (this.platform) {
			case "X":
				return "x.com";
			case "INSTAGRAM":
				return "instagram.com";
			case "THREADS":
				return "threads.net";
			case "YOUTUBE":
				return "youtube.com";
		}
	}

	public async cancel(): Promise<void> {
		if (this.process) {
			this.process.kill();
			this.process = null;
		}
	}
}
