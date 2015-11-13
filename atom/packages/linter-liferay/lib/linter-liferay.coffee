{BufferedProcess, CompositeDisposable} = require 'atom'
{XRegExp} = require 'xregexp'

class LinterLiferay
	grammarScopes: [
		'source.css.scss'
		'source.css'
		'source.js'
		'source.velocity'
		'text.html.jsp'
		'text.html.mustache'
		'text.html'
	]

	regex: 'Lines?\\s+(?<lineStart>\\d+)(?<lineEnd>\\-\\d+)?(?:,\\s+Column\\s+)?(?<col>\\d+)?:\\s+(?<message>.*)'

	regexFlags: 'i'

	constructor: ->
		@subscriptions = new CompositeDisposable

		@subscriptions.add atom.config.observe 'linter-liferay.lintJS', => @args = @formatArgs()
		@subscriptions.add atom.config.observe 'linter-liferay.checkSFPath', =>
			@cmd = atom.config.get('linter-liferay.checkSFPath')

	formatArgs: ->
		args = ['--no-color', '--show-columns']
		args.push '--no-lint' unless atom.config.get('linter-liferay.lintJS')
		args

	getProvider: ->
		provider =
			grammarScopes: @grammarScopes
			scope: 'file'
			lintOnFly: true
			lint: (editor) =>
				@editor = editor
				@lint()


	lint: ->
		new Promise (resolve, reject) =>
			output = []

			process = new BufferedProcess
				command: @cmd
				args: [@args..., @editor.getPath()]
				stdout: (data) ->
					output.push data
				exit: (code) =>
					return resolve [] unless code is 0
					resolve @getMessages(output.join '\n')

			process.onWillThrowError ({error, handle}) =>
				atom.notifications.addError "Cannot execute #{@cmd}",
					detail: error.message
					dismissable: true

				handle()
				reject error

	getMessages: (output) ->
		messages = []
		regex = XRegExp @regex, @regexFlags

		XRegExp.forEach output, regex, (match, i) =>
			messages.push
				filePath: @editor.getPath()
				range: @computeRange match
				type: 'warning'
				text: match.message

		messages

	computeRange: (match) ->
		rowStart = match.lineStart
		rowEnd = match.lineEnd ? rowStart

		colStart = match.col ? 1

		# check_sf only outputs starting column
		rowEndLength = @editor.lineTextForBufferRow(rowEnd - 1)?.length
		colEnd = rowEndLength ? 1

		# Ranges are 0-based
		[
			[--rowStart, --colStart],
			[--rowEnd, --colEnd]
		]

	destroy: ->
		@subscriptions.dispose()

module.exports = LinterLiferay
