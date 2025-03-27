import { getZone } from "@/src/lib/actions/zoneActions";

import { ZoneForm } from "./ZoneForm";

export default async function ZonePage({
  params,
}: {
  params: Promise<{ zoneId: string }>;
}) {
  const { zoneId } = await params;

  const zoneIdInt = parseInt(zoneId);

  let zone = undefined;

  if (!isNaN(zoneIdInt)) {
    zone = await getZone(zoneIdInt);
  }

  return <ZoneForm zone={zone} />;
}
