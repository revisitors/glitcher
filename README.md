glitcher
=====

[![NPM](https://nodei.co/npm/glitcher.png)](https://nodei.co/npm/glitcher/)

An image glitching toolbox.

API
===

`invertRGBA(buffer)`
---

Inverts an RGBA buffer.

`reverseRGBA(buffer)`
---

Flips (vertically) a RGBA buffer by reversing the pixels.

`var redblueoverlay = redBlueOverlay(buffer)`
---

Overlays red/blue channels from the first half of an RGBA buffer over the second half of an RGBA buffer.

`clampColors(buffer[, maxColors])`
---

A slightly glitchy color clamp to `maxColors` (default 256).

`glitchClamp(buffer[, maxColors])`
---

A randomizing color clamper. Randomizes a palate limited to `maxColors` (default 256).

LICENSE
=======

MIT
