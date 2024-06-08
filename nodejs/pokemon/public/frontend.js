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
  constructor({ position, velocity, image }) {
    this.position = position
    this.image = image
  }

  draw() {
    ctx.drawImage(this.image, this.position.x, this.position.y)
  }
}

const background = new Sprite({
  position: {
    x: -740,
    y: -600,
  },
  image: image,
})

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
}
function display() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  background.draw()
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

  if (keys.w.pressed && lastkey === 'w') background.position.y += 3
  else if (keys.a.pressed && lastkey === 'a') background.position.x += 3
  else if (keys.s.pressed && lastkey === 's') background.position.y -= 3
  else if (keys.d.pressed && lastkey === 'd') background.position.x -= 3
}

animate()
let lastkey = ''
window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = true
			lastkey = 'w'
      break

    case 'a':
      keys.a.pressed = true
			lastkey = 'a'
      break

    case 's':
      keys.s.pressed = true
			lastkey = 's'
      break

    case 'd':
      keys.d.pressed = true
			lastkey = 'd'
      break
  }
})
window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = false
      break

    case 'a':
      keys.a.pressed = false
      break

    case 's':
      keys.s.pressed = false
      break

    case 'd':
      keys.d.pressed = false
      break
  }
})

socket.on('update', () => {
  console.log('front 004')
})

// const game = setInterval(function () {
//   display();
// }, 100);
