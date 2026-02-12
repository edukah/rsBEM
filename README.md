# rsBEM Naming Convention

[![Version](https://img.shields.io/badge/version-v1.0.0-blueviolet)](#)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Stylelint Rule](https://img.shields.io/badge/stylelint-rsBEM_Regex-informational?logo=stylelint)](#-stylelint-regex-rule)

> A file-system-grounded CSS naming convention for MVC projects.  
> Every class name maps directly to its template file — no guessing, no ambiguity.

## ℹ️ What is rsBEM?

**rsBEM** combines three ideas into a single naming standard:

| Letter | Stands for | Meaning |
|--------|-----------|---------|
| **r** | **Route / Root** | Class names are rooted in the file system — the folder and file path IS the namespace |
| **s** | **Scoped / Strict** | Styles are strictly scoped to their template — nothing leaks, nothing collides |
| **BEM** | **Block Element Modifier** | Uses the familiar `__element` and `--modifier` syntax from BEM |

> rsBEM is a thin layer on top of BEM.  
> BEM provides the structure. rsBEM adds **file-based traceability**.

---

## 🎯 Purpose

In MVC applications with many templates, a recurring question arises:  
**"Which file does this class belong to?"**

rsBEM addresses this by embedding the **file route** into every class name as a prefix. A `Ctrl + Shift + F` search on any class locates both the template and its styles.

## 📚 Quick BEM Recap

- `.block` – Independent UI component
- `.block__element` – Child part of the block
- `.block--modifier` – Visual or behavioral variant

### ❗ The Problem — BEM is context-free by design

```scss
.process-step--active {}
.status-badge--pending {}
.save-btn {}
```

Which page? Which template? Which module? BEM doesn't include this information by design.  
In a project with many templates, `.save-btn` could be **anywhere**.

### ✅ rsBEM's solution — the file system IS the namespace

```scss
.sale-return_request__process-step--active {}
.sale-return_request__status-badge--pending {}
.sale-return_request__save-btn {}
```

> The class name maps to its file:  
> `view/sale/return_request.tpl`

---

## 📐 Syntax

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
Template: view/marketplace/trendyol/claim.tpl
   Class: .marketplace-trendyol-claim__…
```

```
 marketplace-trendyol-claim__status-badge--error
 ─────┬───── ───┬──── ─┬──  ─────┬─────  ──┬──
   folder    folder   file    element    modifier
```

> **Why not underscores?** Folder and file names already use underscores internally (snake_case). If nested folders were also joined with underscores, `marketplace_trendyol` could mean either a single folder named `marketplace_trendyol` or two nested folders `marketplace/trendyol`. With hyphens, every hyphen in the prefix is **always** a path separator — no ambiguity.

---

## 🧠 Core Principles

### 1. File Mapping — The class IS the route

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
Template: view/marketplace/trendyol/claim.tpl
   Class: .marketplace-trendyol-claim__...
```

Any rsBEM class can be `grep`ped to find both its `.tpl` and `.scss` file.

### 2. Flat Hierarchy — Describe what, not where

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

### 3. Semantic Grouping — Hyphen groups, underscore separates

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

---

## ✅ Correct vs ❌ Incorrect

### ✅ Correct (Flat & Scoped)

Describes **what the element is**, scoped to its file:

```scss
.sale-return_request__save-btn {}
.sale-return_request__product-list {}
.sale-return_request__process-step--done {}
.sale-return_request__status-badge--pending {}
.catalog-product_form__price-input {}
.catalog-product_form__image-preview--loading {}
.user_settings-profile_form__avatar {}         // multi-word folder
.marketplace-trendyol-claim__status-badge {}   // nested folder
```

### ❌ Incorrect

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
.marketplace_trendyol-claim__status-badge {}  // use marketplace-trendyol-claim (hyphen joins path segments)
```

---

## 💻 Full Example

**Template:** `Src/Admin/View/Template/sale/return_request.tpl`  
**Styles:** `Src/Admin/View/Stylesheet/sale/return_request.scss`

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

---

## ⚙️ SCSS Structure

rsBEM SCSS files mirror the template's file path:

```
view/sale/return_request.tpl
scss/sale/return_request.scss     ← styles live here
```

### Writing rsBEM in SCSS

The file-scoped prefix is written as a variable or directly, with media queries nested inside their relevant selectors:

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

---

## 🔍 When to Use rsBEM

| Situation | Use rsBEM? |
|-----------|------------|
| Page/template-specific styles | ✅ Yes |
| Styles scoped to a single .tpl file | ✅ Yes |
| Global utility classes (`d-flex`, `m-3`) | ❌ No — use them freely |
| Shared UI components (buttons, modals, slide-menus) | ❌ No — use standard BEM |
| Validation error containers (`err-*`) | ❌ No — framework convention |
| Admin listing framework (`admin-listing_*`) | ❌ No — framework convention |
| Tab/accordion IDs (behavior, not styling) | ❌ No — use descriptive IDs |

rsBEM is a **scoping strategy** that works alongside BEM and utility classes. It applies specifically to **template-scoped styles** — classes that exist only within a single template file.

---

## 🛡️ Stylelint Regex Rule

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

## 🔑 Key Differences from BEM

| Aspect | BEM | rsBEM |
|--------|-----|-------|
| Block naming | Free-form | File-route prefix (mandatory) |
| File location | Unknown from class | Readable from class name |
| Scope | Component-scoped | File/template-scoped |
| Reusability | Cross-project | Within project (by design) |
| Searchability | Requires convention | Built-in (`grep` friendly) |

---

## 💬 Philosophy

> **"A class name should reveal where it lives."**

rsBEM is a thin layer on top of BEM. BEM provides the structure, rsBEM adds **traceability** by tying class names to the file system.

---

## 📄 License

[MIT](LICENSE)
