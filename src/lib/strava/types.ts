// https://developers.strava.com/docs/reference

import { ALL_SPORT_TYPES } from "./constants";

export type LatLng = [number, number];

export interface MetaAthlete {
  id: number;
  resource_state: number;
}

export interface PolyLineMap {
  id: string;
  summary_polyline: string;
  resource_state: number;
}

// prettier-ignore
export type SportType = typeof ALL_SPORT_TYPES[number];

export interface SummaryActivity {
  achievement_count: number;
  athlete_count: number;
  athlete: MetaAthlete;
  average_cadence: number;
  average_heartrate: number;
  average_speed: number;
  average_watts: number;
  comment_count: number;
  commute: boolean;
  device_watts: boolean;
  display_hide_heartrate_option: boolean;
  distance: number;
  elapsed_time: number;
  elev_high: number;
  elev_low: number;
  end_latlng: LatLng;
  external_id: string;
  flagged: boolean;
  from_accepted_tag: boolean;
  gear_id: string;
  has_heartrate: boolean;
  has_kudoed: boolean;
  heartrate_opt_out: boolean;
  id: number;
  kilojoules: number;
  kudos_count: number;
  location_city: string;
  location_country: string;
  location_state: string;
  manual: boolean;
  map: PolyLineMap;
  max_heartrate: number;
  max_speed: number;
  max_watts: number;
  moving_time: number;
  name: string;
  photo_count: number;
  pr_count: number;
  private: boolean;
  resource_state: number;
  sport_type: string;
  start_date_local: string;
  start_date: string;
  start_latlng: LatLng;
  suffer_score: number;
  timezone: string;
  total_elevation_gain: number;
  total_photo_count: number;
  trainer: boolean;
  type: string;
  upload_id_str: string;
  upload_id: number;
  utc_offset: number;
  visibility: string;
  weighted_average_watts: number;
}
