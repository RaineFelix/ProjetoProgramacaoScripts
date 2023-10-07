const socket = io()

// initialize context
kaboom({
    width: 800,
    height: 600
})

const SPEED = 320

// load a sprite called "bean"
loadSprite("bean", "sprites/bean.png")

const player = add([
    sprite("bean"),
    pos(0, 0),
    area(),
    body(),
])

// onKeyDown() registers an event that runs every frame as long as user is holding a certain key
onKeyDown("left", () => {
    // .move() is provided by pos() component, move by pixels per second
    player.move(-SPEED, 0)
    socket.emit("move", { x: player.pos.x, y: player.pos.y })
})

onKeyDown("right", () => {
    player.move(SPEED, 0)
    socket.emit("move", { x: player.pos.x, y: player.pos.y })
})

onKeyDown("up", () => {
    player.move(0, -SPEED)
    socket.emit("move", { x: player.pos.x, y: player.pos.y })
})

onKeyDown("down", () => {
    player.move(0, SPEED)
    socket.emit("move", { x: player.pos.x, y: player.pos.y })
})

function render(players) {
    console.log(players)

    if (!players) return

    destroyAll("other")

    players.filter((p) => p.id !== socket.id).forEach((p, index) => {
        add([
            sprite("bean"),
            pos(p.x, p.y),
            area(),
            body(),
            "other"
        ])
        add([
            text("Conectados"),
            pos(0, 0),
            "texto"
        ])

        const position = (index + 1) * 30

        add([
            text(p.id.slice(0, 3)),
            pos(0, position)
        ])
    })

}

socket.on("refresh", (players) => {
    render(players)
})

socket.on("init", (players) => {
    const me = players.find((p) => p.id === socket.id)

    player.pos.x = me.x
    player.pos.y = me.y

    add([
        text(me.id.slice(0, 3)),
        pos(800, 0),
    ])
})

player.onCollide("other", () => {
    addKaboom(toWorld(player.pos))
})