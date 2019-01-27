
const listener = (socket) => {
    socket.emit("test", {
        "message": "Connection acknowledged from client"
    })
}

export default listener