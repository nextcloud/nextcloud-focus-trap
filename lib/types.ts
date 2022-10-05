import type { FocusTrap } from "focus-trap";

export type Element = HTMLElement | SVGElement | string;
export type ElementList = Array<Element>;

export type FocusTrapGlobalState = Readonly<{
  list: FocusTrap[];
  elements: WeakMap<FocusTrap, Set<Element>>;
}>;

declare global {
  interface Window {
    _nc_focus_trap: FocusTrapGlobalState;
  }
}
