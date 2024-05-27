const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const socket = io();
const devicePixelRatio = window.devicePixelRatio || 1;

canvas.width = 1024 * devicePixelRatio;
canvas.height = 576 * devicePixelRatio;

c.scale(devicePixelRatio, devicePixelRatio);

const frontEndPlayers = {};

socket.on("updatePlayers", (backEndPlayers) => {
  for (const id in backEndPlayers) {
    const backEndPlayer = backEndPlayers[id];

    if (!frontEndPlayers[id]) {
      // create new player
      frontEndPlayers[id] = new Player({
        username: backEndPlayer.username
      });
      document.querySelector("#playerLabels").innerHTML += `<div data-id="${id}"></div>`;
    } else {
      // update player
      document.querySelector(`div[data-id="${id}"`).innerHTML = "";
    }
  }

  // this is where we delete frontend players
  for (const id in frontEndPlayers) {
    if (!backEndPlayers[id]) {
      delete frontEndPlayers[id];
    }
  }
});

function animate() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  //frontEndPlayer.draw();
}

animate();
var all_array = []

document.querySelector("#usernameForm").addEventListener("submit", (event) => {
  console.log('form submited.')
  // ページリロードをprevent(妨げる)する。
  event.preventDefault();
  const hb = new HitAndBlow()

  inp = document.querySelector("#usernameInput").value
  if (inp.length != 4) return

  console.log("inp: " + inp[0] + ":" + inp[1]+ ":" + inp[2]+ ":" + inp[3])

  console.log(hb.getHitAndBlow(inp, hb.all_array[0]))

  console.log(" FRONT END " + hb.all_array.length)

  // 初期化
  socket.emit("initGame", {
    width: canvas.width,
    height: canvas.height,
    username: document.querySelector("#usernameInput").value
  });
});
