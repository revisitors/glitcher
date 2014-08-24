module.exports.copy = copy
module.exports.invertRGBA = invertRGBA
module.exports.reverseRGBA = reverseRGBA
module.exports.redBlueOverlay = redBlueOverlay
module.exports.clampColors = clampColors
module.exports.glitchClamp = glitchClamp
module.exports.ghostColors = ghostColors
module.exports.glitchGhost = glitchGhost
module.exports.pixelshift = pixelshift
module.exports.grayscale = grayscale
module.exports.rowslice = rowslice
module.exports.cloneChannel = cloneChannel
module.exports.smearChannel = smearChannel
module.exports.smear = smear

function copy(rgba) {
  var copy = new Buffer(rgba.length)
  rgba.copy(copy)
  return copy
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

function redBlueOverlay(original) {
  var shifted = new Buffer(original.length)
  original.copy(shifted)
  var len = shifted.length
  var half = len / 2
  for (var k = half, l = 0; k < len; k+= 4, l+= 4) {
    shifted[k] = original[l]
  }
  return shifted
}

// An intentionally glitchy color comparator
function colorDiff(reference, pixel) {
  var r = reference[0] - pixel[0]
  var g = reference[1] - pixel[1]
  var b = reference[2] - pixel[2]

  return Math.abs(r) + Math.abs(g) + Math.abs(b)
}

function clampColors(rgba, max) {
  // take the first `max` colors seen
  max = max || 256
  var colorMap = {}
  var colors = []
  for (var i = 0; i < rgba.length; i+= 4) {
    var color = rgba.slice(i, i + 4)
    if (colors.length < max && !colorMap[color]) {
      colors.push(color)
      colorMap[color] = color
    }
    else {
      if (!colorMap[color]) {
        var closest = 0
        var best = Number.MAX_VALUE
        for (var j = 0; j < colors.length; j++) {
          var diff = colorDiff(colors[j], color)
          if (diff < best) {
            closest = j
            best = diff
          }
          if (diff === 0) {
            break;
          }
        }
        colors[closest].copy(rgba, i)
      }
    }
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

function glitchClamp(rgba, max) {
  // take the first `max` colors seen
  max = max || 256
  var colors = []
  var glitchtable = []
  for (var i = 0; i < rgba.length; i+= 4) {
    var closest = 0
    var color = rgba.slice(i, i + 4)
    var colorMap = {}
    if (colors.length < max && !colorMap[color]) {
      closest = colors.length
      colors.push(color)
      glitchtable.push(randomPixel())
      colorMap[color] = 1
    }
    else {
      var best = Number.MAX_VALUE
      for (var j = 0; j < colors.length; j++) {
        var diff = colorDiff(colors[j], color)
        if (diff < best) {
          closest = j
          best = diff
        }
        if (diff === 0) {
          break;
        }
      }
    }
    glitchtable[closest].copy(rgba, i)
  }
}

function ghostColors(rgba, max) {
  // take the first `max` colors seen
  max = max || 256
  var colorMap = {}
  var colors = []
  var ghost = randomPixel()
  for (var i = 0; i < rgba.length; i+= 4) {
    var color = rgba.slice(i, i + 4)
    if (colors.length < max && !colorMap[color]) {
      colors.push(color)
      colorMap[color] = color
    }
    else {
      if (!colorMap[color]) {
        ghost.copy(rgba, i)
      }
    }
  }
}

function randomPalette(size) {
  var palette = []
  for (var i = 0; i < size; i++) {
    palette.push(randomPixel())
  }
  return palette
}

function glitchGhost(rgba, max) {
  // take the first `max` colors seen
  max = max || 256
  var colorMap = {}
  var colors = []
  var ghostPalette = randomPalette(max)
  for (var i = 0; i < rgba.length; i+= 4) {
    var color = rgba.slice(i, i + 4)
    if (colors.length < max && !colorMap[color]) {
      colors.push(color)
      colorMap[color] = color
    }
    else {
      if (!colorMap[color]) {
        ghostPalette[(Math.random() * max) | 0].copy(rgba, i)
      }
    }
  }
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

// Does not mutate
function pixelshift(rgba, pixels) {
  if (!pixels) {
    return
  }
  pixels = (pixels % (rgba.length / 4)) * 4
  var left = rgba.slice(0, pixels)
  var right = rgba.slice(pixels)
  return Buffer.concat([right, left])
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

function smear(rgba, smear) {
  var pixel = Buffer(4)
  var smearcount = smear
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
