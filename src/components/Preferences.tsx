import { AccessibleIcon } from "@radix-ui/react-accessible-icon";
import { BoltIcon } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import SignOut from "./SignOut";

export default async function PreferencesDrawer({
  className,
}: {
  className?: string;
}) {
  return (
    <Sheet>
      <SheetTrigger className={className}>
        <AccessibleIcon label="Settings">
          <BoltIcon />
        </AccessibleIcon>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <SignOut />
        </div>
      </SheetContent>
    </Sheet>
  );
}
