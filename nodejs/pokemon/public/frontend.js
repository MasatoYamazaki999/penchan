const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const socket = io()

canvas.width = 1024
canvas.height = 576

const playerImage = new Image()
playerImage.src = './img/playerDown.png'

const image = new Image()
image.src = './img/Pellet Town.png'

class Sprite {
  constructor({ position, velocity }) {
    this.position = position
    this.velocity = velocity
  }
}

function display() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(image, -740, -600)
  ctx.drawImage(
    playerImage,
    0,
    0,
    playerImage.width / 4,
    playerImage.height,
    canvas.width / 2 - playerImage.width / 4 / 2,
    canvas.height / 2 - playerImage.height / 2,
    playerImage.width / 4,
    playerImage.height
  )
}

function animate() {
  window.requestAnimationFrame(animate)
  display()
}

animate()

window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'w':
      break

    case 'a':
      break

    case 's':
      break

    case 'd':
      break
  }
})
// const game = setInterval(function () {
//   display();
// }, 100);
socket.on('update', () => {
  console.log('front 004')
})
