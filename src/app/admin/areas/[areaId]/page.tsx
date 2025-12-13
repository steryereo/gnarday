import { getArea } from "@/src/lib/actions/areaActions";
import { getZones } from "@/src/lib/actions/zoneActions";
import { adminOnly } from "@/src/lib/actions/userActions";

import { AreaForm } from "./AreaForm";

async function getAreaFromParams(params: Promise<{ areaId: string }>) {
  const { areaId } = await params;

  const areaIdInt = parseInt(areaId);

  if (!isNaN(areaIdInt)) {
    return await getArea(areaIdInt);
  }

  return undefined;
}

export default async function AreaPage({
  params,
}: {
  params: Promise<{ areaId: string }>;
}) {
  await adminOnly();

  const [area, zones] = await Promise.all([
    getAreaFromParams(params),
    getZones(),
  ]);

  return <AreaForm area={area} zones={zones} />;
}

