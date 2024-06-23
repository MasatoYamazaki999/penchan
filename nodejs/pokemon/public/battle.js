const msg = document.querySelector('#message')

const RND_DEF = 12

function displayMsg(message) {
  msg.innerHTML += message
  msg.scrollTop = msg.scrollHeight
}

function rnd() {
  return RND_DEF * Math.random() - RND_DEF / 2
}

function checkHit(sub, obj) {
  if (sub.dex + rnd() < obj.dex + rnd()) {
    displayMsg(obj.name + 'は' + sub.name + 'の攻撃をかわした' + '</br>')
    return false
  }
  return true
}
function gaveDamege(sub, obj) {
  let damage = Math.floor(sub.str / 2 + rnd() - (obj.def / 4 + rnd()))
  if (damage <= 0) damage = 1
  displayMsg(
    sub.name + 'は' + obj.name + 'に' + damage + 'のダメージを与えた' + '</br>'
  )
  obj.hp -= damage
  if (obj.hp < 0) {
    return true
  }
  return false
}

function oneBattle(p, e) {
  if (checkHit(p, e)) {
    if (gaveDamege(p, e)) {
      displayMsg('player won' + '</br>')
      return true
    }
  }

  if (checkHit(e, p)) {
    if (gaveDamege(e, p)) {
      displayMsg('enemy won' + '</br>')
      return true
    }
  }
}

function battleLogic(player, enemy) {
  battle.initiated = true
  msg.innerHTML = 'バトル開始!' + '</br>'
  while (true) {
    if (oneBattle(player, enemy)) {
      break
    }
  }
  battle.initiated = false
}
