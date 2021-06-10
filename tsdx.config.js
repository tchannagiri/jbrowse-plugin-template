const globals = require('@jbrowse/core/ReExports/list').default
const { createJBrowsePluginTsdxConfig } = require('@jbrowse/development-tools')

module.exports = {
  rollup(config, options) {
    var config = createJBrowsePluginTsdxConfig(config, options, globals)
    if (options.format === 'umd' || options.format === 'iife') {
      // If it's an external package in node_modules and is not in JBrowse's
      // list of re-exported packages, bundle it in the UMD build.
      const originalExternal = config.external
      config.external = (...args) => {
        if (args[0] == "@jbrowse/core/pluggableElementTypes/renderers/BoxRendererType") {
          console.log(args[0])
          // return true;
          return false;
        }
        const isExternal = originalExternal(...args) || (args[0] == "canvas")
        return isExternal
      }
    }
    return config
  },
}
