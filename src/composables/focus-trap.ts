import type { ComputedRef, Ref } from 'vue';
import type { FocusTrap } from '../../lib';

import { watchEffect, onBeforeUnmount } from 'vue';
import { createFocusTrap } from '../../lib';

type Input = ComputedRef<boolean> | Ref<boolean>;

const useFocusTrap = (state: Input, el: Ref<HTMLElement | null>): void => {
  let focusTrap: FocusTrap | null = null;

  const onOpen = (): void => {
    if (el.value == null) {
      return;
    }

    focusTrap = createFocusTrap(el.value, {
      escapeDeactivates: false,
      allowOutsideClick: true,
    });

    focusTrap.activate();
  };

  const onClose = (): void => {
    if (focusTrap == null) {
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
