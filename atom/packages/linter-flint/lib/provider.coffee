child_process = require 'child_process'
path = require 'path'

module.exports = class LinterProvider
  regex = ///
    \[(\w+)\] # Type surrounded in square brackets.
    \s(.*)    # Message.
  ///

  getCommand = ->
    cmd = atom.config.get 'linter-flint.executablePath'
    if atom.config.get 'linter-flint.skipReadme'
      cmd = "#{cmd} --skip-readme"
    if atom.config.get 'linter-flint.skipContributing'
      cmd = "#{cmd} --skip-contributing"
    if atom.config.get 'linter-flint.skipLicense'
      cmd = "#{cmd} --skip-license"
    if atom.config.get 'linter-flint.skipBootstrap'
      cmd = "#{cmd} --skip-bootstrap"
    if atom.config.get 'linter-flint.skipTestScript'
      cmd = "#{cmd} --skip-test-script"
    if atom.config.get 'linter-flint.skipScripts'
      cmd = "#{cmd} --skip-scripts"
    unless atom.config.get 'linter-flint.colorOutput'
      cmd = "#{cmd} --no-color"
    return cmd

  lint: ->
    return new Promise (resolve) ->
      projectPath = atom.project.getPaths()[0]
      data = ''
      process = child_process.exec(getCommand(), {cwd: projectPath})
      process.stderr.on 'data', (d) -> data = d.toString()
      process.on 'close', ->
        toReturn = []
        for line in data.split('\n')
          #console.log "Flint Provider: #{line}" if atom.inDevMode()
          if line.match regex
            [type, message] = line.match(regex)[1..2]
            toReturn.push(
              type: type,
              text: message
            )
        resolve toReturn
