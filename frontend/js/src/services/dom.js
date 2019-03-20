class DomService {
    showElement(elementId){
        document.getElementById(elementId).style.display = "initial"
    }

    hideElement(elementId){
        document.getElementById(elementId).style.display = "none"
    }
}

const domService = new DomService()
export default domService