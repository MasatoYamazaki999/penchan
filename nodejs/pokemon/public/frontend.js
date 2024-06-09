const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const socket = io()

canvas.width = 1024
canvas.height = 576
let collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i))
}

const boundaries = []
const offset = {
  x: -740,
  y: -600,
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
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 + 30 / 2,
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
  player.draw()
  foreground.draw()
}
const movables = [background, ...boundaries, foreground]
function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  )
}
function animate() {
  window.requestAnimationFrame(animate)
  display()
  let moving = true
  player.moving = false
  if (keys.w.pressed && lastkey === 'w') {
    player.moving = true
    player.image = player.sprites.up
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
        })
      ) {
        console.log('colliding')
        moving = false
        break
      }
    }
    if (moving)
      movables.forEach((movabl) => {
        movabl.position.y += 3
      })
  } else if (keys.a.pressed && lastkey === 'a') {
    player.moving = true
    player.image = player.sprites.left
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        console.log('colliding')
        moving = false
        break
      }
    }
    if (moving)
      movables.forEach((movabl) => {
        movabl.position.x += 3
      })
  } else if (keys.s.pressed && lastkey === 's') {
    player.moving = true
    player.image = player.sprites.down
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        })
      ) {
        console.log('colliding')
        moving = false
        break
      }
    }
    if (moving)
      movables.forEach((movabl) => {
        movabl.position.y -= 3
      })
  } else if (keys.d.pressed && lastkey === 'd') {
    player.moving = true
    player.image = player.sprites.right
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        console.log('colliding')
        moving = false
        break
      }
    }
    if (moving)
      movables.forEach((movabl) => {
        movabl.position.x -= 3
      })
  }
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
