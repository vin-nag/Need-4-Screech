const FileService = require("../../services/FileService")

const onGetAnimationsList = (socket, data) => {
    const animations = _getAnimations()
    socket.emit("animationsList", {
        payload: animations
    })
}

const onGetMusicList = (socket, data) => {
    const music = _getMusic()
    socket.emit("musicList", {
        payload: music
    })
}

const onGetSoundList = (socket, data) => {
    const sound = _getSound()
    socket.emit("soundList", {
        payload: sound
    })
}

const _getAnimations = () => {
    const animationDirFiles = FileService.listdir("frontend/static/assets/animations")
    let animations = animationDirFiles.filter(file => file.endsWith(".png"))
    animations = animations.map(animation => animation.substring(0, animation.length-4))
    return animations
}

const _getMusic = () => {
    const musicDirFiles = FileService.listdir("frontend/static/assets/music")
    let music = musicDirFiles.filter(file => file.endsWith(".mp3"))
    music = music.map(music => music.substring(0, music.length-4))
    return music
}

const _getSound = () => {
    const soundDirFiles = FileService.listdir("frontend/static/assets/sfx")
    let sound = soundDirFiles.filter(file => file.endsWith(".wav"))
    sound = sound.map(sound => sound.substring(0, sound.length-4))
    return sound
}

module.exports = {
    onGetAnimationsList,
    onGetMusicList,
    onGetSoundList
}

