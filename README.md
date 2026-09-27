# prompt-ui-components

A shared UI component library for the **AET Prompt** system, built on [shadcn/ui](https://ui.shadcn.dev/).

Components are designed for **Module Federation** singleton usage, which ensures:
- A **consistent UI experience** across microfrontends
- **Reduced bundle size** by avoiding duplicate component loading
- **Unified UI state** such as shared toast handling across apps

For shared state primitives and shared TypeScript interfaces, use [`@tumaet/prompt-shared-state`](https://github.com/prompt-edu/prompt-shared-state).

---

## Package

`@tumaet/prompt-ui-components` provides:
- **36+ shadcn/ui base components** (buttons, dialogs, forms, tables, etc.)
- **PromptTable** — advanced data table with sorting, filtering, pagination, row selection, and URL-synced state
- **MinimalTiptapEditor** — rich text editor with toolbar, code highlighting, image support, and link management
- **Custom components** — date pickers, multi-select, management page headers, score level selectors, and more

---

## Server-paged tables

`PromptTable` and `PromptTableURL` own a search box, sortable column headers and a pagination bar,
and all three act on the rows currently in `data`. That is right for a table holding the whole data
set and wrong for one fed a single server page: the search would narrow the page instead of the
data set, and the headers would reorder it.

A consumer that drives those concerns itself hands them over with `serverDriven`:

```tsx
// The consumer searches, sorts and pages on the server and passes one page at a time.
<PromptTable data={page.entries} columns={columns} serverDriven />

// Or per concern - here the table still owns the search box and the column headers.
<PromptTable data={page.entries} columns={columns} serverDriven={{ pagination: true }} />
```

| Flag         | What the table stops doing                                               |
| ------------ | ------------------------------------------------------------------------ |
| `search`     | drops the built-in search box; the global filter no longer narrows `data` |
| `sorting`    | renders plain column headers; `data` is no longer reordered              |
| `pagination` | drops the pagination bar; every row in `data` renders as one page        |

`serverDriven: true` is shorthand for all three. Column `filters` stay client-side either way; when
the search box is gone the filter menu moves out of it and gets its own button.

The prop only stops the table from doing the work - fetching the matching page stays with the
consumer. `onSortingChange`, `onSearchChange` and `onColumnFiltersChange` report the state the table
still owns and are safe to hang a request on: they fire once the table has committed the new value.

---

## Date pickers

`DatePicker` and `DatePickerWithRange` are typable text fields with a calendar button. Dates are
shown as `dd.MM.yyyy`; typing also accepts `d.M.yyyy`, `dd/MM/yyyy` and ISO `yyyy-MM-dd`. Typed
text commits on Enter or blur, shows as invalid while it is not a real day, and reverts to the last
valid date when left that way. Clearing a field selects no date.

```tsx
<DatePicker id='releaseDate' date={date} onSelect={setDate} />

// Adds an HH:mm field. A new date keeps the selected time; a first date gets defaultTime.
<DatePicker date={deadline} onSelect={setDeadline} withTime defaultTime='23:59' />

// Separate start and end fields. A typed end before the start swaps them, a typed start after the
// end clears the end, and an end without a start is only selected once a start is typed.
<DatePickerWithRange date={range} setDate={setRange} />
```

---

## Participant navigation

`ParticipantNavigation` puts previous / next buttons on a participant's detail page, at the left
and right edge, with the current position (`3 / 12`) between them. The buttons carry the
neighbors' names from `md` up and truncate long ones; below that they show only the chevron.

```tsx
// `participants` is already in the order to step through, e.g. the sorted or filtered list the
// detail page was opened from. The page decides the URL.
<ParticipantNavigation
  participants={orderedParticipations}
  currentId={participation.courseParticipationID}
  onNavigate={(p) => navigate(`../${p.courseParticipationID}`, { relative: 'path' })}
  colorByStatus
/>
```

| Prop            | Default | Effect                                                              |
| --------------- | ------- | ------------------------------------------------------------------- |
| `colorByStatus` | `false` | tints each button with the pass status of the participant it leads to |
| `wrapAround`    | `false` | continues from the last participant to the first and vice versa     |

Without `wrapAround` the previous button is disabled on the first participant and the next button
on the last, so reaching the end of the list is visible.

When the detail page is opened from a `PromptTable`, the order comes from the table: `onRowClick`
receives every row as the table shows it (searched, filtered and sorted, across all pages) as its
second argument.

```tsx
<PromptTable
  data={rows}
  columns={columns}
  onRowClick={(row, orderedRows) =>
    navigate(`${row.id}`, { state: { order: orderedRows.map((r) => r.id) } })
  }
/>
``` The underlying `getNavigationNeighbors`
is exported for pages that need the neighbors without the buttons.

---

## Prerequisites

This project uses **Yarn 4** as specified in the `packageManager` field of each `package.json`. To work with this repository, enable Corepack, which will automatically use the correct Yarn version.

```bash
corepack enable
```

Corepack is included by default with Node.js 16.9+ and 14.19+. If you see an error like:

```text
error This project's package.json defines "packageManager": "yarn@4.13.0". However the current global version of Yarn is 1.22.22.
```

Run `corepack enable` to fix it.

---

## Development

### Building Locally

```bash
yarn install
yarn build
```

### Linting

```bash
# From within the package directory
yarn lint
```

### Unit Tests

```bash
yarn test
```

Vitest runs the colocated `src/**/*.test.ts` files in a node environment; they are left out of the
build.

### Testing Before Release

```bash
yarn build
```

---

## Publishing Packages

The package is published to npm when you create a GitHub release.

### 1. Update Package Version

Ensure `package.json` has the version number matching your intended release tag.

```bash
yarn version patch   # 1.2.3 -> 1.2.4
# or: yarn version minor  (1.2.3 -> 1.3.0)
# or: yarn version major  (1.2.3 -> 2.0.0)
```

Or edit the `package.json` file manually.

### 2. Create a GitHub Release

1. Go to the [Releases page](../../releases)
2. Click **"Create a new release"**
3. Create a new tag with the format `v{version}` (for example, `v1.2.3`)
4. Set the release title and add release notes
5. Click **"Publish release"**

### 3. Automated Publishing

Once you publish the release, the GitHub Actions workflow:

1. **Validates** that `package.json` matches the release tag
2. **Builds** the package
3. **Publishes** `@tumaet/prompt-ui-components` to npm

If there is a version mismatch, the workflow fails with a clear error.

---

## Package Information

| Package | Latest Version | Description |
|---|---|---|
| [@tumaet/prompt-ui-components](https://www.npmjs.com/package/@tumaet/prompt-ui-components) | ![npm](https://img.shields.io/npm/v/@tumaet/prompt-ui-components) | Reusable React UI components |
