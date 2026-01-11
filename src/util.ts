const sleep = (m: number) => new Promise((r) => setTimeout(r, m))

const oppositeDirection = {
    up: 'down',
    down: 'up',
    right: 'left',
    left: 'right',
}

export { sleep, oppositeDirection }
