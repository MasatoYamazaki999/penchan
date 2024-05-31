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
        ans: backEndPlayer.ans
      })
      // 参加者追加(自分以外)
      if (id != socket.id) {
        const selText = `<label id="${id}"><input type="radio" name="selMember" id="${id}" `
          + `value="${id}">${backEndPlayer.username}</label>`
        document.querySelector('#memberList').innerHTML += selText
      }
    } else {
      // すでに参加済みの場合
      frontEndPlayers[id].history = backEndPlayer.history
      frontEndPlayers[id].target = backEndPlayer.target
      frontEndPlayers[id].battle = backEndPlayer.battle
      frontEndPlayers[id].ans = backEndPlayer.ans
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
      // 対戦相手の場合
      if (id == frontEndPlayers[socket.id]?.target) {
        disp = ''
        for (const data of frontEndPlayers[id].history) {
          disp += data + '</br>'
        }
        document.querySelector('#enemyResult').innerHTML = `${disp}`
        const enemyLen = frontEndPlayers[id].history.length
        const myLen = frontEndPlayers[socket.id].history.length
        console.log(myLen + " : " + enemyLen)
        // 検証ボタンを押下可能にする(前回より結果が増えた時)
        // ※先手後手で比較記号を変える事! 先手後手プロパが必要
        if (myLen == enemyLen) {
          document.querySelector('#btnValidate').disabled = ''
        }
      }
    }
  }
  // 消えた人のオブジェクト削除
  for (const id in frontEndPlayers) {
    if (!backEndPlayers[id]) {
      // 参加リストから削除
      const divToDelete = document.querySelector(`label[id="${id}"]`)
      divToDelete?.parentNode.removeChild(divToDelete)

      delete frontEndPlayers[id]
    }
  }
  // 人数が変わるか、又はbattleが変われば再表示にする!!!!!!!!!!!!
})

// 検証回数
var count = 0

// 自分の数決定
document.querySelector('#ansForm').addEventListener('submit', (event) => {
  event.preventDefault()

  document.querySelector('#ansBoad').style.display = 'block'
  document.querySelector('#ansInput').disabled = 'true'
  document.querySelector('#btnAns').disabled = 'true'

  socket.emit('ans', {
    ans: document.querySelector('#ansInput').value,
  })
})

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

  document.querySelector('#btnRun').disabled = 'true'

  let runForm = document.querySelector(`#runForm`)
  radioNodeList = runForm.elements['selMember']
  const targetId = radioNodeList.value
  frontEndPlayers[socket.id].battle = targetId

  socket.emit('run', {
    target: targetId,
  })
})

const hb = new HitAndBlow()
// 検証、再開
document.querySelector('#numForm').addEventListener('submit', (event) => {
  event.preventDefault()

  inp = document.querySelector('#numInput').value
  if (inp.length != 4) return
  const target = frontEndPlayers[socket.id].target
  const ans = frontEndPlayers[target].ans

  const result = hb.getHitAndBlow(inp, ans)
  count++
  let strResult =
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
