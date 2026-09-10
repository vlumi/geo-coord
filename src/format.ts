import type { DDCoordinates, Hemisphere } from "./types.js";

export interface FormatOptions {
  /** Decimal degrees (`"dd"`, the default) or degrees, minutes and seconds (`"dms"`). */
  style?: "dd" | "dms";
  /** Decimals kept: of the degrees for `"dd"` (default 4), of the seconds for `"dms"` (default 0). */
  precision?: number;
  /** Mark the hemisphere with a letter or word (default) or with a minus sign on the number. */
  hemisphere?: "letter" | "sign";
  /** Replacements for the hemisphere letters, for example Japanese 北緯, 南緯, 東経, 西経. */
  hemispheres?: Partial<Record<Hemisphere, string>>;
  /** Whether the hemisphere mark follows the number (default) or leads it, as in Japanese. */
  hemispherePosition?: "after" | "before";
  /** Replacements for the °, ′ and ″ symbols. */
  symbols?: Partial<Record<"degrees" | "minutes" | "seconds", string>>;
  /** What separates latitude from longitude in `formatCoordinates` (default a space). */
  separator?: string;
}

const LETTERS: Record<Hemisphere, string> = { N: "N", S: "S", E: "E", W: "W" };
const SYMBOLS = { degrees: "°", minutes: "′", seconds: "″" };

const formatNumber = (
  value: number,
  positive: Hemisphere,
  negative: Hemisphere,
  options: FormatOptions,
): string => {
  const { style = "dd", hemisphere = "letter", hemispherePosition = "after" } =
    options;
  const symbols = { ...SYMBOLS, ...options.symbols };
  const precision = options.precision ?? (style === "dd" ? 4 : 0);
  const magnitude = Math.abs(value);
  let text: string;
  let zero: boolean;
  if (style === "dd") {
    text = `${magnitude.toFixed(precision)}${symbols.degrees}`;
    zero = Number(magnitude.toFixed(precision)) === 0;
  } else {
    const scale = 10 ** precision;
    const total = Math.round(magnitude * 3600 * scale);
    const seconds = (total % (60 * scale)) / scale;
    const wholeMinutes = Math.floor(total / (60 * scale));
    const minutes = wholeMinutes % 60;
    const degrees = Math.floor(wholeMinutes / 60);
    text =
      `${degrees}${symbols.degrees}${minutes}${symbols.minutes}` +
      `${seconds.toFixed(precision)}${symbols.seconds}`;
    zero = total === 0;
  }
  const isNegative = value < 0 && !zero;
  if (hemisphere === "sign") {
    return isNegative ? `-${text}` : text;
  }
  const side = isNegative ? negative : positive;
  const mark = options.hemispheres?.[side] ?? LETTERS[side];
  return hemispherePosition === "before" ? `${mark}${text}` : `${text}${mark}`;
};

/** A latitude as text, `"35.6812°N"` by default. */
export const formatLatitude = (
  latitude: number,
  options: FormatOptions = {},
): string => {
  if (!(latitude >= -90 && latitude <= 90)) {
    throw new Error(`Invalid latitude: ${latitude}`);
  }
  return formatNumber(latitude, "N", "S", options);
};

/** A longitude as text, `"139.7671°E"` by default. */
export const formatLongitude = (
  longitude: number,
  options: FormatOptions = {},
): string => {
  if (!(longitude >= -180 && longitude <= 180)) {
    throw new Error(`Invalid longitude: ${longitude}`);
  }
  return formatNumber(longitude, "E", "W", options);
};

/** Both coordinates as text, `"35.6812°N 139.7671°E"` by default. */
export const formatCoordinates = (
  { latitude, longitude }: DDCoordinates,
  options: FormatOptions = {},
): string =>
  formatLatitude(latitude, options) +
  (options.separator ?? " ") +
  formatLongitude(longitude, options);
