const express = require("express")
const path = require("path")
const { createServer } = require('node:http');
const { Server } = require("socket.io");

const PORT = 3000

const app = express()
const server = createServer(app);
const io = new Server(server);

app.use(express.static('assets'))

let players = []

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/index.html" ))
})

io.on("connection", (socket) => {
    players.push({ id: socket.id, x: Math.ceil(Math.random() * 800), y: Math.ceil(Math.random() * 600) })
    socket.emit("init", players)

    socket.on("disconnect", (reason) => {

        players = players.filter((p) => p.id !== socket.id)

        io.emit("refresh", players)
    })

    socket.on("move", ({ x, y }) => {
        const player = players.find((p) => p.id === socket.id)
        player.x = x
        player.y = y
        players = players.filter((p) => p.id !== socket.id)
        players = [...players, player]

        io.emit("refresh", players)
    })
})

server.listen(PORT, () => {
    console.log("Servidor iniciado em http://localhost:3000")
})