import { describe, expect, test, vi } from "vitest";
import { createFocusTrap } from "@nextcloud/focus-trap";

vi.mock("focus-trap", () => {
  const factory = vi.fn().mockImplementation(() => {
    return {
      activate: vi.fn(),
      deactivate: vi.fn(),
    };
  });

  return { createFocusTrap: factory };
});

test('factory', () => {
  expect(window._nc_focus_trap).toMatchObject({
    list: [],
    elements: new WeakMap()
  });

  expect(window._nc_focus_trap.list).length(0);

  const trap = createFocusTrap(null)

  trap.activate()
  expect(window._nc_focus_trap.list).length(1);

  trap.deactivate();
  expect(window._nc_focus_trap.list).length(0);
})