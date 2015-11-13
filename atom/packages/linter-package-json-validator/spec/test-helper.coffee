{ config } = require '../lib/init'


module.exports.resetConfig = ->

  Object.keys(config).forEach (key) ->
    atom.config.set("linter-linter-package-json-validator.#{key}", config[key].default)
