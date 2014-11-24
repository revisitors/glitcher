var glitcher = require("../glitcher")

var fs = require("fs")
var file = process.argv[2] || "./img/owl-glasses.jpg"
var max = process.argv[3] || 256
var orig = fs.readFileSync(file)
var gifwriter = require("writegif")
var readimage = require("readimage")

function ghost(orig, callback) {
  readimage(orig, function (err, image) {
    if (err) {
      return callback(err)
    }
    var blank = new Buffer([100, 0, 0, 255])
    image.frames.forEach(function (frame) {
      glitcher.chromaKey(frame.data, [255, 255, 255], blank, 200)
    })
    return callback(null, image)
  })
}

ghost(orig, function (err, img) {
  gifwriter(img, function (err, gif) {
    fs.writeFileSync("output/chroma.gif", gif)
  })
})

