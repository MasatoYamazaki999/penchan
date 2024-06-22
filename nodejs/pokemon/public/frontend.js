const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const socket = io()

const devicePixelRatio = window.devicePixelRatio || 1

canvas.width = 480 * devicePixelRatio
canvas.height = 574 * devicePixelRatio

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

const battle = {
  initiated: false,
}

function display() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  //document.getElementById('socketId').innerHTML = sockets + '</br>'

  // 背景
  background.draw()

  // 壁判定
  boundaries.forEach((boundary) => {
    boundary.draw()
  })

  // プレイヤー
  for (const id in frontEndPlayers) {
    const frontEndPlayer = frontEndPlayers[id]
    if (frontEndPlayer.socket === socket.id) {
      frontEndPlayer.draw(true)
      displayStatus(frontEndPlayer)
    } else {
      frontEndPlayer.draw(false)
    }
  }
  // status

  // 前景
  foreground.draw()

  // Encount!
  // REM....
}
function displayStatus(p){
  charStatus = ""
  charStatus += "<div>" + p.name + "</div>"
  charStatus += "<div>" + "lvl: " + p.level + "</div>"
  charStatus += "<div>" + "hp: " + p.hp + "</div>"
  charStatus += "<div>" + "str: " + "</div>"
  charStatus += "<div>" + "def: " + "</div>"
  charStatus += "<div>" + "dex: " + "</div>"
  charStatus += "<div>" + "exp: " + "</div>"
  document.querySelector('#status').innerHTML = charStatus
  message = "Masatoはenemyに10のダメージを与えた"
  document.querySelector('#message').innerHTML = message
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
              y: frontEndPlayers[socket.id].position.y,
            },
            width: 48,
            height: 68,
          },
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - frontEndPlayers[socket.id].velocity.x,
              y: boundary.position.y - frontEndPlayers[socket.id].velocity.y,
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

  if (frontEndPlayers[socket.id]) {
    if (moving && frontEndPlayers[socket.id].moving) {
      // 移動
      movables.forEach((movabl) => {
        movabl.position.x -= frontEndPlayers[socket.id].velocity.x
        movabl.position.y -= frontEndPlayers[socket.id].velocity.y
      })
      frontEndPlayers[socket.id].world = background.position
      socket.emit(
        'updateWorld',
        frontEndPlayers[socket.id].world,
        frontEndPlayers[socket.id].moving,
        frontEndPlayers[socket.id].velocity
      )
    }
  }
}

let animationId
function animate() {
  animationId = null
  animationId = window.requestAnimationFrame(animate)
  display()
  if (!battle.initiated) {
    move()
  }
}

socket.on('updatePlayers', (backEndPlayers, pSockets) => {
  sockets = pSockets

  for (const id in backEndPlayers) {
    const backEndPlayer = backEndPlayers[id]
    // 初参加プレイヤー
    if (!frontEndPlayers[id]) {
      frontEndPlayers[id] = new Player({
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
        moving: backEndPlayer.moving,
        name: 'MASATO',
        level: 123,
        hp: 6543
      })
    } else {
      if (id !== socket.id) {
        frontEndPlayers[id].velocity = backEndPlayer.velocity
        frontEndPlayers[id].moving = backEndPlayer.moving
      }
      frontEndPlayers[id].world = backEndPlayer.world
    }
  }
  // this is where we delete frontend players
  for (const id in frontEndPlayers) {
    if (!backEndPlayers[id]) {
      delete frontEndPlayers[id]
    }
  }
})

function updateWorld(moving, angle = null) {
  if (angle != null) {
    const velocity = {
      x: Math.cos(angle) * 5,
      y: Math.sin(angle) * 5,
    }
    frontEndPlayers[socket.id].velocity = velocity
  }
  frontEndPlayers[socket.id].moving = moving
  socket.emit(
    'updateWorld',
    frontEndPlayers[socket.id].world,
    frontEndPlayers[socket.id].moving,
    frontEndPlayers[socket.id].velocity
  )
}

window.addEventListener('touchstart', (e) => {
  e.preventDefault()
  const canvas = document.querySelector('canvas')
  const { top, left } = canvas.getBoundingClientRect()
  const playerPosition = {
    x: canvas_width_half,
    y: canvas_height_half - 50,
  }
  const angle = Math.atan2(
    e.touches[0].pageY - top - playerPosition.y,
    e.touches[0].pageX - left - playerPosition.x
  )
  updateWorld(true, angle)
})

window.addEventListener('mousedown', (e) => {
  e.preventDefault()
  const canvas = document.querySelector('canvas')
  const { top, left } = canvas.getBoundingClientRect()
  const playerPosition = {
    x: canvas_width_half,
    y: canvas_height_half - 50,
  }
  const angle = Math.atan2(
    e.offsetY - top - playerPosition.y,
    e.offsetX - left - playerPosition.x
  )
  updateWorld(true, angle)
})

window.addEventListener('touchend', (e) => {
  e.preventDefault()
  updateWorld(false)
})

window.addEventListener('mouseup', (e) => {
  e.preventDefault()
  updateWorld(false)
})
