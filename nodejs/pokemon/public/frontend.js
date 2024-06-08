const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const socket = io();

const image = new Image();
image.src = "./img/akane.png";

function display() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(image, 100, 100, 48, 48);
}
const game = setInterval(function() {
    display()
}, 100)

socket.on("update", () => {
  console.log("front 004");
});
