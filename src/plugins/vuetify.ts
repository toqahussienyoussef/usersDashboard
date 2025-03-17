import { createVuetify } from "vuetify";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// Define custom themes
const lightTheme = {
  dark: false,
  colors: {
    primary: "#4DB6AC", // Blue
    secondary: "#424242", // Dark grey
    accent: "#82B1FF", // Light blue
    error: "#FF5252", // Red
    info: "#2196F3", // Blue
    success: "#4CAF50", // Green
    warning: "#FFC107", // Amber
    background: "#F5F5F5", // Light grey background
    surface: "#FFFFFF", // White surface
  },
};

const darkTheme = {
  dark: true,
  colors: {
    primary: "#B2DFDB", // Lighter blue
    secondary: "#B0BEC5", // Light grey
    accent: "#FF4081", // Pink
    error: "#FF5252", // Red
    info: "#2196F3", // Blue
    success: "#4CAF50", // Green
    warning: "#FFC107", // Amber
    background: "#121212", // Dark background
    surface: "#1E1E1E", // Dark surface
  },
};

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "light", // Default to light theme
    themes: {
      light: lightTheme,
      dark: darkTheme,
    },
  },
  icons: {
    defaultSet: "mdi",
  },
});

export default vuetify;
