# The problem

Obsidian has had a well-known issue with diagrams for quite some time — whether they’re big or small, they’re rendered as static, awkward images. This becomes especially painful when you're dealing with really large diagrams.

People have tried to work around this in all sorts of ways: scaling the entire Obsidian window, throwing in some CSS hacks — which usually end up looking janky at best.

This plugin exists specifically to fix that — to bring interactivity and proper usability to diagrams inside Obsidian.

Right now, it supports not just Mermaid, but a bunch of other custom diagrams too (you can enable support via the plugin settings).

# Features
- Support for Mermaid, PlantUML, Graphviz, and custom diagrams
- Interactive zoom and pan controls
- Changing the size of diagrams
- Mobile touch support
- Fullscreen mode
- Flexible behavior settings for panels
- Configurable panel and button visibility
- Contextual actions (copy, export)
- Customizable panel layouts
- Individual State Management Each diagram remembers its zoom level and position independently

# Control panel
- Service panel: Located in the top right corner by default.
    - Hide/Show: Toggle other subpanels.
    - Fullscreen mode: Open or exit fullscreen mode.
    - Native touch events (Mobile): Enable or disable native touch events on the diagram.
- Zoom panel: Positioned at the center of the right edge by default.
    - Zoom in: Increase the scale of the current diagram.
    - Reset zoom and position: Reset the scale and position of the diagram.
    - Zoom out: Decrease the scale of the current diagram.
- Move panel: Located at the bottom right by default.
    - Move the diagram in the desired direction.

# Keyboard & Mouse Controls
- `CTRL` + `+`/`=`: Zoom in.
- `CTRL` + `-`: Zoom out.
- `CTRL` + `0`: Reset zoom and position.
- Arrow keys: Move the diagram.
- `SHIFT` + `WHEEL`: Scroll diagram horizontally.
- `SHIFT` + `ALT` + `WHEEL`: Scroll diagram vertically.
- Mouse down + drag: Move the diagram.
- `CTRL` + Mouse Wheel: Zoom in or out.


# Adding Custom Diagrams
This plugin automatically detects diagrams by looking for `<div>` elements in Markdown view.

For detailed instructions: Plugin Settings → Diagram Management → User Guide
