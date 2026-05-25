/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				mono: ['JetBrains Mono', 'monospace'],
			},
			colors: {
				bim: '#F59E0B', // Orange
				ml: '#06B6D4',  // Cyan
				dark: '#0B1120', // Main Background
				card: '#161F32', // Card Background
			}
		},
	},
	plugins: [require("@tailwindcss/typography")],
}