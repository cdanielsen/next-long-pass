// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, expect, it } from "vitest";

import AppHeader from "./AppHeader";

afterEach(cleanup);

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppHeader />
    </MemoryRouter>,
  );

it("renders the app name as the only h1", () => {
  renderAt("/");
  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  expect(screen.getByRole("heading", { name: "Next Passphrase" })).toBeTruthy();
});

it.each([
  ["/", "Generator"],
  ["/about", "About"],
])("marks the current page at %s", (path, current) => {
  renderAt(path);
  const nav = screen.getByRole("navigation", { name: "Main" });
  const active = nav.querySelectorAll('[aria-current="page"]');
  expect(active).toHaveLength(1);
  expect(active.item(0).textContent).toBe(current);
});

it("links to the source on GitHub", () => {
  renderAt("/");
  expect(
    screen
      .getByRole("link", { name: "Source code on GitHub" })
      .getAttribute("href"),
  ).toBe("https://github.com/cdanielsen/next-long-pass");
});
