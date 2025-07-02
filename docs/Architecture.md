# RGC Plugin Architecture

## Goals:
- Modular input system (GamepadInputManager)
- Clean UI component separation
- Single source of truth for button mappings
- Future support: Thumbstick-driven multiple choice navigation

## Key Modules:
- /components → All React UI
- /hooks → Gamepad state (button + axis)
- /services → Business logic (input manager, debouncing, mapping)
- /config → Default + user settings
- /utils → Logging, helper funcs
