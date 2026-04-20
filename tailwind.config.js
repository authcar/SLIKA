// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./filter.html",
    "./room.html",
    "./frame.html",
    "./src/**/*.{js,ts,jsx,tsx,vue,svelte}",
  ],
  theme: {
    extend: {
      // Di sinilah Anda bisa menambahkan custom width dan height
      // seperti w-329 atau h-173 jika Anda mau.
      spacing: {
        329: "329px",
        173: "173px",
      },
    },
  },
  plugins: [],
};
