module.exports.copy = copy
module.exports.invertRGBA = invertRGBA
module.exports.reverseRGBA = reverseRGBA
module.exports.redBlueOverlay = redBlueOverlay

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



