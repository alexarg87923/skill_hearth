/** @type {import('tailwindcss').Config} */
export default {
  content: [
	"./index.html",
	"./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
	extend: {
		colors: {
		  background: "var(--background)",
		  foreground: "var(--foreground)",
		},
	  },
  },
  plugins: [],
}

