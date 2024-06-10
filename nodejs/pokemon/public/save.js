function move() {
    let moving = true
    player.moving = false
    if (keys.w.pressed && lastkey === 'w') {
      player.moving = true
      player.image = player.sprites.up
      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i]
        if (
          rectangularCollision({
            rectangle1: player,
            rectangle2: {
              ...boundary,
              position: {
                x: boundary.position.x,
                y: boundary.position.y + 3,
              },
            },
          })
        ) {
          console.log('colliding')
          moving = false
          break
        }
      }
      if (moving)
        movables.forEach((movabl) => {
          movabl.position.y += 3
        })
    } else if (keys.a.pressed && lastkey === 'a') {
      player.moving = true
      player.image = player.sprites.left
      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i]
        if (
          rectangularCollision({
            rectangle1: player,
            rectangle2: {
              ...boundary,
              position: {
                x: boundary.position.x + 3,
                y: boundary.position.y,
              },
            },
          })
        ) {
          console.log('colliding')
          moving = false
          break
        }
      }
      if (moving)
        movables.forEach((movabl) => {
          movabl.position.x += 3
        })
    } else if (keys.s.pressed && lastkey === 's') {
      player.moving = true
      player.image = player.sprites.down
      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i]
        if (
          rectangularCollision({
            rectangle1: player,
            rectangle2: {
              ...boundary,
              position: {
                x: boundary.position.x,
                y: boundary.position.y - 3,
              },
            },
          })
        ) {
          console.log('colliding')
          moving = false
          break
        }
      }
      if (moving)
        movables.forEach((movabl) => {
          movabl.position.y -= 3
        })
    } else if (keys.d.pressed && lastkey === 'd') {
      player.moving = true
      player.image = player.sprites.right
      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i]
        if (
          rectangularCollision({
            rectangle1: player,
            rectangle2: {
              ...boundary,
              position: {
                x: boundary.position.x - 3,
                y: boundary.position.y,
              },
            },
          })
        ) {
          console.log('colliding')
          moving = false
          break
        }
      }
      if (moving)
        movables.forEach((movabl) => {
          movabl.position.x -= 3
        })
    }
  }
  window.addEventListener('keyup', (e) => {
    switch (e.key) {
      case 'w':
        keys.w.pressed = false
        break
  
      case 'a':
        keys.a.pressed = false
        break
  
      case 's':
        keys.s.pressed = false
        break
  
      case 'd':
        keys.d.pressed = false
        break
    }
  })

  let lastkey = ''
window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = true
      lastkey = 'w'
      break

    case 'a':
      keys.a.pressed = true
      lastkey = 'a'
      break

    case 's':
      keys.s.pressed = true
      lastkey = 's'
      break

    case 'd':
      keys.d.pressed = true
      lastkey = 'd'
      break
  }
})

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  )
}

