module.exports.invertRGBA = invertRGBA

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
