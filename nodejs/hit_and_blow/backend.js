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
//var all_array = []

io.on('connection', (socket) => {
  console.log('a user connected')

  io.emit('updatePlayers', backEndPlayers)

  socket.on('join', ({ username: username }) => {
    // create backEndPlayers.
    backEndPlayers[socket.id] = {
      username: username,
      history: [],
      target: false
    }
  })
  socket.on('updateHistory', ({ message: message }) => {
    backEndPlayers[socket.id].history.push(message)
    //console.log(backEndPlayers)
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
}, 1000)

server.listen(port, () => {
  console.log(`Im listening on port ${port}`)
})

console.log('server did load')
