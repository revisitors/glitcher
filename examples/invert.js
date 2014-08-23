var glitcher = require("../glitcher")

var fs = require("fs")
var orig = fs.readFileSync("./img/doge_jump2.gif")
var gifwriter = require("writegif")
var readimage = require("readimage")

function invertImage(orig, callback) {
  readimage(orig, function (err, image) {
    if (err) {
      return callback(err)
    }
    image.frames.forEach(function (frame) {
      frame.data = glitcher.invertRGBA(glitcher.copy(frame.data))
    })
    return callback(null, image)
  })
}

invertImage(orig, function (err, img) {
  gifwriter(img, function (err, gif) {
    fs.writeFileSync("output/inverted.gif", gif)
  })
})

function invertEveryOther(orig, callback) {
  readimage(orig, function (err, image) {
    if (err) {
      return callback(err)
    }
    image.frames.forEach(function (frame, i) {
      if (i % 2 === 0) {
        return
      }
      frame.data = glitcher.invertRGBA(glitcher.copy(frame.data))
    })
    return callback(null, image)
  })
}

invertEveryOther(orig, function (err, img) {
  gifwriter(img, function (err, gif) {
    fs.writeFileSync("output/inverted2.gif", gif)
  })
})
