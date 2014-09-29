var glitcher = require("../glitcher")

var fs = require("fs")
var doge = fs.readFileSync("./img/doge_jump2.gif")
var gifwriter = require("writegif")
var readimage = require("readimage")

readimage(doge, function (err, dogeImage) {
  var m = glitcher.medianFrame(dogeImage.frames)
  var i = new readimage.Image(dogeImage.height, dogeImage.width)
  i.addFrame(m)
  gifwriter(i, function (err, gif) {
    fs.writeFileSync("./output/mediandoge.gif", gif)
  })
})

readimage(doge, function (err, dogeImage) {
  var m = glitcher.meanFrame(dogeImage.frames)
  var i = new readimage.Image(dogeImage.height, dogeImage.width)
  i.addFrame(m)
  console.log(glitcher.medianPixel(m))

  gifwriter(i, function (err, gif) {
    fs.writeFileSync("./output/meandoge.gif", gif)
  })
})

readimage(doge, function (err, dogeImage) {
  dogeImage.frames.forEach(function (frame) {
    glitcher.rowSort(dogeImage.width, frame.data)
  })
  gifwriter(dogeImage, function (err, gif) {
    fs.writeFileSync("./output/sorteddoge.gif", gif)
  })
})
