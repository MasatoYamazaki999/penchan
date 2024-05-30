const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const socket = io()
const devicePixelRatio = window.devicePixelRatio || 1

canvas.width = 1024 * devicePixelRatio
canvas.height = 576 * devicePixelRatio

c.scale(devicePixelRatio, devicePixelRatio)

const frontEndPlayers = {}

const g_opt = document.createElement('option')

socket.on('updatePlayers', (backEndPlayers) => {
  //console.log(frontEndPlayers)
  for (const id in backEndPlayers) {
    const backEndPlayer = backEndPlayers[id]

    if (!frontEndPlayers[id]) {
      // create new player
      frontEndPlayers[id] = new Player({
        username: backEndPlayer.username,
        history: backEndPlayer.history,
        target: backEndPlayer.target,
      })
      // 参加者追加
      let selText = "<select id='select' size='4' style='width: 100px;' class='scrollbox'>"
      selText += "<option id='opt1'>Masato</option>"
      selText += "<option id='opt2'>Hiroko</option>"
      selText += '</select>'

      document.querySelector('#members').innerHTML = selText
    } else {
      frontEndPlayers[id].history = backEndPlayer.history
    }
  }

  for (const id in frontEndPlayers) {
    // 対戦内容表示
    if (socket.id == id) {
      disp = ''
      for (const data of frontEndPlayers[id].history) {
        disp += data + '</br>'
      }
      document.querySelector('#playResult').innerHTML = `${disp}`
    } else {
      // !!! when target is true
      disp = ''
      for (const data of frontEndPlayers[id].history) {
        disp += data + '</br>'
      }
      document.querySelector('#enemyResult').innerHTML = `${disp}`
    }
  }

  // 消えた人のオブジェクト削除
  for (const id in frontEndPlayers) {
    if (!backEndPlayers[id]) {
      delete frontEndPlayers[id]
    }
  }
})

var all_array = []
var count = 0

// 参加
document.querySelector('#nameForm').addEventListener('submit', (event) => {
  event.preventDefault()
  document.querySelector('#gameBoad').style.display = 'block'
  document.querySelector('#nameInput').disabled = 'true'
  document.querySelector('#btnJoin').disabled = 'true'

  socket.emit('join', {
    username: document.querySelector('#nameInput').value,
  })
})

// 検証、再開
document.querySelector('#numForm').addEventListener('submit', (event) => {
  // ページリロードをprevent(妨げる)する。
  event.preventDefault()
  const submitButton = event.submitter.name
  const hb = new HitAndBlow()

  inp = document.querySelector('#numInput').value
  if (inp.length != 4) return
  result = hb.getHitAndBlow(inp, hb.all_array[0])
  count++
  strResult =
    count.toString() +
    ': ' +
    inp.toString() +
    ' : ' +
    result[0] +
    ' hit ' +
    result[1] +
    ' blow'

  socket.emit('updateHistory', {
    message: strResult,
  })

  //document.querySelector("#playResult").innerHTML += `<div>${strResult}</div>`;
})
