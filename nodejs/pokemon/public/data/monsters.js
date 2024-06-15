const embyImage = new Image()
embyImage.src = './img/embySprite.png'
const monsters = {
  Emby: {
    position: {
      x: 120,
      y: 330
    },
    image: embyImage
    },
    frames: {
      max: 4
    },
    moving: true,
    name: 'Emby'
  }
