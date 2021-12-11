const { RawSource } = require("webpack-sources")
const Module = require("webpack/lib/Module")
const DelegatedSourceDependency = require('../dependencies/DelegatedSourceDependency')
class DelegatedModule extends Module {
  constructor(sourceRequest, data, originModule) {
    super("javascript/dynamic", null);
    this.sourceRequest = sourceRequest;
    this.request = data.id;
    this.originalRequest = originModule;//老模块
  }
  libIdent(options) {//模块ID还是老的模块ID
    return this.originalRequest.libIdent(options);
  }

  identifier() {
    return `delegated ${this.request} from ${this.sourceRequest}`;
  }
  readableIdentifier() {
    return `delegated ${this.request} from ${this.sourceRequest}`;
  }
  size(){
    return 42;
  }
  source() {
    const str = `module.exports = (__webpack_require__('${this.sourceRequest}')(${JSON.stringify(this.request)}))`
    return new RawSource(str)
  }

  /**
   * 1. 当代理模块被创建的时
   * 2. 不走原本的Build逻辑，例如ast解析，创建各种依赖
   * 3. 直接创建依赖，后面会递归解析这个DelegatedSourceDependency依赖
   * @param {*} options 
   * @param {*} compilation 
   * @param {*} resolver 
   * @param {*} fs 
   * @param {*} callback 
   */
  build(options, compilation, resolver, fs, callback) {
    this.built = true;
    this.buildMeta = {};
    this.buildInfo = {};
    // 不走ast分析创建依赖  直接创建DelegatedSourceDependency依赖
    this.delegatedSourceDependency = new DelegatedSourceDependency(
      this.sourceRequest
    );
    this.addDependency(this.delegatedSourceDependency);
    callback();
  }
}

module.exports = DelegatedModule