/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
      fontFamily: { 
        archivo: ["Archivo"],
        clash: ["Clash Display"]
      },
      colors: {
        primary: '#023047',
        primary_hover: '#011B28',
        accent: '#fb8500',
        danger: '#ff4500'
      },
    },
	},
	plugins: [],
}
