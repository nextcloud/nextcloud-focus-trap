import type { FocusTrap } from "focus-trap";

export const SymbolRealInstance = Symbol("real-focus-trap");

// @private
export const getRealInstance = (proxy: FocusTrap): FocusTrap => {
  //@ts-ignore
  return proxy[SymbolRealInstance] as FocusTrap;
};
