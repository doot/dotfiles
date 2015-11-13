module.exports = LinterFlint =
  config:
    executablePath:
      type: 'string'
      default: 'flint'
    skipReadme:
      type: 'boolean'
      default: false
    skipContributing:
      type: 'boolean'
      default: false
    skipLicense:
      type: 'boolean'
      default: false
    skipBootstrap:
      type: 'boolean'
      default: false
    skipTestScript:
      type: 'boolean'
      default: false
    skipScripts:
      type: 'boolean'
      default: false
    colorOutput:
      type: 'boolean'
      default: false

  activate: ->
    require('atom-package-deps').install 'linter-flint'

  provideLinter: ->
    LinterProvider = require('./provider')
    @provider = new LinterProvider()
    return {
      grammarScopes: ['*']
      scope: 'project'
      lint: @provider.lint
      lintOnFly: true
    }
