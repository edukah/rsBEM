// Layer 3: Utility
// Pattern: prefix-value (e.g., d-flex, margin-sm, text-center)
// Use for: Single-purpose global utility SCSS files.

module.exports = {
  rules: {
    "selector-class-pattern": [
      "^[a-z][a-z0-9]*-[a-z0-9]+(?:-[a-z0-9]+)*(?:--[a-z0-9]+(?:-[a-z0-9]+)*)?$",
      {
        message:
          "Class names must follow utility pattern (Layer 3): prefix-value",
      },
    ],
  },
};
