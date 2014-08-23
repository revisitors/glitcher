module.exports.invertRGBA = invertRGBA
module.exports.shifty = shifty

function invertRGBA(rgba) {
  var inverted = new Buffer(rgba.length)
  rgba.copy(inverted)
  for (var i = 0; i < inverted.length; i+= 4) {
    inverted[i] = inverted[i] ^ 255
    inverted[i + 1] = inverted[i + 1] ^ 255
    inverted[i + 2] = inverted[i + 2] ^ 255
  }
  return inverted
}

function shifty(original) {
  var shifted = new Buffer(original.length)
  original.copy(shifted)
  var len = shifted.length
  var half = len / 2
  for (var k = half, l = 0; k < len; k+= 4, l+= 4) {
    shifted[k] = original[l]
  }
  return shifted
}

