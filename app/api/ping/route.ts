export async function GET() {
  return Response.json({ stravaClientId: process.env.AUTH_STRAVA_ID });
}
