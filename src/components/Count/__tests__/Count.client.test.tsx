import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import ClientCount from "../Count.client";

vi.mock("@/src/lib/fonts", () => ({ coptek: { className: "" } }));

function visibleCount(container: HTMLElement) {
  return container.querySelector("span[aria-hidden]")?.textContent;
}

describe("ClientCount", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test("shows 0 when there are no days", () => {
    const { container } = render(<ClientCount count={0} />);

    expect(visibleCount(container)).toBe("0");
  });

  test("counts up to the total", async () => {
    vi.useFakeTimers();
    const { container } = render(<ClientCount count={3} />);

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(visibleCount(container)).toBe("3");
  });
});
