import type { Config } from 'tailwindcss'

export default {
	content: ['./index.html', './src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				quran: ['KFGQPC', 'serif'],
			},
		},
	},
	plugins: [],
} satisfies Config
