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

io.on('connection', (socket) => {
  console.log('a user connected: ' + socket.id)

  sockets.push(socket.id)

  backEndPlayers[socket.id] = {
    position: {
      x: 220,
      y: 500,
    },
    socket: socket.id,
    world: {}
  }
  io.emit('firstConnect', backEndPlayers)
  io.emit('updatePlayers', backEndPlayers, sockets)

  socket.on('mouse', (e) => {
    console.log(e)
  })
  
  socket.on('updateWorld', (world) => {
    backEndPlayers[socket.id].world = world
  })

  socket.on('disconnect', (reason) => {
    console.log('disconnect ' + socket.id)
    sockets = sockets.filter((item) => item !== socket.id);

    io.emit('disConnect', backEndPlayers)
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

