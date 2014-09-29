var glitcher = require("../glitcher")

var fs = require("fs")
var file = process.argv[2] || "./img/doge_jump2.gif"
var orig = fs.readFileSync(file)
var gifwriter = require("writegif")
var readimage = require("readimage")

function bg(orig, callback) {
  readimage(orig, function (err, image) {
    if (err) {
      return callback(err)
    }
    var replacer = function(frame) {
      glitcher.rainbowClamp(frame)
    }
    glitcher.replaceBackground(image.frames, replacer, 30)
    return callback(null, image)
  })
}

function fg(orig, callback) {
  readimage(orig, function (err, image) {
    if (err) {
      return callback(err)
    }
    var replacer = function(frame) {
      glitcher.rainbowClamp(frame)
    }
    glitcher.replaceForeground(image.frames, replacer, 30)
    return callback(null, image)
  })
}

bg(orig, function (err, img) {
  gifwriter(img, function (err, gif) {
    fs.writeFileSync("./output/bg.gif", gif)
  })
})

fg(orig, function (err, img) {
  gifwriter(img, function (err, gif) {
    fs.writeFileSync("./output/fg.gif", gif)
  })
})
