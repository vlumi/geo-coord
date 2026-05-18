export type LatitudeHemisphere = "N" | "S";
export type LongitudeHemisphere = "E" | "W";
export type Hemisphere = LatitudeHemisphere | LongitudeHemisphere;

export interface DMS<H extends Hemisphere = Hemisphere> {
  degrees: number;
  minutes: number;
  seconds: number;
  hemisphere: H;
}

export interface DDCoordinates {
  latitude: number;
  longitude: number;
}

export interface DMSCoordinates {
  latitude: DMS<LatitudeHemisphere>;
  longitude: DMS<LongitudeHemisphere>;
}

export interface CoordSink {
  latitude: number;
  longitude: number;
}
