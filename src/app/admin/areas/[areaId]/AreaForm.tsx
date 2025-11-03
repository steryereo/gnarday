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
  InsertArea,
  insertAreaSchema,
  SelectArea,
  SelectZone,
} from "@/src/lib/zod-schemas/gnar";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { createArea, updateArea } from "@/src/lib/actions/areaActions";
type AreaFormProps = {
  area?: SelectArea;
  zones: SelectZone[];
};

export function AreaForm({ area, zones }: AreaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const defaultValues: InsertArea = {
    name: area?.name ?? "",
    directions: area?.directions ?? "",
    squallywoodPage: area?.squallywoodPage,
    zoneId: area?.zoneId ?? (zones.length > 0 ? zones[0].id : 0),
  };

  const form = useForm<InsertArea>({
    resolver: zodResolver(insertAreaSchema),
    defaultValues,
  });

  async function submitForm(data: InsertArea) {
    setIsSubmitting(true);

    try {
      if (area?.id) {
        await updateArea(data, area.id);
      } else {
        await createArea(data);
      }

      router.push("/admin/areas");
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
        {area?.id ? "Edit Area" : "New Area"}
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

          <FormField
            control={form.control}
            name="zoneId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zone</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      field.onChange(value);
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    <option value="">Select a zone</option>
                    {zones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="mt-4" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 /> : "Save Area"}
          </Button>
          {form.formState.errors.root && (
            <FormMessage>{form.formState.errors.root.message}</FormMessage>
          )}
        </form>
      </Form>
    </div>
  );
}

