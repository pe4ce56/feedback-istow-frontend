const defaultTheme = require("tailwindcss/defaultTheme");
const windmill = require("@roketid/windmill-react-ui/config");
module.exports = windmill({
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./containers/**/*.{js,ts,jsx,tsx}",
    "./example/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      primary: "#912062",
    },
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
    },
    extends: {},
  },
  plugins: [],
});
