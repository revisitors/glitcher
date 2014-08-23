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
    image.frames.forEach(function (frame) {
      glitcher.ghostColors(frame.data, max)
    })
    return callback(null, image)
  })
}

ghost(orig, function (err, img) {
  gifwriter(img, function (err, gif) {
    fs.writeFileSync("output/ghosted.gif", gif)
  })
})

function glitch(orig, callback) {
  readimage(orig, function (err, image) {
    if (err) {
      return callback(err)
    }
    image.frames.forEach(function (frame) {
      glitcher.glitchGhost(frame.data, max)
    })
    return callback(null, image)
  })
}

glitch(orig, function (err, img) {
  gifwriter(img, function (err, gif) {
    fs.writeFileSync("output/glitchghosted.gif", gif)
  })
})
