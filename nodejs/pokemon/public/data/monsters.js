const monsters = {
  Emby: {
    position: {
      x: 120,
      y: 330,
    },
    image: {
      src: './img/embySprite.png'
    },
    frames: {
      max: 4,
    },
    moving: true,
    name: 'Emby',
    attacks: [attacks.Tackle, attacks.Fireball]
  },
  Draggle: {
    position: {
      x: 340,
      y: 100,
    },
    image: {
      src: './img/draggleSprite.png'
    },
    frames: {
      max: 4,
    },
    moving: true,
    isEnemy: true,
    name: 'penchan',
    attacks: [attacks.Tackle, attacks.Fireball],
    hp: 30,
    str: 10,
    dex: 2,
  },
}
