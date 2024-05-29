const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const socket = io();
const devicePixelRatio = window.devicePixelRatio || 1;

canvas.width = 1024 * devicePixelRatio;
canvas.height = 576 * devicePixelRatio;

c.scale(devicePixelRatio, devicePixelRatio);

const frontEndPlayers = {};

socket.on("updatePlayers", (backEndPlayers) => {
  //console.log(frontEndPlayers)
  for (const id in backEndPlayers) {
    const backEndPlayer = backEndPlayers[id];

    if (!frontEndPlayers[id]) {
      // create new player
      frontEndPlayers[id] = new Player({
        username: backEndPlayer.username
      });
      //document.querySelector("#member").innerHTML += `<div>${frontEndPlayers[id].username}</div>`;
    } else {
      // update player
      //document.querySelector(`div[data-id="${id}"`).innerHTML = "";
    }
  }
  // 参加者表示
  document.querySelector("#member").innerHTML = '';
  for (const id in frontEndPlayers) {
    document.querySelector("#member").innerHTML += `<div>${frontEndPlayers[id].username}</div>`;
  }

  // this is where we delete frontend players
  for (const id in frontEndPlayers) {
    if (!backEndPlayers[id]) {
      delete frontEndPlayers[id];
    }
  }
  
});

// function animate() {
//   c.clearRect(0, 0, canvas.width, canvas.height);
//   //frontEndPlayer.draw();
// }

// animate();
var all_array = []
var count = 0

// 参加
document.querySelector("#nameForm").addEventListener("submit", (event) => {
  // ページリロードをprevent(妨げる)する。
  event.preventDefault();
  // inp_name = document.querySelector("#nameInput").value
  // document.querySelector("#member").innerHTML += `<div>${inp_name}</div>`;

  document.querySelector("#gameBoad").style.display = 'block'
  document.querySelector("#nameInput").disabled = 'true'
  document.querySelector("#btnJoin").disabled = 'true'

  socket.emit("join", {
    username: document.querySelector("#nameInput").value
  });
  
});

// 検証、再開
document.querySelector("#numForm").addEventListener("submit", (event) => {
  // ページリロードをprevent(妨げる)する。
  event.preventDefault();
  const submitButton = event.submitter.name
  const hb = new HitAndBlow()

  inp = document.querySelector("#numInput").value
  if (inp.length != 4) return
  result = hb.getHitAndBlow(inp, hb.all_array[0])
  count++
  strResult = count.toString().padStart(3, '0') + ": " + result[0] + " hit " + result[1] + " blow"
  document.querySelector("#playResult").innerHTML += `<div>${strResult}</div>`;

});
