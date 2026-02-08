# rsBEM — Layered CSS Naming System

[![Version](https://img.shields.io/badge/version-v2.0.0-blueviolet)](#)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Stylelint Rule](https://img.shields.io/badge/stylelint-rsBEM_Regex-informational?logo=stylelint)](#-stylelint-regex-rule)

> A file-system-grounded, layered CSS naming system for MVC projects.
> Three layers, one state convention — zero ambiguity.

---

## ℹ️ What is rsBEM?

**rsBEM** is a CSS naming system that organizes class names into **three distinct layers**, each with its own rules and scope. At its core, it combines three ideas:

| Letter | Stands for | Meaning |
|--------|-----------|---------|
| **r** | **Route / Root** | Class names are rooted in the file system — the folder and file path IS the namespace |
| **s** | **Scoped / Strict** | Styles are strictly scoped to their context — nothing leaks, nothing collides |
| **BEM** | **Block Element Modifier** | Uses the familiar `__element` and `--modifier` syntax from BEM |

---

## 🏗️ The Three Layers

| Layer | Name | Pattern | Scope |
|-------|------|---------|-------|
| **1** | **Template** | `folder-file__element--modifier` | Styles for a single `.tpl` file |
| **2** | **Component** | `block__element--modifier` | Shared, reusable UI components (library or project) |
| **3** | **Utility** | `prefix-value` | Single-purpose global helper classes |

Additionally, a **State Convention** (`is-*` / `has-*`) applies across Layers 1 and 2 for JS-toggled dynamic states.

```
┌────────────────────────────────────────────────────┐
│  Layer 1: Template (rsBEM)                         │
│  .sale-return_request__save-btn                    │
│  One class ↔ one template file                     │
├────────────────────────────────────────────────────┤
│  Layer 2: Component (Standard BEM)                 │
│  .modal__header    .btn--pri                  │
│  .admin-heading__title    .status--danger          │
│  Shared UI components (library or project)         │
├────────────────────────────────────────────────────┤
│  Layer 3: Utility                                  │
│  .d-flex    .margin-sm    .text-center              │
│  Single-purpose, composable classes                │
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤
│  State Convention (across Layers 1 & 2)            │
│  .is-open    .is-visible    .has-error              │
│  JS-toggled dynamic states                         │
└────────────────────────────────────────────────────┘
```

---

## 📐 Layer 1: Template (rsBEM)

The core rsBEM layer. Every class name maps directly to its template file — no guessing, no ambiguity.

### Purpose

In MVC applications with many templates, a recurring question arises:
**"Which file does this class belong to?"**

rsBEM addresses this by embedding the **file route** into every class name as a prefix. A `Ctrl + Shift + F` search on any class locates both the template and its styles.

### Syntax

```
[folder]-[file_name]__[element-name]--[modifier]
```

| Segment | Separator | Case | Description |
|---------|-----------|------|-------------|
| **folder** | start | preserves original | Template directory name (keeps snake_case if the directory uses it) |
| **file_name** | `-` after folder | preserves original | Template file name (keeps snake_case if the file uses it) |
| **element-name** | `__` | kebab-case | Describes **what** the element is |
| **modifier** | `--` | kebab-case | State or variant (active, error, disabled…) |

### Visual Breakdown

```
 sale-return_request__process-step--done
 ─┬── ──────┬──────  ─────┬──────  ─┬──
  │         │             │         │
folder   file_name     element   modifier
  r          r             BEM      BEM
  └── route-scoped ──┘  └── block element modifier ──┘
```

### Multi-Word Folder

When a folder name contains multiple words, it preserves its original form (typically snake_case):

```
 user_settings-profile_form__save-btn
 ─────┬─────  ─────┬──────  ───┬────
    folder      file_name    element
(snake_case   (snake_case   (kebab-case)
  preserved)   preserved)
```

> **Why hyphen as the separator?** Underscores are used *within* folder and file names (snake_case). The hyphen (`-`) is reserved exclusively as the folder↔file separator. This makes parsing unambiguous — a hyphen between the route prefix and `__` always marks the folder-file boundary.

### Nested Folders

When templates live in nested directories, each folder segment is separated by a hyphen — the same separator used between folder and file. The **last** hyphen-separated segment before `__` is always the file name; everything before it is a folder.

```
Template: view/marketplace/partner/claim.tpl
   Class: .marketplace-partner-claim__…
```

```
 marketplace-partner-claim__status-badge--error
 ─────┬───── ───┬──── ─┬──  ─────┬─────  ──┬──
   folder    folder   file    element    modifier
```

> **Why not underscores?** Folder and file names already use underscores internally (snake_case). If nested folders were also joined with underscores, `marketplace_partner` could mean either a single folder named `marketplace_partner` or two nested folders `marketplace/partner`. With hyphens, every hyphen in the prefix is **always** a path separator — no ambiguity.

### Core Principles

#### 1. File Mapping — The class IS the route

The prefix of every class maps 1:1 to its template path.

```
Template: view/sale/return_request.tpl
   Class: .sale-return_request__...

Template: view/catalog/product_form.tpl
   Class: .catalog-product_form__...

Template: view/common/dashboard.tpl
   Class: .common-dashboard__...

Multi-word folder:
Template: view/user_settings/profile_form.tpl
   Class: .user_settings-profile_form__...

Nested folder:
Template: view/marketplace/partner/claim.tpl
   Class: .marketplace-partner-claim__...
```

Any rsBEM class can be `grep`ped to find both its `.tpl` and `.scss` file.

#### 2. Flat Hierarchy — Describe what, not where

The DOM tree is not mirrored in class names. The element name describes **what it is**, not where it sits in the HTML structure.

```scss
// ❌ DOM-coupled nesting
.sale-return_request__form_footer_save_btn {}
.sale-return_request__table_row_cell_text {}

// ✅ Flat, descriptive identity
.sale-return_request__save-btn {}
.sale-return_request__table-text {}
```

Even if `save-btn` is nested 5 levels deep in the DOM, the class name stays flat.

#### 3. Semantic Grouping — Hyphen groups, underscore separates

When an element belongs to a logical group, use hyphens to express the relationship:

```scss
// "process" is a logical group
.sale-return_request__process-bar {}
.sale-return_request__process-step--done {}
.sale-return_request__process-icon {}
.sale-return_request__process-label {}
.sale-return_request__process-line--active {}
```

The word `process-` acts as a **semantic prefix** within the element name.
This is **not nesting** — it's grouping by meaning.

### ✅ Correct vs ❌ Incorrect

#### ✅ Correct (Flat & Scoped)

```scss
.sale-return_request__save-btn {}
.sale-return_request__product-list {}
.sale-return_request__process-step--done {}
.sale-return_request__status-badge--pending {}
.catalog-product_form__price-input {}
.catalog-product_form__image-preview--loading {}
.user_settings-profile_form__avatar {}         // multi-word folder
.marketplace-partner-claim__status-badge {}   // nested folder
```

#### ❌ Incorrect

```scss
// ❌ Generic — which page's button?
.btn-save {}
.status-badge {}

// ❌ DOM-coupled nesting
.sale-return_request__form_footer_btn {}

// ❌ Vague element name
.sale-return_request__step {}        // Process step? Form step?
.sale-return_request__text {}        // What text?

// ❌ Wrong separator in element
.sale-return_request__process_bubble {}  // underscore creates false hierarchy

// ❌ Folder name converted to kebab-case
.user-settings-profile_form__avatar {}  // folder MUST preserve original (user_settings, not user-settings)

// ❌ Nested folders joined with underscore instead of hyphen
.marketplace_partner-claim__status-badge {}  // use marketplace-partner-claim (hyphen joins path segments)
```

### Full Example

**Template:** `view/sale/return_request.tpl`
**Styles:** `scss/sale/return_request.scss`

```html
<div class="sale-return_request__container">

    <!-- Header -->
    <div class="sale-return_request__header">
        <h1 class="sale-return_request__page-title">Return Request #1234</h1>
        <span class="sale-return_request__status-badge--pending">Pending</span>
    </div>

    <!-- Process Bar -->
    <div class="sale-return_request__process-bar">
        <div class="sale-return_request__process-step--done">
            <div class="sale-return_request__process-icon">✓</div>
            <span class="sale-return_request__process-label">Application</span>
        </div>

        <div class="sale-return_request__process-line--active"></div>

        <div class="sale-return_request__process-step--active">
            <div class="sale-return_request__process-icon">2</div>
            <span class="sale-return_request__process-label">Review</span>
        </div>
    </div>

    <!-- Product Table -->
    <table class="sale-return_request__product-table">
        <tr class="sale-return_request__product-row">
            <td class="sale-return_request__product-name">Blue T-Shirt</td>
            <td class="sale-return_request__product-quantity">2</td>
            <td class="sale-return_request__product-status--approved">Approved</td>
        </tr>
    </table>

    <!-- Actions -->
    <div class="sale-return_request__action-bar">
        <button class="sale-return_request__save-btn">Save</button>
        <button class="sale-return_request__cancel-btn">Cancel</button>
    </div>

</div>
```

### SCSS Structure

rsBEM SCSS files mirror the template's file path:

```
view/sale/return_request.tpl
scss/sale/return_request.scss     ← styles live here
```

```scss
.sale-return_request {
    &__container {
        max-width: 960px;
        margin: 0 auto;
    }

    &__page-title {
        font-size: 1.5rem;
        font-weight: 700;

        @media (max-width: 768px) {
            font-size: 1.2rem;
        }
    }

    &__status-badge {
        padding: 4px 12px;
        border-radius: 4px;

        &--pending { background: #fff3cd; color: #856404; }
        &--approved { background: #d4edda; color: #155724; }
        &--rejected { background: #f8d7da; color: #721c24; }
    }

    &__process-step {
        display: flex;
        align-items: center;

        &--done { opacity: 0.6; }
        &--active { font-weight: bold; }
    }
}
```

### Stylelint Regex (Layer 1)

```json
{
  "rules": {
    "selector-class-pattern": [
      "^[a-z][a-z0-9]*(?:_[a-z0-9]+)*(?:-[a-z][a-z0-9]*(?:_[a-z0-9]+)*)+__[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:--[a-z0-9]+(?:-[a-z0-9]+)*)?$",
      {
        "message": "Class names must follow rsBEM: [folder]-[file_name]__[element-name]--[modifier]"
      }
    ]
  }
}
```

> **Regex breakdown:** A `segment` is `[a-z][a-z0-9]*(?:_[a-z0-9]+)*` (supports snake_case). The prefix is `segment(-segment)+` — one or more hyphen-separated segments (minimum 2: folder + file, more for nested folders). Then `__` separator, `element` = kebab-case, `--modifier` = optional kebab-case.

---

## 🧩 Layer 2: Component (Standard BEM)

Shared, reusable UI components — whether from a shared library or defined within a project.

### Purpose

Components are **not tied to a single template**. They appear across many pages, so file-path prefixes make no sense. Instead, they follow **standard BEM**: the block name describes the component, not its location. This applies to both library components and project-specific shared patterns.

### Syntax

```
block__element--modifier
```

| Segment | Separator | Case | Description |
|---------|-----------|------|-------------|
| **block** | start | kebab-case | Component name |
| **element** | `__` | kebab-case | Sub-part of the component |
| **modifier** | `--` | kebab-case | State or variant |

### Rules

1. **Block name** is kebab-case: `.slide-menu`, `.progress-bar`, `.filter-bar`
2. **Sub-elements use `__`**, never single hyphen:
   ```scss
   // ✅ Correct
   .tooltip__arrow {}
   .slide-menu__header {}
   .modal__close-button {}

   // ❌ Wrong — hyphen makes it ambiguous
   .tooltip-arrow {}      // Is this a block named "tooltip-arrow" or element of "tooltip"?
   .slide-menu-header {}  // Block "slide-menu-header" or element of "slide-menu"?
   ```
3. **Modifiers use `--`**, never class stacking for variants:
   ```scss
   // ✅ Correct — static variants use BEM modifiers
   .tooltip--top {}
   .btn--pri {}
   .modal__notification--error {}

   // ✅ Correct — dynamic states use is-*/has-* (see State Convention)
   .backdrop.is-visible {}
   .slide-menu.is-entering {}

   // ❌ Wrong — bare class stacking for variants
   .tooltip.top {}
   .modal__notification-list.error {}
   ```
4. **Block-only classes are allowed** — not every component needs elements:
   ```scss
   .btn {}           // block-only, modifiers via --
   .btn--pri {}
   .btn--lg {}
   ```

### Examples

```scss
// Modal
.modal {
    &__dialog { }
    &__header { }
    &__body { }
    &__footer { }
    &__close-button { }
    &__dialog--sm { }
    &__dialog--lg { }
}

// Button
.btn {
    &--pri { }
    &--danger { }
    &--lg { }
    &--sm { }
    &--loading { }  // component-specific loading (has spinner animation)
}

// Switch
.switch {
    &__container { }
    &__label { }
    &__slider { }
}

// Tooltip
.tooltip {
    &__arrow { }
    &--top { }
    &--right { }
    &--bottom { }
    &--left { }
}

// Project-specific components (also Layer 2)
.admin-heading {
    &__title { }
    &__actions { }
}

.status {
    &--success { }
    &--danger { }
    &--warning { }
}

.status-dot {
    &--active { }
    &--inactive { }
}
```

### How to distinguish from Layer 1?

- **Layer 1** classes always contain `__` and have a route prefix with at least **two** hyphen-separated segments before `__` (folder + file): `.sale-return_request__save-btn`
- **Layer 2** classes have a single block name before `__`: `.modal__header`

### Stylelint Regex (Layer 2)

```json
{
  "rules": {
    "selector-class-pattern": [
      "^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?(?:--[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?$",
      {
        "message": "Class names must follow BEM: block__element--modifier"
      }
    ]
  }
}
```

---

## 🔧 Layer 3: Utility

Single-purpose, composable classes for common CSS properties. No BEM structure — just `prefix-value`.

### Purpose

Utility classes provide **atomic styling** — one class, one CSS property (or a small group of related properties). They are global, reusable, and meant to be composed directly in HTML.

### Syntax

```
[prefix]-[value]
```

No `__` elements, no `--` modifiers. The prefix identifies the category; the value specifies the property.

### Prefix Table

| Category | Prefix | Examples |
|----------|--------|----------|
| **Display** | `d-` | `d-flex`, `d-grid`, `d-table`, `d-block`, `d-none` |
| **Flex** | `flex-` | `flex-center`, `flex-col`, `flex-wrap`, `flex-gap-sm` |
| **Grid** | `grid-` | `grid-cols-2`, `grid-cols-3`, `grid-auto-fit` |
| **Padding** | `padding-` | `padding-sm`, `padding-md`, `padding-y-sm`, `padding-x-md` |
| **Margin** | `margin-` | `margin-sm`, `margin-md`, `margin-y-sm`, `margin-l-sm` |
| **Text** | `text-` | `text-center`, `text-upper`, `text-nowrap` |
| **Font Size** | `fsi-` | `fsi-12`, `fsi-14`, `fsi-16`, `fsi-20` |
| **Font Weight** | `fwe-` | `fwe-regular`, `fwe-semibold`, `fwe-bold` |
| **Font Family** | `ffa-` | `ffa-sans`, `ffa-mono` |
| **Width** | `w-` | `w-full`, `w-auto`, `w-fit` |
| **Height** | `h-` | `h-full`, `h-auto`, `h-screen` |
| **Image** | `img-` | `img-responsive`, `img-circle`, `img-grayscale` |
| **Theme Color** | `tc-` | `tc-pri-500`, `tc-danger-500`, `tc-text-dark-1` |
| **Theme BG Color** | `tbc-` | `tbc-pri-100`, `tbc-grey-300` |
| **Position** | `pos-` | `pos-relative`, `pos-absolute`, `pos-sticky` |
| **Z-index** | `z-` | `z-10`, `z-50`, `z-max` |
| **Overflow** | `ovf-` | `ovf-hidden`, `ovf-auto`, `ovf-scroll` |
| **Cursor** | `cursor-` | `cursor-pointer`, `cursor-default` |
| **User-select** | `sel-` | `sel-none`, `sel-all` |
| **Visibility** | `vis-` | `vis-hidden--md-up`, `vis-show--lg-down` |

### Responsive Modifiers

Responsive breakpoints use the `--breakpoint-direction` suffix:

```scss
.d-none--md-up {}     // display: none from md breakpoint and up
.d-flex--lg-down {}   // display: flex from lg breakpoint and down
.vis-hidden--sm-up {} // visibility: hidden from sm and up
```

### Rules

1. **One prefix per category** — no aliases, no duplicates
2. **No BEM structure** — utility classes never use `__` or `--` (except responsive suffixes)
3. **Composable** — designed to be stacked in HTML:
   ```html
   <div class="d-flex flex-center flex-gap-md padding-sm">...</div>
   ```
4. **Stateless** — utilities describe appearance, not state. Use Layer 2 modifiers for state.

### SCSS Structure

Utility files are organized by prefix, one file per category:

```
scss/utilities/display.scss
scss/utilities/flex.scss
scss/utilities/spacing.scss
scss/utilities/typography.scss
scss/utilities/image.scss
```

```scss
// scss/utilities/spacing.scss

// Padding
.padding-sm  { padding: 8px; }
.padding-md  { padding: 16px; }
.padding-lg  { padding: 24px; }

.padding-y-sm { padding-top: 8px; padding-bottom: 8px; }
.padding-y-md { padding-top: 16px; padding-bottom: 16px; }
.padding-x-sm { padding-left: 8px; padding-right: 8px; }
.padding-x-md { padding-left: 16px; padding-right: 16px; }

// Margin
.margin-sm  { margin: 8px; }
.margin-md  { margin: 16px; }
.margin-lg  { margin: 24px; }

.margin-t-sm { margin-top: 8px; }
.margin-b-sm { margin-bottom: 8px; }
.margin-l-sm { margin-left: 8px; }
.margin-r-sm { margin-right: 8px; }
```

---

## 🔄 State Convention (`is-*` / `has-*`)

A cross-cutting convention for **dynamic states toggled by JavaScript**. State classes work within both Layer 1 (Template) and Layer 2 (Component) — they are not a separate layer, but a shared vocabulary for runtime state changes.

### Purpose

BEM modifiers (`--`) describe **static variants** set in HTML (e.g., `--danger`, `--lg`, `--top`). But dynamic states — toggled at runtime by JavaScript — are conceptually different. The `is-*` / `has-*` convention separates these concerns:

- **BEM modifier** = "what kind" (variant, set once) → `btn--danger`, `tooltip--top`
- **State class** = "what's happening" (dynamic, toggled by JS) → `is-open`, `is-loading`

### Syntax

| Prefix | Meaning | Use when | Examples |
|--------|---------|----------|----------|
| `is-` | Element's own state | The element itself changes state | `is-active`, `is-open`, `is-visible`, `is-hovering`, `is-selected`, `is-loading`, `is-entering`, `is-leaving`, `is-scroll-locked` |
| `has-` | Containment / ownership | The element contains or owns something | `has-error`, `has-children`, `has-dropdown` |

### Rules

1. **Scoped in SCSS** — state classes are always defined inside their component block, never standalone:
   ```scss
   // ✅ Correct — scoped to component
   .slide-menu {
     &.is-open { display: block; }
     &.is-entering { animation: menuSlideIn 0.3s forwards; }
     &.is-leaving  { animation: menuSlideOut 0.2s forwards; }
   }

   .backdrop {
     &.is-visible { opacity: 1; visibility: visible; }
   }

   .tabs__head-item {
     &.is-active { border-bottom-color: var(--color-pri-500); }
   }

   .sidebar__panel {
     &.is-open { left: 0; visibility: visible; }
   }

   // ❌ Wrong — standalone state class with no scope
   .is-open { display: block; }
   ```

2. **JS toggles state, CSS defines appearance**:
   ```js
   // JS side — clean and readable
   wrapper.classList.add('is-open');
   element.classList.toggle('is-selected');
   backdrop.classList.remove('is-visible');
   ```

3. **Use BEM modifiers for static variants**, state classes for dynamic states:
   ```scss
   .btn {
     &--danger { }      // variant — set in HTML, never changes
     &--lg { }          // variant
     &--loading { }     // component-specific state (has spinner animation)
   }

   .tooltip {
     &--top { }         // placement variant — set once by JS, not toggled
     &--right { }
   }

   .dropdown__list li {
     &.is-selected { }  // dynamic state — toggled on hover/keyboard
   }
   ```

4. **Exception: `is-loading` utility** — a generic loading state defined as a global utility (`.is-loading`) that can be applied to any container. Component-specific loading states (like `btn--loading` with spinner animation) remain BEM modifiers.

5. **Body-level states** — some states apply to `<body>` for global effects:
   ```scss
   body.is-scroll-locked { overflow: hidden; }
   ```
   These are set by components (Modal, SlideMenu) that need to lock page scroll.

### When to use which?

| Question | Answer | Use |
|----------|--------|-----|
| Is it toggled by JS at runtime? | Yes | `is-*` / `has-*` |
| Is it set once in HTML and never changes? | Yes | `--modifier` (BEM) |
| Does the component have its own loading animation? | Yes | `--loading` (BEM) |
| Is it a generic disable/dim effect? | Yes | `is-loading` (state) |

---

## 🗺️ Decision Flowchart

Use this to decide which layer a class belongs to:

```
Is this style for a single template file?
├── YES → Layer 1 (Template / rsBEM)
│         .sale-return_request__save-btn
│
└── NO → Is it a reusable component (library or project)?
         ├── YES → Layer 2 (Component / BEM)
         │         .modal__header  .admin-heading__title
         │
         └── NO → Layer 3 (Utility)
                  .d-flex  .margin-sm  .text-center

Is this class toggled by JavaScript at runtime?
├── YES → State Convention (is-* / has-*)
│         .is-open  .is-visible  .has-error
│         (defined inside the component's SCSS block)
│
└── NO → BEM modifier (--)
          .btn--danger  .tooltip--top
```

### Quick Reference

| Ask yourself | Layer | Example |
|-------------|-------|---------|
| "Which template file is this for?" | Layer 1 | `.sale-return_request__save-btn` |
| "Which component is this?" | Layer 2 | `.modal__header`, `.admin-heading__title` |
| "What CSS property does this set?" | Layer 3 | `.d-flex` |
| "Is JS toggling this at runtime?" | State | `.is-open`, `.is-visible` |

### Exceptions

Some patterns don't fit neatly into the three layers. Document these per-project:

```scss
// Validation errors — flat prefix pattern, not BEM
.err-required { }
.err-email { }
.err-minlength { }
```

---

## 🛡️ Stylelint Configuration

### Per-Layer Configs

rsBEM provides separate stylelint configs for each layer. Use the one that matches your file context:

```js
// Layer 1 — Template-scoped SCSS files
// import from: rsbem/lint/layers/template.config.js
"^[a-z][a-z0-9]*(?:_[a-z0-9]+)*(?:-[a-z][a-z0-9]*(?:_[a-z0-9]+)*)+__[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:--[a-z0-9]+(?:-[a-z0-9]+)*)?$"

// Layer 2 — Component SCSS files
// import from: rsbem/lint/layers/component.config.js
"^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?(?:--[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?$"

// Layer 3 — Utility SCSS files
// import from: rsbem/lint/layers/utility.config.js
"^[a-z][a-z0-9]*-[a-z0-9]+(?:-[a-z0-9]+)*$"
```

### Combined Config (All Layers)

For projects that mix multiple layers in a single file, use the combined config:

```js
// import from: rsbem/lint/layers/all.config.js
// Matches Layer 1 OR Layer 2 OR Layer 3
```

### Recommended Setup

Apply per-layer configs using stylelint overrides:

```js
export default {
  overrides: [
    {
      files: ["scss/sale/**/*.scss", "scss/catalog/**/*.scss"],
      rules: {
        "selector-class-pattern": [/* Layer 1 regex */]
      }
    },
    {
      files: ["scss/components/**/*.scss"],
      rules: {
        "selector-class-pattern": [/* Layer 2 regex */]
      }
    },
    {
      files: ["scss/utilities/**/*.scss"],
      rules: {
        "selector-class-pattern": [/* Layer 3 regex */]
      }
    }
  ]
};
```

---

## 🔑 Key Differences: rsBEM vs BEM

| Aspect | BEM (Layer 2) | rsBEM (Layer 1) |
|--------|---------------|-----------------|
| Block naming | Free-form | File-route prefix (mandatory) |
| File location | Unknown from class | Readable from class name |
| Scope | Component-scoped | File/template-scoped |
| Reusability | Cross-project | Within project (by design) |
| Searchability | Requires convention | Built-in (`grep` friendly) |

---

## 💬 Philosophy

> **"A class name should reveal where it lives."**

rsBEM is a thin layer on top of BEM. BEM provides the structure, rsBEM adds **traceability** by tying class names to the file system. The layered system extends this philosophy to cover every CSS class in a project — from template-specific styles to global utilities.

---

## 📄 License

[MIT](LICENSE)
