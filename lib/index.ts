import type { Options, FocusTrap } from 'focus-trap';
import type { FocusTrapGlobalState, Element, ElementList } from './types';

import { createFocusTrap as create } from 'focus-trap';
import { getActiveTrap } from './utils';

const state: FocusTrapGlobalState =
  window._nc_focus_trap !== undefined
    ? window._nc_focus_trap
    : Object.freeze({
        list: [],
        elements: new WeakMap<FocusTrap, Set<Element>>(),
      });

window._nc_focus_trap = state;

const createFocusTrap = (
  element: Element | ElementList,
  userOptions?: Options
): FocusTrap => {
  // Create original focus trap
  const trap = create(element, userOptions);

  // Initialize elements
  const els = new Set(Array.isArray(element) ? [...element] : [element]);
  state.elements.set(trap, els);

  const originalActivate = trap.activate
  const originalDeactivate = trap.deactivate

  /**
   * Activate the focus trap and pause all
   * the other registered traps
   */
  trap.activate = function(...args) {
    state.list.forEach(row => {
      row.pause();
    });

    state.list.push(trap);

    return originalActivate(...args);
  };

  /**
   * Deactivate the focus trap and unpause
   * the last registered trap
   */
  trap.deactivate = function(...args) {
    const res = originalDeactivate(...args);
    const index = state.list.findIndex(row => row === trap);

    if (index >= 0) {
      state.list.splice(index, 1);
    }

    const last = state.list[state.list.length - 1];

    if (last?.paused) {
      last.unpause();
    }

    return res;
  };

  return trap
};

const addToActive = (el: Element): void => {
  const active = getActiveTrap();

  if (active == null) {
    return;
  }

  const els = state.elements.get(active);

  // @ts-expect-error
  els.add(el);

  // @ts-expect-error
  active.updateContainerElements([...els.values()]);
};

const removeFromActive = (el: Element): void => {
  const active = getActiveTrap();

  if (active == null) {
    return;
  }

  const els = state.elements.get(active);

  // @ts-expect-error
  els.delete(el);

  // @ts-expect-error
  active.updateContainerElements([...els.values()]);
};

export { FocusTrap, Options, Element, ElementList };
export { createFocusTrap, addToActive, removeFromActive };
