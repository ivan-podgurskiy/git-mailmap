# git-mailmap

Parse, resolve, and serialize Git `.mailmap` files in TypeScript. The package
has no runtime dependencies and works in Node.js 18 or newer, browsers, ESM,
and CommonJS.

## Install

```sh
npm install git-mailmap
```

## Usage

```ts
import { parse, resolve, serialize } from 'git-mailmap';

const entries = parse(`
Joe R. Developer <joe@example.com>
Jane Doe <jane@example.com> <jane@desktop.(none)>
`);

resolve(entries, 'Jane D.', 'jane@desktop.(none)');
// { name: 'Jane Doe', email: 'jane@example.com' }

serialize(entries);
// "Joe R. Developer <joe@example.com>\n..."
```

CommonJS is available through the same package entry point:

```js
const { parse, resolve, serialize } = require('git-mailmap');
```

## Entry format

`parse` returns `MailmapEntry[]`:

```ts
interface MailmapEntry {
  newName: string | null;
  newEmail: string | null;
  oldEmail: string;
  oldName: string | null;
}
```

The parser accepts the Git-compatible forms below:

```text
Proper Name <commit@email>
<proper@email> <commit@email>
Proper Name <proper@email> <commit@email>
Proper Name <proper@email> Commit Name <commit@email>
<proper@email> Commit Name <commit@email>
```

Only a `#` in the first column starts a comment. Matching of names and emails
uses ASCII case-insensitive comparison, as Git does.

## API

### `parse(content)`

Parses a `.mailmap` string into entries in file order. Invalid lines are
silently ignored, matching Git. Emails used for matching are normalized to
lowercase ASCII.

### `resolve(entries, name, email)`

Returns the canonical `{ name, email }` identity. Email and name matching use
ASCII case-insensitive comparison. A matching name-and-email entry takes
priority over a general email entry. Repeated general entries update only the
fields they specify, matching Git's cumulative behavior.

### `serialize(entries)`

Serializes entries to canonical `.mailmap` lines with a trailing newline.
Programmatically constructed entries that cannot be represented in the format
throw `TypeError`.

## Scope

The package handles strings only. Reading `.mailmap` files, Git configuration,
Git blobs, and command-line integration are intentionally left to consumers.

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for planned compatibility, testing, and
performance work.

## License

MIT. See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for compatibility
research provenance.
