import io from "socket.io-client"
import connectListener from "./connect"
import disconnectListener from "./disconnect"

const socket = io()

export const listen = () => {
    socket.on('connect', () => connectListener(socket))
    socket.on('disconnect', () => disconnectListener(socket))
}

export const emit = (eventName, data) => {
    socket.emit(eventName, data)
}

export default {
    listen,
    emit
}