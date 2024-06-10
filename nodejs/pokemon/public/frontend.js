const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const socket = io()

const devicePixelRatio = window.devicePixelRatio || 1

canvas.width = 480 * devicePixelRatio
canvas.height = 800 * devicePixelRatio

const canvas_width_half = canvas.width / 2
const canvas_height_half = canvas.height / 2

ctx.scale(devicePixelRatio, devicePixelRatio)

let collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i))
}

let battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i += 70) {
  battleZonesMap.push(battleZonesData.slice(i, 70 + i))
}

const boundaries = []
const offset = {
  x: -1000,
  y: -500,
}

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      )
  })
})

const battleZones = []
battleZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      battleZones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      )
  })
})

const image = new Image()
image.src = './img/Pellet Town.png'

const foregroundImage = new Image()
foregroundImage.src = './img/foregroundObjects.png'

const playerUpImage = new Image()
playerUpImage.src = './img/playerUp.png'

const playerDownImage = new Image()
playerDownImage.src = './img/playerDown.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './img/playerRight.png'

const player = new Sprite({
  position: {
    x: 220,
    y: 380,
  },
  image: playerDownImage,
  frames: {
    max: 4,
  },
  sprites: {
    up: playerUpImage,
    left: playerLeftImage,
    right: playerRightImage,
    down: playerDownImage,
  },
})
const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
})

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImage,
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
  boundaries.forEach((boundary) => {
    boundary.draw()
  })
  battleZones.forEach((battleZone) => {
    battleZone.draw()
  })
  player.draw()
  foreground.draw()
}
// detect collision
function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  )
}

const movables = [background, ...boundaries, foreground, ...battleZones]

function move() {
  // 移動前に移動可能か確認
  let moving = true
  //player.moving = true
  for (let i = 0; i < boundaries.length; i++) {
    const boundary = boundaries[i]
    if (
      rectangularCollision({
        rectangle1: player,
        rectangle2: {
          ...boundary,
          position: {
            x: boundary.position.x - player.velocity.x,
            y: boundary.position.y - player.velocity.y,
          },
        },
      })
    ) {
      console.log('colliding')
      moving = false
      player.moving = false
      break
    }
  }
  if (moving && player.moving)
    movables.forEach((movabl) => {
      movabl.position.x -= player.velocity.x
      movabl.position.y -= player.velocity.y
    })
}

function animate() {
  window.requestAnimationFrame(animate)
  display()
  move()
}

animate()

socket.on('update', () => {
  console.log('front 004')
})

window.addEventListener('touchstart', (e) => {
  e.preventDefault()
  const canvas = document.querySelector('canvas')
  const { top, left } = canvas.getBoundingClientRect()
  const playerPosition = {
    x: canvas_width_half,
    y: canvas_height_half,
  }
  const angle = Math.atan2(
    e.touches[0].pageY - top - playerPosition.y,
    e.touches[0].pageX - left - playerPosition.x
  )
  const velocity = {
    x: Math.cos(angle) * 5,
    y: Math.sin(angle) * 5,
  }
  player.velocity = velocity
  player.moving = true

  socket.emit('mouse', velocity)
})

window.addEventListener('touchend', (e) => {
  e.preventDefault()
  player.moving = false
  socket.emit('mouse', '離した!')
})
