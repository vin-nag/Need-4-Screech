const fs = require("fs")
const path = require("path")

class FileService {
    constructor(){
        this.appPath = this._getAppPath()
    }

    /**
     * Retrieves a directory listing of the provided path
     * 
     * @param {string} path The path whose directory is to be listed
     */
    listdir(path){
        return fs.readdirSync(path)
    }

    /**
     * Gets the base path of the node app
     */
    _getAppPath(){
        return path.dirname(require.main.filename)
    }
}

module.exports = new FileService()