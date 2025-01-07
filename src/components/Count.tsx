import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { getData } from "@/src/lib/actions/getData";

import CounterText from "./CounterText";

export default async function ServerCount() {
  const data = await getData();

  return (
    <CounterText
      className="text-[11rem] counter"
      style={{ ["--count" as string]: data.dayCount }}
    >
      <VisuallyHidden>{data.dayCount}</VisuallyHidden>
    </CounterText>
  );
}
