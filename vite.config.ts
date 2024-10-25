import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		exclude: ['playwright.config.ts'],
		include: ['src/**/*.spec.ts'],
		coverage: {
			provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                // Config files
                '**/playwright.config.ts',
                '**/svelte.config.js',
                '**/vite.config.ts',
				'**/eslint.config.js',
                
                // Test files
                '**/*.{test,spec}.{js,ts}',
                '**/tests/**',
                
                // Generated files and types
                '**/*.d.ts',
                '**/types.ts',
                
                // Build directories
                '**/node_modules/**',
                '**/dist/**',
                '.svelte-kit/**',
                
                // Specific files/directories you want to exclude
                '**/stores.svelte.ts',
                '**/routes/(marketing)/**',
                '**/routes/(protected)/**',
				'**/mongo.ts/**',
				'**/*.server.ts',
                '**/+server.ts',
                '**/hooks.server.ts',
            ],
		}
	}
});
