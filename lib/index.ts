import type { Options, FocusTrap } from 'focus-trap';
import type { FocusTrapGlobalState, Element, ElementList } from './types';

import { createFocusTrap as create } from 'focus-trap';
import { SymbolRealInstance } from './utils';

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
  const real = create(element, userOptions);

  const els = new Set(Array.isArray(element) ? [...element] : [element]);

  state.elements.set(real, els);

  const activate: typeof real.activate = (...args) => {
    state.list.forEach(row => {
      row.pause();
    });

    state.list.push(real);

    return real.activate(...args);
  };

  const deactivate: typeof real.deactivate = (...args) => {
    const res = real.deactivate(...args);
    const index = state.list.findIndex(row => row === real);

    if (index >= 0) {
      state.list.splice(index, 1);
    }

    const last = state.list[state.list.length - 1];

    if (last?.paused) {
      last.unpause();
    }

    return res;
  };

  return new Proxy(real, {
    get(target, p: keyof FocusTrap | symbol) {
      if (p === 'activate') {
        return activate;
      }

      if (p === 'deactivate') {
        return deactivate;
      }

      if (p === SymbolRealInstance) {
        return target;
      }
      // Deliberately ignoring pause and unpause
      // as the scenario of pausing while being
      // active and used is very unlikely

      // return the expected/original prop
      return target[p as keyof FocusTrap];
    },
  });
};

const getActiveTrap = (): FocusTrap | undefined => {
  return state.list.find(row => row.active);
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

export { FocusTrap, Options };
export { createFocusTrap, getActiveTrap, addToActive, removeFromActive };
