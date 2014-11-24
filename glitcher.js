module.exports.copy = copy
module.exports.invertRGBA = invertRGBA
module.exports.reverseRGBA = reverseRGBA
module.exports.swapChannels = swapChannels
module.exports.redBlueOverlay = redBlueOverlay
module.exports.clampColors = clampColors
module.exports.glitchClamp = glitchClamp
module.exports.ghostColors = ghostColors
module.exports.glitchGhost = glitchGhost
module.exports.superGhost = superGhost
module.exports.pixelshift = pixelshift
module.exports.grayscale = grayscale
module.exports.fiftiesTv = fiftiesTv
module.exports.rowslice = rowslice
module.exports.cloneChannel = cloneChannel
module.exports.smearChannel = smearChannel
module.exports.smear = smear
module.exports.interleave = interleave
module.exports.interleaveVertical = interleaveVertical
module.exports.rainbowClamp = rainbowClamp
module.exports.rainbow = rainbow
module.exports.rainbowMatch = rainbowMatch
module.exports.sparkle = sparkle
module.exports.medianFrame = medianFrame
module.exports.meanFrame = meanFrame
module.exports.medianPixel = medianPixel
module.exports.meanPixel = meanPixel
module.exports.rowSort = rowSort
module.exports.chromaKey = chromaKey
module.exports.chromaKeyInverse = chromaKeyInverse
module.exports.replaceBackground = replaceBackground
module.exports.replaceForeground = replaceForeground

var Rainbow = require("color-rainbow")

function rainbowHues(colors) {
  return Rainbow.create(colors).map(function (color) {
    return new Buffer([color.values.rgb[0], color.values.rgb[1], color.values.rgb[2], 0xff])
  })
}

function copy(rgba) {
  var dupe = new Buffer(rgba.length)
  rgba.copy(dupe)
  return dupe
}

function invertRGBA(rgba) {
  for (var i = 0; i < rgba.length; i+= 4) {
    rgba[i] = rgba[i] ^ 255
    rgba[i + 1] = rgba[i + 1] ^ 255
    rgba[i + 2] = rgba[i + 2] ^ 255
  }
  return rgba
}

function reverseRGBA(rgba) {
  var len = rgba.length
  var half = len / 2
  for (var i = 0; i < half; i+= 4) {
    len -= 4
    var r = rgba[len]
    var g = rgba[len + 1]
    var b = rgba[len + 2]

    rgba[len] = rgba[i]
    rgba[len + 1] = rgba[i + 1]
    rgba[len + 2] = rgba[i + 2]

    rgba[i] = r
    rgba[i + 1] = g
    rgba[i + 2] = b
  }
  return rgba
}

function swapChannels(rgba, swap1, swap2) {
  if (swap1 == null) {
    swap1 = (Math.random() * 100) | 0
  }
  if (swap2 == null) {
    swap2 = (Math.random() * 100) | 0
  }
  if (swap1 == swap2) {
    swap2++
  }
  if (swap1 % 4 == swap2 % 4) {
    swap2++
  }
  for (var i = 0; i < rgba.length; i += 4) {
    var a = rgba[i + swap1]
    var b = rgba[i + swap2]

    rgba[i + swap2] = a
    rgba[i + swap1] = b
  }
  return rgba
}

function redBlueOverlay(original) {
  var shifted = new Buffer(original.length)
  original.copy(shifted)
  var len = shifted.length
  var half = len / 2
  for (var k = half, l = 0; k < len; k+= 4, l+= 4) {
    shifted[k] = original[l]
  }
  shifted.copy(original)
  return original
}

// An intentionally glitchy color comparator
function colorDiff(reference, pixel) {
  var r = reference[0] - pixel[0]
  var g = reference[1] - pixel[1]
  var b = reference[2] - pixel[2]

  return Math.abs(r) + Math.abs(g) + Math.abs(b)
}

