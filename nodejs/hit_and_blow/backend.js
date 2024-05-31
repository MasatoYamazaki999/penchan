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
      battle: false
    }
  })
  socket.on('ans', ({ ans: ans }) => {
    backEndPlayers[socket.id].ans = ans
    io.emit('updatePlayers', backEndPlayers)
  })

  socket.on('run', ({ target: target }) => {
    backEndPlayers[socket.id].target = target
    backEndPlayers[socket.id].battle = true
    io.emit('updatePlayers', backEndPlayers)
  })
  
  socket.on('updateHistory', ({ message: message }) => {
    backEndPlayers[socket.id].history.push(message)
  })

  socket.on('disconnect', (reason) => {
    delete backEndPlayers[socket.id]
    io.emit('updatePlayers', backEndPlayers)
  })
})

// backend ticker
setInterval(() => {
  //console.log(backEndPlayers)
  io.emit('updatePlayers', backEndPlayers)
}, 500)

server.listen(port, () => {
  console.log(`Im listening on port ${port}`)
})

console.log('server did load')
