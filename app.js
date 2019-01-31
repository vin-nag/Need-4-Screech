const express = require("express")
const http = require("http")
const path = require("path")
const socketio = require("socket.io")
const httpControllers = require("./backend/controllers/http")
const socketControllers = require("./backend/controllers/socket")
const userAuth = require("./backend/services/userauth")

const app = express()
app.use(express.static(path.join(__dirname, 'frontend/js/dist'))) //static resource
app.use(httpControllers)
app.use(express.urlencoded({ extended: true }))

const server = http.createServer(app)
const io = socketio(server)
socketControllers.listen(io)

server.listen(3000, () => console.log("Running on port 3000..."))

io.sockets.on('connection', function(socket) {
    console.log('socket connection');
 
    socket.on('onSignUp',function(data) {

        console.log(data.username);
        console.log(data.email);
        console.log(data.password);
        console.log(data.confirmPass);

        userAuth.signUp(data);
       
    });

    socket.on('onLogin', function(data)) {

    	console.log("login");
    }
   
});

