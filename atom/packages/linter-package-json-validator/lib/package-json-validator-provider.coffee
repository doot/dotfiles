fs = require "fs"
path = require "path"
PJV = require('package-json-validator').PJV

module.exports =

  name: "package-json-validator"

  grammarScopes: ['source.json']

  scope: 'file'

  lintOnFly: true

  types:
    errors: 'Error'
    warnings: 'Warning'
    recommendations: 'Recommendation'

  lint: (textEditor) ->

    return new Promise (resolve, reject) =>

      filePath = textEditor.getPath()
      return resolve([]) unless filePath and /package\.json$/.test(filePath)

      text = textEditor.getText()

      @lintText text, (result) =>

        messsages = []

        for typeKey, typeLabel of @types
          continue unless result[typeKey]

          for messsage in result[typeKey]
            messsages.push {
              type: typeLabel
              text: messsage
              filePath: filePath
              range: [[0, 0], [0, 0]]
            }

        resolve messsages

  lintText: (text, callback) ->
    spec = @config 'spec', 'npm'
    options =
      warnings: @config 'show_warnings', true
      recommendations: @config 'show_recommendations', true


    callback PJV.validate(text, spec, options)

  config: (key, defaultValue = null) ->
    atom.config.get("linter-linter-package-json-validator.#{key}") || defaultValue
