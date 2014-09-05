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
    if (image.frames.length == 1) {
      glitcher.rainbowClamp(image.frames[0].data)
    }
    else {
      glitcher.rainbow(image.frames)
    }
    return callback(null, image)
  })
}

pixelshift(orig, function (err, img) {
  gifwriter(img, function (err, gif) {
    fs.writeFileSync("./output/rainbow.gif", gif)
  })
})
