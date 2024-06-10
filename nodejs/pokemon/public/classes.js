class Sprite {
  constructor({ position, velocity, image, frames = { max: 1 }, sprites }) {
    this.position = position
    this.image = image
    this.frames = { ...frames, val: 0, elapsed: 0 }
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max
      this.height = this.image.height
    }
    this.moving = false
    this.sprites = sprites
    this.velocity = { x: 0, y: 0 }
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
    if (!this.moving) return
    if (this.frames.max > 1) {
      this.frames.elapsed++
    }
    if (this.frames.elapsed % 10 === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++
      else this.frames.val = 0
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
