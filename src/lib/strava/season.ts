const NOVEMBER = 10;

export function getSeasonStart(now: Date = new Date()) {
  const year =
    now.getUTCMonth() >= NOVEMBER
      ? now.getUTCFullYear()
      : now.getUTCFullYear() - 1;

  return `${year}-11-01`;
}
