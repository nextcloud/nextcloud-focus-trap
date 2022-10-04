import type { ComputedRef, Ref } from "vue";
import type { FocusTrap } from "../../lib";

import { watchEffect, onBeforeUnmount, nextTick } from "vue";
import { createFocusTrap } from "../../lib";

type Input = ComputedRef<boolean> | Ref<boolean>;

const useFocusTrap = (state: Input, el: Ref<HTMLElement | null>) => {
  let focusTrap: FocusTrap | null = null;

  const onOpen = () => {

    if (!el.value) {
      return;
    }

    focusTrap = createFocusTrap(el.value, {
      escapeDeactivates: false,
      allowOutsideClick: true,
    });

    focusTrap.activate();
  };

  const onClose = () => {
    if (!focusTrap) {
      return;
    }

    focusTrap.deactivate();
    focusTrap = null;
  };

  watchEffect(() => {
    state.value
      ? requestAnimationFrame(onOpen)
      : requestAnimationFrame(onClose);
  });

  onBeforeUnmount(onClose);
};

export { useFocusTrap };
