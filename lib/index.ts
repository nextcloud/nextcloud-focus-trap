import type { Options, FocusTrap } from "focus-trap";
import { createFocusTrap as create } from 'focus-trap'

type Element = HTMLElement | SVGElement | string;
type ElementList = Array<Element>;

const extra = new WeakMap<FocusTrap, Set<Element>>();

const state = {
  list: [] as FocusTrap[],
};

// window._nc_focus_trap

const createFocusTrap = (
  element: Element | ElementList,
  userOptions?: Options
): FocusTrap => {
  const real = create(element, userOptions);

  const els = new Set(Array.isArray(element) ? [...element] : [element]);

  extra.set(real, els);

  const activate = (...args) => {
    state.list.forEach((row) => {
      row.pause();
    });

    state.list.push(real);

    return real.activate(...args);
  };

  const deactivate = (...args) => {
    const res = real.deactivate(...args);

    const index = state.list.findIndex((row) => row === real);

    if (index >= 0) {
      state.list.slice(index, 1);
    }

    const last = state.list[state.list.length - 1];

    if (last && last.paused) {
      last.unpause();
    }

    return res;
  };

  return new Proxy(real, {
    get(target, p, receiver) {
      if (p === "activate") {
        return activate;
      }

      if (p === "deactivate") {
        return deactivate;
      }

      // Deliberately ignoring pause and unpause
      // as the scenario of pausing while being
      // active and used is very unlikely

      // return the expected/original prop
      return target[p];
    },
  });
};

const getActiveTrap = (): FocusTrap | undefined => {
  return state.list.find(row=> row.active)
}

const addToActive = (el: Element) => {
  const active = getActiveTrap();

  if (!active) {
    return;
  }

  const els = extra.get(active);

  // @ts-expect-error
  els.add(el);

  // @ts-expect-error
  return active.updateContainerElements([...els.values()]);
};

const removeFromActive = (el: Element) => {
  const active = getActiveTrap();

  if (!active) {
    return;
  }

  const els = extra.get(active);

  // @ts-expect-error
  els.delete(el);

  // @ts-expect-error
  return active.updateContainerElements([...els.values()]);
};

export { FocusTrap, Options };
export { createFocusTrap, getActiveTrap, addToActive, removeFromActive };