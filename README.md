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
