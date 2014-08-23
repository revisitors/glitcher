var glitcher = require("../glitcher")

var fs = require("fs")
var orig = fs.readFileSync("./img/doge_jump2.gif")
var gifwriter = require("writegif")
var readimage = require("readimage")

function flipImage(orig, callback) {
  readimage(orig, function (err, image) {
    if (err) {
      return callback(err)
    }
    image.frames.forEach(function (frame) {
      frame.data = glitcher.reverseRGBA(glitcher.copy(frame.data))
    })
    return callback(null, image)
  })
}

flipImage(orig, function (err, img) {
  gifwriter(img, function (err, gif) {
    fs.writeFileSync("output/flipped.gif", gif)
  })
})

function flipEveryOther(orig, callback) {
  readimage(orig, function (err, image) {
    if (err) {
      return callback(err)
    }
    image.frames.forEach(function (frame, i) {
      if (i % 2 === 0) {
        return
      }
      frame.data = glitcher.reverseRGBA(glitcher.copy(frame.data))
    })
    return callback(null, image)
  })
}

flipEveryOther(orig, function (err, img) {
  gifwriter(img, function (err, gif) {
    fs.writeFileSync("output/flipped2.gif", gif)
  })
})
