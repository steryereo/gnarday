// @vitest-environment node
import { revalidatePath } from "next/cache";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { actAs, type Caller } from "@/test/mocks/auth";
import { dbMock } from "@/test/mocks/db";

import { deleteZoneAction, submitZoneForm } from "../zoneActions";

vi.mock("@/src/lib/auth/auth", async () => ({
  auth: (await import("@/test/mocks/auth")).authMock,
}));
vi.mock("@/src/db", async () => ({
  db: (await import("@/test/mocks/db")).dbMock.db,
}));
vi.mock("next/headers", () => ({ headers: vi.fn(async () => new Headers()) }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

function zoneForm(fields: Record<string, string> = {}) {
  const formData = new FormData();
  const values = {
    name: "Shirley Lake",
    description: "Mellow groomers",
    directions: "Take Shirley Lake Express",
    squallywoodPage: "42",
    ...fields,
  };
  for (const [key, value] of Object.entries(values)) {
    formData.set(key, value);
  }
  return formData;
}

const UNAUTHORIZED = { success: false, error: "Unauthorized" };

beforeEach(() => {
  dbMock.reset();
  vi.mocked(revalidatePath).mockClear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe.each<Exclude<Caller, "admin">>(["anonymous", "user"])(
  "when the caller is %s",
  (caller) => {
    beforeEach(() => actAs(caller));

    test("submitZoneForm (create) is rejected without touching the db", async () => {
      const result = await submitZoneForm(null, zoneForm());

      expect(result).toEqual(UNAUTHORIZED);
      expect(dbMock.wasCalled()).toBe(false);
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    test("submitZoneForm (update) is rejected without touching the db", async () => {
      const result = await submitZoneForm(null, zoneForm({ zoneId: "5" }));

      expect(result).toEqual(UNAUTHORIZED);
      expect(dbMock.wasCalled()).toBe(false);
    });

    test("deleteZoneAction is rejected without touching the db", async () => {
      const result = await deleteZoneAction(5);

      expect(result).toEqual(UNAUTHORIZED);
      expect(dbMock.wasCalled()).toBe(false);
    });
  },
);

describe("when the caller is an admin", () => {
  beforeEach(() => actAs("admin"));

  describe("submitZoneForm", () => {
    test("creates a zone and revalidates the list", async () => {
      dbMock.state.result = [{ insertedId: 1 }];

      const result = await submitZoneForm(null, zoneForm());

      expect(result).toEqual({ success: true });
      expect(dbMock.db.insert).toHaveBeenCalledOnce();
      expect(revalidatePath).toHaveBeenCalledWith("/admin/zones");
    });

    test("updates a zone and revalidates the list and detail page", async () => {
      dbMock.state.result = [{ updatedId: 5 }];

      const result = await submitZoneForm(null, zoneForm({ zoneId: "5" }));

      expect(result).toEqual({ success: true });
      expect(dbMock.db.update).toHaveBeenCalledOnce();
      expect(revalidatePath).toHaveBeenCalledWith("/admin/zones");
      expect(revalidatePath).toHaveBeenCalledWith("/admin/zones/5");
    });

    test("reports a missing zone on update", async () => {
      dbMock.state.result = [];

      const result = await submitZoneForm(null, zoneForm({ zoneId: "5" }));

      expect(result).toEqual({ success: false, error: "Zone not found" });
    });

    test("only passes editable fields to the db", async () => {
      dbMock.state.result = [{ insertedId: 1 }];

      await submitZoneForm(
        null,
        zoneForm({ id: "999", createdAt: "2000-01-01", bogus: "x" }),
      );

      expect(dbMock.chain.values).toHaveBeenCalledWith({
        name: "Shirley Lake",
        description: "Mellow groomers",
        directions: "Take Shirley Lake Express",
        squallywoodPage: 42,
      });
    });

    test("treats an empty squallywoodPage as null", async () => {
      dbMock.state.result = [{ insertedId: 1 }];

      await submitZoneForm(null, zoneForm({ squallywoodPage: "" }));

      expect(dbMock.chain.values).toHaveBeenCalledWith(
        expect.objectContaining({ squallywoodPage: null }),
      );
    });

    test.each(["abc", "-1", "1.5", "0"])(
      "rejects invalid zoneId %j without touching the db",
      async (zoneId) => {
        const result = await submitZoneForm(null, zoneForm({ zoneId }));

        expect(result.success).toBe(false);
        expect(dbMock.wasCalled()).toBe(false);
      },
    );

    test("rejects a non-numeric squallywoodPage with a field error", async () => {
      const result = await submitZoneForm(
        null,
        zoneForm({ squallywoodPage: "abc" }),
      );

      expect(result).toMatchObject({
        success: false,
        fieldErrors: { squallywoodPage: expect.any(String) },
      });
      expect(dbMock.wasCalled()).toBe(false);
    });

    test("hides db error details from the client and logs them", async () => {
      const dbError = new Error('duplicate key violates "zones_pkey" secret');
      dbMock.state.error = dbError;
      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await submitZoneForm(null, zoneForm());

      expect(result).toEqual({ success: false, error: "Failed to save zone" });
      expect(consoleError).toHaveBeenCalledWith(
        expect.anything(),
        dbError,
      );
    });
  });

  describe("deleteZoneAction", () => {
    test("deletes a zone and revalidates the list", async () => {
      const result = await deleteZoneAction(5);

      expect(result).toEqual({ success: true });
      expect(dbMock.db.delete).toHaveBeenCalledOnce();
      expect(revalidatePath).toHaveBeenCalledWith("/admin/zones");
    });

    test.each([["abc"], [-1], [1.5], [0], [undefined], [null], [{}]])(
      "rejects invalid id %j without touching the db",
      async (id) => {
        const result = await deleteZoneAction(id);

        expect(result.success).toBe(false);
        expect(dbMock.wasCalled()).toBe(false);
      },
    );

    test("hides db error details from the client and logs them", async () => {
      const dbError = new Error('violates foreign key "areas_zone_id_fkey"');
      dbMock.state.error = dbError;
      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await deleteZoneAction(5);

      expect(result).toEqual({
        success: false,
        error: "Failed to delete zone",
      });
      expect(consoleError).toHaveBeenCalledWith(
        expect.anything(),
        dbError,
      );
    });
  });
});
