import { describe, expect, test } from 'vitest';

import { parse } from '../src/index.js';
import conformance from './fixtures/conformance.json';

describe('parse', () => {
  test.each(conformance.parse)('$name', ({ input, entries }) => {
    expect(parse(input)).toEqual(entries);
  });
});
