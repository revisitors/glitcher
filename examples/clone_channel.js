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
  glitcher.cloneChannel(dupe, owlImage.frames[0].data, Math.random() * 3 | 0)
  gifwriter(owlImage, function (err, gif) {
    fs.writeFileSync("./output/owlowl.gif", gif)
  })
})

readimage(owl, function (err, owlImage) {
  var dupe = glitcher.copy(owlImage.frames[0].data)
  glitcher.invertRGBA(dupe)
  glitcher.reverseRGBA(dupe)
  glitcher.cloneChannel(dupe, owlImage.frames[0].data, Math.random() * 3 | 0)
  gifwriter(owlImage, function (err, gif) {
    fs.writeFileSync("./output/owllwo.gif", gif)
  })
})

readimage(owl, function (err, owlImage) {
  readimage(noby, function (err, nobyImage) {
    glitcher.cloneChannel(nobyImage.frames[0].data, owlImage.frames[0].data, 0)
    gifwriter(owlImage, function (err, gif) {
      fs.writeFileSync("./output/owlnoby.gif", gif)
    })
  })
})
