const DelegatedSourceDependency = require('../dependencies/DelegatedSourceDependency')
const ExternalModuleFactoryPlugin = require('./ExternalModuleFactoryPlugin')
const DelegatedModuleFactoryPlugin = require('./DelegatedModuleFactoryPlugin')
class DllReferencePlugin {
  constructor(options) {
    this.options = options
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('DllReferencePlugin', (compilation, { normalModuleFactory }) => {
      compilation.dependencyFactories.set(
        DelegatedSourceDependency,
        normalModuleFactory
      );
    })
    compiler.hooks.compile.tap('DllReferencePlugin', ({ normalModuleFactory }) => {
      const manifest = this.options.manifest
      const name = manifest.name
      const content = manifest.content
      const source = `dll-reference ${name}`
      const external = {}
      external[source] = name
      new ExternalModuleFactoryPlugin('var', external).apply(normalModuleFactory)

      new DelegatedModuleFactoryPlugin({
        source,
        context: compiler.options.context,
        content
      }).apply(normalModuleFactory);
    })
  }
}

module.exports = DllReferencePlugin