function ghost(rgba, max, tolerance, replacer) {
  var colorMap = {}
  var colors = []
  for (var i = 0; i < rgba.length; i+= 4) {
    var color = rgba.slice(i, i + 4)
    var floored = new Buffer(color)
    floored[0] = ((color[0] / tolerance) | 0) * tolerance
    floored[1] = ((color[1] / tolerance) | 0) * tolerance
    floored[2] = ((color[2] / tolerance) | 0) * tolerance

    var key = floored.readInt32LE(0)
    if (colors.length < max && colorMap[key] === undefined) {
      colors.push(color)
      colorMap[key] = color
    }
    else {
      if (colorMap[key]) {
        rgba[i] = floored[0]
        rgba[i + 1] = floored[1]
        rgba[i + 2] = floored[2]
      }
      else {
        replacer(i, color, floored, colors)
      }
    }
  }
}

function clampColors(rgba, max, tolerance) {
  ghost(rgba, max || 256, tolerance || 13, function _clampColors(i, color, floored, colorTable) {
    var closest = 0
    var best = Number.MAX_VALUE
    for (var j = 0; j < colorTable.length; j++) {
      var diff = colorDiff(colorTable[j], color)
      if (diff === 0) {
        break
      }
      if (diff < best) {
        closest = j
        best = diff
      }
    }
    colorTable[closest].copy(rgba, i)
  })
}

// TODO need a better "find closest hue from set" algo

function rainbowMatch(rgba, colordepth, tolerance) {
  var black = new Buffer([0, 0, 0, 255])
  var white = new Buffer([255, 255, 255, 255])
  var rainbow = rainbowHues(colordepth).concat(black, white)
  for (var i = 0; i < rgba.length; i += 4) {
    var color = rgba.slice(i)
    var closest = 0
    var best = Number.MAX_VALUE
    for (var j = 0; j < rainbow.length; j++) {
      var diff = colorDiff(rainbow[j], color)
      if (diff === 0) {
        break
      }
      if (diff < best) {
        closest = j
        best = diff
      }
    }
    rainbow[closest].copy(rgba, i)
  }
}

function randomPixel() {
  return new Buffer([
    (Math.random() * 256) | 0,
    (Math.random() * 256) | 0,
    (Math.random() * 256) | 0,
    0xff
  ])
}

function randomPalette(size) {
  var palette = []
  for (var i = 0; i < size; i++) {
    palette.push(randomPixel())
  }
  return palette
}

function glitchClamp(rgba, max, tolerance) {
  var glitchTable = randomPalette(max || 256)
  ghost(rgba, max || 256, tolerance || 13, function _glitchClamp(i, color, floored, colorTable) {
    var closest = 0
    var best = Number.MAX_VALUE
    for (var j = 0; j < colorTable.length; j++) {
      var diff = colorDiff(colorTable[j], color)
      if (diff === 0) {
        break
      }
      if (diff < best) {
        closest = j
        best = diff
      }
    }
    glitchTable[closest].copy(rgba, i)
  })
}

function ghostColors(rgba, max, tolerance) {
  var hue = randomPixel()
  ghost(rgba, max || 256, tolerance || 13, function _ghostColors(i, color, floored, colorTable) {
    hue.copy(rgba, i)
  })
}

function glitchGhost(rgba, max, tolerance) {
  max = max || 256
  var ghostPalette = randomPalette(max)
  ghost(rgba, max, tolerance || 13, function _glitchGhost(i, color, floored, colorTable) {
    ghostPalette[(Math.random() * max) | 0].copy(rgba, i)
  })
}

// keep n `max` colors, then fill the rest with whatever was in memory
function superGhost(rgba, max, tolerance) {
  var ghostBuffer = new Buffer(rgba.length)
  ghost(rgba, max || 256, tolerance || 13, function _superGhost(i, color, floored, colorTable) {
    ghostBuffer.copy(rgba, i, i, i + 4)
  })
}

function grayscale(rgba) {
  for (var i = 0; i < rgba.length; i+= 4) {
    var brightness = (0.34 * rgba[i] + 0.5 * rgba[i + 1] + 0.16 * rgba[i + 2]) | 0
    rgba[i] = brightness
    rgba[i + 1] = brightness
    rgba[i + 2] = brightness
  }
  return rgba
}

