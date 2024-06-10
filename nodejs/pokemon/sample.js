let x = 50
let y = 50
let cx = 0
let cy = 0

let center = { x: cx, y: cy };
let player = { x: x, y: y };
let radian = Math.atan2( center.y - player.y, center.x - player.y );
let degree = radian * (180 / Math.PI);

console.log("degree is " + degree)