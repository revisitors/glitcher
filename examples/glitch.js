var glitcher = require("../glitcher")

var fs = require("fs")
var algo = process.argv[2]
if (!algo) {
  console.log("usage: node glitch.js glitch file")
  process.exit(1)
}
var file = process.argv[3] || "./img/owl-glasses.jpg"
var arg = +process.argv[4] || 256
var arg2 = +process.argv[5] || 0
var orig = fs.readFileSync(file)
var gifwriter = require("writegif")
var readimage = require("readimage")

function glitch(orig, callback) {
  readimage(orig, function (err, image) {
    if (err) {
      return callback(err)
    }
    console.log("Image h=%s w=%s frames=%s", image.height, image.width, image.frames.length)
    if (algo === "yslice") {
      console.log("try %s for arg 3", image.height * image.width / 4)
    }
    image.frames.forEach(function (frame) {
      frame.data = glitcher[algo](frame.data, arg, arg2)
    })
    return callback(null, image)
  })
}

glitch(orig, function (err, img) {
  gifwriter(img, function (err, gif) {
    fs.writeFileSync("./output/glitch.gif", gif)
  })
})
