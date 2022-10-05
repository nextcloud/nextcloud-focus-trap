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

## Development

This project is build on top of

- [focus-trap](https://github.com/focus-trap/focus-trap)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Vitest](https://vitest.dev/)
- [Vue](https://vuejs.org/)
- [Tailwindcss](https://tailwindcss.com/)

### Install dependencies

```sh
npm install
```

### Run tests

```sh
# test single run
npm run test

# test with coverage
npm run test -- --coverage

# watch tests and code changes
npm run test:watch
```

### Run demo app

```sh
npm run dev
```

### Linter & Format

```sh
# apply prettier
npm run format

# run eslint
npm run lint

# apply fix to eslint errors
npm run lint:fix

# check lint and format
npm run check
```
