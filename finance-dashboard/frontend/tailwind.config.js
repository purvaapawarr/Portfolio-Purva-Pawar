/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        saffron: "#FF9933",
        indiaGreen: "#138808",
        navyBlue: "#000080",
      },
    },
  },
  plugins: [],
};
