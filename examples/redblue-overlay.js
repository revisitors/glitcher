var glitcher = require("../glitcher")

var fs = require("fs")
var file = process.argv[2] || "./img/doge_jump2.gif"
var doge = fs.readFileSync(file);
var owl = fs.readFileSync("./img/owl-glasses.jpg")
var noby = fs.readFileSync("./img/can-u-not-noby.jpg")
var gifwriter = require("writegif")
var readimage = require("readimage")

function shiftImage(orig, callback) {
  readimage(orig, function (err, image) {
    if (err) {
      return callback(err)
    }
    image.frames.forEach(function (frame) {
      glitcher.redBlueOverlay(frame.data)
    })
    return callback(null, image)
  })
}

shiftImage(doge, function (err, img) {
  gifwriter(img, function (err, gif) {
    fs.writeFileSync("output/redblue-overlay-doge.gif", gif)
  })
})


shiftImage(owl, function (err, img) {
  gifwriter(img, function (err, gif) {
    fs.writeFileSync("output/redblue-overlay-owl.gif", gif)
  })
})

shiftImage(noby, function (err, img) {
  gifwriter(img, function (err, gif) {
    fs.writeFileSync("output/redblue-overlay-noby.gif", gif)
  })
})
