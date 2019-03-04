const path = require('path')

module.exports = {
  entry: './frontend/js/src/index.js',
  mode: "development",
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'frontend/static/dist/')
  },
  devtool: "cheap-eval-source-map"
}