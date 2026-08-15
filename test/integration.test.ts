import { describe, expect, test } from 'vitest';

import { parse, resolve, serialize } from '../src/index.js';
import conformance from './fixtures/conformance.json';

describe('integration', () => {
  test('resolves the gitmailmap(5) examples', () => {
    const entries = parse(`
Joe R. Developer <joe@example.com>
Jane Doe <jane@example.com> <jane@laptop.(none)>
Jane Doe <jane@example.com> <jane@desktop.(none)>
`);

    expect(resolve(entries, 'Jane D.', 'jane@desktop.(none)')).toEqual({
      name: 'Jane Doe',
      email: 'jane@example.com',
    });
    expect(resolve(entries, 'Joe Developer', 'joe@example.com')).toEqual({
      name: 'Joe R. Developer',
      email: 'joe@example.com',
    });
  });

  test.each(conformance.parse)('round-trips $name', ({ input }) => {
    const entries = parse(input);

    expect(parse(serialize(entries))).toEqual(entries);
  });
});
