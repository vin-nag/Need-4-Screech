const express = require("express")
const http = require("http")
const path = require("path")
const socketio = require("socket.io")
const httpControllers = require("./backend/controllers/http")
const socketControllers = require("./backend/controllers/socket")

const app = express()

//static resources
app.use(express.static(path.join(__dirname, 'frontend/js/dist')))
app.use(express.static(path.join(__dirname, 'frontend/css')))

app.use(httpControllers)
app.use(express.urlencoded({ extended: true }))


const server = http.createServer(app)
const io = socketio(server)
socketControllers.listen(io)

server.listen(3000, () => console.log("Running on port 3000..."))

