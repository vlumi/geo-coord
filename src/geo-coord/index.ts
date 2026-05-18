import { latitudeToDMS, longitudeToDMS } from "../convert.js";
import parseInput from "./parse-input/index.js";
import type {
  DDCoordinates,
  DMS,
  DMSCoordinates,
  LatitudeHemisphere,
  LongitudeHemisphere,
} from "../types.js";

type Hemi = LatitudeHemisphere | LongitudeHemisphere;

export class GeoCoord {
  latitude!: number;
  longitude!: number;

  constructor(...input: unknown[]) {
    parseInput(this, ...input);
  }

  toDD(): DDCoordinates {
    return { latitude: this.latitude, longitude: this.longitude };
  }

  toDMS(): DMSCoordinates {
    return {
      latitude: latitudeToDMS(this.latitude),
      longitude: longitudeToDMS(this.longitude),
    };
  }

  roundToDegrees(): GeoCoord {
    const round = <H extends Hemi>(coord: DMS<H>): DMS<H> => {
      const degrees = Math.round(
        coord.degrees + coord.minutes / 60 + coord.seconds / 3600,
      );
      return { ...coord, degrees, minutes: 0, seconds: 0 };
    };
    return new GeoCoord(
      round(latitudeToDMS(this.latitude)),
      round(longitudeToDMS(this.longitude)),
    );
  }

  roundToMinutes(): GeoCoord {
    const round = <H extends Hemi>(coord: DMS<H>): DMS<H> => {
      const minutes = Math.round(coord.minutes + coord.seconds / 60);
      if (minutes < 60) {
        return { ...coord, minutes, seconds: 0 };
      }
      return { ...coord, degrees: coord.degrees + 1, minutes: 0, seconds: 0 };
    };
    return new GeoCoord(
      round(latitudeToDMS(this.latitude)),
      round(longitudeToDMS(this.longitude)),
    );
  }

  roundToSeconds(): GeoCoord {
    const round = <H extends Hemi>(coord: DMS<H>): DMS<H> => {
      const seconds = Math.round(coord.seconds);
      if (seconds < 60) {
        return { ...coord, seconds };
      }
      const minutes = coord.minutes + 1;
      if (minutes < 60) {
        return { ...coord, minutes, seconds: 0 };
      }
      return { ...coord, degrees: coord.degrees + 1, minutes: 0, seconds: 0 };
    };
    return new GeoCoord(
      round(latitudeToDMS(this.latitude)),
      round(longitudeToDMS(this.longitude)),
    );
  }

  toDDString(): string {
    const c = this.toDD();
    return `${c.latitude} ${c.longitude}`;
  }

  toDMSString(): string {
    const { latitude: lat, longitude: lon } = this.toDMS();
    return (
      `${lat.degrees}°${lat.minutes}′${lat.seconds}″${lat.hemisphere}` +
      " " +
      `${lon.degrees}°${lon.minutes}′${lon.seconds}″${lon.hemisphere}`
    );
  }

  toString(): string {
    return this.toDMSString();
  }
}
