import { getZone } from "@/src/lib/actions/zoneActions";
import { adminOnly } from "@/src/lib/actions/userActions";

import { ZoneForm } from "./ZoneForm";

async function getZoneFromParams(params: Promise<{ zoneId: string }>) {
  const { zoneId } = await params;

  const zoneIdInt = parseInt(zoneId);

  if (!isNaN(zoneIdInt)) {
    return await getZone(zoneIdInt);
  }

  return undefined;
}

export default async function ZonePage({
  params,
}: {
  params: Promise<{ zoneId: string }>;
}) {
  await adminOnly();

  const zone = await getZoneFromParams(params);

  return <ZoneForm zone={zone} />;
}
