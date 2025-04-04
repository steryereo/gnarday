"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/src/components/ui/form";
import {
  InsertZone,
  insertZoneSchema,
  SelectZone,
} from "@/src/lib/zod-schemas/gnar";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { createZone, updateZone } from "@/src/lib/actions/zoneActions";
type ZoneFormProps = {
  zone?: SelectZone;
};

export function ZoneForm({ zone }: ZoneFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const defaultValues: InsertZone = {
    name: zone?.name ?? "",
    description: zone?.description ?? "",
    directions: zone?.directions ?? "",
    squallywoodPage: zone?.squallywoodPage,
  };

  const form = useForm<InsertZone>({
    resolver: zodResolver(insertZoneSchema),
    defaultValues,
  });

  async function submitForm(data: InsertZone) {
    setIsSubmitting(true);

    try {
      if (zone?.id) {
        await updateZone(data, zone.id);
      } else {
        await createZone(data);
      }

      router.push("/admin/zones");
    } catch {
      setIsSubmitting(false);
      form.setError("root", {
        message: "Something went wrong. Please try again.",
      });
    }
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <h2 className="text-2xl font-bold">
        {zone?.id ? "Edit Zone" : "New Zone"}
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className="w-full max-w-lg flex flex-col gap-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="directions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Directions</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="squallywoodPage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Squallywood Page</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);

                      if (isNaN(value)) {
                        field.onChange(null);
                      } else {
                        field.onChange(value);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="mt-4" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 /> : "Save Zone"}
          </Button>
          {form.formState.errors.root && (
            <FormMessage>{form.formState.errors.root.message}</FormMessage>
          )}
        </form>
      </Form>
    </div>
  );
}
