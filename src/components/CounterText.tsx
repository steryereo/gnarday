import { PropsWithChildren } from "react";

import { coptek } from "@/src/lib/fonts";

type Props = {
  className: string;
  style?: React.CSSProperties;
};

export default function CounterText({
  children,
  className,
  style,
}: PropsWithChildren<Props>) {
  return (
    <p
      // this font is weird - it needs a little nudging
      className={`${coptek.className} ${className} relative top-[0.12em] right-[0.025em] text-yellow drop-shadow-solid-onyx font-bold`}
      style={style}
    >
      {children}
    </p>
  );
}
