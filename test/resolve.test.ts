import { describe, expect, test } from 'vitest';

import { parse, resolve } from '../src/index.js';
import conformance from './fixtures/conformance.json';

describe('resolve', () => {
  test.each(conformance.resolve)('$name', ({ mailmap, input, identity }) => {
    expect(resolve(parse(mailmap), input.name, input.email)).toEqual(identity);
  });
});
