const path = require('path')
const DllPlugin = require('./plugins/DllPlugin')
module.exports = {
  mode: 'development',
  entry: {
    utils: ['isarray', 'is-promise']
  },
  output: {
    filename: 'utils.dll.js',
    path: path.resolve(__dirname, 'dist'),
    library: '_dll_utils'
  },
  plugins: [
    new DllPlugin({
      name: '_dll_utils',
      path: path.resolve(__dirname, 'dist', 'utils.manifest.json')
    })
  ]
}
