const express = require("express")
const http = require("http")
const path = require("path")
const socketio = require("socket.io")
const httpControllers = require("./backend/controllers/http")
const socketControllers = require("./backend/controllers/socket")
const userAuth = require("./backend/services/userauth")
const models = require("./backend/models/models")

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

        userAuth.validateRegistration(data, function(res) {

            if(res) {
                socket.emit('signUpResponse',{success:false});
            }

            else {

                new_user = models.user(data.username, data.email, data.password)
                userAuth.registerUser(new_user, function(res) {

                    if(res) {
                        socket.emit('signUpResponse',{success:false});
                    }
                    else {
                        socket.emit('signUpResponse',{success:true});
                    }
                    
                });
            }
        });
       
    });

    socket.on('onLogin', function(data) {

    	userAuth.login(data, function(res) {

            if(res) {
                socket.emit('signInResponse',{success:false});
            }

            else {
                socket.emit('signInResponse',{success:true});
            }
        });

    });
   
});

