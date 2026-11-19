/** User-selectable accent colors. Values live in src/styles/tokens.css. */
export const ACCENTS = ["teal", "blue", "plum"] as const;
export type Accent = (typeof ACCENTS)[number];

export const DEFAULT_ACCENT: Accent = "teal";

export const ACCENT_LABELS: Record<Accent, string> = {
  teal: "Teal",
  blue: "Blue",
  plum: "Plum",
};

const STORAGE_KEY = "accent";

const isAccent = (value: unknown): value is Accent =>
  ACCENTS.includes(value as Accent);

/** The saved accent, or the default if none is saved or storage is blocked. */
export const readStoredAccent = (): Accent => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return isAccent(value) ? value : DEFAULT_ACCENT;
  } catch {
    return DEFAULT_ACCENT;
  }
};

/** Point the accent tokens at `accent` via <html data-accent>. */
export const applyAccent = (accent: Accent) => {
  document.documentElement.dataset.accent = accent;
};

export const storeAccent = (accent: Accent) => {
  try {
    localStorage.setItem(STORAGE_KEY, accent);
  } catch {
    // Private mode or blocked storage: the choice lasts for this visit only
  }
};
