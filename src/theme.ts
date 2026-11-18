import { extendTheme } from "@chakra-ui/react";

const DISPLAY_FONT = `"Alfa Slab One", Inter, system-ui, Avenir, Helvetica, Arial, sans-serif`;

const theme = extendTheme({
  fonts: {
    heading: DISPLAY_FONT,
    body: DISPLAY_FONT,
  },
});

export default theme;
