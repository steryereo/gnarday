"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/src/components/ui/form";
import { SelectZone } from "@/src/lib/zod-schemas/gnar";
import { submitZoneForm } from "@/src/lib/actions/zoneActions";

type ZoneFormProps = {
  zone?: SelectZone;
};

export function ZoneForm({ zone }: ZoneFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(submitZoneForm, null);

  useEffect(() => {
    if (state?.success) {
      router.push("/admin/zones");
    }
    // Only depend on state to avoid unnecessary re-runs when router object changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div className="flex flex-col gap-4 items-center">
      <h2 className="text-2xl font-bold">
        {zone?.id ? "Edit Zone" : "New Zone"}
      </h2>
      <form
        action={formAction}
        className="w-full max-w-lg flex flex-col gap-6"
      >
        {zone?.id && <input type="hidden" name="zoneId" value={zone.id} />}

        <FormField
          name="name"
          error={state && !state.success ? state.fieldErrors?.name : undefined}
        >
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input
                name="name"
                defaultValue={zone?.name ?? ""}
                required
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField
          name="description"
          error={
            state && !state.success ? state.fieldErrors?.description : undefined
          }
        >
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                name="description"
                defaultValue={zone?.description ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField
          name="directions"
          error={
            state && !state.success ? state.fieldErrors?.directions : undefined
          }
        >
          <FormItem>
            <FormLabel>Directions</FormLabel>
            <FormControl>
              <Textarea
                name="directions"
                defaultValue={zone?.directions ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField
          name="squallywoodPage"
          error={
            state && !state.success
              ? state.fieldErrors?.squallywoodPage
              : undefined
          }
        >
          <FormItem>
            <FormLabel>Squallywood Page</FormLabel>
            <FormControl>
              <Input
                type="number"
                name="squallywoodPage"
                defaultValue={zone?.squallywoodPage ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <Button className="mt-4" type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Zone"
          )}
        </Button>

        {state && !state.success && !state.fieldErrors && (
          <p className="text-[0.8rem] font-medium text-destructive">
            {state.error}
          </p>
        )}
      </form>
    </div>
  );
}
