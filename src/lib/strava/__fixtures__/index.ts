import { MetaAthlete, PolyLineMap, SummaryActivity } from "../types";

export const META_ATHLETE: MetaAthlete = {
  id: 12345,
  resource_state: 1,
};

export const POLYLINE_MAP: PolyLineMap = {
  id: "a10436443241",
  summary_polyline:
    "q`enFdf`}U_@sAEc@?QLmBd@eCNk@l@uANg@^yBNo@Fm@DSN_@TUF?NHPBVM`@r@l\\peAMg@o@BIGCEEc@GEEMMOAWOCCEk@{BWYCMO}AMk@QYU[OKcAc@YYW[GQMeAQg@UYsBqBc@o@Qa@K_@Q_AIw@?aCEKSYI[?_@Fm@OoACwAS_@QFGCEEASEK?EHFBGHe@?OGaAKa@Wc@II_@OEMKaAIQk@o@Ue@Qy@E{@YeAAm@Ji@b@b@~\\xcA@_ACY@q@CGOIISKCCGU@CEGu@Ke@IoA]e@Ye@w@sBc@a@[e@Qc@UgACWSk@A_@G_@GOa@u@_AqBUWa@YCGCQBKCIEKICGUCSIKO]@[Oa@Ui@Y_@]WUY]q@CIC]GCACAc@ABMBEOGs@U_AKOSQKQGCg@DIAO[Im@@c@BY?[SsACcAIUc@e@Q]IWEi@@CLOXRPh@v\\lcAI[OIEKGGYA]FIGo@iA[kA]m@GSMkB@SEUs@qAW{@Ms@S[Kc@K]OUIGm@_@KSM}@OoB_@oBAi@Fa@AGEKOCOBUJG[AWCGKGGKCKHw@FONQDIA][s@Iq@Lw@?[MGk@o@]k@o@MOIkAy@[_@OcASk@]kBGoAEMo@qAGEABMeATId@~An\\fdAtA_B`@u@Je@Jq@HwARw@RiANuA@wAFkAAUOeA[w@]o@a@g@i@]g@OWM]_@KGuA_@e@EIEQWYs@IBQSOm@QcCYeBgAiEs@_BK[CWi@Bo@Ie@_A_@Y?Eg@UI@WX[PGHMVOKIMCODUKY?MB]PqARg@@IMaBOGG@c@TSA}@F_AA[Ki@g@OUKe@AmATqA?o@KkADm@Ce@Fg@HSNMNGr@Gj@BHEp@w@zAy@fBs@l@m@f@_@FO[s@m@y@c@w@_BoEE[Gu@@yBEYIUEeA?IRk@?GEc@CICCCYEQ@MDOp@{@z@{@j@a@d@e@T_@Ng@d@mC@c@COqA_Bs@s@e@_@{CmBeEyCqDsCqAaBGI_@mAU]G[IYk@m@_@WOOw@}@oBeDw@yAeB{EKq@W_AYaBIYKWkA_B_BiDq@iAQUgAiAg@o@",
  resource_state: 2,
};

export const SUMMARY_ACTIVITY: SummaryActivity = {
  resource_state: 2,
  athlete: META_ATHLETE,
  name: "Afternoon Snowboard",
  distance: 8881,
  moving_time: 1672,
  elapsed_time: 6262,
  total_elevation_gain: 0,
  type: "Snowboard",
  sport_type: "Snowboard",
  id: 666,
  start_date: "2023-12-25T21:54:48Z",
  start_date_local: "2023-12-25T13:54:48Z",
  timezone: "(GMT-08:00) America/Los_Angeles",
  utc_offset: -28800,
  location_city: null,
  location_state: null,
  location_country: "United States",
  achievement_count: 0,
  kudos_count: 2,
  comment_count: 0,
  athlete_count: 1,
  photo_count: 0,
  map: POLYLINE_MAP,
  trainer: false,
  commute: false,
  manual: false,
  private: false,
  visibility: "everyone",
  flagged: false,
  gear_id: null,
  start_latlng: [39.18878269381821, -120.26637149043381],
  end_latlng: [39.19552283361554, -120.23634265176952],
  average_speed: 5.312,
  max_speed: 17.388,
  average_temp: 24,
  has_heartrate: true,
  average_heartrate: 118.2,
  max_heartrate: 135,
  heartrate_opt_out: false,
  display_hide_heartrate_option: true,
  elev_high: 2634.4,
  elev_low: 1902.2,
  upload_id: 56789,
  upload_id_str: "56789",
  external_id: "garmin_ping_99999",
  from_accepted_tag: false,
  pr_count: 0,
  total_photo_count: 0,
  has_kudoed: false,
  suffer_score: 5,
};
