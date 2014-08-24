glitcher
=====

[![NPM](https://nodei.co/npm/glitcher.png)](https://nodei.co/npm/glitcher/)

An image glitching toolbox.

Running Examples
================

To see demo output of API functions, clone this repository and then use `node` to run any of the files in the `examples/` folder.

For example, to run `flip.js`, change directories into the `examples/` folder, and then run `node flip.js`.

Example files pull source images from the `img/` folder and then save their glitch transformations to the `output/` folder.

API
===

`invertRGBA(buffer)`
---

Inverts an RGBA buffer.

`reverseRGBA(buffer)`
---

Flips (vertically) a RGBA buffer by reversing the pixels.

`redBlueOverlay(buffer)`
---

Overlays red/blue channels from the first half of an RGBA buffer over the second half of an RGBA buffer.

`clampColors(buffer[, maxColors])`
---

A slightly glitchy color clamp to `maxColors` (default 256).

`glitchClamp(buffer[, maxColors])`
---

A randomizing color clamper. Randomizes a palette limited to `maxColors` (default 256).

`ghostColors(buffer[, maxColors])`
---

A ghosting color palette -- the first `maxColors` (default 256) are processed, any colors outside the first set are assigned the same hue.

`glitchGhost(buffer[, maxColors])`
---

A ghosting color palette -- the first `maxColors` (default 256) are processed, any other colors are assigned a hue from a randomly generated palette of `maxColors` hues.

`grayscale(buffer)`
---

Convert a RGBA buffer to grayscale.

`var shifted = pixelshift(buffer, pixels)`
---

Shift an image in the x direction by `pixels`

`rowslice(buffer, bandsize)`
---

Slice an image into rows of `bandsize` -- this is a raw value. Choose numbers somewhere on the order of the image height * width for best results. A small value will generally turn your image into noise.

`cloneChannel(sourceBuffer, targetBuffer, channel)`
---

Copy all pixels from channel `channel` (0-3) from source to target. Works best if the images are the same dimensions.

`smear(buffer, smearwidth)`
---

Smear pixels by `smearwidth` to the right

`smearChannel(buffer, channel, smearwidth)`
---

Smear `channel` for `smearwidth` pixels at a ttime.

LICENSE
=======

MIT
