const socket = io()

const frontEndPlayers = {}

const g_opt = document.createElement('option')

var prevBattleLen = 0
var prevMemberLen = 0

const hb = new HitAndBlow()

const GAME_MODE = {
  init: 'INIT',
  joind: 'JOIND',
  wait: 'WAIT',
  play: 'PLAY',
  win: 'WIN',
  lose: 'LOSE',
}
var game_mode = GAME_MODE.init

socket.on('updatePlayers', (backEndPlayers) => {
  // display backEndPlayers
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
        ans: backEndPlayer.ans,
        win: backEndPlayer.win,
      })
      // 新規参加の場合は参加者に追加表示(自分除く)
      // ※後で、表示はまとめて下でやる。
      if (id != socket.id) {
        const selText =
          `<label id="${id}"><input type="radio" name="selMember" id="${id}" ` +
          `value="${id}">${backEndPlayer.username}</label>`
        document.querySelector('#memberList').innerHTML += selText
      }
    } else {
      // すでに参加済みの場合
      frontEndPlayers[id].history = backEndPlayer.history
      frontEndPlayers[id].target = backEndPlayer.target
      frontEndPlayers[id].battle = backEndPlayer.battle
      frontEndPlayers[id].ans = backEndPlayer.ans
      frontEndPlayers[id].win = backEndPlayer.win
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
  switch (game_mode) {
    case GAME_MODE.init:
      // ガイド表示
      document.querySelector('#guide').innerHTML =
        '名前を入れて</br>参加ボタンを押してね'
      // 名前入力
      document.querySelector('#nameInput').disabled = false
      // 参加ボタン
      document.querySelector('#btnJoin').disabled = false
      // 開始ボタン
      document.querySelector('#btnRun').disabled = true
      // 回答入力
      document.querySelector('#ansInput').disabled = true
      // 決定ボタン
      document.querySelector('#btnAns').disabled = true
      // 検証入力
      document.querySelector('#numInput').disabled = true
      // 検証ボタン
      document.querySelector('#btnValidate').disabled = true
      // 再開ボタン
      document.querySelector('#btnReset').disabled = true
      break

    case GAME_MODE.joind:
      // ガイド表示
      document.querySelector('#guide').innerHTML =
        '対戦相手を選んで</br>開始ボタンを押してね'
      // 名前入力
      document.querySelector('#nameInput').disabled = true
      // 参加ボタン
      document.querySelector('#btnJoin').disabled = true
      // 開始ボタン
      document.querySelector('#btnRun').disabled = false
      // 回答入力
      document.querySelector('#ansInput').disabled = true
      // 決定ボタン
      document.querySelector('#btnAns').disabled = true
      // 検証入力
      document.querySelector('#numInput').disabled = true
      // 検証ボタン
      document.querySelector('#btnValidate').disabled = true
      // 再開ボタン
      document.querySelector('#btnReset').disabled = true
      break

    case GAME_MODE.wait:
      // ガイド表示
      document.querySelector('#guide').innerHTML =
        '自分の数を入れて</br>決定ボタンを押してね'
      // 名前入力
      document.querySelector('#nameInput').disabled = true
      // 参加ボタン
      document.querySelector('#btnJoin').disabled = true
      // 開始ボタン
      document.querySelector('#btnRun').disabled = true
      // 回答入力
      document.querySelector('#ansInput').disabled = false
      // 決定ボタン
      document.querySelector('#btnAns').disabled = false
      // 検証入力
      document.querySelector('#numInput').disabled = true
      // 検証ボタン
      document.querySelector('#btnValidate').disabled = true
      // 再開ボタン
      document.querySelector('#btnReset').disabled = true
      break

    case GAME_MODE.play:
      // ガイド表示
      document.querySelector('#guide').innerHTML =
        '予想する相手の数字を入れて</br>検証ボタンを押してね'
      // 名前入力
      document.querySelector('#nameInput').disabled = true
      // 参加ボタン
      document.querySelector('#btnJoin').disabled = true
      // 開始ボタン
      document.querySelector('#btnRun').disabled = true
      // 回答入力
      document.querySelector('#ansInput').disabled = true
      // 決定ボタン
      document.querySelector('#btnAns').disabled = true
      // 検証入力
      document.querySelector('#numInput').disabled = false
      // 検証ボタン
      document.querySelector('#btnValidate').disabled = false
      // 再開ボタン
      document.querySelector('#btnReset').disabled = true
      break

    case GAME_MODE.win:
      // ガイド表示
      document.querySelector('#guide').innerHTML = 'あなたの勝ちです!'
      // 名前入力
      document.querySelector('#nameInput').disabled = true
      // 参加ボタン
      document.querySelector('#btnJoin').disabled = true
      // 開始ボタン
      document.querySelector('#btnRun').disabled = true
      // 回答入力
      document.querySelector('#ansInput').disabled = true
      // 決定ボタン
      document.querySelector('#btnAns').disabled = true
      // 検証入力
      document.querySelector('#numInput').disabled = true
      // 検証ボタン
      document.querySelector('#btnValidate').disabled = true
      // 再開ボタン
      document.querySelector('#btnReset').disabled = false
      break

    case GAME_MODE.lose:
      // ガイド表示
      document.querySelector('#guide').innerHTML = 'あなたの負けです...'
      // 名前入力
      document.querySelector('#nameInput').disabled = true
      // 参加ボタン
      document.querySelector('#btnJoin').disabled = true
      // 開始ボタン
      document.querySelector('#btnRun').disabled = true
      // 回答入力
      document.querySelector('#ansInput').disabled = true
      // 決定ボタン
      document.querySelector('#btnAns').disabled = true
      // 検証入力
      document.querySelector('#numInput').disabled = true
      // 検証ボタン
      document.querySelector('#btnValidate').disabled = true
      // 再開ボタン
      document.querySelector('#btnReset').disabled = false
      break
  }

  if (game_mode == GAME_MODE.play) {
    const target = frontEndPlayers[socket.id].target
    const win = backEndPlayers[target].win

    console.log('相手のwin: ' + win)
    // 相手が勝った場合
    if (win) {
      frontEndPlayers[socket.id].win = false
      game_mode = GAME_MODE.lose
    }
  }
})

