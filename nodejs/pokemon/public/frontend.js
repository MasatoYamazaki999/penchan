const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const socket = io()

const devicePixelRatio = window.devicePixelRatio || 1

canvas.width = 480 * devicePixelRatio
canvas.height = 800 * devicePixelRatio

const canvas_width_half = canvas.width / 2
const canvas_height_half = canvas.height / 2

let sockets = []

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
const frontEndPlayers = {}

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

console.log(battleZones)
const backgroundImage = new Image()
backgroundImage.src = './img/Pellet Town.png'

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

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: backgroundImage,
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
  document.getElementById('socketId').innerHTML = sockets + '</br>'

  // 背景
  background.draw()
  // 衝突用
  boundaries.forEach((boundary) => {
    boundary.draw()
  })
  // battle zones
  battleZones.forEach(battleZone => {
    battleZone.draw()
  })

  // プレイヤー
  for (const id in frontEndPlayers) {
    const frontEndPlayer = frontEndPlayers[id]
    if(frontEndPlayer.socket === socket.id){
      frontEndPlayer.draw(true)
    } else {
      frontEndPlayer.draw(false)
    }
  }
  // 前景
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
  for (let i = 0; i < boundaries.length; i++) {
    const boundary = boundaries[i]
    if (frontEndPlayers[socket.id] && frontEndPlayers[socket.id].moving) {
      if (
        rectangularCollision({
          rectangle1: {
            position: {
              x: frontEndPlayers[socket.id].position.x,
              y: frontEndPlayers[socket.id].position.y
            },
            //position: { x: 220, y: 380 },
            width: 48,
            height: 68,
          },
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - frontEndPlayers[socket.id].velocity.x,
              y: boundary.position.y - frontEndPlayers[socket.id].velocity.y
            },
          },
        })
      ) {
        moving = false
        frontEndPlayers[socket.id].moving = false
        break
      }
    }
  }

  for (let i = 0; i < battleZones.length; i++) {
    const battleZone = battleZones[i]
    if (frontEndPlayers[socket.id] && frontEndPlayers[socket.id].moving) {
      if (
        rectangularCollision({
          rectangle1: {
            position: {
              x: frontEndPlayers[socket.id].position.x,
              y: frontEndPlayers[socket.id].position.y
            },
            width: 48,
            height: 68,
          },
          rectangle2: {
            ...battleZone,
            position: {
              x: battleZone.position.x - frontEndPlayers[socket.id].velocity.x,
              y: battleZone.position.y - frontEndPlayers[socket.id].velocity.y
            },
          },
        })
      ) {
        console.log('battle zone collide')
        break
      }
    }
  }

  if (frontEndPlayers[socket.id]) {
    if (moving && frontEndPlayers[socket.id].moving) {
      // // プレイヤー画像選定
      // 移動
      movables.forEach((movabl) => {
        movabl.position.x -= frontEndPlayers[socket.id].velocity.x
        movabl.position.y -= frontEndPlayers[socket.id].velocity.y
      })
      frontEndPlayers[socket.id].world = background.position
      socket.emit('updateWorld', 
        frontEndPlayers[socket.id].world, 
        frontEndPlayers[socket.id].moving, 
        frontEndPlayers[socket.id].velocity)
    }
  }
}

function animate() {
  window.requestAnimationFrame(animate)
  display()
  move()
}

animate()

socket.on('updatePlayers', (backEndPlayers, pSockets) => {
  sockets = pSockets

  for (const id in backEndPlayers) {
    const backEndPlayer = backEndPlayers[id]
    // 初参加プレイヤー
    if (!frontEndPlayers[id]) {

      frontEndPlayers[id] = new SpritePlayer({
        position: {
          x: backEndPlayer.position.x,
          y: backEndPlayer.position.y,
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
        socket: backEndPlayer.socket,
        world: background.position,
        velocity: backEndPlayer.velocity,
        moving: backEndPlayer.moving
      })
    } else {
      if (id === socket.id) {
        //frontEndPlayers[id].socket = backEndPlayer.socket;
      } else {
        frontEndPlayers[id].velocity = backEndPlayer.velocity
        frontEndPlayers[id].moving = backEndPlayer.moving
      }
      frontEndPlayers[id].world = backEndPlayer.world;
    }
  }
  // this is where we delete frontend players
  for (const id in frontEndPlayers) {
    if (!backEndPlayers[id]) {
      delete frontEndPlayers[id]
    }
  }
})

window.addEventListener('touchstart', (e) => {
  e.preventDefault()
  const canvas = document.querySelector('canvas')
  const { top, left } = canvas.getBoundingClientRect()
  const playerPosition = {
    x: canvas_width_half,
    y: canvas_height_half + 300,
  }
  const angle = Math.atan2(
    e.touches[0].pageY - top - playerPosition.y,
    e.touches[0].pageX - left - playerPosition.x
  )
  const velocity = {
    x: Math.cos(angle) * 5,
    y: Math.sin(angle) * 5,
  }
  frontEndPlayers[socket.id].velocity = velocity
  frontEndPlayers[socket.id].moving = true
  socket.emit('updateWorld', 
    frontEndPlayers[socket.id].world, 
    frontEndPlayers[socket.id].moving, 
    frontEndPlayers[socket.id].velocity)
})

window.addEventListener('mousedown', (e) => {
  e.preventDefault()
  const canvas = document.querySelector('canvas')
  const { top, left } = canvas.getBoundingClientRect()
  const playerPosition = {
    x: canvas_width_half,
    y: canvas_height_half + 300,
  }
  const angle = Math.atan2(
    e.offsetY - top - playerPosition.y,
    e.offsetX - left - playerPosition.x
  )
  const velocity = {
    x: Math.cos(angle) * 5,
    y: Math.sin(angle) * 5,
  }
  frontEndPlayers[socket.id].velocity = velocity
  frontEndPlayers[socket.id].moving = true
  socket.emit('updateWorld', 
    frontEndPlayers[socket.id].world, 
    frontEndPlayers[socket.id].moving, 
    frontEndPlayers[socket.id].velocity)
})

window.addEventListener('touchend', (e) => {
  e.preventDefault()
  frontEndPlayers[socket.id].moving = false
  socket.emit('updateWorld', 
    frontEndPlayers[socket.id].world, 
    frontEndPlayers[socket.id].moving, 
    frontEndPlayers[socket.id].velocity)
})

window.addEventListener('mouseup', (e) => {
  e.preventDefault()
  frontEndPlayers[socket.id].moving = false
  socket.emit('updateWorld', 
    frontEndPlayers[socket.id].world, 
    frontEndPlayers[socket.id].moving, 
    frontEndPlayers[socket.id].velocity)
})
