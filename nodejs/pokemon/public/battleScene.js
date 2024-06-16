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

function initBattle() {
  document.querySelector('#userInterface').style.display = 'block'
  document.querySelector('#dialogueBox').style.display = 'block'
  document.querySelector('#enemyHealthBar').style.width = '100%'
  document.querySelector('#playerHealthBar').style.width = '100%'
  document.querySelector('#attacksBox').replaceChildren()
  
  document.querySelector('#dialogueBox').innerHTML = 'バトル開始 !'

  draggle = new Monster(monsters.Draggle)
  emby = new Monster(monsters.Emby)
  renderedSprites = [draggle, emby]
  queue = []
  emby.attacks.forEach((attack) => {
    const button = document.createElement('button')
    button.innerHTML = attack.display
    button.setAttribute('kind', attack.name)
    button.style.fontSize = '72pt'
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
function attackDetail(e) {
  console.log(e.currentTarget.getAttribute('kind'))
  const selectedAttack = attacks[e.currentTarget.getAttribute('kind')]
  emby.attack({
    attack: selectedAttack,
    recipient: draggle,
    renderedSprites,
  })

  if (draggle.health <= 0) {
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
          battle.initiated = false
        },
      })
    })
  }

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
            battle.initiated = false
            audio.Map.play()
          },
        })
      })
    }
  })
}

function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle)
  battleBackgroud.draw()

  renderedSprites.forEach((sprite) => {
    sprite.draw()
  })
}

//animate()
initBattle()
animateBattle()

document.querySelector('#dialogueBox').addEventListener('touchstart', (e) => {
  if (queue.length > 0) {
    queue[0]()
    queue.shift()
  } else e.currentTarget.style.display = 'none'
})

document.querySelector('#dialogueBox').addEventListener('click', (e) => {
  if (queue.length > 0) {
    queue[0]()
    queue.shift()
  } else e.currentTarget.style.display = 'none'
})

