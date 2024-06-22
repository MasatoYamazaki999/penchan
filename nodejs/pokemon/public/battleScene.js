const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battleBackground.png'
const battleBackgroud = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
})

let draggle
let emby
let renderedSprites
let battleAnimationId
let queue

function waitTimer(t) {
  ;(async () => {
    console.time('Waited for')
    await new Promise((resolve) => setTimeout(resolve, t))
    console.timeLog('Waited for')
  })()
}
function initBattle() {
  document.querySelector('#userInterface').style.display = 'block'
  document.querySelector('#enemyHealthBar').style.width = '100%'
  document.querySelector('#playerHealthBar').style.width = '100%'
  document.querySelector('#messages').innerHTML = 'バトル開始 !'
  document.querySelector('#attacksBox').replaceChildren()

  draggle = new Monster(monsters.Draggle)
  emby = new Monster(monsters.Emby)
  renderedSprites = [draggle, emby]
  queue = []
  emby.attacks.forEach((attack) => {
    const button = document.createElement('button')
    button.innerHTML = attack.display
    button.setAttribute('kind', attack.kind)
    button.style.fontSize = '56pt'
    document.querySelector('#attacksBox').append(button)
  })

  // our event listeners for our buttons (attack)
  document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('touchstart', (e) => {
      attackDetail(e)
    })

    button.addEventListener('click', (e) => {
      attackDetail(e)
    })
  })
}

function sleep(waitSec) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve()
    }, waitSec)
  })
}

async function attackDetail(e) {
  console.log(e.currentTarget.getAttribute('kind'))

  const selectedAttack = attacks[e.currentTarget.getAttribute('kind')]
  emby.attack({
    attack: selectedAttack,
    recipient: draggle,
    renderedSprites,
  })

  if (draggle.health <= 0) {
    battle.initiated = false
    console.log('draggle DEAD...................')
    queue.push(() => {
      draggle.faint()
    })
    queue.push(() => {
      // fade back to black
      gsap.to('#overlappingDiv', {
        opacity: 1,
        onComplete: () => {
          cancelAnimationFrame(battleAnimationId)
          animate()
          document.querySelector('#userInterface').style.display = 'none'
          gsap.to('#overlappingDiv', {
            opacity: 0,
          })
          audio.battle.stop()
          audio.Map.play()
        },
      })
    })
  }

  if (battle.initiated) {
    // draggle or enemy attacks right here
    const randomAttack =
      draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)]

    queue.push(() => {
      draggle.attack({
        attack: randomAttack,
        recipient: emby,
        renderedSprites,
      })

      if (emby.health <= 0) {
        battle.initiated = false
        console.log('emby DEAD...................')
        queue.push(() => {
          emby.faint()
        })
        queue.push(() => {
          // fade back to black
          gsap.to('#overlappingDiv', {
            opacity: 1,
            onComplete: () => {
              cancelAnimationFrame(battleAnimationId)
              animate()
              document.querySelector('#userInterface').style.display = 'none'
              gsap.to('#overlappingDiv', {
                opacity: 0,
              })
              audio.battle.stop()
              audio.Map.play()
            },
          })
        })
      }
    })
  }

  if (!battle.initiated) {
    while (queue.length != 0) {
      await sleep(700)
      queue[0]()
      queue.shift()
    }
    await sleep(2000)
  } else {
    await sleep(700)
    if (queue.length > 0) {
      queue[0]()
      queue.shift()
    } else {
      e.currentTarget.style.display = 'none'
    }
  }
}

function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle)
  battleBackgroud.draw()

  renderedSprites.forEach((sprite) => {
    sprite.draw()
  })
}

animate()
// initBattle()
// animateBattle()

