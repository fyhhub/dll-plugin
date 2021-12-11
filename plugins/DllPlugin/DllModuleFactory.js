const { Tapable } = require('tapable')
const DllModule = require('./DllModule')

class DllModuleFactory extends Tapable {
  constructor() {
    super()
    this.hooks = {}
  }
  /**
   * 每个工厂都需要实现create
   * @param {*} data 
   * @param {Module} callback 
   */
  create(data, callback) {
    // 获取第一个依赖
    const dependency = data.dependencies[0]

    callback(
      null,
      new DllModule(
        data.context,
        dependency.dependencies,
        dependency.name,
        dependency.type
      )
    )
  }
}

module.exports = DllModuleFactory