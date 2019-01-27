const path = require("path")

class ResponseService {
    constructor(){
        this.appPath = this._getAppPath()
        this.viewsPath = `${this.appPath}/frontend/views`
    }

    /**
     * Sends a view to the client
     * 
     * @param {Express.Response} res The response object being prepared
     * @param {string} viewFile The name of the view file, for example "index.html"
     */
    sendView(res, viewFile){
        res.sendFile(`${this.viewsPath}/${viewFile}`)
    }

    /**
     * Gets the base path of the node app
     */
    _getAppPath(){
        return path.dirname(require.main.filename)
    }
}

module.exports = new ResponseService()