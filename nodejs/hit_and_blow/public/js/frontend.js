const socket = io()

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
      let selText = `<option data-id="${id}">`
      selText += backEndPlayer.username
      selText += '</option>'
      document.querySelector('#select').innerHTML += selText
    } else {
      frontEndPlayers[id].history = backEndPlayer.history
      frontEndPlayers[id].target = backEndPlayer.target
    }
  }
  //console.log(frontEndPlayers)
  for (const id in frontEndPlayers) {
    // 対戦内容表示
    if (socket.id == id) {
      disp = ''
      for (const data of frontEndPlayers[id].history) {
        disp += data + '</br>'
      }
      document.querySelector('#playResult').innerHTML = `${disp}`
    } else {
      // 対戦相手の場合
      if (id==frontEndPlayers[socket.id].target) {
        disp = ''
        for (const data of frontEndPlayers[id].history) {
          disp += data + '</br>'
        }
        document.querySelector('#enemyResult').innerHTML = `${disp}`
      }
    }
  }

  // 消えた人のオブジェクト削除
  for (const id in frontEndPlayers) {
    if (!backEndPlayers[id]) {
      // 参加リストから削除
      const divToDelete = document.querySelector(`option[data-id="${id}"]`);
      divToDelete.parentNode.removeChild(divToDelete);

      delete frontEndPlayers[id]
    }
  }
})

var count = 0

// 参加
document.querySelector('#nameForm').addEventListener('submit', (event) => {
  event.preventDefault()
  document.querySelector('#gameBoad').style.display = 'block'
  document.querySelector('#nameInput').disabled = 'true'
  document.querySelector('#btnJoin').disabled = 'true'
  socket.emit('join', {
    username: document.querySelector('#nameInput').value
  })
})

// 開始
document.querySelector('#runForm').addEventListener('submit', (event) => {
  event.preventDefault()

  let sel = document.querySelector('#select')
  let target = sel[sel.selectedIndex].getAttribute('data-id')
  console.log("selected001: " + target)
  socket.emit('run', {
    target: target
  })
  document.querySelector('#select').disabled = "disabled"
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
})
