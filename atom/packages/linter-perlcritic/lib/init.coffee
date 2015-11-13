{CompositeDisposable} = require 'atom'
Path = require 'path'
NamedRegexp = require 'named-regexp'

module.exports =
  config:
    executablePath:
      type: 'string'
      title: 'Perlcritic Executable Path'
      default: 'perlcritic' # Let OS's $PATH handle the rest
    regex:
      type: 'string'
      title: 'Perlcritic Verbose Regex'
      default: '(:<text>.*) at line (:<line>\\d+), column (:<col>\\d+).\\s+(:<trace>.*\\.)\\s+\\(Severity: (:<severity>\\d+)\\)'
    level:
      type: 'string'
      title: 'Perlcritic Level of warning'
      default: 'Info'


  activate: ->
    require("atom-package-deps").install("linter-perlcritic")

  provideLinter: ->
    helpers = require('atom-linter')
    provider =
      name: 'perlcritic'
      grammarScopes: ['source.perl.mojolicious', 'source.perl']
      scope: 'file'
      lintOnFly: true
      lint: (textEditor) =>
        filePath = textEditor.getPath()
        fileDir = Path.dirname(filePath)
        command = atom.config.get('linter-perlcritic.executablePath')
        parameters = []
        parameters.push('-')
        text = textEditor.getText()
        return helpers.exec(command, parameters, {stdin: text, cwd: fileDir}).then (output) ->
          regex = new RegExp(atom.config.get('linter-perlcritic.regex'), 'ig')
          regex = NamedRegexp.named(regex)
          messages = []
          while ((match = regex.exec(output)) isnt null)
            line = parseInt(match.capture('line'), 10) - 1
            col = parseInt(match.capture('col'), 10) - 1
            text = match.capture('text')
            
            # get all named captures
            captures = match.captures

            # severity
            if (captures['severity'])
                text += ' (Severity ' + match.capture('severity') + ')'

            # trace
            if (captures['trace'])
                text += ' [' + match.capture('trace') + ']'

            messages.push
              type: atom.config.get('linter-perlcritic.level')
              text: text
              filePath: filePath
              range: helpers.rangeFromLineNumber(textEditor, line, col)

          return messages
