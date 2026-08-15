export interface MailmapEntry {
  /** Canonical name to map to (`null` keeps the original). */
  newName: string | null;
  /** Canonical email to map to (`null` keeps the original). */
  newEmail: string | null;
  /** Email to match, normalized to lowercase ASCII. */
  oldEmail: string;
  /** Name to match for a name-specific entry. */
  oldName: string | null;
}

export interface Identity {
  name: string | null;
  email: string;
}

interface ParsedIdentity {
  name: string | null;
  email: string;
  rest: string;
}

/** Parse `.mailmap` content into entries in file order. */
export function parse(content: string): MailmapEntry[] {
  const entries: MailmapEntry[] = [];

  for (const line of content.split('\n')) {
    if (line.startsWith('#')) continue;

    const first = parseIdentity(line, false);
    if (first === null) continue;

    const second = parseIdentity(first.rest, true);
    if (second !== null) {
      entries.push({
        newName: first.name,
        newEmail: first.email,
        oldEmail: asciiLower(second.email),
        oldName: second.name,
      });
    } else if (first.name !== null) {
      entries.push({
        newName: first.name,
        newEmail: null,
        oldEmail: asciiLower(first.email),
        oldName: null,
      });
    }
  }

  return entries;
}

/** Resolve an identity through parsed mailmap entries. */
export function resolve(
  entries: readonly MailmapEntry[],
  name: string | null,
  email: string,
): Identity {
  let specific: MailmapEntry | null = null;
  let generalName: string | null = null;
  let generalEmail: string | null = null;
  let hasGeneral = false;

  for (const entry of entries) {
    if (!asciiEqual(entry.oldEmail, email)) continue;

    if (entry.oldName === null) {
      hasGeneral = true;
      if (entry.newName !== null) generalName = entry.newName;
      if (entry.newEmail !== null) generalEmail = entry.newEmail;
    } else if (name !== null && asciiEqual(entry.oldName, name)) {
      specific = entry;
    }
  }

  if (specific !== null) {
    return {
      name: specific.newName ?? name,
      email: specific.newEmail ?? email,
    };
  }

  if (hasGeneral) {
    return {
      name: generalName ?? name,
      email: generalEmail ?? email,
    };
  }

  return { name, email };
}

/** Serialize entries to canonical `.mailmap` lines. */
export function serialize(entries: readonly MailmapEntry[]): string {
  return entries.map(serializeEntry).join('');
}

function serializeEntry(entry: MailmapEntry): string {
  if (entry.oldName !== null) {
    if (entry.newEmail === null) {
      throw new TypeError('A name-specific entry requires a canonical email');
    }

    const canonicalName = serializeNamePrefix(entry.newName);
    return `${canonicalName}<${entry.newEmail}> ${entry.oldName} <${entry.oldEmail}>\n`;
  }

  if (entry.newEmail !== null) {
    const canonicalName = serializeNamePrefix(entry.newName);
    return `${canonicalName}<${entry.newEmail}> <${entry.oldEmail}>\n`;
  }

  if (entry.newName !== null) {
    return `${serializeNamePrefix(entry.newName)}<${entry.oldEmail}>\n`;
  }

  throw new TypeError('A mailmap entry must change a name or email');
}

function serializeNamePrefix(name: string | null): string {
  if (name === null) return '';
  return `${name.startsWith('#') ? ' ' : ''}${name} `;
}

function parseIdentity(
  input: string,
  allowEmptyEmail: boolean,
): ParsedIdentity | null {
  const left = input.indexOf('<');
  if (left === -1) return null;

  const right = input.indexOf('>', left + 1);
  if (right === -1) return null;

  const email = input.slice(left + 1, right);
  if (!allowEmptyEmail && email.length === 0) return null;

  const name = input.slice(0, left).trim() || null;
  return { name, email, rest: input.slice(right + 1) };
}

function asciiLower(value: string): string {
  return value.replace(/[A-Z]/g, (character) =>
    String.fromCharCode(character.charCodeAt(0) + 32),
  );
}

function asciiEqual(left: string, right: string): boolean {
  return asciiLower(left) === asciiLower(right);
}
