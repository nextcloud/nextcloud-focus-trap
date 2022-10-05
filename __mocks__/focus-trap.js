import { vi } from 'vitest';

const createFocusTrap = vi.fn().mockImplementation(() => {
  const instance = {
    paused: false,
    active: false,
    updateContainerElements: vi.fn(),
    activate: vi.fn(() => {
      instance.active = true;
      return instance;
    }),
    deactivate: vi.fn(() => {
      instance.active = false;
      return instance;
    }),
    pause: vi.fn(() => {
      instance.paused = true;
      return instance;
    }),
    unpause: vi.fn(() => {
      instance.paused = false;
      return instance;
    }),
  };

  return instance;
});

export { createFocusTrap };
