// express setup
const express = require('express')
const app = express()

// socket.io setup
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, { pingInterval: 2000, pingTimeout: 5000 })

const port = 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

const backEndPlayers = {}

io.on('connection', (socket) => {
  console.log('a user connected')

  io.emit('updatePlayers', backEndPlayers)

  socket.on('join', ({ username: username }) => {
    // create backEndPlayers.
    backEndPlayers[socket.id] = {
      username: username,
      history: [],
      target: '',
      now: false
    }
  })
  socket.on('run', ({ target: target }) => {
    console.log(target)
    backEndPlayers[socket.id].target = target
  })
  
  socket.on('updateHistory', ({ message: message }) => {
    backEndPlayers[socket.id].history.push(message)
  })

  socket.on('disconnect', (reason) => {
    console.log('disconnect reason: ' + reason)
    delete backEndPlayers[socket.id]
    io.emit('updatePlayers', backEndPlayers)
  })
})

// backend ticker
setInterval(() => {
  //console.log(backEndPlayers)
  io.emit('updatePlayers', backEndPlayers)
}, 200)

server.listen(port, () => {
  console.log(`Im listening on port ${port}`)
})

console.log('server did load')
