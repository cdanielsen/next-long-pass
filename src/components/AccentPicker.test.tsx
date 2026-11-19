// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";

import AccentPicker from "./AccentPicker";

afterEach(() => {
  cleanup();
  localStorage.clear();
  delete document.documentElement.dataset.accent;
});

it("starts on the saved accent", () => {
  localStorage.setItem("accent", "plum");
  render(<AccentPicker />);
  expect(screen.getByRole("radio", { name: "Plum" })).toHaveProperty(
    "checked",
    true,
  );
});

it("applies and saves the chosen accent", () => {
  render(<AccentPicker />);
  expect(screen.getByRole("radio", { name: "Teal" })).toHaveProperty(
    "checked",
    true,
  );

  fireEvent.click(screen.getByRole("radio", { name: "Blue" }));

  expect(document.documentElement.dataset.accent).toBe("blue");
  expect(localStorage.getItem("accent")).toBe("blue");
  expect(screen.getByRole("radio", { name: "Blue" })).toHaveProperty(
    "checked",
    true,
  );
});
