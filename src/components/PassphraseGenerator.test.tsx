// @vitest-environment jsdom
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import PassphraseGenerator, {
  MNEMONIC_DEBOUNCE_MS,
} from "./PassphraseGenerator";
import { DEFAULT_WORDS, MAX_WORDS } from "../../shared/passphrase";

interface RequestBody {
  passphrase: string;
  mode: string;
}

const fetchMock =
  vi.fn<(url: string, init: RequestInit) => Promise<Response>>();
const writeText = vi.fn<(text: string) => Promise<void>>();

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const requestBodies = () =>
  fetchMock.mock.calls.map(
    ([, init]) => JSON.parse(init.body as string) as RequestBody,
  );

/** The passphrase shown, read from the screen-reader copy of each word. */
const shownPassphrase = () =>
  within(screen.getByRole("list", { name: "Your passphrase" }))
    .getAllByRole("listitem")
    .map((li) => li.querySelector(".visually-hidden")?.textContent ?? "")
    .join(" ");

const findMnemonic = (text: string) =>
  screen.findByText(text, { selector: "blockquote .visually-hidden" });

const button = (name: string) => screen.getByRole("button", { name });
const radio = (name: string) => screen.getByRole("radio", { name });

beforeEach(() => {
  // jsdom lacks matchMedia (used by the typing animation's reduced-motion check)
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({ matches: false, media: query })),
  );
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
  });
  writeText.mockResolvedValue(undefined);
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockImplementation((_url, init) => {
    const { passphrase } = JSON.parse(init.body as string) as RequestBody;
    return Promise.resolve(
      jsonResponse(200, { message: `Mnemonic for ${passphrase}` }),
    );
  });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  fetchMock.mockReset();
  writeText.mockReset();
});

describe("PassphraseGenerator", () => {
  it("shows a passphrase on load without contacting the AI", () => {
    render(<PassphraseGenerator />);

    expect(shownPassphrase().split(" ")).toHaveLength(DEFAULT_WORDS);
    expect(radio("Off")).toHaveProperty("checked", true);
    expect(screen.getByText("64.6 bits · strong")).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rolls new words locally while the mnemonic is off", () => {
    render(<PassphraseGenerator />);
    const first = shownPassphrase();

    fireEvent.click(button("New passphrase"));

    expect(shownPassphrase()).not.toBe(first);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("requests a mnemonic for the current words as soon as a style is picked", async () => {
    render(<PassphraseGenerator />);
    const passphrase = shownPassphrase();

    fireEvent.click(radio("Standard"));

    expect(requestBodies()).toEqual([{ passphrase, mode: "standard" }]);
    expect(fetchMock.mock.calls[0][0]).toBe("/api/mnemonic");
    expect(await findMnemonic(`Mnemonic for ${passphrase}`)).toBeTruthy();
  });

  it("rewrites the mnemonic right away when the style changes", () => {
    render(<PassphraseGenerator />);
    const passphrase = shownPassphrase();

    fireEvent.click(radio("Standard"));
    fireEvent.click(radio("McConaughey"));

    expect(requestBodies()).toEqual([
      { passphrase, mode: "standard" },
      { passphrase, mode: "mcconaughey" },
    ]);
  });

  it("waits for re-rolling to stop, then requests once for the final words", () => {
    render(<PassphraseGenerator />);
    fireEvent.click(radio("Standard"));
    fetchMock.mockClear();
    vi.useFakeTimers();

    fireEvent.click(button("New passphrase"));
    fireEvent.click(button("New passphrase"));
    fireEvent.click(button("New passphrase"));
    const final = shownPassphrase();
    expect(
      screen.getByText("Mnemonic coming once you stop rolling…"),
    ).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(MNEMONIC_DEBOUNCE_MS - 1);
    });
    expect(fetchMock).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(requestBodies()).toEqual([{ passphrase: final, mode: "standard" }]);
  });

  it("drops a pending request when switched off", () => {
    render(<PassphraseGenerator />);
    fireEvent.click(radio("Standard"));
    fetchMock.mockClear();
    vi.useFakeTimers();

    fireEvent.click(button("New passphrase"));
    fireEvent.click(radio("Off"));
    act(() => {
      vi.advanceTimersByTime(MNEMONIC_DEBOUNCE_MS * 2);
    });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.queryByText(/stop rolling/)).toBeNull();
  });

  it("writes a new mnemonic for the same words on request", async () => {
    render(<PassphraseGenerator />);
    const passphrase = shownPassphrase();
    fireEvent.click(radio("Standard"));
    await findMnemonic(`Mnemonic for ${passphrase}`);

    fireEvent.click(button("New mnemonic"));

    expect(requestBodies()[1]).toEqual({ passphrase, mode: "standard" });
    expect(shownPassphrase()).toBe(passphrase);
  });

  it("changes the word count, rerolls and updates the strength", () => {
    render(<PassphraseGenerator />);

    fireEvent.click(button("More words"));
    expect(shownPassphrase().split(" ")).toHaveLength(MAX_WORDS);
    expect(screen.getByText("77.5 bits · strong")).toBeTruthy();
    expect(button("More words")).toHaveProperty("disabled", true);

    fireEvent.click(button("Fewer words"));
    fireEvent.click(button("Fewer words"));
    fireEvent.click(button("Fewer words"));
    expect(shownPassphrase().split(" ")).toHaveLength(3);
    expect(screen.getByText("38.8 bits · weak")).toBeTruthy();
    expect(button("Fewer words")).toHaveProperty("disabled", true);
  });

  it("copies the passphrase and confirms it", async () => {
    render(<PassphraseGenerator />);

    fireEvent.click(button("Copy passphrase"));

    expect(writeText).toHaveBeenCalledWith(shownPassphrase());
    expect(await screen.findByText("Copied to clipboard")).toBeTruthy();
  });

  it("shows the server's error message verbatim", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(503, { error: "AI mnemonics are unavailable right now." }),
    );
    render(<PassphraseGenerator />);

    fireEvent.click(radio("Standard"));

    const alert = await screen.findByRole("alert");
    // No "Please try again" when retrying won't help
    expect(alert.textContent).toContain(
      "AI mnemonics are unavailable right now.",
    );
    expect(alert.textContent).not.toMatch(/try again/i);
  });

  it("explains network failures", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    render(<PassphraseGenerator />);

    fireEvent.click(radio("Standard"));

    expect((await screen.findByRole("alert")).textContent).toContain(
      "Couldn't reach the server. Check your connection and try again.",
    );
  });
});
