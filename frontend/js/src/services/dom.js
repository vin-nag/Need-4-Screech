class DomService {
    showElement(elementId){
        document.getElementById(elementId).style.display = "initial"
    }

    hideElement(elementId){
        document.getElementById(elementId).style.display = "none"
    }

    isHidden(elementId){
        const element = document.getElementById(elementId)
        return window.getComputedStyle(element).display === "none"
    }

    fillSelect(elementId, values, labels){
        const selectMenu = document.getElementById(elementId)
        selectMenu.options.length = 0 //clear select menu

        for(let i = 0; i < values.length; i++){
            const option = new Option(labels[i], values[i])
            selectMenu.options[i] = option
        }

    }
}

const domService = new DomService()
export default domService