function fiftiesTv(frameData, snowVal) {
  snowVal = snowVal || (((Math.random() * 10) | 0) + 5)
  for (var i = 0; i < frameData.length; i+=4) {
    var maxSaturation = Math.max.apply(null, [
        frameData[i], frameData[i+1], frameData[i+2]
    ])
    if (maxSaturation % snowVal === 0) {
      maxSaturation = 255
    }
    frameData[i] = maxSaturation
    frameData[i+1] = maxSaturation
    frameData[i+2] = maxSaturation
  }
  return frameData
}

// Does not mutate
function pixelshift(rgba, pixels) {
  if (!pixels) {
    return
  }
  pixels = (pixels % (rgba.length / 4)) * 4
  var left = rgba.slice(0, pixels)
  var right = rgba.slice(pixels)
  Buffer.concat([right, left]).copy(rgba)
  return rgba
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

function rowslice(rgba, width) {
  if (!width) {
    return
  }
  width = +width
  var slices = []
  var win = 0
  var dupe = copy(rgba)
  while (win < dupe.length) {
    slices.push(dupe.slice(win, win + width))
    win += width
  }
  shuffle(slices).forEach(function (slice, i) {
    slice.copy(rgba, width * i)
  })
  return rgba
}

function cloneChannel(source, target, channel) {
  var len = Math.min(source.length, target.length)
  for (var i = channel; i < len; i += 4) {
    target[i] = source[i]
  }
  return target
}

function smear(rgba, count) {
  var pixel = Buffer(4)
  var smearcount = count
  for (var i = 0; i < rgba.length; i += 4) {
    if (smearcount < smear) {
      pixel.copy(rgba, i)
      smearcount++
    }
    else {
      pixel = rgba.slice(i, i + 4)
      smearcount = 0
    }
  }
  return rgba
}

function smearChannel(rgba, channel, smear) {
  var val = 0
  var smearcount = smear
  for (var i = channel; i < rgba.length; i += 4) {
    if (smearcount < smear) {
      rgba[i] = val
      smearcount++
    }
    else {
      val = rgba[i]
      smearcount = 0
    }
  }
  return rgba
}

function interleave(width, left, right) {
  var rows = (left.length / 4) / width
  var rowWidth = width * 4
  var i = 0

  var fillBlack = (right == null)
  if (fillBlack) {
    right = new Buffer(rowWidth)
    for (i = 0; i < right.length; i+= 4) {
      right[i] = 0
      right[i+1] = 0
      right[i+2] = 0
      right[i+3] = 0xff
    }
  }
  var target = new Buffer(left.length)
  for (i = 0; i < rows; i++) {
    var start = i * rowWidth
    if (i % 2 === 0) {
      if (fillBlack) {
        right.copy(target, start)
      }
      else {
        right.copy(target, start, start, start + rowWidth)
      }
    }
    else {
      left.copy(target, start, start, start + rowWidth)
    }
  }
  target.copy(left)
  return target
}

function interleaveVertical(left, right) {
  var fillBlack = (right == null)
  if (fillBlack) {
    right = new Buffer([0, 0, 0, 255])
  }
  for (var i = 0; i < left.length; i += 8) {
    var sourceStart = (fillBlack) ? 0 : i
    right.copy(left, i, sourceStart, sourceStart + 4)
  }
}

function rainbowClamp(rgba) {
  var hues = rainbowHues(256)
  for (var i = 0; i < rgba.length; i+= 4) {
    var brightness = (0.34 * rgba[i] + 0.5 * rgba[i + 1] + 0.16 * rgba[i + 2]) | 0
    var hue = hues[brightness]
    rgba[i] = hue[0]
    rgba[i + 1] = hue[1]
    rgba[i + 2] = hue[2]
  }
  return rgba
}

function rainbow(frames) {
  var hues = rainbowHues(frames.length - 1)
  for (var i = 1; i < frames.length; i++) {
    mask(frames[0].data, frames[i - 1].data, frames[i].data, hues[i - 1], 50)
  }
  return frames
}

function mask(base, overlay, rgba, hue, tolerance) {
  tolerance = tolerance != null ? tolerance : 50
  var dupe = copy(overlay)
  for (var j = 0; j < dupe.length; j+= 4) {
    var rDiff = Math.abs(rgba[j] - base[j])
    var gDiff = Math.abs(rgba[j+1] - base[j+1])
    var bDiff = Math.abs(rgba[j+2] - base[j+2])
    if (rDiff > tolerance || gDiff > tolerance || bDiff > tolerance) {
      dupe[j] = hue[0]
      dupe[j+1] = hue[1]
      dupe[j+2] = hue[2]
    }
  }
  dupe.copy(rgba)
  return rgba
}

function overlaySprite(rgba, sprite, cornerIndex, width, hue) {
  for (var i = 0; i < sprite.length; i++) {
    var row = sprite[i]
    for (var j = 0; j < row.length; j++) {
      var coord = (cornerIndex + (i * width * 4)) + (j * 4)
      if (row[j] > 0) {
        rgba[coord] = hue[0]
        rgba[coord + 1] = hue[1]
        rgba[coord + 2] = hue[2]
      }
    }
  }
}

var sparkleSprite = [
  [0,0,0,1,0,0,0],
  [0,0,0,1,0,0,0],
  [0,0,1,1,1,0,0],
  [1,1,1,1,1,1,1],
  [0,0,1,1,1,0,0],
  [0,0,0,1,0,0,0],
  [0,0,0,1,0,0,0],
]

function sparkle(width, rgba, sparkles) {
  if (sparkles == null) {
    sparkles = (rgba.length / 4) * 0.01 * Math.random()
  }
  for (var i = 0; i < sparkles; i++) {
    var pos = ((Math.random() * (rgba.length / 4)) | 0) * 4
    overlaySprite(rgba, sparkleSprite, pos, width, randomPixel())
  }
}

function sortPixels(pixels) {
  var split = []
  for (var i = 0; i < pixels.length; i += 4) {
    split.push(pixels.slice(i, i + 4))
  }
  var sorted = split.sort(function (a, b) {
    return (a[0] + a[1] + a[2] + a[3]) - (b[0] + b[1] + b[2] + b[3])
  })
  var newbuff = new Buffer(pixels.length)
  for (var j = 0; j < sorted.length; j++) {
    newbuff[j * 4] = sorted[j][0]
    newbuff[j * 4 + 1] = sorted[j][1]
    newbuff[j * 4 + 2] = sorted[j][2]
    newbuff[j * 4 + 3] = sorted[j][3]
  }
  return newbuff
}

function medianPixel(pixels) {
  var sorted = sortPixels(pixels)
  var mid = (sorted.length / 2) - ((sorted.length / 2) % 4)
  return sorted.slice(mid, mid + 4)
}

function medianFrame(frames, alg) {
  return avg(frames, medianPixel)
}

function meanPixel(pixels) {
  if (pixels.length === 0) {
    return new Buffer(4)
  }
  if (pixels.length === 4) {
    return pixels
  }
  var p = new Buffer(4)
  var r = 0
  var g = 0
  var b = 0
  var a = 0
  for (var i = 0; i < pixels.length; i+= 4) {
    r += pixels[i]
    g += pixels[i + 1]
    b += pixels[i + 2]
    a += pixels[i + 3]
  }
  p[0] = (r / (pixels.length / 4)) >>> 0
  p[1] = (g / (pixels.length / 4)) >>> 0
  p[2] = (b / (pixels.length / 4)) >>> 0
  p[3] = (a / (pixels.length / 4)) >>> 0
  return p
}

function meanFrame(frames) {
  return avg(frames, meanPixel)
}

function avg(frames, alg) {
  var len = frames[0].data.length
  if (len === 1) {
    return frames[0].data
  }
  var avgFrame = new Buffer(len)
  for (var i = 0; i < len; i += 4) {
    var pixels = new Buffer(4 * frames.length)
    for (var j = 0; j < frames.length; j++) {
      frames[j].data.copy(pixels, j * 4, i, i + 4)
    }
    var avgPixel = alg(pixels)
    avgPixel.copy(avgFrame, i)
  }
  return avgFrame
}

function rowSort(rowWidth, rgba) {
  var sorted = new Buffer(rgba.length)
  for (var i = 0; i < rgba.length; i += rowWidth * 4) {
    var pixels = rgba.slice(i, (Math.min(rgba.length, (i + rowWidth * 4))))
    var spix = sortPixels(pixels)
    spix.copy(sorted, i)
  }
  sorted.copy(rgba)
  return rgba
}

function inSphere(centroid, radius, obs) {
  var r = obs[0] - centroid[0]
  var g = obs[1] - centroid[1]
  var b = obs[2] - centroid[2]
  var locus = Math.pow(r, 2) + Math.pow(g, 2) + Math.pow(b, 2)
  return locus < Math.pow(radius, 2)
}

function getAlpha(rgba) {
  var mean = meanPixel(rgba)
  alpha = ((mean[0] + mean[1] + mean[2]) / 3) | 0
  return alpha
}

function _chromaKey(rgba, maskHue, background, alpha, isInside) {
  for (var i = 0; i < rgba.length; i += 4) {
    if (inSphere(maskHue, alpha, rgba.slice(i, i + 4)) == isInside) {
      var start = (i > background.length) ? 0 : i
      background.copy(rgba, i, start, start + 4)
    }
  }
}

function chromaKey(rgba, maskHue, background, alpha) {
  if (alpha == null) {
    alpha = getAlpha(rgba) * 2
  }
  return _chromaKey(rgba, maskHue, background, alpha, true)
}

function chromaKeyInverse(rgba, maskHue, background, alpha) {
  if (alpha == null) {
    alpha = getAlpha(rgba) * 2
  }
  return _chromaKey(rgba, maskHue, background, alpha, false)
}

function replaceForeground(frames, replacer, tolerance) {
  var background = meanFrame(frames)
  for (var i = 0; i < frames.length; i++) {
    var dupe = copy(frames[i].data)
    replacer(dupe)

    var rgba = frames[i].data
    for (var j = 0; j < background.length; j += 4) {
      var rDiff = Math.abs(rgba[j] - background[j])
      var gDiff = Math.abs(rgba[j+1] - background[j+1])
      var bDiff = Math.abs(rgba[j+2] - background[j+2])
      if (rDiff > tolerance || gDiff > tolerance || bDiff > tolerance) {
        var start = (j > dupe.length) ? 0 : j
        rgba[j] = dupe[start + 0]
        rgba[j+1] = dupe[start + 1]
        rgba[j+2] = dupe[start + 2]
      }
    }
  }
}

function replaceBackground(frames, replacer, tolerance) {
  tolerance = tolerance != null ? tolerance : 50

  var background = meanFrame(frames)
  for (var i = 0; i < frames.length; i++) {
    var dupe = copy(frames[i].data)
    replacer(dupe)
    var rgba = frames[i].data
    for (var j = 0; j < background.length; j += 4) {
      var rDiff = Math.abs(rgba[j] - background[j])
      var gDiff = Math.abs(rgba[j+1] - background[j+1])
      var bDiff = Math.abs(rgba[j+2] - background[j+2])
      if (!(rDiff > tolerance || gDiff > tolerance || bDiff > tolerance)) {
        var start = (j > dupe.length) ? 0 : j
        rgba[j] = dupe[start + 0]
        rgba[j+1] = dupe[start + 1]
        rgba[j+2] = dupe[start + 2]
      }
    }
  }
}

function unmask(base, rgba, replacement, tolerance) {
  tolerance = tolerance != null ? tolerance : 50
  var dupe = copy(base)
  for (var j = 0; j < dupe.length; j+= 4) {
    var rDiff = Math.abs(rgba[j] - base[j])
    var gDiff = Math.abs(rgba[j+1] - base[j+1])
    var bDiff = Math.abs(rgba[j+2] - base[j+2])
    if (rDiff > tolerance || gDiff > tolerance || bDiff > tolerance) {
      var start = (j > replacement.length) ? 0 : j
      dupe[j] = replacement[start + 0]
      dupe[j+1] = replacement[start + 1]
      dupe[j+2] = replacement[start + 2]
    }
  }
  dupe.copy(rgba)
  return rgba
}
