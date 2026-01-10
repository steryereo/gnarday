"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import { deleteZone } from "@/src/lib/actions/zoneActions";

import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

type DeleteZoneButtonProps = {
  zoneId: number;
  zoneName: string;
};

export default function DeleteZoneButton({
  zoneId,
  zoneName,
}: DeleteZoneButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (
      !confirm(
        `Are you sure you want to delete "${zoneName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(true);

    const result = await deleteZone(zoneId);

    if (result.success) {
      router.refresh();
    } else {
      alert(`Failed to delete zone: ${result.error}`);
    }

    setIsDeleting(false);
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label={`Delete zone ${zoneName}`}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <VisuallyHidden.Root>
                  Deleting zone {zoneName}...
                </VisuallyHidden.Root>
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                <VisuallyHidden.Root>
                  Delete zone {zoneName}
                </VisuallyHidden.Root>
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete zone</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