// 検証回数
var count = 0

// 参加ボタン押下
document.querySelector('#nameForm').addEventListener('submit', (event) => {
  event.preventDefault()

  // 人数チェック必要
  game_mode = GAME_MODE.joind

  socket.emit('join', {
    username: document.querySelector('#nameInput').value,
  })
})

// 開始ボタン押下
document.querySelector('#runForm').addEventListener('submit', (event) => {
  event.preventDefault()

  game_mode = GAME_MODE.wait

  let runForm = document.querySelector(`#runForm`)
  radioNodeList = runForm.elements['selMember']
  const targetId = radioNodeList.value
  frontEndPlayers[socket.id].battle = targetId

  socket.emit('run', {
    target: targetId,
  })
})

// 決定ボタン押下
document.querySelector('#ansForm').addEventListener('submit', (event) => {
  event.preventDefault()

  game_mode = GAME_MODE.play

  socket.emit('ans', {
    ans: document.querySelector('#ansInput').value,
  })
})

// 検証ボタン押下
document.querySelector('#numForm').addEventListener('submit', (event) => {
  event.preventDefault()

  const btnName = event.submitter.name
  if (btnName == 'reset') {
    // 再開
    socket.emit('reset', {})
    game_mode = GAME_MODE.init
    return
  }

  inp = document.querySelector('#numInput').value
  if (inp.length != 4) return

  // 検証
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

  if (result[0] == 4) {
    game_mode = GAME_MODE.win
    frontEndPlayers[socket.id].win = true
    frontEndPlayers[target].win = false
  }
  socket.emit('updateHistory', {
    message: strResult,
    win: frontEndPlayers[socket.id].win,
  })
})
