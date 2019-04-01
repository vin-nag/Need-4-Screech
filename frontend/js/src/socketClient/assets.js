import assetManager from "../services/assetManager"

const onAnimationsList = (socket, data) => {
    const animationsList = data.payload
    assetManager.loadAnimationImages(animationsList)
}

const onMusicList = (socket, data) => {
    const musicList = data.payload
    assetManager.loadMusic(musicList)
}

export default {
    onAnimationsList,
    onMusicList
}