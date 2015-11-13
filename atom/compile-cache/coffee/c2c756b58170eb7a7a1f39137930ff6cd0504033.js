(function() {
  var CompositeDisposable, Emitter, ListView, TermView, Terminals, capitalize, config, getColors, keypather, path;

  path = require('path');

  TermView = require('./lib/term-view');

  ListView = require('./lib/build/list-view');

  Terminals = require('./lib/terminal-model');

  Emitter = require('event-kit').Emitter;

  keypather = require('keypather')();

  CompositeDisposable = require('event-kit').CompositeDisposable;

  capitalize = function(str) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
  };

  getColors = function() {
    var background, brightBlack, brightBlue, brightCyan, brightGreen, brightPurple, brightRed, brightWhite, brightYellow, foreground, normalBlack, normalBlue, normalCyan, normalGreen, normalPurple, normalRed, normalWhite, normalYellow, _ref;
    _ref = (atom.config.getAll('term3.colors'))[0].value, normalBlack = _ref.normalBlack, normalRed = _ref.normalRed, normalGreen = _ref.normalGreen, normalYellow = _ref.normalYellow, normalBlue = _ref.normalBlue, normalPurple = _ref.normalPurple, normalCyan = _ref.normalCyan, normalWhite = _ref.normalWhite, brightBlack = _ref.brightBlack, brightRed = _ref.brightRed, brightGreen = _ref.brightGreen, brightYellow = _ref.brightYellow, brightBlue = _ref.brightBlue, brightPurple = _ref.brightPurple, brightCyan = _ref.brightCyan, brightWhite = _ref.brightWhite, background = _ref.background, foreground = _ref.foreground;
    return [normalBlack, normalRed, normalGreen, normalYellow, normalBlue, normalPurple, normalCyan, normalWhite, brightBlack, brightRed, brightGreen, brightYellow, brightBlue, brightPurple, brightCyan, brightWhite, background, foreground].map(function(color) {
      return color.toHexString();
    });
  };

  config = {
    autoRunCommand: {
      type: 'string',
      "default": ''
    },
    titleTemplate: {
      type: 'string',
      "default": "Terminal ({{ bashName }})"
    },
    fontFamily: {
      type: 'string',
      "default": ''
    },
    fontSize: {
      type: 'string',
      "default": ''
    },
    colors: {
      type: 'object',
      properties: {
        normalBlack: {
          type: 'color',
          "default": '#2e3436'
        },
        normalRed: {
          type: 'color',
          "default": '#cc0000'
        },
        normalGreen: {
          type: 'color',
          "default": '#4e9a06'
        },
        normalYellow: {
          type: 'color',
          "default": '#c4a000'
        },
        normalBlue: {
          type: 'color',
          "default": '#3465a4'
        },
        normalPurple: {
          type: 'color',
          "default": '#75507b'
        },
        normalCyan: {
          type: 'color',
          "default": '#06989a'
        },
        normalWhite: {
          type: 'color',
          "default": '#d3d7cf'
        },
        brightBlack: {
          type: 'color',
          "default": '#555753'
        },
        brightRed: {
          type: 'color',
          "default": '#ef2929'
        },
        brightGreen: {
          type: 'color',
          "default": '#8ae234'
        },
        brightYellow: {
          type: 'color',
          "default": '#fce94f'
        },
        brightBlue: {
          type: 'color',
          "default": '#729fcf'
        },
        brightPurple: {
          type: 'color',
          "default": '#ad7fa8'
        },
        brightCyan: {
          type: 'color',
          "default": '#34e2e2'
        },
        brightWhite: {
          type: 'color',
          "default": '#eeeeec'
        },
        background: {
          type: 'color',
          "default": '#000000'
        },
        foreground: {
          type: 'color',
          "default": '#f0f0f0'
        }
      }
    },
    scrollback: {
      type: 'integer',
      "default": 1000
    },
    cursorBlink: {
      type: 'boolean',
      "default": true
    },
    shellOverride: {
      type: 'string',
      "default": ''
    },
    shellArguments: {
      type: 'string',
      "default": (function(_arg) {
        var HOME, SHELL;
        SHELL = _arg.SHELL, HOME = _arg.HOME;
        switch (path.basename(SHELL.toLowerCase())) {
          case 'bash':
            return "--init-file " + (path.join(HOME, '.bash_profile'));
          case 'zsh':
            return "";
          default:
            return '';
        }
      })(process.env)
    },
    openPanesInSameSplit: {
      type: 'boolean',
      "default": false
    }
  };

  module.exports = {
    termViews: [],
    focusedTerminal: false,
    emitter: new Emitter(),
    config: config,
    disposables: null,
    activate: function(state) {
      this.state = state;
      this.disposables = new CompositeDisposable();
      ['up', 'right', 'down', 'left'].forEach((function(_this) {
        return function(direction) {
          return _this.disposables.add(atom.commands.add("atom-workspace", "term3:open-split-" + direction, _this.splitTerm.bind(_this, direction)));
        };
      })(this));
      this.disposables.add(atom.commands.add("atom-workspace", "term3:open", this.newTerm.bind(this)));
      this.disposables.add(atom.commands.add("atom-workspace", "term3:pipe-path", this.pipeTerm.bind(this, 'path')));
      this.disposables.add(atom.commands.add("atom-workspace", "term3:pipe-selection", this.pipeTerm.bind(this, 'selection')));
      return atom.packages.activatePackage('tree-view').then((function(_this) {
        return function(treeViewPkg) {
          var node;
          node = new ListView();
          return treeViewPkg.mainModule.treeView.find(".tree-view-scroller").prepend(node);
        };
      })(this));
    },
    service_0_1_3: function() {
      return {
        getTerminals: this.getTerminals.bind(this),
        onTerm: this.onTerm.bind(this),
        newTerm: this.newTerm.bind(this)
      };
    },
    getTerminals: function() {
      return Terminals.map(function(t) {
        return t.term;
      });
    },
    onTerm: function(callback) {
      return this.emitter.on('term', callback);
    },
    newTerm: function(forkPTY, rows, cols, title) {
      var id, item, model, pane, subscriptions, termView;
      if (forkPTY == null) {
        forkPTY = true;
      }
      if (rows == null) {
        rows = 30;
      }
      if (cols == null) {
        cols = 80;
      }
      if (title == null) {
        title = 'tty';
      }
      termView = this.createTermView(forkPTY, rows, cols);
      pane = atom.workspace.getActivePane();
      model = Terminals.add({
        local: !!forkPTY,
        term: termView,
        title: title
      });
      subscriptions = new CompositeDisposable;
      subscriptions.add(pane.onDidChangeActiveItem(function() {
        var activeItem;
        activeItem = pane.getActiveItem();
        if (activeItem !== termView) {
          if (termView.term) {
            termView.term.constructor._textarea = null;
          }
          return;
        }
        return process.nextTick(function() {
          var atomPane;
          termView.focus();
          atomPane = activeItem.parentsUntil("atom-pane").parent()[0];
          if (termView.term) {
            return termView.term.constructor._textarea = atomPane;
          }
        });
      }));
      id = model.id;
      termView.id = id;
      subscriptions.add(termView.onExit(function() {
        return Terminals.remove(id);
      }));
      subscriptions.add(termView.onDidChangeTitle(function() {
        if (forkPTY) {
          return model.title = termView.getTitle();
        } else {
          return model.title = title + '-' + termView.getTitle();
        }
      }));
      item = pane.addItem(termView);
      pane.activateItem(item);
      subscriptions.add(pane.onWillRemoveItem((function(_this) {
        return function(itemRemoved, index) {
          if (itemRemoved.item === item) {
            item.destroy();
            Terminals.remove(id);
            _this.disposables.remove(subscriptions);
            return subscriptions.dispose();
          }
        };
      })(this)));
      this.disposables.add(subscriptions);
      return termView;
    },
    createTermView: function(forkPTY, rows, cols) {
      var editorPath, opts, termView, _base;
      if (forkPTY == null) {
        forkPTY = true;
      }
      if (rows == null) {
        rows = 30;
      }
      if (cols == null) {
        cols = 80;
      }
      opts = {
        runCommand: atom.config.get('term3.autoRunCommand'),
        shellOverride: atom.config.get('term3.shellOverride'),
        shellArguments: atom.config.get('term3.shellArguments'),
        titleTemplate: atom.config.get('term3.titleTemplate'),
        cursorBlink: atom.config.get('term3.cursorBlink'),
        fontFamily: atom.config.get('term3.fontFamily'),
        fontSize: atom.config.get('term3.fontSize'),
        colors: getColors(),
        forkPTY: forkPTY,
        rows: rows,
        cols: cols
      };
      if (opts.shellOverride) {
        opts.shell = opts.shellOverride;
      } else {
        opts.shell = process.env.SHELL || 'bash';
      }
      editorPath = keypather.get(atom, 'workspace.getEditorViews[0].getEditor().getPath()');
      opts.cwd = opts.cwd || atom.project.getPaths()[0] || editorPath || process.env.HOME;
      termView = new TermView(opts);
      termView.on('remove', this.handleRemoveTerm.bind(this));
      if (typeof (_base = this.termViews).push === "function") {
        _base.push(termView);
      }
      process.nextTick((function(_this) {
        return function() {
          return _this.emitter.emit('term', termView);
        };
      })(this));
      return termView;
    },
    splitTerm: function(direction) {
      var activePane, item, openPanesInSameSplit, pane, splitter, termView;
      openPanesInSameSplit = atom.config.get('term3.openPanesInSameSplit');
      termView = this.createTermView();
      termView.on("click", (function(_this) {
        return function() {
          termView.term.element.focus();
          termView.term.focus();
          return _this.focusedTerminal = termView;
        };
      })(this));
      direction = capitalize(direction);
      splitter = (function(_this) {
        return function() {
          var pane;
          pane = activePane["split" + direction]({
            items: [termView]
          });
          activePane.termSplits[direction] = pane;
          return _this.focusedTerminal = [pane, pane.items[0]];
        };
      })(this);
      activePane = atom.workspace.getActivePane();
      activePane.termSplits || (activePane.termSplits = {});
      if (openPanesInSameSplit) {
        if (activePane.termSplits[direction] && activePane.termSplits[direction].items.length > 0) {
          pane = activePane.termSplits[direction];
          item = pane.addItem(termView);
          pane.activateItem(item);
          return this.focusedTerminal = [pane, item];
        } else {
          return splitter();
        }
      } else {
        return splitter();
      }
    },
    pipeTerm: function(action) {
      var editor, item, pane, stream, _ref;
      editor = this.getActiveEditor();
      stream = (function() {
        switch (action) {
          case 'path':
            return editor.getBuffer().file.path;
          case 'selection':
            return editor.getSelectedText();
        }
      })();
      if (stream && this.focusedTerminal) {
        if (Array.isArray(this.focusedTerminal)) {
          _ref = this.focusedTerminal, pane = _ref[0], item = _ref[1];
          pane.activateItem(item);
        } else {
          item = this.focusedTerminal;
        }
        item.pty.write(stream.trim());
        return item.term.focus();
      }
    },
    handleRemoveTerm: function(termView) {
      return this.termViews.splice(this.termViews.indexOf(termView), 1);
    },
    deactivate: function() {
      this.termViews.forEach(function(view) {
        return view.exit();
      });
      this.termViews = [];
      return this.disposables.dispose;
    },
    serialize: function() {
      var termViewsState;
      termViewsState = this.termViews.map(function(view) {
        return view.serialize();
      });
      return {
        termViews: termViewsState
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvdGVybTMvaW5kZXguY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJHQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsaUJBQVIsQ0FEWCxDQUFBOztBQUFBLEVBRUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSx1QkFBUixDQUZYLENBQUE7O0FBQUEsRUFHQSxTQUFBLEdBQVksT0FBQSxDQUFRLHNCQUFSLENBSFosQ0FBQTs7QUFBQSxFQUlDLFVBQVksT0FBQSxDQUFRLFdBQVIsRUFBWixPQUpELENBQUE7O0FBQUEsRUFLQSxTQUFBLEdBQWdCLE9BQUEsQ0FBUSxXQUFSLENBQUgsQ0FBQSxDQUxiLENBQUE7O0FBQUEsRUFNQyxzQkFBdUIsT0FBQSxDQUFRLFdBQVIsRUFBdkIsbUJBTkQsQ0FBQTs7QUFBQSxFQVFBLFVBQUEsR0FBYSxTQUFDLEdBQUQsR0FBQTtXQUFRLEdBQUksQ0FBQSxDQUFBLENBQUUsQ0FBQyxXQUFQLENBQUEsQ0FBQSxHQUF1QixHQUFJLFNBQUksQ0FBQyxXQUFULENBQUEsRUFBL0I7RUFBQSxDQVJiLENBQUE7O0FBQUEsRUFVQSxTQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsUUFBQSx3T0FBQTtBQUFBLElBQUEsT0FNSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBWixDQUFtQixjQUFuQixDQUFELENBQW9DLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FOM0MsRUFDRSxtQkFBQSxXQURGLEVBQ2UsaUJBQUEsU0FEZixFQUMwQixtQkFBQSxXQUQxQixFQUN1QyxvQkFBQSxZQUR2QyxFQUVFLGtCQUFBLFVBRkYsRUFFYyxvQkFBQSxZQUZkLEVBRTRCLGtCQUFB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

//# sourceURL=/Users/doot/.atom/packages/term3/index.coffee
