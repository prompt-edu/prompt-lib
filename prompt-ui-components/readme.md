# prompt-ui-components

A shared UI component library for the **AET Prompt** system, built on [shadcn/ui](https://ui.shadcn.dev/).

Components are loaded as **Module Federation singletons**, which ensures:
- A **consistent UI experience** across all microfrontends
- **Reduced bundle size** by avoiding duplicate component loading
- **Unified UI state** (e.g., global toast notifications shared across apps)

## Installation

```bash
# Using Yarn
yarn add @tumaet/prompt-ui-components

# Using npm
npm install @tumaet/prompt-ui-components
```

### Import CSS

Import the stylesheet in your app's entry point to include component styles:

```ts
import '@tumaet/prompt-ui-components/index.css'

// If using the rich text editor, also import its styles:
import '@tumaet/prompt-ui-components/minimal-tiptap/index.css'
```

---

## Components

### shadcn/ui Base Components

All standard shadcn/ui components are re-exported from this package:

```ts
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  // ...and many more
} from '@tumaet/prompt-ui-components'
```

Available components include: Accordion, Alert, Alert Dialog, Avatar, Badge, Breadcrumb, Button, Calendar, Card, Checkbox, Collapsible, Command, Dialog, Dropdown Menu, Form, Input, Label, Popover, Progress, Radio Group, Scroll Area, Select, Separator, Sheet, Sidebar, Skeleton, Switch, Table, Tabs, Textarea, Toast/Toaster, Toggle, Toggle Group, and Tooltip.

---

### PromptTable

An advanced data table built on [TanStack Table](https://tanstack.com/table), with sorting, filtering, pagination, row selection, and bulk actions.

```tsx
import { PromptTable } from '@tumaet/prompt-ui-components'

<PromptTable
  data={students}
  columns={studentColumns}
  filters={[
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: ['active', 'inactive'],
      optionLabel: (value) => value === 'active' ? 'Active' : 'Inactive',
    },
  ]}
  actions={[
    {
      label: 'Delete',
      icon: <TrashIcon />,
      onAction: (selectedRows) => deleteStudents(selectedRows),
      confirm: {
        title: 'Delete students?',
        description: 'This action cannot be undone.',
      },
    },
  ]}
  onRowClick={(row) => navigate(`/students/${row.id}`)}
  pageSize={20}
/>
```

**Props:**

| Prop | Type | Description |
|---|---|---|
| `data` | `T[]` | Array of row data objects (must have an `id` field) |
| `columns` | `ColumnDef<T>[]` | TanStack column definitions (auto-generated if omitted) |
| `filters` | `TableFilter[]` | Filter configurations (`select`, `numericRange`, or `custom`) |
| `actions` | `RowAction<T>[]` | Bulk row action buttons |
| `onRowClick` | `(row: T) => void` | Callback when a row is clicked |
| `pageSize` | `number` | Rows per page (default: `20`) |
| `initialState` | `InitialTableState` | Initial sorting/filter state |
| `onSortingChange` | `(sorting) => void` | Callback on sort change |
| `onSearchChange` | `(search: string) => void` | Callback on search input change |
| `onColumnFiltersChange` | `(filters) => void` | Callback on filter change |

**Features:**
- Global search input
- Column sorting (click headers)
- Filter menu with active filter badges
- Checkbox row selection
- Configurable bulk actions with optional confirmation dialog
- Column visibility toggling
- Pagination with configurable page size

---

### PromptTableURL

Extends `PromptTable` to synchronize table state (sorting, filters, search) with URL query parameters. Table state persists across page reloads and is shareable via URL.

```tsx
import { PromptTableURL } from '@tumaet/prompt-ui-components'

<PromptTableURL
  data={students}
  columns={studentColumns}
  filters={filters}
  // All PromptTable props are supported
/>
```

URL query parameters used: `sorting`, `filters`, `search` (configurable).

---

### MinimalTiptapEditor

A WYSIWYG rich text editor based on [Tiptap v2](https://tiptap.dev/).

```tsx
import { MinimalTiptapEditor } from '@tumaet/prompt-ui-components'
import '@tumaet/prompt-ui-components/minimal-tiptap/index.css'

function MyForm() {
  const [content, setContent] = useState('')

  return (
    <MinimalTiptapEditor
      value={content}
      onChange={setContent}
      className="min-h-[200px]"
    />
  )
}
```

**Props:**

| Prop | Type | Description |
|---|---|---|
| `value` | `Content` | Current editor content (HTML string or Tiptap JSON) |
| `onChange` | `(value: Content) => void` | Called when content changes |
| `className` | `string` | CSS class for the outer wrapper |
| `editorContentClassName` | `string` | CSS class for the editor content area |

**Toolbar features:**
- Headings (H1–H6)
- Bold, italic, underline, strikethrough, inline code, clear formatting
- Text color
- Ordered and unordered lists
- Code blocks with syntax highlighting (via highlight.js)
- Blockquotes and horizontal rules
- Image insertion with resize handles
- Link management
- Undo/redo

Variants for specific contexts:
- `DescriptionMinimalTiptapEditor` — compact variant for form description fields
- `MailingTiptapEditor` — variant configured for email content

---

### DatePicker

A calendar-based date picker using a Popover.

```tsx
import { DatePicker } from '@tumaet/prompt-ui-components'

<DatePicker
  date={selectedDate}
  onSelect={setSelectedDate}
/>
```

---

### DatePickerWithRange

Selects a start and end date.

```tsx
import { DatePickerWithRange } from '@tumaet/prompt-ui-components'

<DatePickerWithRange
  date={dateRange}
  setDate={setDateRange}
/>
```

---

### MultiSelect

A multi-value select component with animations and variant support.

```tsx
import { MultiSelect } from '@tumaet/prompt-ui-components'

<MultiSelect
  options={[
    { label: 'React', value: 'react' },
    { label: 'TypeScript', value: 'ts' },
  ]}
  defaultValue={selected}
  onValueChange={setSelected}
  placeholder="Select frameworks..."
/>
```

---

### DeleteConfirmation

A confirmation dialog specifically for destructive delete actions.

```tsx
import { DeleteConfirmation } from '@tumaet/prompt-ui-components'

<DeleteConfirmation
  isOpen={showDialog}
  setOpen={setShowDialog}
  onClick={(confirmed) => { if (confirmed) handleDelete() }}
  deleteMessage="This will permanently delete the course."
/>
```

---

### SaveChangesAlert

A fixed-position alert bar shown when there are unsaved changes, with Save and Revert buttons.

```tsx
import { SaveChangesAlert } from '@tumaet/prompt-ui-components'

<SaveChangesAlert
  message="You have unsaved changes"
  saveChanges={handleSave}
  handleRevert={handleRevert}
  onClose={handleClose}
/>
```

---

### ScoreLevelSelector

A selector for the five assessment score levels (VeryGood, Good, Ok, Bad, VeryBad).

```tsx
import { ScoreLevelSelector } from '@tumaet/prompt-ui-components'
import { ScoreLevel } from '@tumaet/prompt-shared-state'

<ScoreLevelSelector
  selectedScore={ScoreLevel.Good}
  onScoreChange={(level) => setScore(level)}
  completed={false}
  descriptionsByLevel={{
    [ScoreLevel.VeryGood]: 'Excellent work',
    [ScoreLevel.Good]: 'Good work',
    [ScoreLevel.Ok]: 'Satisfactory',
    [ScoreLevel.Bad]: 'Needs improvement',
    [ScoreLevel.VeryBad]: 'Unsatisfactory',
  }}
/>
```

---

### Page Components

Pre-built full-page components for common application states:

```tsx
import {
  ErrorPage,
  LoadingPage,
  UnauthorizedPage,
  ManagementPageHeader,
} from '@tumaet/prompt-ui-components'

// Loading state
<LoadingPage />

// Error state
<ErrorPage message="Something went wrong." />

// Unauthorized access
<UnauthorizedPage />

// Management page header — pass the title as children
<ManagementPageHeader>Course Management</ManagementPageHeader>
```

---

## Hooks

```ts
import {
  useToast,
  useIsMobile,
  useCustomElementWidth,
  useScreenSize,
} from '@tumaet/prompt-ui-components'

// Toast notifications
const { toast } = useToast()
toast({ title: 'Saved!', description: 'Your changes have been saved.' })

// Detect mobile viewport
const isMobile = useIsMobile()

// Get an element's current width by element ID (returns a number)
const width = useCustomElementWidth('my-element-id')
// With optional pixel offset subtracted from the width:
const widthWithOffset = useCustomElementWidth('my-element-id', 16)

// Get current screen dimensions
const { width: screenWidth, height: screenHeight } = useScreenSize()
```

---

## Utilities

```ts
import { cn } from '@tumaet/prompt-ui-components'

// Merge Tailwind classes safely (clsx + tailwind-merge)
const className = cn('base-class', condition && 'conditional-class', 'override-class')
```

---

## Module Federation Configuration

To ensure components and state are shared as singletons in a Module Federation setup:

```js
new ModuleFederationPlugin({
  name: 'your-module',
  shared: {
    '@tumaet/prompt-ui-components': {
      singleton: true,
      requiredVersion: deps['@tumaet/prompt-ui-components'],
    },
    '@tumaet/prompt-shared-state': {
      singleton: true,
      requiredVersion: deps['@tumaet/prompt-shared-state'],
    },
    react: { singleton: true, requiredVersion: deps.react },
    'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
  },
})
```

---

## Contributing

As a member of the AET team, contribute changes by opening a pull request. Once merged, follow the release process described in the [repository root README](../README.md) to publish a new version.

### Versioning & Publishing

Publishing is triggered by creating a **GitHub Release**. The steps are:

1. Update the version in `prompt-ui-components/package.json` so it matches the release tag.
2. Create a GitHub Release with the tag `v{version}` (for example, `v1.2.3`).
3. The publish workflow validates the version and publishes `@tumaet/prompt-ui-components` to npm.

See the [root README](../README.md) for full details.
