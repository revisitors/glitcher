var glitcher = require("../glitcher")

var fs = require("fs")
var doge = fs.readFileSync("./img/doge_jump2.gif")
var gifwriter = require("writegif")
var readimage = require("readimage")

readimage(doge, function (err, dogeImage) {
  dogeImage.frames.forEach(function (frame) {
    glitcher.sparkle(dogeImage.width, frame.data)
  })
  gifwriter(dogeImage, function (err, gif) {
    fs.writeFileSync("./output/sparkledoge.gif", gif)
  })
})
