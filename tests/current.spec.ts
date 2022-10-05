import { expect, test, vi, describe, MockInstance } from 'vitest';
import {
  createFocusTrap,
  addToActive,
  removeFromActive,
} from '@nextcloud/focus-trap';
import { getActiveTrap, getRealInstance } from '@nextcloud/focus-trap/utils.ts';

vi.mock('focus-trap');

describe('getActiveTrap', () => {
  test('single instance', () => {
    const trap = createFocusTrap(null);
    const real = getRealInstance(trap);

    expect(getActiveTrap()).toBe(undefined);

    trap.activate();

    expect(window._nc_focus_trap.list).length(1);

    expect(getActiveTrap()).toBe(real);

    trap.deactivate();

    expect(window._nc_focus_trap.list).length(0);
    expect(getActiveTrap()).toBe(undefined);
  });

  test('multiple instance', () => {
    const trapA = createFocusTrap(null);
    const trapB = createFocusTrap(null);
    const realA = getRealInstance(trapA);
    const realB = getRealInstance(trapB);

    expect(getActiveTrap()).toBe(undefined);

    trapA.activate();
    trapB.activate();

    expect(getActiveTrap()).toBe(realB);

    trapB.deactivate();
    expect(getActiveTrap()).toBe(realA);

    trapA.deactivate();
    expect(getActiveTrap()).toBe(undefined);

    expect(window._nc_focus_trap.list).length(0);
  });
});

describe('addToActive', () => {
  test('add into a active', () => {
    const root = document.createElement('root');
    const extra = document.createElement('div');

    const trap = createFocusTrap(root);
    const real = getRealInstance(trap);

    expect(getActiveTrap()).toBe(undefined);

    trap.activate();

    expect(window._nc_focus_trap.list).length(1);
    expect(getActiveTrap()).toBe(real);

    addToActive(extra);

    expect(real.updateContainerElements).toBeCalledWith([root, extra]);

    expect(window._nc_focus_trap.elements.get(real)).contain(root);
    expect(window._nc_focus_trap.elements.get(real)).contain(extra);

    trap.deactivate();
  });

  test('add into a inactive', () => {
    const trap = createFocusTrap(null);
    const real = getRealInstance(trap);

    expect(getActiveTrap()).toBe(undefined);

    addToActive(null);

    expect(real.updateContainerElements).not.toHaveBeenCalled();
  });
});

describe('removeFromActive', () => {
  test('with active instance', () => {
    const root = document.createElement('root');
    const A = document.createElement('div');
    const B = document.createElement('div');

    const trap = createFocusTrap(root);
    const real = getRealInstance(trap);

    trap.activate();

    addToActive(A);
    addToActive(B);

    expect(window._nc_focus_trap.elements.get(real)).contain(root);
    expect(window._nc_focus_trap.elements.get(real)).contain(A);
    expect(window._nc_focus_trap.elements.get(real)).contain(B);

    expect(real.updateContainerElements).toBeCalledTimes(2);
    expect(real.updateContainerElements).toBeCalledWith([root, A, B]);

    (real.updateContainerElements as unknown as MockInstance).mockReset();

    removeFromActive(B);
    expect(real.updateContainerElements).toBeCalledWith([root, A]);

    removeFromActive(A);
    expect(real.updateContainerElements).toBeCalledWith([root]);

    expect(real.updateContainerElements).toBeCalledTimes(2);

    expect(window._nc_focus_trap.elements.get(real)).contain(root);
    expect(window._nc_focus_trap.elements.get(real)).not.contain(A);
    expect(window._nc_focus_trap.elements.get(real)).not.contain(B);

    trap.deactivate();
  });

  test('without active instance', () => {
    const extra = document.createElement('div');
    const trap = createFocusTrap(null);
    const real = getRealInstance(trap);

    expect(window._nc_focus_trap.list).length(0);

    removeFromActive(extra);

    expect(window._nc_focus_trap.elements.get(real)).not.contain(extra);
    expect(real.updateContainerElements).toBeCalledTimes(0);
  });

  test('remove before add', () => {
    const extra = document.createElement('div');
    const trap = createFocusTrap(null);
    const real = getRealInstance(trap);

    trap.activate();

    removeFromActive(extra);

    expect(window._nc_focus_trap.elements.get(real)).not.contain(extra);
    expect(real.updateContainerElements).toBeCalledTimes(1);

    trap.deactivate();
  });
});
