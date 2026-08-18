# git-mailmap — Git `.mailmap` for JavaScript and TypeScript

[![CI](https://github.com/ivan-podgurskiy/git-mailmap/actions/workflows/ci.yml/badge.svg)](https://github.com/ivan-podgurskiy/git-mailmap/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/git-mailmap.svg)](https://www.npmjs.com/package/git-mailmap)
[![Types](https://img.shields.io/npm/types/git-mailmap.svg)](https://www.npmjs.com/package/git-mailmap)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

`git-mailmap` is a zero-dependency JavaScript and TypeScript parser, identity
resolver, and serializer for Git `.mailmap` files. A mailmap maps historical
contributor names and email addresses to canonical author and committer
identities, so aliases are treated as the same person.

Use `git-mailmap` when an application needs to process those mappings without
invoking Git or reading a repository. The package works in Node.js 20 or newer
and browsers, ships ESM and CommonJS builds with TypeScript declarations, and
has no runtime dependencies.

## Features

- Parse the five Git `.mailmap` entry forms into ordered, typed objects.
- Resolve author or committer aliases with Git-compatible matching and
  precedence.
- Serialize parsed or programmatically constructed entries to canonical
  `.mailmap` lines.
- Handle comments, invalid lines, repeated mappings, and ASCII
  case-insensitive names and emails like Git.
- Use the same side-effect-free package from ESM, CommonJS, Node.js, and
  browser bundles.
- Run without filesystem, network, or Git process access.

## Install

```sh
npm install git-mailmap
```

## Quick start

Parse mailmap content, resolve an alias, and serialize the mappings again:

```ts
import { parse, resolve, serialize } from 'git-mailmap';

const entries = parse(`
Joe R. Developer <joe@example.com>
Jane Doe <jane@example.com> <jane@desktop.(none)>
`);

resolve(entries, 'Jane D.', 'jane@desktop.(none)');
// { name: 'Jane Doe', email: 'jane@example.com' }

serialize(entries);
// "Joe R. Developer <joe@example.com>\nJane Doe <jane@example.com> <jane@desktop.(none)>\n"
```

CommonJS uses the same package entry point:

```js
const { parse, resolve, serialize } = require('git-mailmap');
```

## Mailmap entry format

`parse` returns `MailmapEntry[]` in file order:

```ts
interface MailmapEntry {
  newName: string | null;
  newEmail: string | null;
  oldEmail: string;
  oldName: string | null;
}
```

The parser accepts all five Git-compatible forms:

```text
Proper Name <commit@email>
<proper@email> <commit@email>
Proper Name <proper@email> <commit@email>
Proper Name <proper@email> Commit Name <commit@email>
<proper@email> Commit Name <commit@email>
```

A `#` starts a comment only in the first column. Invalid lines are silently
ignored, matching Git. Emails stored for matching are normalized to lowercase
ASCII.

## Identity resolution

`resolve(entries, name, email)` takes parsed entries plus a contributor name
and email, then returns the canonical `{ name, email }` identity.

- Names and emails are compared using ASCII case-insensitive matching.
- A matching name-and-email entry takes priority over a general email entry.
- Repeated general entries update only the fields they specify, matching Git's
  cumulative behavior.
- When no entry matches, the input name and email are returned unchanged.

## Use cases

- Canonicalize contributor identities before generating credits, reports, or
  repository analytics.
- Reconcile historical names and email addresses while importing Git commit
  metadata into a Node.js service, build tool, or browser application.
- Apply mailmap content supplied by a repository host or Git client without
  spawning `git check-mailmap`.
- Parse, transform, and serialize generated `.mailmap` mappings in release or
  developer tooling.

## API

### `parse(content)`

Parses a `.mailmap` string into entries in file order. Invalid lines are
silently ignored.

### `resolve(entries, name, email)`

Resolves a name and email through parsed entries and returns their canonical
identity.

### `serialize(entries)`

Serializes entries to canonical `.mailmap` lines with a trailing newline.
Programmatically constructed entries that cannot be represented in the format
throw `TypeError`.

## Runtime support and scope

The package exports ESM and CommonJS builds plus `.d.ts` and `.d.cts`
TypeScript declarations. Node.js 20 or newer is supported. The implementation
uses platform-neutral string operations and can be bundled for browsers.

`git-mailmap` implements the string-based parsing, matching, precedence, and
serialization behavior documented above. Compatibility is covered by unit,
integration, and shared cross-implementation conformance tests.

The package does not read `.mailmap` files, inspect Git configuration, load Git
blobs, discover repositories, or provide a command-line interface. File I/O,
repository access, and Git integration remain the caller's responsibility.

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for planned compatibility, testing, and
performance work.

## License

MIT.
