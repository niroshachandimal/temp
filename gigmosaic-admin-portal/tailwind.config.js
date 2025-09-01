const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#12BBB5",
        secondary: "#323232",
        background: "#000000",
        graycolor: "#141414",
        white: "#ECECEC",
        textSecondary: "#595959",
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      prefix: "nextui",
      addCommonColors: true,
    }),
  ],
};
