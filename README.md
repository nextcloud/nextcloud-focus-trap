# @nextcloud/focus-trap

Wrapper over [`focus-trap`](https://github.com/focus-trap/focus-trap) library to have more than one instance activate at the same time.

## Install

```sh
npm install @nextcloud/focus-trap -S
```

```sh
yarn add @nextcloud/focus-trap
```

The API is the same of `focus-trap`, just follow the doc.

```js
import { createFocusTrap } from '@nextcloud/focus-trap';
```

## Example

### Vue.js v3

Check [`src/`](src/) to full example.

```ts
import type { ComputedRef, Ref } from 'vue';
import type { FocusTrap } from '@nextcloud/focus-trap';

import { watchEffect, onBeforeUnmount } from 'vue';
import { createFocusTrap } from '@nextcloud/focus-trap';

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
```
