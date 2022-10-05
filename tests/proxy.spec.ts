import { describe, expect, test } from 'vitest';
import { createFocusTrap, FocusTrap } from '@nextcloud/focus-trap';

type NativeTypes = 'boolean' | 'function';

type Keys = keyof FocusTrap;

describe('proxy access', () => {
  const trap = createFocusTrap(null);

  test.each<[Keys, NativeTypes]>([
    ['activate', 'function'],
    ['active', 'boolean'],
    ['deactivate', 'function'],
    ['pause', 'function'],
    ['paused', 'boolean'],
    ['unpause', 'function'],
    ['updateContainerElements', 'function'],
  ])('%s shold be %s', (prop, expected) => {
    expect(trap[prop]).toBeTypeOf(expected);
  });
});
