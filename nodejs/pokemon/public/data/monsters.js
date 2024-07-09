const monsters = {
  Shirokuma: {
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
    name: 'しろくま',
    attacks: [attacks.Tackle, attacks.Fireball],
    hp: 30,
    str: 12,
    dex: 4,
    exp: 10
  },
  Penchan: {
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
    name: 'ペンちゃん',
    attacks: [attacks.Tackle, attacks.Fireball],
    hp: 10,
    str: 4,
    dex: 2,
    exp: 10
  },
}
