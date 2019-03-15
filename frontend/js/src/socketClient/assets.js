import assetManager from "../services/assetManager"

const onAnimationsList = (socket, data) => {
    const animationsList = data.payload
    assetManager.loadAnimationImages(animationsList)
}

export default {
    onAnimationsList
}