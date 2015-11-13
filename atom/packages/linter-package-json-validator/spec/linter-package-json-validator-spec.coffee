{ resetConfig } = require './test-helper'

PJVProvider = require '../lib/package-json-validator-provider'

describe "Lint package.json", ->
  beforeEach ->
    waitsForPromise -> atom.packages.activatePackage('linter-package-json-validator')
    resetConfig()

  describe "Other json files", ->
    it 'should not lint other.json files', ->

      waitsForPromise ->
        atom.workspace.open('./files/other.json')
          .then (editor) -> PJVProvider.lint(editor)
          .then (messages) ->

            expect(messages.length).toEqual(0)


  describe "package.json - npm", ->
    it 'should lint package.json files', ->

      waitsForPromise ->
        atom.workspace.open('./files/package.json')
          .then (editor) -> PJVProvider.lint(editor)
          .then (messages) ->

            expect(messages.length).toNotEqual(0)
