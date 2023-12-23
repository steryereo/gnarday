import { auth } from "@/auth";
import { formatResults, getActivities, refreshAccessToken } from "@/src/strava";

export const GET = auth(async (req): Promise<void | Response> => {
  if (req.auth) {
    try {
      // TODO: don't do this refresh every time. store stuff in a DB instead?
      // @ts-expect-error refresh_token was added manually in auth.ts
      const { access_token } = await refreshAccessToken(req.auth.refresh_token);

      const activities = await getActivities(access_token);

      return Response.json({ ...formatResults(activities), ...req.auth });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);

      return new Response(message, { status: 500 });
    }
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 });
});
