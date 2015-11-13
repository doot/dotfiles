(function() {
  var CompositeDisposable;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    config: {
      enableAutoActivation: {
        title: 'Show Suggestions On Keystroke',
        description: 'Suggestions will show as you type if this preference is enabled. If it is disabled, you can still see suggestions by using the keymapping for autocomplete-plus:activate (shown below).',
        type: 'boolean',
        "default": true,
        order: 1
      },
      autoActivationDelay: {
        title: 'Delay Before Suggestions Are Shown',
        description: 'This prevents suggestions from being shown too frequently. Usually, the default works well. A lower value than the default has performance implications, and is not advised.',
        type: 'integer',
        "default": 100,
        order: 2
      },
      maxVisibleSuggestions: {
        title: 'Maximum Visible Suggestions',
        description: 'The suggestion list will only show this many suggestions.',
        type: 'integer',
        "default": 10,
        minimum: 1,
        order: 3
      },
      confirmCompletion: {
        title: 'Keymap For Confirming A Suggestion',
        description: 'You should use the key(s) indicated here to confirm a suggestion from the suggestion list and have it inserted into the file.',
        type: 'string',
        "default": 'tab and enter',
        "enum": ['tab', 'enter', 'tab and enter'],
        order: 4
      },
      useCoreMovementCommands: {
        title: 'Use Core Movement Commands',
        description: 'Disable this if you want to bind your own keystrokes to move around the suggestion list. You will also need to add definitions to your keymap. See: https://github.com/atom/autocomplete-plus#remapping-movement-commands',
        type: 'boolean',
        "default": true,
        order: 5
      },
      fileBlacklist: {
        title: 'File Blacklist',
        description: 'Suggestions will not be provided for files matching this list, e.g. *.md for Markdown files.',
        type: 'array',
        "default": ['.*'],
        items: {
          type: 'string'
        },
        order: 6
      },
      scopeBlacklist: {
        title: 'Scope Blacklist',
        description: 'Suggestions will not be provided for scopes matching this list. See: https://atom.io/docs/latest/behind-atom-scoped-settings-scopes-and-scope-descriptors',
        type: 'array',
        "default": [],
        items: {
          type: 'string'
        },
        order: 7
      },
      includeCompletionsFromAllBuffers: {
        title: 'Include Completions From All Buffers',
        description: 'For grammars with no registered provider(s), the default provider will include completions from all buffers, instead of just the buffer you are currently editing.',
        type: 'boolean',
        "default": true,
        order: 8
      },
      strictMatching: {
        title: 'Use Strict Matching For Built-In Provider',
        description: 'Fuzzy searching is performed if this is disabled; if it is enabled, suggestions must begin with the prefix from the current word.',
        type: 'boolean',
        "default": false,
        order: 9
      },
      minimumWordLength: {
        description: "Only autocomplete when you've typed at least this many characters.",
        type: 'integer',
        "default": 3,
        order: 10
      },
      enableBuiltinProvider: {
        title: 'Enable Built-In Provider',
        description: 'The package comes with a built-in provider that will provide suggestions using the words in your current buffer or all open buffers. You will get better suggestions by installing additional autocomplete+ providers. To stop using the built-in provider, disable this option.',
        type: 'boolean',
        "default": true,
        order: 11
      },
      builtinProviderBlacklist: {
        title: 'Built-In Provider Blacklist',
        description: 'Don\'t use the built-in provider for these selector(s).',
        type: 'string',
        "default": '.source.gfm',
        order: 12
      },
      backspaceTriggersAutocomplete: {
        title: 'Allow Backspace To Trigger Autocomplete',
        description: 'If enabled, typing `backspace` will show the suggestion list if suggestions are available. If disabled, suggestions will not be shown while backspacing.',
        type: 'boolean',
        "default": false,
        order: 13
      },
      enableAutoConfirmSingleSuggestion: {
        title: 'Automatically Confirm Single Suggestion',
        description: 'If enabled, automatically insert suggestion on manual activation with autocomplete-plus:activate when there is only one match.',
        type: 'boolean',
        "default": true,
        order: 14
      },
      suggestionListFollows: {
        title: 'Suggestions List Follows',
        description: 'With "Cursor" the suggestion list appears at the cursor\'s position. With "Word" it appears at the beginning of the word that\'s being completed.',
        type: 'string',
        "default": 'Word',
        "enum": ['Word', 'Cursor'],
        order: 15
      },
      defaultProvider: {
        description: 'Using the Symbol provider is experimental. You must reload Atom to use a new provider after changing this option.',
        type: 'string',
        "default": 'Symbol',
        "enum": ['Fuzzy', 'Symbol'],
        order: 16
      },
      suppressActivationForEditorClasses: {
        title: 'Suppress Activation For Editor Classes',
        description: 'Don\'t auto-activate when any of these classes are present in the editor.',
        type: 'array',
        "default": ['vim-mode.command-mode', 'vim-mode.visual-mode', 'vim-mode.operator-pending-mode'],
        items: {
          type: 'string'
        },
        order: 17
      },
      consumeSuffix: {
        title: 'Consume suggestion text following the cursor',
        description: 'Completing a suggestion consumes text following the cursor matching the suffix of the chosen suggestion.',
        type: 'boolean',
        "default": true,
        order: 18
      },
      useAlternateScoring: {
        description: "Prefers runs of consecutive characters, acronyms and start of words. (Experimental)",
        type: 'boolean',
        "default": false,
        order: 19
      },
      useLocalityBonus: {
        description: "Gives words near the cursor position a higher score than those far away",
        type: 'boolean',
        "default": true,
        order: 20
      }
    },
    autocompleteManager: null,
    subscriptions: null,
    activate: function() {
      this.subscriptions = new CompositeDisposable;
      return this.requireAutocompleteManagerAsync();
    },
    deactivate: function() {
      var _ref;
      if ((_ref = this.subscriptions) != null) {
        _ref.dispose();
      }
      this.subscriptions = null;
      return this.autocompleteManager = null;
    },
    requireAutocompleteManagerAsync: function(callback) {
      if (this.autocompleteManager != null) {
        return typeof callback === "function" ? callback(this.autocompleteManager) : void 0;
      } else {
        return setImmediate((function(_this) {
          return function() {
            var autocompleteManager;
            autocompleteManager = _this.getAutocompleteManager();
            return typeof callback === "function" ? callback(autocompleteManager) : void 0;
          };
        })(this));
      }
    },
    getAutocompleteManager: function() {
      var AutocompleteManager;
      if (this.autocompleteManager == null) {
        AutocompleteManager = require('./autocomplete-manager');
        this.autocompleteManager = new AutocompleteManager();
        this.subscriptions.add(this.autocompleteManager);
      }
      return this.autocompleteManager;
    },
    consumeSnippets: function(snippetsManager) {
      return this.requireAutocompleteManagerAsync(function(autocompleteManager) {
        return autocompleteManager.setSnippetsManager(snippetsManager);
      });
    },

    /*
    Section: Provider API
     */
    consumeProviderLegacy: function(service) {
      if ((service != null ? service.provider : void 0) == null) {
        return;
      }
      return this.consumeProvider([service.provider], '1.0.0');
    },
    consumeProvidersLegacy: function(service) {
      return this.consumeProvider(service != null ? service.providers : void 0, '1.1.0');
    },
    consumeProvider: function(providers, apiVersion) {
      var registrations;
      if (apiVersion == null) {
        apiVersion = '2.0.0';
      }
      if ((providers != null) && !Array.isArray(providers)) {
        providers = [providers];
      }
      if (!((providers != null ? providers.length : void 0) > 0)) {
        return;
      }
      registrations = new CompositeDisposable;
      this.requireAutocompleteManagerAsync(function(autocompleteManager) {
        var provider, _i, _len;
        for (_i = 0, _len = providers.length; _i < _len; _i++) {
          provider = providers[_i];
          registrations.add(autocompleteManager.providerManager.registerProvider(provider, apiVersion));
        }
      });
      return registrations;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBsdXMvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLG9CQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTywrQkFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLHlMQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLElBSFQ7QUFBQSxRQUlBLEtBQUEsRUFBTyxDQUpQO09BREY7QUFBQSxNQU1BLG1CQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxvQ0FBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLDhLQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLEdBSFQ7QUFBQSxRQUlBLEtBQUEsRUFBTyxDQUpQO09BUEY7QUFBQSxNQVlBLHFCQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyw2QkFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLDJEQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLEVBSFQ7QUFBQSxRQUlBLE9BQUEsRUFBUyxDQUpUO0FBQUEsUUFLQSxLQUFBLEVBQU8sQ0FMUDtPQWJGO0FBQUEsTUFtQkEsaUJBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLG9DQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsK0hBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxRQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsZUFIVDtB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

//# sourceURL=/Users/doot/.atom/packages/autocomplete-plus/lib/main.coffee
