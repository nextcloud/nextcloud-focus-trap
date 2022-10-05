import { describe, expect, test, vi } from 'vitest';
import { createFocusTrap, FocusTrap } from '@nextcloud/focus-trap';
import { getRealInstance } from '@nextcloud/focus-trap/utils.ts';

vi.mock('focus-trap', () => {
  const factory = vi.fn().mockImplementation(() => {
    const instance = {
      paused: false,
      active: false,
      activate: vi.fn(() => {
        instance.active = true;
        return instance;
      }),
      deactivate: vi.fn(() => {
        instance.active = false;
        return instance;
      }),
      pause: vi.fn(() => {
        instance.paused = true;
        return instance;
      }),
      unpause: vi.fn(() => {
        instance.paused = false;
        return instance;
      }),
    } as Partial<FocusTrap>;

    return instance;
  });

  return { createFocusTrap: factory };
});

describe('state', () => {
  test('factory', () => {
    expect(window._nc_focus_trap).toMatchObject({
      list: [],
      elements: new WeakMap(),
    });

    const root = document.createElement('div');

    expect(window._nc_focus_trap.list).length(0);

    const trap = createFocusTrap(root);
    const real = getRealInstance(trap);

    trap.activate();
    expect(window._nc_focus_trap.list).length(1);

    trap.deactivate();
    expect(window._nc_focus_trap.list).length(0);
    expect(window._nc_focus_trap.elements.get(real)).contain(root);
  });

  test('multiple instances', () => {
    // root elements to be used as references
    const rootA = document.createElement('div');
    const rootB = document.createElement('div');

    // no active traps
    expect(window._nc_focus_trap.list).length(0);

    const A = createFocusTrap(rootA);
    const B = createFocusTrap(rootB);

    // get real focus trap instance
    const realA = getRealInstance(A);
    const realB = getRealInstance(B);

    // check elements in each instance
    expect(window._nc_focus_trap.elements.get(realA)).contain(rootA);
    expect(window._nc_focus_trap.elements.get(realB)).contain(rootB);

    // no active traps after create instances
    expect(window._nc_focus_trap.list).length(0);

    // active first instance
    A.activate();
    expect(window._nc_focus_trap.list).length(1);
    expect(window._nc_focus_trap.list).contain(realA);
    expect(realA.active).toBe(true);
    expect(realA.paused).toBe(false);
    expect(realB.active).toBe(false);

    // active second instance
    B.activate();
    expect(window._nc_focus_trap.list).length(2);
    expect(window._nc_focus_trap.list).contain(realA);
    expect(window._nc_focus_trap.list).contain(realB);

    // both instance activates
    expect(realA.active).toBe(true);
    expect(realB.active).toBe(true);

    // first instance must be paused
    expect(realA.paused).toBe(true);
    expect(realB.paused).toBe(false);

    // deactivate second instance
    B.deactivate();

    // only fist instance is activate
    expect(window._nc_focus_trap.list).length(1);
    expect(window._nc_focus_trap.list).contain(realA);

    // check instance states
    expect(realA.active).toBe(true);
    expect(realB.active).toBe(false);
    expect(realA.paused).toBe(false);
    expect(realB.paused).toBe(false);

    // deactivate second instance
    A.deactivate();
    expect(realA.active).toBe(false);

    // no active instances
    expect(window._nc_focus_trap.list).length(0);
  });
});
