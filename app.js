const express = require("express")
const http = require("http")
const socketio = require("socket.io")
const controllers = require("./controllers")

const app = express()
app.use(controllers)

const server = http.createServer(app)
const io = socketio(server)

io.on("connection", client => {
    console.log("Client connected")
    client.on("disconnect", () => console.log("Client disconnected"))
})

server.listen(3000, () => console.log("Running on port 3000..."))