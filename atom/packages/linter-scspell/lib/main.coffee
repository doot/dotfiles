{BufferedProcess, CompositeDisposable} = require 'atom'

module.exports =
  config:
    executablePath:
      type: 'string'
      title: 'Path to scspell command'
      default: '/usr/local/bin/scspell'
    overrideDictionary:
      type: 'string'
      title: 'Path to override dictionary'
      default: ''

  activate: ->
    @subscriptions = new CompositeDisposable
    @subscriptions.add atom.config.observe 'linter-scspell.executablePath',
      (executablePath) =>
        @executablePath = executablePath
    @subscriptions.add atom.config.observe 'linter-scspell.overrideDictionary',
      (overrideDictionary) =>
        @overrideDictionary = overrideDictionary

  deactivate: ->
    @subscriptions.dispose()

  provideLinter: ->
    provider =
      grammarScopes: ['*']
      scope: 'file'
      lintOnFly: false

      lint: (textEditor) =>
        filePath = textEditor.getPath()
        parameters = [filePath, '--report-only']

        if @overrideDictionary
          parameters.push "--override-dictionary=#{ @overrideDictionary }"

        regex = /.*:(\d+): (.*)\r?/

        parse = (line) ->
            parsed = regex.exec(line)

            return null unless parsed?

            line = parseInt(parsed[1], 10) - 1
            message = parsed[2]

            tokenStart = message.lastIndexOf('from token') + 12
            token = message.slice(tokenStart, -2)

            lineText = textEditor.lineTextForBufferRow line
            start = lineText.indexOf(token)
            end = start + token.length

            type: 'SP',
            text: message,
            filePath: filePath,
            range: [
                [line, start],
                [line, end]
            ]

        return new Promise (resolve, reject) =>
          lines = []
          process = new BufferedProcess
            command: @executablePath
            args: parameters

            stdout: (data) ->
              lines = data.split '\n'

            exit: (code) ->
              return resolve [] unless code is 0

              errors = []
              for line in lines
                  if line
                    info = parse line
                    errors.push info if info?

              return resolve errors

          process.onWillThrowError ({error,handle}) ->
            atom.notifications.addError "Failed to run #{@executablePath}",
              detail: "#{error.message}"
              dismissable: true
            handle()
            resolve []
