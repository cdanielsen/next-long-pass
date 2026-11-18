import { extendTheme } from "@chakra-ui/react";

const DISPLAY_FONT = `"Alfa Slab One", Inter, system-ui, Avenir, Helvetica, Arial, sans-serif`;

const theme = extendTheme({
  fonts: {
    heading: DISPLAY_FONT,
    body: DISPLAY_FONT,
  },
  styles: {
    // Merged with Chakra's default global styles (body colour, bg, etc.)
    global: {
      body: {
        minWidth: "320px",
        minHeight: "100vh",
      },
      "#root": {
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "0 1.5rem",
      },
    },
  },
});

export default theme;
