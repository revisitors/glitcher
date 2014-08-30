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

readimage(doge, function (err, image) {
  for (var i = image.frames.length - 1; i > 0; i--) {
    dupe = glitcher.copy(image.frames[i - 1].data)
    glitcher.cloneChannel(dupe, image.frames[i].data, 0)
    if (i - 2 >= 0) {
      dupe = glitcher.copy(image.frames[i - 2].data)
      glitcher.cloneChannel(dupe, image.frames[i].data, 1)
    }
    if (i - 3 >= 0) {
      dupe = glitcher.copy(image.frames[i - 3].data)
      glitcher.cloneChannel(dupe, image.frames[i].data, 2)
    }
  }
  gifwriter(image, function (err, gif) {
    fs.writeFileSync("./output/dogogogoge.gif", gif)
  })
})
