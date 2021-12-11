const Module = require("webpack/lib/Module");
const { RawSource } = require('webpack-sources')

class DllModule extends Module {
  constructor(context, dependencies, name, type) {
    super('javascript/dynamic', context)
    this.context = context
    this.dependencies = dependencies
    this.name = name
    this.type = type
  }

  identifier() {
    return `dll ${this.name}`
  }

  readableIdentifier() {
    return `dll ${this.name}`
  }

  size() {
    return 12
  }

  source() {
    return new RawSource(`module.exports = __webpack_require__;`)
  }

  // 模块编译
  build(options, compilation, resolver, fs, callback) {
    this.built = true
    this.buildMeta = {}
    this.buildInfo = {}
    return callback()
  }
}

module.exports = DllModule