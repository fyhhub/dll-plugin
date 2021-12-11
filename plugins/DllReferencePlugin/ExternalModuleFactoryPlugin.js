const ExternalModule = require('webpack/lib/ExternalModule')
class ExternalModuleFactoryPlugin {
  constructor(type, externals) {
    this.type = type;//var
    this.externals = externals;//{"dll-reference _dll_utils":"_dll_utils"}
  }

  /**
   * 1. 这里获取到的实际是我们之前创建好的 DelegatedSourceDependency
   * 2. 如果路径是dll-reference _dll_utils  则创建ExternalModule
   * @param {*} normalModuleFactory 
   */
  apply(normalModuleFactory) {
    normalModuleFactory.hooks.factory.tap("ExternalModuleFactoryPlugin", factory => (data, callback) => {
      const dependency = data.dependencies[0];//DelegatedSourceDependency
      let request = dependency.request;// "dll-reference _dll_utils"
      let value = this.externals[request];//_dll_utils
      if (value) {//如果是一个外部模块
        callback(
          null,
          new ExternalModule(value, 'var', dependency.request)//_dll_utils
        );
      } else {//否则 是个普通模块 走老的普通模块工厂的生产模块的逻辑
        factory(data, callback);
      }
    });
  }
}

module.exports = ExternalModuleFactoryPlugin