# prompt-lib

Shared UI components for the **AET Prompt** system, an educational platform for managing courses, assessments, and student participation.

This repository contains one npm package:

| Package | Description |
|---|---|
| [`@tumaet/prompt-ui-components`](./prompt-ui-components) | Reusable React UI components built on shadcn/ui |

The shared state package now lives in its own repository:

| Package | Repository |
|---|---|
| [`@tumaet/prompt-shared-state`](https://www.npmjs.com/package/@tumaet/prompt-shared-state) | [`prompt-shared-state`](https://github.com/prompt-edu/prompt-shared-state) |

Both packages are designed for use in **Module Federation** microfrontend architectures, where they must be loaded as singletons to ensure consistent state and UI across independently deployed apps.

---

## Packages

### @tumaet/prompt-ui-components

Provides:
- **36+ shadcn/ui base components** (buttons, dialogs, forms, tables, etc.)
- **PromptTable** — advanced data table with sorting, filtering, pagination, row selection, and URL-synced state
- **MinimalTiptapEditor** — rich text editor with toolbar, code highlighting, image support, and link management
- **Custom components** — date pickers, multi-select, management page headers, score level selectors, and more

See the [prompt-ui-components README](./prompt-ui-components/readme.md) for full documentation.

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
cd prompt-ui-components
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
cd prompt-ui-components && yarn build
```

---

## Publishing Packages

The package is published to npm when you create a GitHub release.

### 1. Update Package Version

Ensure `prompt-ui-components/package.json` has the version number matching your intended release tag.

```bash
cd prompt-ui-components
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

1. **Validates** that `prompt-ui-components/package.json` matches the release tag
2. **Builds** the package
3. **Publishes** `@tumaet/prompt-ui-components` to npm

If there is a version mismatch, the workflow fails with a clear error.

---

## Package Information

| Package | Latest Version | Description |
|---|---|---|
| [@tumaet/prompt-ui-components](https://www.npmjs.com/package/@tumaet/prompt-ui-components) | ![npm](https://img.shields.io/npm/v/@tumaet/prompt-ui-components) | Reusable React UI components |
