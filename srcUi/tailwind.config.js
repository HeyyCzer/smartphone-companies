/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#00b4d8",
				secondary: "#90e0ef",
				terciary: "#0077b6",

				dark: {
					1: "#272737",
					2: "#242432",
					3: "#20202E",
					4: "#1D1D29",
					5: "#191924",
					6: "#161620",
					7: "#12121b",
				},
				light: {
					1: "#fafaf9",
					2: "#f5f5f4",
					3: "#e7e5e4",
					4: "#d6d3d1",
					5: "#a8a29e",
					6: "#78716c",
					7: "#57534e",
				},
				semi: {
					white: {
						1: "rgba(255, 255, 255, 0.1)",
						2: "rgba(255, 255, 255, 0.2)",
						3: "rgba(255, 255, 255, 0.3)",
					},
					black: {
						1: "rgba(0, 0, 0, 0.1)",
						2: "rgba(0, 0, 0, 0.2)",
						3: "rgba(0, 0, 0, 0.3)",
					},
				},
			}
		},
	},
	plugins: [],
};
