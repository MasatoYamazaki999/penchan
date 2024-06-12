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
}

class Sprite {
  constructor({ position, image, frames = { max: 1 }, sprites }) {
    this.position = position
    this.image = image
    this.frames = { ...frames, val: 0, elapsed: 0 }
    this.image.decode().then(() => {
      this.width = this.image.width / this.frames.max
      this.height = this.image.height
    })
    this.sprites = sprites
  }

  draw() {
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
