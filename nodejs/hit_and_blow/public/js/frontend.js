const socket = io()

const frontEndPlayers = {}

const g_opt = document.createElement('option')

var prevBattleLen = 0
var prevMemberLen = 0

socket.on('updatePlayers', (backEndPlayers) => {

  for (const id in backEndPlayers) {
    const backEndPlayer = backEndPlayers[id]
    // バックにあってフロントにない
    if (!frontEndPlayers[id]) {
      // 新規プレイヤーの場合
      frontEndPlayers[id] = new Player({
        username: backEndPlayer.username,
        history: backEndPlayer.history,
        target: backEndPlayer.target,
        battle: backEndPlayer.battle,
        ans: backEndPlayer.ans
      })
      // 新規参加の場合は参加者に追加表示(自分除く)
      // ※後で、表示はまとめて下でやる。
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

  //
  // 対戦結果表示(常時表示)
  //
  for (const id in frontEndPlayers) {
    // 自分の場合
    if (socket.id == id) {
      disp = ''
      for (const data of frontEndPlayers[id].history) {
        disp += data + '</br>'
      }
      document.querySelector('#playResult').innerHTML = `${disp}`
    } else {
      // 相手の場合
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
    // フロントにあってバックにないものは削除
    if (!backEndPlayers[id]) {
      // 参加リストから削除
      const divToDelete = document.querySelector(`label[id="${id}"]`)
      divToDelete?.parentNode.removeChild(divToDelete)

      delete frontEndPlayers[id]
    }
  }
  
  // 表示処理
  // モード　初期状態　
})

// 検証回数
var count = 0

// 決定ボタン押下
document.querySelector('#ansForm').addEventListener('submit', (event) => {
  event.preventDefault()

  // 回答ボード
  document.querySelector('#ansBoad').style.display = 'block'
  // 回答入力
  document.querySelector('#ansInput').disabled = 'true'
  // 回答ボタン
  document.querySelector('#btnAns').disabled = 'true'

  socket.emit('ans', {
    ans: document.querySelector('#ansInput').value,
  })
})

// 参加ボタン押下
document.querySelector('#nameForm').addEventListener('submit', (event) => {
  event.preventDefault()
  // ゲームボード
  document.querySelector('#gameBoad').style.display = 'block'
  // 名前入力
  document.querySelector('#nameInput').disabled = 'true'
  // 参加ボタン
  document.querySelector('#btnJoin').disabled = 'true'

  socket.emit('join', {
    username: document.querySelector('#nameInput').value,
  })
})

// 開始ボタン押下
document.querySelector('#runForm').addEventListener('submit', (event) => {
  event.preventDefault()
  // 開始ボタン
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
// 検証ボタン押下
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
