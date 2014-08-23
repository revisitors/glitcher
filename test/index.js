var test = require("tape")

var glitcher = require("../glitcher")

test("invertRGBA", function (t) {
  var b = new Buffer([33, 22, 11, 0xff, 99, 98, 10, 0xff])
  var inverted = glitcher.invertRGBA(b)
  var z = new Buffer([0x21, 0x16, 0x0b, 0xff, 0x63, 0x62, 0x0a, 0xff])
  t.deepEqual(b, z)
  t.end()
})
