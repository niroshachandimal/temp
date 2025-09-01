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
      fontFamily: {
        // sans: ["Roboto", "sans-serif"],
      },
      colors: {
        primary: "#12BBB5",
        secondary: "#7965C1",
        background: "#000000",
        graycolor: "#141414",
        white: "#ffffff",
        textSecondary: "#595959",
        darkModeBackground: "#121212",
        darkModeBackgroundSecondary: "#18181B",
        sideBarBackground: "#252E3E",
        darkModeText: "#FFFFFF",
        darkModeTextSecondary: "#B0B0B0",
        zinc: {
          900: "#06B7DB",
        },
      },

      backgroundImage: {
        "primary-gradient":
          "linear-gradient(90deg, rgba(18, 187, 181, 1) 28%, rgba(109, 111, 192, 1) 68%)",
      },
    },
  },
  darkMode: "class",
  // plugins: [
  //   heroui({
  //     prefix: "nextui",
  //     addCommonColors: true,
  //     themes: {
  //       dark: {
  //         color: {
  //           primary: {,
  //             background: "#FF7A30",
  //           },
  //         },
  //       },
  //     },
  //   }),
  // ],
  plugins: [
    heroui({
      prefix: "nextui",
      addCommonColors: true,
      themes: {
        dark: {
          colors: {
            // background: "#006FEE",
            // content1: "#2F3349",
          },
        },
      },
    }),
  ],
};
