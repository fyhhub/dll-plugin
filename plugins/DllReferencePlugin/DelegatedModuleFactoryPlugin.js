const DelegatedModule = require('./DelegatedModule')

/**
 * 1. 获取当前require模块的路径
 * 2. 判断是否命中 manifest中的路径，代表这个模块是我们已经生成的dll模块，创建DelegatedModule
 * 3. 返回DelegatedModule对象  代替原本的module
 */
class DelegatedModuleFactoryPlugin {
  constructor(options) {
    this.options = options
    options.type = options.type || 'require'
  }

  apply(normalModuleFactory) {
    normalModuleFactory.hooks.module.tap('DelegatedModuleFactoryPlugin', (module) => {

      if (module.libIdent) {
        const request = module.libIdent(this.options)
        // 匹配到了manifest里的content文件
        if (request && request in this.options.content) {
          const resolved = this.options.content[request]
          return new DelegatedModule(
            this.options.source,//dll-reference _dll_utils
            resolved,//{"id":"./node_modules/_is-promise@4.0.0@is-promise/index.js"}
            module//老模块
          );
        }
      }
      return module
    })
  }
}

module.exports = DelegatedModuleFactoryPlugin