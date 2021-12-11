const path = require('path')
const webpack = require('webpack')
const DllReferencePlugin = require('./plugins/DllReferencePlugin')
module.exports = {
  mode: 'development',
  entry: {
    app: path.resolve(__dirname, 'src')
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new DllReferencePlugin({
      manifest: require(path.resolve(__dirname, './dist', 'utils.manifest.json'))
    })
  ]
}
