import { getData } from "@/src/lib/actions/getData";

import ClientCount from "./Count.client";

export default async function ServerCount() {
  const data = await getData();

  return <ClientCount count={data.dayCount} />;
}
