module.exports = {
    content: [
      "./src/app/**/*.{js,ts,jsx,tsx}",
      "./src/pages/**/*.{js,ts,jsx,tsx}",
      "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
  theme: {
    extend: {
      fontFamily: {
        bbstrata: ['bbstrata', 'sans-serif'], // 👈 register your custom font
        disket: ['Disket-Mono-Bold', 'sans-serif'],
      },
    },
  },
  plugins: [],
};