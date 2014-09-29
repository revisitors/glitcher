var glitcher = require("../glitcher")

function drawImage(imageObj) {
  var canvas = document.getElementById('myCanvas')
  var context = canvas.getContext('2d')
  var imageX = 0
  var imageY = 0
  var imageWidth = imageObj.width
  var imageHeight = imageObj.height

  context.drawImage(imageObj, imageX, imageY)

  var imageData = context.getImageData(imageX, imageY, imageWidth, imageHeight)
  console.log(imageData)
  var data = new Buffer(imageData.data)

  console.log(data.length)
  console.log("replacing")
  glitcher.swapChannels(data, (Math.random() * 100) | 0, (Math.random() * 100) | 0)
  //glitcher.chromaKey(data, glitcher.meanPixel(data), new Buffer(data.length), 120)
  //glitcher.chromaKeyInverse(data, [0, 255, 0], new Buffer(data.length), 200)

  for (var i = 0; i < data.length; i++) {
    imageData.data[i] = data[i]
  }
  context.putImageData(imageData, imageX, imageY)
}
var imageObj = new Image()
imageObj.onload = function() {
  drawImage(this)
}
imageObj.src = 'img/owl-glasses.jpg'
