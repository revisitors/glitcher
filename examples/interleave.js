var glitcher = require("../glitcher")

var fs = require("fs")
var owl = fs.readFileSync("./img/owl-glasses.jpg")
var noby = fs.readFileSync("./img/can-u-not-noby.jpg")
var doge = fs.readFileSync("./img/doge_jump2.gif")
var gifwriter = require("writegif")
var readimage = require("readimage")

readimage(owl, function (err, owlImage) {
  var dupe = glitcher.copy(owlImage.frames[0].data)
  glitcher.invertRGBA(dupe)
  glitcher.interleave(owlImage.width, owlImage.frames[0].data, dupe)
  gifwriter(owlImage, function (err, gif) {
    fs.writeFileSync("./output/interleave_owl.gif", gif)
  })
})

readimage(owl, function (err, owlImage) {
  var dupe = glitcher.copy(owlImage.frames[0].data)
  glitcher.interleave(owlImage.width, owlImage.frames[0].data)
  gifwriter(owlImage, function (err, gif) {
    fs.writeFileSync("./output/interlace_owl.gif", gif)
  })
})

readimage(owl, function (err, owlImage) {
  var dupe = glitcher.copy(owlImage.frames[0].data)
  glitcher.reverseRGBA(dupe)
  glitcher.interleave(owlImage.width, owlImage.frames[0].data, dupe)
  gifwriter(owlImage, function (err, gif) {
    fs.writeFileSync("./output/shiftmirror_owl.gif", gif)
  })
})

readimage(owl, function (err, owlImage) {
  var dupe = glitcher.copy(owlImage.frames[0].data)
  glitcher.rowslice(dupe, 34001)
  glitcher.interleave(owlImage.width, owlImage.frames[0].data, dupe)
  gifwriter(owlImage, function (err, gif) {
    fs.writeFileSync("./output/slice_owl.gif", gif)
  })
})
