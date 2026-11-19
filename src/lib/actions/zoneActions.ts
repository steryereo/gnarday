"use server";
import "server-only";

import { revalidatePath } from "next/cache";

import { createZone, deleteZone, updateZone } from "@/src/data/zones";

import { insertZoneSchema } from "../zod-schemas/gnar";
import { ActionError, idSchema, toActionError } from "./actionErrors";

const zoneFormSchema = insertZoneSchema.pick({
  name: true,
  description: true,
  directions: true,
  squallywoodPage: true,
});

type ZoneFormState = { success: true } | ActionError;

function parseZoneFields(formData: FormData) {
  const squallywoodPage = formData.get("squallywoodPage");

  return zoneFormSchema.parse({
    name: formData.get("name"),
    description: formData.get("description"),
    directions: formData.get("directions"),
    squallywoodPage:
      squallywoodPage && squallywoodPage !== ""
        ? Number(squallywoodPage)
        : null,
  });
}

export async function submitZoneForm(
  _previousState: ZoneFormState | null,
  formData: FormData,
): Promise<ZoneFormState> {
  try {
    const data = parseZoneFields(formData);
    const zoneIdValue = formData.get("zoneId");

    if (zoneIdValue != null && zoneIdValue !== "") {
      const zoneId = idSchema.parse(zoneIdValue);
      const updated = await updateZone(zoneId, data);

      if (!updated) {
        return { success: false, error: "Zone not found" };
      }

      revalidatePath("/admin/zones");
      revalidatePath(`/admin/zones/${zoneId}`);
    } else {
      await createZone(data);
      revalidatePath("/admin/zones");
    }

    return { success: true };
  } catch (error) {
    return toActionError(error, "Failed to save zone");
  }
}

export async function deleteZoneAction(
  id: unknown,
): Promise<{ success: true } | ActionError> {
  try {
    const zoneId = idSchema.parse(id);
    await deleteZone(zoneId);
    revalidatePath("/admin/zones");

    return { success: true };
  } catch (error) {
    return toActionError(error, "Failed to delete zone");
  }
}
