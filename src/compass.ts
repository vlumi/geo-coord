export type CompassPoints = 4 | 8 | 16;

/** The sixteen compass points clockwise from north, as English abbreviations. */
export const COMPASS_POINTS: readonly string[] = [
  "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
  "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
];

/** Which of `points` compass points a bearing rounds to, as an index clockwise from north, for the caller to name. */
export const compassIndex = (bearing: number, points: CompassPoints = 8): number =>
  Math.round((((bearing % 360) + 360) % 360) / (360 / points)) % points;

/** The compass point a bearing rounds to, as an English abbreviation. */
export const compassPoint = (bearing: number, points: CompassPoints = 8): string =>
  COMPASS_POINTS[compassIndex(bearing, points) * (16 / points)] as string;
