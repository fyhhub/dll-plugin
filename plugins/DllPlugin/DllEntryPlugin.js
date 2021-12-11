const SingleEntryDependency = require("webpack/lib/dependencies/SingleEntryDependency")
const DllEntryDependency = require("../dependencies/DllEntryDependency")
const DllModuleFactory = require('./DllModuleFactory')

class DllEntryPlugin {
  constructor(context, entries, name) {
    this.context = context
    this.entries = entries
    this.name = name
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('DllEntryPlugin', (compilation, { normalModuleFactory }) => {
      const dllModuleFactory = new DllModuleFactory()
      compilation.dependencyFactories.set(DllEntryDependency, dllModuleFactory)
      compilation.dependencyFactories.set(SingleEntryDependency, normalModuleFactory)
    })


    compiler.hooks.make.tapAsync('DllEntryPlugin', (compilation, callback) => {
      // 开始一次新的入口编译
      compilation.addEntry(
        this.context,
        new DllEntryDependency(
          this.entries.map(entry => new SingleEntryDependency(entry)),
          this.name
        ),
        this.name,
        callback
      )
    })
  }
}

module.exports = DllEntryPlugin