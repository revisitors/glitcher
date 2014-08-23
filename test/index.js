var test = require("tape")

var glitcher = require("../glitcher")

test("invertRGBA", function (t) {
  var b = new Buffer([33, 22, 11, 0xff, 99, 98, 10, 0xff])
  glitcher.invertRGBA(b)
  var z = new Buffer([0xde, 0xe9, 0xf4, 0xff, 0x9c, 0x9d, 0xf5, 0xff])
  t.deepEqual(b, z)
  t.end()
})

test("reverseRGBA", function (t) {
  var b = new Buffer([33, 22, 11, 0xff, 99, 98, 10, 0xff, 33, 22, 11, 0xff, 99, 98, 10, 0xff])
  glitcher.reverseRGBA(b)
  var z = new Buffer([99, 98, 10, 0xff, 33, 22, 11, 0xff, 99, 98, 10, 0xff, 33, 22, 11, 0xff])
  t.deepEqual(b, z)
  t.end()
})
