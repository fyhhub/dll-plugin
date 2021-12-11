const path = require('path')
const async = require('neo-async')

/**
 * 用于生成manifest.json文件
 */
class LibManifestPlugin {
  constructor(options) {
    this.options = options
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('LibManifestPlugin', (compilation, callback) => {
      // 所有chunks执行这个函数， 当所有任务都done  才会执行callback
      const content = {}
      async.forEach(compilation.chunks, (chunk, done) => {
        const targetPath = this.options.path
        const name = this.options.name
        for (let module of chunk.modulesIterable) {
          if (module.libIdent) {
            const ident = module.libIdent({
              context: compiler.options.context
            })
            content[ident] = {
              id: module.id
            }
          }
        }
        const manifest = {
          name,
          content
        }

        compiler.outputFileSystem.mkdirp(path.dirname(targetPath), err => {
          compiler.outputFileSystem.writeFile(
            targetPath,
            JSON.stringify(manifest),
            done
          )
        })
      }, callback)
    })
  }
}

module.exports = LibManifestPlugin