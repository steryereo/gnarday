import { AccessibleIcon } from "@radix-ui/react-accessible-icon";
import { BoltIcon, XIcon } from "lucide-react";

import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/Drawer";
import SignOut from "./SignOut";

export default async function PreferencesDrawer({
  className,
}: {
  className?: string;
}) {
  return (
    <Drawer>
      <DrawerTrigger className={className}>
        <AccessibleIcon label="Settings">
          <BoltIcon />
        </AccessibleIcon>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
          <DrawerClose className="w-11 h-11 flex items-center justify-center">
            <AccessibleIcon label="Close Settings">
              <XIcon />
            </AccessibleIcon>
          </DrawerClose>
        </DrawerHeader>
        <DrawerBody>
          <SignOut />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
