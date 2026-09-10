import type { DDCoordinates } from "./types.js";

/** The equivalent longitude in [-180, 180). */
export const normalizeLongitude = (longitude: number): number =>
  ((((longitude + 180) % 360) + 360) % 360) - 180;

/** The shortest signed way round from one longitude to another, in [-180, 180): positive is eastward. */
export const longitudeDelta = (from: number, to: number): number =>
  normalizeLongitude(to - from);

/**
 * The same path with each longitude shifted by whole turns so consecutive points never jump across the
 * antimeridian: a path that crosses it continues past ±180° instead.
 */
export const unwrapPath = (path: readonly DDCoordinates[]): DDCoordinates[] => {
  let offset = 0;
  return path.map((point, i) => {
    const previous = path[i - 1];
    if (previous) {
      const jump = point.longitude - previous.longitude;
      if (jump > 180) offset -= 360;
      else if (jump < -180) offset += 360;
    }
    return { latitude: point.latitude, longitude: point.longitude + offset };
  });
};

/**
 * The path cut wherever consecutive points jump across the antimeridian: each piece ends on its edge
 * (±180°) and the next starts on the opposite edge at the same latitude, so no segment reads as going the
 * long way round. Pieces shorter than two points are left out.
 */
export const splitAtAntimeridian = (
  path: readonly DDCoordinates[],
): DDCoordinates[][] => {
  const pieces: DDCoordinates[][] = [];
  let piece: DDCoordinates[] = [];
  const finish = (): void => {
    if (piece.length > 1) pieces.push(piece);
  };
  path.forEach((point, i) => {
    const previous = path[i - 1];
    if (previous && Math.abs(point.longitude - previous.longitude) > 180) {
      const edge = previous.longitude > 0 ? 180 : -180;
      const t =
        (edge - previous.longitude) /
        (point.longitude + 2 * edge - previous.longitude);
      const latitude =
        previous.latitude + (point.latitude - previous.latitude) * t;
      piece.push({ latitude, longitude: edge });
      finish();
      piece = [{ latitude, longitude: -edge }];
    }
    piece.push({ latitude: point.latitude, longitude: point.longitude });
  });
  finish();
  return pieces;
};
