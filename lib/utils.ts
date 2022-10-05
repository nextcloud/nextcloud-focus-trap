import type { FocusTrap } from 'focus-trap';

export const SymbolRealInstance = Symbol('real-focus-trap');

// @private
export const getActiveTrap = (): FocusTrap | undefined => {
  return window._nc_focus_trap.list.reverse().find(row => row.active);
};

// @private
export const getRealInstance = (proxy: FocusTrap): FocusTrap => {
  // @ts-expect-error
  return proxy[SymbolRealInstance] as FocusTrap;
};
