import assetManager from "../services/assetManager"

const onAnimationsList = (socket, data) => {
    const animationsList = data.payload
    assetManager.loadAnimationImages(animationsList)
}

const onMusicList = (socket, data) => {
    const musicList = data.payload
    assetManager.loadMusic(musicList)
}

const onSoundList = (socket, data) => {
    const soundList = data.payload
    assetManager.loadSfx(soundList)
}

export default {
    onAnimationsList,
    onMusicList,
    onSoundList
}