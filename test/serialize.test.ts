import { describe, expect, test } from 'vitest';

import { serialize, type MailmapEntry } from '../src/index.js';
import conformance from './fixtures/conformance.json';

describe('serialize', () => {
  test.each(conformance.serialize)('$name', ({ entries, output }) => {
    expect(serialize(entries as MailmapEntry[])).toBe(output);
  });

  test('rejects an entry that changes nothing', () => {
    const entry: MailmapEntry = {
      newName: null,
      newEmail: null,
      oldEmail: 'old@email',
      oldName: null,
    };

    expect(() => serialize([entry])).toThrow(TypeError);
  });

  test('rejects a name-specific entry without a canonical email', () => {
    const entry: MailmapEntry = {
      newName: 'Canonical',
      newEmail: null,
      oldEmail: 'old@email',
      oldName: 'Old Name',
    };

    expect(() => serialize([entry])).toThrow(TypeError);
  });
});
