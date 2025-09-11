import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // In v4, most theme configuration is done in CSS using @theme
  // Keep only essential config here
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;