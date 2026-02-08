// Layer 2: Component (Standard BEM)
// Pattern: block__element--modifier
// Use for: Shared, reusable UI component SCSS files.

module.exports = {
  rules: {
    "selector-class-pattern": [
      "^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?(?:--[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?$",
      {
        message:
          "Class names must follow BEM (Layer 2): block__element--modifier",
      },
    ],
  },
};
