// @vitest-environment jsdom
import { ChakraProvider } from "@chakra-ui/react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Content from "./Content";
import { DEFAULT_WORDS } from "../lib/config";

// The typing animation is timer-driven noise in jsdom; phrases are asserted
// through the container aria-labels instead.
vi.mock("typewriter-effect", () => ({ default: () => null }));

interface RequestBody {
  passphrase: string;
  temperature: number;
}

const fetchMock = vi.fn<[string, RequestInit], Promise<Response>>();

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const requestBodies = () =>
  fetchMock.mock.calls.map(
    ([, init]) => JSON.parse(init.body as string) as RequestBody,
  );

const renderContent = () =>
  render(
    <ChakraProvider>
      <Content />
    </ChakraProvider>,
  );

/** The passphrase currently shown, read from its section's aria-label. */
const shownPassphrase = () => {
  const label = screen
    .getByLabelText(/^A set of random words/)
    .getAttribute("aria-label");
  const match = /"(.+)"/.exec(label ?? "");
  if (!match) throw new Error(`Unexpected passphrase label: ${label}`);
  return match[1];
};

beforeEach(() => {
  // Chakra's slider measures itself
  vi.stubGlobal(
    "ResizeObserver",
    vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    })),
  );
  // framer-motion (Collapse) calls this; jsdom doesn't implement it
  vi.stubGlobal("scrollTo", () => undefined);
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
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  fetchMock.mockReset();
});

describe("Content (characterization)", () => {
  it("generates a passphrase and its mnemonic on click", async () => {
    renderContent();
    expect(fetchMock).not.toHaveBeenCalled();

    fireEvent.click(
      screen.getByRole("button", { name: "Generate a new passphrase" }),
    );

    const passphrase = shownPassphrase();
    expect(passphrase.split(" ")).toHaveLength(DEFAULT_WORDS);
    expect(requestBodies()).toEqual([{ passphrase, temperature: 0.5 }]);
    expect(fetchMock.mock.calls[0][0]).toBe("/api/openai");

    expect(
      await screen.findByLabelText(
        `An AI generated mnemonic for the random words "${passphrase}": Mnemonic for ${passphrase}`,
      ),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Generate a new passphrase" })
        .textContent,
    ).toBe("Make me another");
    expect(
      screen.getByRole("button", { name: "Copy passphrase" }),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Copy mnemonic" })).toBeTruthy();
  });

  it("applies AI mode on the next click without requesting on change", async () => {
    renderContent();
    fireEvent.click(
      screen.getByRole("button", { name: "Passphrase configuration" }),
    );

    fireEvent.click(
      await screen.findByRole("radio", { name: "Matthew McConaughey" }),
    );
    expect(fetchMock).not.toHaveBeenCalled();

    fireEvent.click(
      screen.getByRole("button", { name: "Generate a new passphrase" }),
    );
    expect(requestBodies()[0].temperature).toBe(1.5);
  });

  it("uses the word count slider for the next passphrase and entropy label", async () => {
    renderContent();
    fireEvent.click(
      screen.getByRole("button", { name: "Passphrase configuration" }),
    );

    const slider = await screen.findByRole("slider");
    expect(screen.getByText("(~65 bits · strong)")).toBeTruthy();

    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(screen.getByText("(~78 bits · strong)")).toBeTruthy();

    fireEvent.click(
      screen.getByRole("button", { name: "Generate a new passphrase" }),
    );
    expect(shownPassphrase().split(" ")).toHaveLength(DEFAULT_WORDS + 1);
  });

  it("regenerates the mnemonic for the same passphrase", async () => {
    renderContent();
    expect(
      screen.queryByRole("button", { name: "Regenerate the AI mnemonic" }),
    ).toBeNull();

    fireEvent.click(
      screen.getByRole("button", { name: "Generate a new passphrase" }),
    );
    const passphrase = shownPassphrase();
    await screen.findByLabelText(/^An AI generated mnemonic/);

    fireEvent.click(
      screen.getByRole("button", { name: "Regenerate the AI mnemonic" }),
    );
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
    expect(requestBodies()[1].passphrase).toBe(passphrase);
    expect(shownPassphrase()).toBe(passphrase);
  });

  it("shows the server's error message", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(502, { error: "AI provider request failed" }),
    );
    renderContent();

    fireEvent.click(
      screen.getByRole("button", { name: "Generate a new passphrase" }),
    );

    expect(await screen.findByText("Error generating mnemonic.")).toBeTruthy();
    expect(
      screen.getByText("AI provider request failed. Please try again."),
    ).toBeTruthy();
    expect(screen.queryByLabelText(/^An AI generated mnemonic/)).toBeNull();
  });
});
