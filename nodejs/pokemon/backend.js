// file system
var fs = require('fs')

// express setup
const express = require('express')
const app = express()

// socket.io setup
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')

const io = new Server(server, { pingInterval: 1000, pingTimeout: 3000 })

const port = 3000

const backEndPlayers = {}

let sockets = []

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

class PlayerData {
  constructor(player) {
    this.name = player.name
    this.level = player.level
    this.maxhp = player.maxhp
    this.hp = player.hp
    this.str = player.str
    this.def = player.def
    this.dex = player.dex
    this.exp = player.exp
  }
}

io.on('connection', (socket) => {
  console.log('a user connected: ' + socket.id)

  sockets.push(socket.id)

  backEndPlayers[socket.id] = {
    position: {
      x: 220,
      y: 230,
    },
    socket: socket.id,
    moving: false,
    velocity: { x: 0, y: 0 },
    world: { x: 0, y: 0 },
    exp: 0
  }
  io.emit('updatePlayers', backEndPlayers, sockets)

  socket.on('log', (e) => {
    console.log(e)
  })

  socket.on('updateWorld', (world, moving, velocity) => {
    backEndPlayers[socket.id].world = world
    backEndPlayers[socket.id].moving = moving
    backEndPlayers[socket.id].velocity = velocity
  })

  socket.on('initGame', ({ name }) => {
    backEndPlayers[socket.id].name = name
    io.emit('updatePlayers', backEndPlayers, sockets)
  })

  socket.on('save', (player) => {
    let data = new PlayerData(player)
    console.log('save on')
    const json = JSON.stringify(data, null, 2)
    fs.writeFileSync('../data/' + player.name + '.json', json)
  })

  socket.on('load', (player) => {
    const data = fs.readFileSync('../data/' + player.name + '.json',
      { encoding: 'utf8', flag: 'r' })
    io.emit('loadPlayer', data)
  })

  socket.on('disconnect', (reason) => {
    console.log('disconnect ' + socket.id + ' ' + reason)
    sockets = sockets.filter((item) => item !== socket.id)

    delete backEndPlayers[socket.id]
    io.emit('updatePlayers', backEndPlayers, sockets)
  })
})

setInterval(() => {
  io.emit('updatePlayers', backEndPlayers, sockets)
}, 20)

server.listen(port, () => {
  console.log(`Im listening on port ${port}`)
})
