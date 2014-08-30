var glitcher = require("../glitcher")

var fs = require("fs")
var file = process.argv[2] || "./img/owl-glasses.jpg"
var orig = fs.readFileSync(file)
var gifwriter = require("writegif")
var readimage = require("readimage")

function pixelshift(orig, callback) {
  readimage(orig, function (err, image) {
    if (err) {
      return callback(err)
    }
    image.frames.forEach(function (frame) {
      glitcher.pixelshift(frame.data, ((Math.random() * image.height) | 0))
    })
    return callback(null, image)
  })
}

pixelshift(orig, function (err, img) {
  gifwriter(img, function (err, gif) {
    fs.writeFileSync("./output/pixelshift.gif", gif)
  })
})
