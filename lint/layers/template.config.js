// Layer 1: Template (rsBEM)
// Pattern: [folder]-[file_name]__[element-name]--[modifier]
// Use for: SCSS files scoped to a single template (.tpl) file.

export default {
  rules: {
    "selector-class-pattern": [
      "^[a-z][a-z0-9]*(?:_[a-z0-9]+)*(?:-[a-z][a-z0-9]*(?:_[a-z0-9]+)*)+__[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:--[a-z0-9]+(?:-[a-z0-9]+)*)?$",
      {
        message:
          "Class names must follow rsBEM (Layer 1): [folder]-[file_name]__[element-name]--[modifier]",
      },
    ],
  },
};
