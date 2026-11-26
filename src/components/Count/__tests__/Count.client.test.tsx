import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import ClientCount from "../Count.client";

vi.mock("@/src/lib/fonts", () => ({ coptek: { className: "" } }));

function visibleCount(container: HTMLElement) {
  return container.querySelector("span[aria-hidden]")?.textContent;
}

async function finishAnimation() {
  await act(async () => {
    await vi.runAllTimersAsync();
  });
}

describe("ClientCount", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  test("shows 0 when there are no days", async () => {
    const { container } = render(<ClientCount count={0} />);

    await finishAnimation();

    expect(visibleCount(container)).toBe("0");
  });

  test("counts up to the total", async () => {
    const { container } = render(<ClientCount count={3} />);

    await finishAnimation();

    expect(visibleCount(container)).toBe("3");
  });
});
