var glitcher = require("../glitcher")

var fs = require("fs")
var file = process.argv[2] || "./img/owl-glasses.jpg"
var max = process.argv[3] || 256
var orig = fs.readFileSync(file)
var gifwriter = require("writegif")
var readimage = require("readimage")

function glitch(orig, callback) {
  readimage(orig, function (err, image) {
    if (err) {
      return callback(err)
    }
    image.frames.forEach(function (frame) {
      glitcher.clampColors(frame.data, max)
    })
    return callback(null, image)
  })
}

glitch(orig, function (err, img) {
  gifwriter(img, function (err, gif) {
    fs.writeFileSync("output/clamped.gif", gif)
  })
})

function glitchClamp(orig, callback) {
  readimage(orig, function (err, image) {
    if (err) {
      return callback(err)
    }
    image.frames.forEach(function (frame) {
      glitcher.glitchClamp(frame.data, max)
    })
    return callback(null, image)
  })
}

glitchClamp(orig, function (err, img) {
  gifwriter(img, function (err, gif) {
    fs.writeFileSync("output/glitchclamped.gif", gif)
  })
})
