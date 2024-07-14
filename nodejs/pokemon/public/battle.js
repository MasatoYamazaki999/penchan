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
  if ((sub.dex + rnd() + (RND_DEF/2)) < obj.dex + rnd()) {
    displayMsg(obj.name + 'は' + sub.name + 'の攻撃をかわした' + '</br>')
    return false
  }
  return true
}
function gaveDamege(sub, obj) {
  let damage = Math.floor(sub.str / 2 + rnd() + (RND_DEF/2) - (obj.def / 4 + rnd()))
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

function levelUp(player){
  const levelUpValue = player.level * 100
  if(levelUpValue <= player.exp){
    player.level++
    displayMsg('レベルアップした! ' + player.level + '</br>')
    socket.emit('log', 'Level UP! ' + player.level)
    player.maxhp += Math.floor((10) + (rnd() + (RND_DEF/2)))
    player.hp = player.maxhp
    player.str += Math.floor(rnd() + (RND_DEF/2))
    player.def += Math.floor(rnd() + (RND_DEF/2))
    player.dex += Math.floor(rnd() + (RND_DEF/2))
    displayStatus(player)
  }
}

function oneBattle() {
  if (checkHit(player, enemy)) {
    if (gaveDamege(player, enemy)) {
      displayMsg('player won' + '</br>')
      player.exp += Math.floor(enemy.exp + rnd() + (RND_DEF/2))
      battle.initiated = false
      levelUp(player)
      return true
    }
  }

  if (checkHit(enemy, player)) {
    if (gaveDamege(enemy, player)) {
      displayMsg('enemy won' + '</br>')
      battle.initiated = false
      return true
    }
  }
  // let hp = Math.floor((player.hp / player.maxhp) * 100)
  // gsap.to('#playerHealthBar', {
  //   width: hp + '%',
  // })
}
let player
let enemy

function battleLogic(p, e) {
  player = p
  enemy = e
  msg.innerHTML = 'モンスターが現れた!' + '</br>'
}

// while (true) {
//   let hp = Math.floor((player.hp / 30) * 100)
//   gsap.to('#playerHealthBar', {
//     width: hp + '%',
//   })
//   if (oneBattle(player, enemy)) {
//     break
//   }
// }
// battle.initiated = false
// }
