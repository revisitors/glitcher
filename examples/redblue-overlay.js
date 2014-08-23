var glitcher = require("../glitcher")

var fs = require("fs")
var owl = fs.readFileSync("./owl-glasses.jpg")
var noby = fs.readFileSync("./can-u-not-noby.jpg")
var gifwriter = require("writegif")
var readimage = require("readimage")

function shiftImage(orig, callback) {
  readimage(orig, function (err, image) {
    if (err) {
      return callback(err)
    }
    image.frames.forEach(function (frame) {
      frame.data = glitcher.redBlueOverlay(frame.data)
    })
    return callback(null, image)
  })
}

shiftImage(owl, function (err, img) {
  gifwriter(img, function (err, gif) {
    fs.writeFileSync("redblue-overlay-owl.gif", gif)
  })
})

shiftImage(noby, function (err, img) {
  gifwriter(img, function (err, gif) {
    fs.writeFileSync("redblue-overlay-noby.gif", gif)
  })
})
