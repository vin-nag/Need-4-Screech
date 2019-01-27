const express = require("express")
const http = require("http")
const socketio = require("socket.io")
const httpControllers = require("./backend/controllers/http")
const socketControllers = require("./backend/controllers/socket")

const app = express()
app.use(httpControllers)

const server = http.createServer(app)
const io = socketio(server)
socketControllers.listen(io)

server.listen(3000, () => console.log("Running on port 3000..."))