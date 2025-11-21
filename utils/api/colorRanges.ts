import { useRuntimeConfig } from "#app";

export interface ColorRange {
  min: number;
  max: number;
  color: string;
  id?: number | string;
}

const HEX_COLOR_REGEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
const DEFAULT_COLOR = "#9ca3af";
const NAMED_COLOR_MAP: Record<string, string> = {
  red: "#ff0000",
  green: "#008000",
  blue: "#0000ff",
  yellow: "#ffff00",
  orange: "#ffa500",
  purple: "#800080",
  pink: "#ffc0cb",
  lime: "#00ff00",
  teal: "#008080",
  cyan: "#00ffff",
  magenta: "#ff00ff",
  maroon: "#800000",
  navy: "#000080",
  olive: "#808000",
  gray: "#808080",
  grey: "#808080",
  black: "#000000",
  white: "#ffffff",
};

let cachedRanges: ColorRange[] | null = null;
let pendingRequest: Promise<ColorRange[]> | null = null;
let resolvedColorRangeUrl: string | null = null;

const toNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const normalizeRange = (input: any): ColorRange | null => {
  if (!input || typeof input !== "object") {
    return null;
  }

  const min = toNumber(input.min ?? input.Min ?? input.MIN);
  const max = toNumber(input.max ?? input.Max ?? input.MAX);
  const color =
    typeof input.color === "string"
      ? input.color.trim()
      : typeof input.Color === "string"
      ? input.Color.trim()
      : "";

  if (min === null || max === null || !color) {
    return null;
  }

  const normalized: ColorRange = {
    min: Math.min(min, max),
    max: Math.max(min, max),
    color,
  };

  if (input.id !== undefined) {
    normalized.id = input.id;
  }

  return normalized;
};

const pickResponseArray = (payload: unknown): any[] => {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (payload && typeof payload === "object") {
    if (Array.isArray((payload as any).data)) {
      return (payload as any).data;
    }
    if (Array.isArray((payload as any).items)) {
      return (payload as any).items;
    }
  }
  return [];
};

const buildColorRangeUrlCandidates = (input?: string | null): string[] => {
  if (!input) return [];
  const trimmed = input.trim();
  if (!trimmed) return [];
  const candidates = new Set<string>([trimmed]);
  if (trimmed.includes("color-ranges")) {
    candidates.add(trimmed.replace("color-ranges", "colorranges"));
  } else if (trimmed.includes("colorranges")) {
    candidates.add(trimmed.replace("colorranges", "color-ranges"));
  }
  return Array.from(candidates);
};

const requestColorRanges = async (url: string) => {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const raw = await response.json();
  const items = pickResponseArray(raw).map(normalizeRange).filter(Boolean);
  return items as ColorRange[];
};

/**
 * Fetches color range configuration from the backend.
 * Results are cached to avoid repeated network hops during a single session.
 */
export const fetchColorRanges = async (force = false): Promise<ColorRange[]> => {
  if (!force && cachedRanges) {
    return cachedRanges;
  }

  if (!force && pendingRequest) {
    return pendingRequest;
  }

  const runtimeConfig = useRuntimeConfig();
  const configuredUrl =
    [
      (runtimeConfig as any)?.colorange,
      (runtimeConfig as any)?.COLOUR,
      (runtimeConfig.public as any)?.COLOUR,
      (runtimeConfig.public as any)?.colour,
      (runtimeConfig.public as any)?.colorange,
      (runtimeConfig.public as any)?.colorRange,
      "/api/cache/color-ranges",
    ].find(
      (candidate): candidate is string =>
        typeof candidate === "string" && candidate.trim().length > 0
    ) ?? null;

  if (!configuredUrl) {
    console.warn(
      "[colorRanges] Missing runtime config `colorange`. Returning empty list."
    );
    cachedRanges = [];
    return cachedRanges;
  }

  pendingRequest = (async () => {
    const candidates = buildColorRangeUrlCandidates(configuredUrl);
    let lastError: unknown = null;

    for (const candidate of candidates) {
      try {
        const items = await requestColorRanges(candidate);
        cachedRanges = items;
        resolvedColorRangeUrl = candidate;
        return cachedRanges;
      } catch (error) {
        lastError = error;
        continue;
      }
    }

    if (!cachedRanges) {
      cachedRanges = [];
    }

    if (lastError) {
      console.error("[colorRanges] Failed to load ranges:", lastError);
    }

    return cachedRanges;
  })();

  return pendingRequest.finally(() => {
    pendingRequest = null;
  });
};

export const refreshColorRanges = () => fetchColorRanges(true);

export const getCachedColorRanges = (): ColorRange[] =>
  cachedRanges ? [...cachedRanges] : [];

export const getResolvedColorRangeUrl = () => resolvedColorRangeUrl;

export const matchColorRange = (
  value: number,
  ranges: ColorRange[] = cachedRanges ?? []
): ColorRange | null => {
  if (!Number.isFinite(value) || !Array.isArray(ranges) || ranges.length === 0) {
    return null;
  }

  return (
    ranges.find(({ min, max }) => value >= min && value <= max) ??
    ranges.find(({ min }) => value >= min) ??
    null
  );
};

export const resolveColorForValue = (
  value: number | null | undefined,
  ranges: ColorRange[] = cachedRanges ?? [],
  fallback = DEFAULT_COLOR
): string => {
  if (value === null || value === undefined) {
    return fallback;
  }
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return fallback;
  }
  const matched = matchColorRange(numeric, ranges);
  return matched?.color ?? fallback;
};

export const toTranslucent = (color: string, alpha = 0.12): string | null => {
  if (!color) return null;
  const value = color.trim();
  const keywordHex = NAMED_COLOR_MAP[value.toLowerCase()];
  if (keywordHex) {
    return toTranslucent(keywordHex, alpha);
  }

  if (HEX_COLOR_REGEX.test(value)) {
    const hex = value.slice(1);
    const fullHex =
      hex.length === 3
        ? hex
            .split("")
            .map((ch) => ch + ch)
            .join("")
        : hex;

    const num = parseInt(fullHex, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  if (value.startsWith("rgb(")) {
    const parts = value
      .slice(4, -1)
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
      .map(Number)
      .filter((n) => Number.isFinite(n));

    if (parts.length >= 3) {
      const [r, g, b] = parts;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
  }

  if (value.startsWith("rgba(")) {
    return value.replace(/rgba\(([^)]+)\)/, (_match, inner) => {
      const parts = inner.split(",").map((part: string) => part.trim());
      if (parts.length < 3) {
        return `rgba(156, 163, 175, ${alpha})`;
      }
      const [r, g, b] = parts;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    });
  }

  return null;
};

export { DEFAULT_COLOR, buildColorRangeUrlCandidates };
