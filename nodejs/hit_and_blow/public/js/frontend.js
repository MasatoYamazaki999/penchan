const socket = io()

const frontEndPlayers = {}

const g_opt = document.createElement('option')

var prevBattleLen = 0
var prevMemberLen = 0

socket.on('updatePlayers', (backEndPlayers) => {
  //console.log(frontEndPlayers)
  for (const id in backEndPlayers) {
    const backEndPlayer = backEndPlayers[id]

    if (!frontEndPlayers[id]) {
      // 新規プレイヤーの場合
      frontEndPlayers[id] = new Player({
        username: backEndPlayer.username,
        history: backEndPlayer.history,
        target: backEndPlayer.target,
        battle: backEndPlayer.battle,
      })
      // 参加者追加(自分以外)
      // if (id != socket.id) {
      //   // 自分以外の場合
      //   let selText = `<option data-id="${id}">`
      //   selText += backEndPlayer.username
      //   selText += '</option>'
      //   document.querySelector('#select').innerHTML += selText
      // }
    } else {
      // すでに参加済みの場合
      frontEndPlayers[id].history = backEndPlayer.history
      frontEndPlayers[id].target = backEndPlayer.target
      frontEndPlayers[id].battle = backEndPlayer.battle
    }
  }

  let cnt = 0
  for (const id in frontEndPlayers) {
    cnt++
    // 対戦内容表示
    if (socket.id == id) {
      disp = ''
      for (const data of frontEndPlayers[id].history) {
        disp += data + '</br>'
      }
      document.querySelector('#playResult').innerHTML = `${disp}`
    } else {
      // 対戦相手の場合
      if (id == frontEndPlayers[socket.id]?.target) {
        disp = ''
        for (const data of frontEndPlayers[id].history) {
          disp += data + '</br>'
        }
        document.querySelector('#enemyResult').innerHTML = `${disp}`

        // 検証ボタンを押下可能にする(前回より結果が増えた時)
        const nowLen = frontEndPlayers[id].history.length
        //console.log('prev: ' + prevLen + ' now: ' + nowLen)
        if (prevBattleLen < nowLen) {
          document.querySelector('#btnValidate').disabled = ''
          prevBattleLen = nowLen
        }
      }
    }
  }
  // 消えた人のオブジェクト削除
  for (const id in frontEndPlayers) {
    if (!backEndPlayers[id]) {
      // 参加リストから削除
      const divToDelete = document.querySelector(`option[data-id="${id}"]`)
      divToDelete.parentNode.removeChild(divToDelete)

      delete frontEndPlayers[id]
    }
  }

  // 参加者メンバーの表示
  //
  // 人数が変わるか、又はbattleが変われば再表示にする!!!!!!!!!!!!
  //
  if (prevMemberLen != cnt) {
    let dispStr = ''
    for (const id in frontEndPlayers) {
      if (id != socket.id) {
        const frontEndPlayer = frontEndPlayers[id]
        if (frontEndPlayer.battle) {
          dispStr += `<option data-id="${id}" disabled>`
        } else {
          dispStr += `<option data-id="${id}">`
        }
        dispStr += frontEndPlayer.username
        dispStr += '</option>'
      }
    }
    prevMemberLen = cnt
    document.querySelector('#select').innerHTML = dispStr
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
    username: document.querySelector('#nameInput').value,
  })
})

// 開始
document.querySelector('#runForm').addEventListener('submit', (event) => {
  event.preventDefault()
  let sel = document.querySelector('#select')
  let target = sel[sel.selectedIndex].getAttribute('data-id')
  frontEndPlayers[socket.id].battle = true

  socket.emit('run', {
    target: target,
  })
  document.querySelector('#select').disabled = 'disabled'
})

// 検証、再開
document.querySelector('#numForm').addEventListener('submit', (event) => {
  event.preventDefault()
  //const submitButton = event.submitter.name
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

  // 検証ボタンをdisableにする
  document.querySelector('#btnValidate').disabled = 'disabled'
})
