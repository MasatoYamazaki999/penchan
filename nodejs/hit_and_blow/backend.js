const express = require('express')
const app = express()

const http = require('http')
const server = http.createServer(app)

const port = 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/a', (req, res) => {
  res.sendFile(__dirname + '/public/hit_and_blow.html')
})

server.listen(port, () => {
  console.log('lisen')
})

console.log('frontend.js started.')
