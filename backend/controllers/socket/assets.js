const FileService = require("../../services/FileService")

const onGetAnimationsList = (socket, data) => {
    const animations = _getAnimations()
    socket.emit("animationsList", {
        payload: animations
    })
}

const _getAnimations = () => {
    const animationDirFiles = FileService.listdir("frontend/static/assets/animations")
    let animations = animationDirFiles.filter(file => file.endsWith(".png"))
    animations = animations.map(animation => animation.substring(0, animation.length-4))
    return animations
}

module.exports = {
    onGetAnimationsList
}

