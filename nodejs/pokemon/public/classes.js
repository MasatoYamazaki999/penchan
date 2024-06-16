class SpritePlayer {
  constructor({
    position,
    image,
    frames = { max: 1 },
    sprites,
    socket,
    moving,
    velocity,
  }) {
    this.position = position
    this.image = image
    this.frames = { ...frames, val: 0, elapsed: 0 }
    this.image.decode().then(() => {
      this.width = this.image.width / this.frames.max
      this.height = this.image.height
    })
    this.sprites = sprites
    this.socket = socket
    this.moving = moving
    this.velocity = velocity
  }

  draw(mine) {
    let px = this.position.x
    let py = this.position.y
    if (mine) {
      // 自分
    } else {
      // 他人
      if (this.world) {
        px += background.position.x - this.world.x
        py += background.position.y - this.world.y
      }
    }

    // プレイヤー画像選定
    if (this.velocity) {
      const v = this.velocity
      const absX = Math.abs(v.x)
      const absY = Math.abs(v.y)
      if (absY > absX) {
        if (v.y > 0) {
          this.image = this.sprites.down
        } else {
          this.image = this.sprites.up
        }
      } else {
        if (v.x > 0) {
          this.image = this.sprites.right
        } else {
          this.image = this.sprites.left
        }
      }
    } else {
      this.image = this.sprites.down
    }

    ctx.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      px,
      py,
      this.image.width / this.frames.max,
      this.image.height
    )
    if (!this.moving) return
    if (this.frames.max > 1) {
      this.frames.elapsed++
    }
    if (this.frames.elapsed % 10 === 0) {
      if (this.frames.val < this.frames.max - 1) {
        this.frames.val++
      } else {
        this.frames.val = 0
      }
    }
  }
  attack({ attack, recipient }) {
    gsap.to(this.position, {
      x: this.position.x - 20,
    })
  }
}

class Sprite {
  constructor({
    position,
    image,
    frames = { max: 1 },
    sprites,
    moving = false,
    rotation = 0,
  }) {
    this.position = position
    this.image = image
    this.frames = { ...frames, val: 0, elapsed: 0 }
    this.image.decode().then(() => {
      this.width = this.image.width / this.frames.max
      this.height = this.image.height
    })
    this.sprites = sprites
    this.moving = moving
    this.opacity = 1
    this.rotation = rotation
  }

  draw() {
    ctx.save()
    ctx.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    )
    ctx.rotate(this.rotation)
    ctx.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    )
    ctx.globalAlpha = this.opacity
    ctx.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    )
    ctx.restore()

    if (!this.moving) return
    if (this.frames.max > 1) {
      this.frames.elapsed++
    }
    if (this.frames.elapsed % 10 === 0) {
      if (this.frames.val < this.frames.max - 1) {
        this.frames.val++
      } else {
        this.frames.val = 0
      }
    }
  }
}

class Monster extends Sprite {
  constructor({
    position,
    image,
    frames = { max: 1 },
    sprites,
    moving = false,
    rotation = 0,
    isEnemy = false,
    name,
    attacks
  }) {
    super({
      position,
      image,
      frames,
      sprites,
      moving,
      rotation,
    })
    this.health = 100
    this.isEnemy = isEnemy
    this.name = name
    this.attacks = attacks
  }
  attack({ attack, recipient, renderedSprites }) {
    document.querySelector('#dialogueBox').style.display = 'block'
    document.querySelector('#dialogueBox').innerHTML =
      this.name + ' used ' + attack.name

    let healthBar = '#enemyHealthBar'
    if (this.isEnemy) healthBar = '#playerHealthBar'

    let rotation = 1
    if (this.isEnemy) rotation = -2.2

    this.health -= attack.damage

    switch (attack.name) {
      case 'Fireball':
        const fireballImage = new Image()
        fireballImage.src = './img/fireball.png'
        const fireball = new Sprite({
          position: {
            x: this.position.x,
            y: this.position.y,
          },
          image: fireballImage,
          frames: {
            max: 4,
          },
          moving: true,
          rotation,
        })

        renderedSprites.splice(1, 0, fireball)

        gsap.to(fireball.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          onComplete: () => {
            // Enemy actually gets hit
            gsap.to(healthBar, {
              width: this.health + '%',
            })
            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.08,
            })
            gsap.to(recipient, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08,
            })
            renderedSprites.splice(1, 1)
          },
        })
        break
      case 'Tackle':
        const tl = gsap.timeline()

        let movementDistance = 20
        if (this.isEnemy) movementDistance = -20

        tl.to(this.position, {
          x: this.position.x - movementDistance,
        })
          .to(this.position, {
            x: this.position.x + movementDistance * 2,
            duration: 0.1,
            onComplete: () => {
              // Enemy actually gets hit
              gsap.to(healthBar, {
                width: this.health + '%',
              })
              gsap.to(recipient.position, {
                x: recipient.position.x + 10,
                yoyo: true,
                repeat: 5,
                duration: 0.08,
              })
              gsap.to(recipient, {
                opacity: 0,
                repeat: 5,
                yoyo: true,
                duration: 0.08,
              })
            },
          })
          .to(this.position, {
            x: this.position.x,
          })
        break
    }
  }
}
class Boundary {
  static width = 48
  static height = 48
  constructor({ position }) {
    this.position = position
    this.width = Boundary.width
    this.height = Boundary.height
  }
  draw() {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.0)'
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}
