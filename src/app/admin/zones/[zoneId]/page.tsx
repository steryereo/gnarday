import { notFound } from "next/navigation";

import { adminOnly } from "@/src/data/auth";
import { getZone } from "@/src/data/zones";
import { idSchema } from "@/src/lib/actions/actionErrors";

import { ZoneForm } from "./ZoneForm";

export default async function ZonePage({
  params,
}: {
  params: Promise<{ zoneId: string }>;
}) {
  await adminOnly();

  const { zoneId } = await params;

  if (zoneId === "new") {
    return <ZoneForm />;
  }

  const parsed = idSchema.safeParse(zoneId);
  if (!parsed.success) {
    notFound();
  }

  const zone = await getZone(parsed.data);
  if (!zone) {
    notFound();
  }

  return <ZoneForm zone={zone} />;
}
