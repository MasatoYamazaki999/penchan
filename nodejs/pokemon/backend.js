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

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
  console.log('a user connected: ' + socket.id)

  backEndPlayers[socket.id] = {
    position: {
      x: 220,
      y: 500,
    },
  }

  cnt = 1
  io.emit('updatePlayers', backEndPlayers)

  socket.on('mouse', (e) => {
    console.log(e)
  })

  socket.on('move', (backendPlayer) => {
    console.log(backendPlayer.position.x + ' : ' + backendPlayer.position.y)
    backEndPlayers[socket.id].position.x = backendPlayer.position.x
    backEndPlayers[socket.id].position.y = backendPlayer.position.y
    io.emit('updatePlayers', backEndPlayers)
  })

  socket.on('disconnect', (reason) => {
    console.log('disconnect reason: ' + reason)
    delete backEndPlayers[socket.id]
    io.emit('updatePlayers', backEndPlayers)
  })
})

server.listen(port, () => {
  console.log(`Im listening on port ${port}`)
})
console.log('server load good!')
