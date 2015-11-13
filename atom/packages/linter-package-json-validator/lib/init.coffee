fs = require "fs"
path = require "path"
PJVProvider = require './package-json-validator-provider'
packageDeps = require 'atom-package-deps'

module.exports =

  config:
    show_warnings:
      type: 'boolean'
      default: true
    show_recommendations:
      type: 'boolean'
      default: true
    spec:
      type: 'string'
      default: 'npm'
      enum: ['npm', 'commonjs_1.0', 'commonjs_1.1']

  activate: ->
    console.log 'activate linter-package-json-validator' if atom.inDevMode()

    packageDeps.install 'linter-package-json-validator'

  provideLinter: -> PJVProvider
