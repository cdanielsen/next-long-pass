// @vitest-environment jsdom
import { ChakraProvider } from "@chakra-ui/react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

import Header from "./Header";
import theme from "../theme";

beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    })),
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it("renders the title as a single, readable h1", () => {
  render(
    <ChakraProvider theme={theme}>
      <Header />
    </ChakraProvider>,
  );

  const heading = screen.getByRole("heading", { level: 1 });
  expect(heading.getAttribute("aria-label")).toBe("You Need A Pass Phrase");
  expect(screen.getByRole("heading", { name: "You Need A Pass Phrase" })).toBe(
    heading,
  );
});
