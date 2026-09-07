// Learn more about Vitest configuration options at https://vitest.dev/config/

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
    ],
    coverage: {
      // 1. Specify the provider (requires @vitest/coverage-v8)
      provider: 'v8',
      // 2. Define the output formats
      reporter: ['text', 'html', 'clover',  'json'],
      // 3. Automatically run coverage with tests
      enabled: true,
      // 4. Clean output directory before each run
      clean: true,
      thresholds: {
        statements: 80,  // Minimum percentage of statements
				branches: 75,   // Minimum percentage of logical branches
        functions: 80,  // Minimum percentage of functions
        lines: 80,      // Minimum percentage of lines
      },
      reportsDirectory: './coverage'
    },

  },
});
