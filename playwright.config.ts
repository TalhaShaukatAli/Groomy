import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
		reuseExistingServer: true
	},
	use: {
		trace: "on-all-retries"
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,
	retries: 1,
	fullyParallel: true,
	outputDir: "test-results",
	reporter: "html",
	
};

export default config;
