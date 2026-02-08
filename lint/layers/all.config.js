// All Layers Combined
// Matches Layer 1 (Template/rsBEM) OR Layer 2 (Component/BEM) OR Layer 3 (Utility)
// Use for: Mixed files or when you want a single config that accepts all layers.

const LAYER_1_TEMPLATE =
  "[a-z][a-z0-9]*(?:_[a-z0-9]+)*(?:-[a-z][a-z0-9]*(?:_[a-z0-9]+)*)+__[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:--[a-z0-9]+(?:-[a-z0-9]+)*)?";

const LAYER_2_COMPONENT =
  "[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?(?:--[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?";

const LAYER_3_UTILITY =
  "[a-z][a-z0-9]*-[a-z0-9]+(?:-[a-z0-9]+)*(?:--[a-z0-9]+(?:-[a-z0-9]+)*)?";

const combined = `^(?:${LAYER_1_TEMPLATE}|${LAYER_2_COMPONENT}|${LAYER_3_UTILITY})$`;

export default {
  rules: {
    "selector-class-pattern": [
      combined,
      {
        message:
          "Class names must follow one of: rsBEM (Layer 1), BEM (Layer 2), or utility (Layer 3) pattern",
      },
    ],
  },
};
