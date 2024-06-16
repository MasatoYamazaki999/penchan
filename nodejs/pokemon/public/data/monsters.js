const embyImage = new Image()
embyImage.src = './img/embySprite.png'

const draggleImage = new Image()
draggleImage.src = './img/draggleSprite.png'

const monsters = {
  Emby: {
    position: {
      x: 120,
      y: 330,
    },
    image: embyImage,
    frames: {
      max: 4,
    },
    moving: true,
    name: 'Emby',
    attacks: [attacks.Tackle, attacks.Fireball]
  },
  Draggle: {
    position: {
      x: 350,
      y: 100,
    },
    image: draggleImage,
    frames: {
      max: 4,
    },
    moving: true,
    isEnemy: true,
    name: 'Draggle',
    attacks: [attacks.Tackle, attacks.Fireball]
  },
}
