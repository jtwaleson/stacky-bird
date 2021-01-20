const SPEED = 200;
const sleep = m => new Promise(r => setTimeout(r, m))

const oppositeDirection = {
    "up": "down",
    "down": "up",
    "right": "left",
    "left": "right",
}

export {
    SPEED,
    sleep,
    oppositeDirection,
}
