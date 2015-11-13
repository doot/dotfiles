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
            return "-l";
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
      if (!process.env.LANG) {
        console.warn("Term3: LANG environment variable is not set. Fancy characters (å, ñ, ó, etc`) may be corrupted. The only work-around is to quit Atom and run `atom` from your shell.");
      }
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvdGVybTMvaW5kZXguY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJHQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsaUJBQVIsQ0FEWCxDQUFBOztBQUFBLEVBRUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSx1QkFBUixDQUZYLENBQUE7O0FBQUEsRUFHQSxTQUFBLEdBQVksT0FBQSxDQUFRLHNCQUFSLENBSFosQ0FBQTs7QUFBQSxFQUlDLFVBQVksT0FBQSxDQUFRLFdBQVIsRUFBWixPQUpELENBQUE7O0FBQUEsRUFLQSxTQUFBLEdBQWdCLE9BQUEsQ0FBUSxXQUFSLENBQUgsQ0FBQSxDQUxiLENBQUE7O0FBQUEsRUFNQyxzQkFBdUIsT0FBQSxDQUFRLFdBQVIsRUFBdkIsbUJBTkQsQ0FBQTs7QUFBQSxFQVFBLFVBQUEsR0FBYSxTQUFDLEdBQUQsR0FBQTtXQUFRLEdBQUksQ0FBQSxDQUFBLENBQUUsQ0FBQyxXQUFQLENBQUEsQ0FBQSxHQUF1QixHQUFJLFNBQUksQ0FBQyxXQUFULENBQUEsRUFBL0I7RUFBQSxDQVJiLENBQUE7O0FBQUEsRUFVQSxTQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsUUFBQSx3T0FBQTtBQUFBLElBQUEsT0FNSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBWixDQUFtQixjQUFuQixDQUFELENBQW9DLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FOM0MsRUFDRSxtQkFBQSxXQURGLEVBQ2UsaUJBQUEsU0FEZixFQUMwQixtQkFBQSxXQUQxQixFQUN1QyxvQkFBQSxZQUR2QyxFQUVFLGtCQUFBLFVBRkYsRUFFYyxvQkFBQSxZQUZkLEVBRTRCLGtCQUFBLFVBRjVCLEVBRXdDLG1CQUFBLFdBRnhDLEVBR0UsbUJBQUEsV0FIRixFQUdlLGlCQUFBLFNBSGYsRUFHMEIsbUJBQUEsV0FIMUIsRUFHdUMsb0JBQUEsWUFIdkMsRUFJRSxrQkFBQSxVQUpGLEVBSWMsb0JBQUEsWUFKZCxFQUk0QixrQkFBQSxVQUo1QixFQUl3QyxtQkFBQSxXQUp4QyxFQUtFLGtCQUFBLFVBTEYsRUFLYyxrQkFBQSxVQUxkLENBQUE7V0FPQSxDQUNFLFdBREYsRUFDZSxTQURmLEVBQzBCLFdBRDFCLEVBQ3VDLFlBRHZDLEVBRUUsVUFGRixFQUVjLFlBRmQsRUFFNEIsVUFGNUIsRUFFd0MsV0FGeEMsRUFHRSxXQUhGLEVBR2UsU0FIZixFQUcwQixXQUgxQixFQUd1QyxZQUh2QyxFQUlFLFVBSkYsRUFJYyxZQUpkLEVBSTRCLFVBSjVCLEVBSXdDLFdBSnhDLEVBS0UsVUFMRixFQUtjLFVBTGQsQ0FNQyxDQUFDLEdBTkYsQ0FNTSxTQUFDLEtBQUQsR0FBQTthQUFXLEtBQUssQ0FBQyxXQUFOLENBQUEsRUFBWDtJQUFBLENBTk4sRUFSVTtFQUFBLENBVlosQ0FBQTs7QUFBQSxFQTBCQSxNQUFBLEdBQ0U7QUFBQSxJQUFBLGNBQUEsRUFDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxNQUNBLFNBQUEsRUFBUyxFQURUO0tBREY7QUFBQSxJQUdBLGFBQUEsRUFDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxNQUNBLFNBQUEsRUFBUywyQkFEVDtLQUpGO0FBQUEsSUFNQSxVQUFBLEVBQ0U7QUFBQSxNQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsTUFDQSxTQUFBLEVBQVMsRUFEVDtLQVBGO0FBQUEsSUFTQSxRQUFBLEVBQ0U7QUFBQSxNQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsTUFDQSxTQUFBLEVBQVMsRUFEVDtLQVZGO0FBQUEsSUFZQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsTUFDQSxVQUFBLEVBQ0U7QUFBQSxRQUFBLFdBQUEsRUFDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLE9BQU47QUFBQSxVQUNBLFNBQUEsRUFBUyxTQURUO1NBREY7QUFBQSxRQUdBLFNBQUEsRUFDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLE9BQU47QUFBQSxVQUNBLFNBQUEsRUFBUyxTQURUO1NBSkY7QUFBQSxRQU1BLFdBQUEsRUFDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLE9BQU47QUFBQSxVQUNBLFNBQUEsRUFBUyxTQURUO1NBUEY7QUFBQSxRQVNBLFlBQUEsRUFDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLE9BQU47QUFBQSxVQUNBLFNBQUEsRUFBUyxTQURUO1NBVkY7QUFBQSxRQVlBLFVBQUEsRUFDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLE9BQU47QUFBQSxVQUNBLFNBQUEsRUFBUyxTQURUO1NBYkY7QUFBQSxRQWVBLFlBQUEsRUFDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLE9BQU47QUFBQSxVQUNBLFNBQUEsRUFBUyxTQURUO1NBaEJGO0FBQUEsUUFrQkEsVUFBQSxFQUNFO0FBQUEsVUFBQSxJQUFBLEVBQU0sT0FBTjtBQUFBLFVBQ0EsU0FBQSxFQUFTLFNBRFQ7U0FuQkY7QUFBQSxRQXFCQSxXQUFBLEVBQ0U7QUFBQSxVQUFBLElBQUEsRUFBTSxPQUFOO0FBQUEsVUFDQSxTQUFBLEVBQVMsU0FEVDtTQXRCRjtBQUFBLFFBd0JBLFdBQUEsRUFDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLE9BQU47QUFBQSxVQUNBLFNBQUEsRUFBUyxTQURUO1NBekJGO0FBQUEsUUEyQkEsU0FBQSxFQUNFO0FBQUEsVUFBQSxJQUFBLEVBQU0sT0FBTjtBQUFBLFVBQ0EsU0FBQSxFQUFTLFNBRFQ7U0E1QkY7QUFBQSxRQThCQSxXQUFBLEVBQ0U7QUFBQSxVQUFBLElBQUEsRUFBTSxPQUFOO0FBQUEsVUFDQSxTQUFBLEVBQVMsU0FEVDtTQS9CRjtBQUFBLFFBaUNBLFlBQUEsRUFDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLE9BQU47QUFBQSxVQUNBLFNBQUEsRUFBUyxTQURUO1NBbENGO0FBQUEsUUFvQ0EsVUFBQSxFQUNFO0FBQUEsVUFBQSxJQUFBLEVBQU0sT0FBTjtBQUFBLFVBQ0EsU0FBQSxFQUFTLFNBRFQ7U0FyQ0Y7QUFBQSxRQXVDQSxZQUFBLEVBQ0U7QUFBQSxVQUFBLElBQUEsRUFBTSxPQUFOO0FBQUEsVUFDQSxTQUFBLEVBQVMsU0FEVDtTQXhDRjtBQUFBLFFBMENBLFVBQUEsRUFDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLE9BQU47QUFBQSxVQUNBLFNBQUEsRUFBUyxTQURUO1NBM0NGO0FBQUEsUUE2Q0EsV0FBQSxFQUNFO0FBQUEsVUFBQSxJQUFBLEVBQU0sT0FBTjtBQUFBLFVBQ0EsU0FBQSxFQUFTLFNBRFQ7U0E5Q0Y7QUFBQSxRQWdEQSxVQUFBLEVBQ0U7QUFBQSxVQUFBLElBQUEsRUFBTSxPQUFOO0FBQUEsVUFDQSxTQUFBLEVBQVMsU0FEVDtTQWpERjtBQUFBLFFBbURBLFVBQUEsRUFDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLE9BQU47QUFBQSxVQUNBLFNBQUEsRUFBUyxTQURUO1NBcERGO09BRkY7S0FiRjtBQUFBLElBcUVBLFVBQUEsRUFDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxNQUNBLFNBQUEsRUFBUyxJQURUO0tBdEVGO0FBQUEsSUF3RUEsV0FBQSxFQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLE1BQ0EsU0FBQSxFQUFTLElBRFQ7S0F6RUY7QUFBQSxJQTJFQSxhQUFBLEVBQ0U7QUFBQSxNQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsTUFDQSxTQUFBLEVBQVMsRUFEVDtLQTVFRjtBQUFBLElBOEVBLGNBQUEsRUFDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxNQUNBLFNBQUEsRUFBWSxDQUFBLFNBQUMsSUFBRCxHQUFBO0FBQ1YsWUFBQSxXQUFBO0FBQUEsUUFEWSxhQUFBLE9BQU8sWUFBQSxJQUNuQixDQUFBO0FBQUEsZ0JBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBYyxLQUFLLENBQUMsV0FBTixDQUFBLENBQWQsQ0FBUDtBQUFBLGVBQ08sTUFEUDttQkFDb0IsY0FBQSxHQUFhLENBQUMsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFWLEVBQWdCLGVBQWhCLENBQUQsRUFEakM7QUFBQSxlQUVPLEtBRlA7bUJBRW1CLEtBRm5CO0FBQUE7bUJBR08sR0FIUDtBQUFBLFNBRFU7TUFBQSxDQUFBLENBQUgsQ0FBa0IsT0FBTyxDQUFDLEdBQTFCLENBRFQ7S0EvRUY7QUFBQSxJQXFGQSxvQkFBQSxFQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLE1BQ0EsU0FBQSxFQUFTLEtBRFQ7S0F0RkY7R0EzQkYsQ0FBQTs7QUFBQSxFQW9IQSxNQUFNLENBQUMsT0FBUCxHQUVFO0FBQUEsSUFBQSxTQUFBLEVBQVcsRUFBWDtBQUFBLElBQ0EsZUFBQSxFQUFpQixLQURqQjtBQUFBLElBRUEsT0FBQSxFQUFhLElBQUEsT0FBQSxDQUFBLENBRmI7QUFBQSxJQUdBLE1BQUEsRUFBUSxNQUhSO0FBQUEsSUFJQSxXQUFBLEVBQWEsSUFKYjtBQUFBLElBTUEsUUFBQSxFQUFVLFNBQUUsS0FBRixHQUFBO0FBQ1IsTUFEUyxJQUFDLENBQUEsUUFBQSxLQUNWLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxXQUFELEdBQW1CLElBQUEsbUJBQUEsQ0FBQSxDQUFuQixDQUFBO0FBRUEsTUFBQSxJQUFBLENBQUEsT0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFuQjtBQUNFLFFBQUEsT0FBTyxDQUFDLElBQVIsQ0FBYSxzS0FBYixDQUFBLENBREY7T0FGQTtBQUFBLE1BS0EsQ0FBQyxJQUFELEVBQU8sT0FBUCxFQUFnQixNQUFoQixFQUF3QixNQUF4QixDQUErQixDQUFDLE9BQWhDLENBQXdDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLFNBQUQsR0FBQTtpQkFDdEMsS0FBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBcUMsbUJBQUEsR0FBbUIsU0FBeEQsRUFBcUUsS0FBQyxDQUFBLFNBQVMsQ0FBQyxJQUFYLENBQWdCLEtBQWhCLEVBQXNCLFNBQXRCLENBQXJFLENBQWpCLEVBRHNDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEMsQ0FMQSxDQUFBO0FBQUEsTUFRQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxZQUFwQyxFQUFrRCxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxJQUFkLENBQWxELENBQWpCLENBUkEsQ0FBQTtBQUFBLE1BU0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsaUJBQXBDLEVBQXVELElBQUMsQ0FBQSxRQUFRLENBQUMsSUFBVixDQUFlLElBQWYsRUFBcUIsTUFBckIsQ0FBdkQsQ0FBakIsQ0FUQSxDQUFBO0FBQUEsTUFVQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxzQkFBcEMsRUFBNEQsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQWUsSUFBZixFQUFxQixXQUFyQixDQUE1RCxDQUFqQixDQVZBLENBQUE7YUFZQSxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsV0FBOUIsQ0FBMEMsQ0FBQyxJQUEzQyxDQUFnRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxXQUFELEdBQUE7QUFDOUMsY0FBQSxJQUFBO0FBQUEsVUFBQSxJQUFBLEdBQVcsSUFBQSxRQUFBLENBQUEsQ0FBWCxDQUFBO2lCQUNBLFdBQVcsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQWhDLENBQXFDLHFCQUFyQyxDQUEyRCxDQUFDLE9BQTVELENBQW9FLElBQXBFLEVBRjhDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEQsRUFiUTtJQUFBLENBTlY7QUFBQSxJQXVCQSxhQUFBLEVBQWUsU0FBQSxHQUFBO2FBQ2I7QUFBQSxRQUNFLFlBQUEsRUFBYyxJQUFDLENBQUEsWUFBWSxDQUFDLElBQWQsQ0FBbUIsSUFBbkIsQ0FEaEI7QUFBQSxRQUVFLE1BQUEsRUFBUSxJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsQ0FBYSxJQUFiLENBRlY7QUFBQSxRQUdFLE9BQUEsRUFBUyxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxJQUFkLENBSFg7UUFEYTtJQUFBLENBdkJmO0FBQUEsSUE4QkEsWUFBQSxFQUFjLFNBQUEsR0FBQTthQUNaLFNBQVMsQ0FBQyxHQUFWLENBQWMsU0FBQyxDQUFELEdBQUE7ZUFDWixDQUFDLENBQUMsS0FEVTtNQUFBLENBQWQsRUFEWTtJQUFBLENBOUJkO0FBQUEsSUFrQ0EsTUFBQSxFQUFRLFNBQUMsUUFBRCxHQUFBO2FBQ04sSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksTUFBWixFQUFvQixRQUFwQixFQURNO0lBQUEsQ0FsQ1I7QUFBQSxJQXFDQSxPQUFBLEVBQVMsU0FBQyxPQUFELEVBQWUsSUFBZixFQUF3QixJQUF4QixFQUFpQyxLQUFqQyxHQUFBO0FBQ1AsVUFBQSw4Q0FBQTs7UUFEUSxVQUFRO09BQ2hCOztRQURzQixPQUFLO09BQzNCOztRQUQrQixPQUFLO09BQ3BDOztRQUR3QyxRQUFNO09BQzlDO0FBQUEsTUFBQSxRQUFBLEdBQVcsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsT0FBaEIsRUFBeUIsSUFBekIsRUFBK0IsSUFBL0IsQ0FBWCxDQUFBO0FBQUEsTUFDQSxJQUFBLEdBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FEUCxDQUFBO0FBQUEsTUFFQSxLQUFBLEdBQVEsU0FBUyxDQUFDLEdBQVYsQ0FBYztBQUFBLFFBQ3BCLEtBQUEsRUFBTyxDQUFBLENBQUMsT0FEWTtBQUFBLFFBRXBCLElBQUEsRUFBTSxRQUZjO0FBQUEsUUFHcEIsS0FBQSxFQUFPLEtBSGE7T0FBZCxDQUZSLENBQUE7QUFBQSxNQVNBLGFBQUEsR0FBZ0IsR0FBQSxDQUFBLG1CQVRoQixDQUFBO0FBQUEsTUFXQSxhQUFhLENBQUMsR0FBZCxDQUFrQixJQUFJLENBQUMscUJBQUwsQ0FBMkIsU0FBQSxHQUFBO0FBQzNDLFlBQUEsVUFBQTtBQUFBLFFBQUEsVUFBQSxHQUFhLElBQUksQ0FBQyxhQUFMLENBQUEsQ0FBYixDQUFBO0FBQ0EsUUFBQSxJQUFHLFVBQUEsS0FBYyxRQUFqQjtBQUNFLFVBQUEsSUFBRyxRQUFRLENBQUMsSUFBWjtBQUNFLFlBQUEsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBMUIsR0FBc0MsSUFBdEMsQ0FERjtXQUFBO0FBRUEsZ0JBQUEsQ0FIRjtTQURBO2VBTUEsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsU0FBQSxHQUFBO0FBQ2YsY0FBQSxRQUFBO0FBQUEsVUFBQSxRQUFRLENBQUMsS0FBVCxDQUFBLENBQUEsQ0FBQTtBQUFBLFVBS0EsUUFBQSxHQUFXLFVBQVUsQ0FBQyxZQUFYLENBQXdCLFdBQXhCLENBQW9DLENBQUMsTUFBckMsQ0FBQSxDQUE4QyxDQUFBLENBQUEsQ0FMekQsQ0FBQTtBQU1BLFVBQUEsSUFBRyxRQUFRLENBQUMsSUFBWjttQkFDRSxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUExQixHQUFzQyxTQUR4QztXQVBlO1FBQUEsQ0FBakIsRUFQMkM7TUFBQSxDQUEzQixDQUFsQixDQVhBLENBQUE7QUFBQSxNQTRCQSxFQUFBLEdBQUssS0FBSyxDQUFDLEVBNUJYLENBQUE7QUFBQSxNQTZCQSxRQUFRLENBQUMsRUFBVCxHQUFjLEVBN0JkLENBQUE7QUFBQSxNQStCQSxhQUFhLENBQUMsR0FBZCxDQUFrQixRQUFRLENBQUMsTUFBVCxDQUFnQixTQUFBLEdBQUE7ZUFDaEMsU0FBUyxDQUFDLE1BQVYsQ0FBaUIsRUFBakIsRUFEZ0M7TUFBQSxDQUFoQixDQUFsQixDQS9CQSxDQUFBO0FBQUEsTUFrQ0EsYUFBYSxDQUFDLEdBQWQsQ0FBa0IsUUFBUSxDQUFDLGdCQUFULENBQTBCLFNBQUEsR0FBQTtBQUMxQyxRQUFBLElBQUcsT0FBSDtpQkFDRSxLQUFLLENBQUMsS0FBTixHQUFjLFFBQVEsQ0FBQyxRQUFULENBQUEsRUFEaEI7U0FBQSxNQUFBO2lCQUdFLEtBQUssQ0FBQyxLQUFOLEdBQWMsS0FBQSxHQUFRLEdBQVIsR0FBYyxRQUFRLENBQUMsUUFBVCxDQUFBLEVBSDlCO1NBRDBDO01BQUEsQ0FBMUIsQ0FBbEIsQ0FsQ0EsQ0FBQTtBQUFBLE1Bd0NBLElBQUEsR0FBTyxJQUFJLENBQUMsT0FBTCxDQUFhLFFBQWIsQ0F4Q1AsQ0FBQTtBQUFBLE1BeUNBLElBQUksQ0FBQyxZQUFMLENBQWtCLElBQWxCLENBekNBLENBQUE7QUFBQSxNQTBDQSxhQUFhLENBQUMsR0FBZCxDQUFrQixJQUFJLENBQUMsZ0JBQUwsQ0FBc0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsV0FBRCxFQUFjLEtBQWQsR0FBQTtBQUN0QyxVQUFBLElBQUcsV0FBVyxDQUFDLElBQVosS0FBb0IsSUFBdkI7QUFDRSxZQUFBLElBQUksQ0FBQyxPQUFMLENBQUEsQ0FBQSxDQUFBO0FBQUEsWUFDQSxTQUFTLENBQUMsTUFBVixDQUFpQixFQUFqQixDQURBLENBQUE7QUFBQSxZQUVBLEtBQUMsQ0FBQSxXQUFXLENBQUMsTUFBYixDQUFvQixhQUFwQixDQUZBLENBQUE7bUJBR0EsYUFBYSxDQUFDLE9BQWQsQ0FBQSxFQUpGO1dBRHNDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdEIsQ0FBbEIsQ0ExQ0EsQ0FBQTtBQUFBLE1BZ0RBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixhQUFqQixDQWhEQSxDQUFBO2FBaURBLFNBbERPO0lBQUEsQ0FyQ1Q7QUFBQSxJQXlGQSxjQUFBLEVBQWdCLFNBQUMsT0FBRCxFQUFlLElBQWYsRUFBd0IsSUFBeEIsR0FBQTtBQUNkLFVBQUEsaUNBQUE7O1FBRGUsVUFBUTtPQUN2Qjs7UUFENkIsT0FBSztPQUNsQzs7UUFEc0MsT0FBSztPQUMzQztBQUFBLE1BQUEsSUFBQSxHQUNFO0FBQUEsUUFBQSxVQUFBLEVBQWdCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQkFBaEIsQ0FBaEI7QUFBQSxRQUNBLGFBQUEsRUFBZ0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHFCQUFoQixDQURoQjtBQUFBLFFBRUEsY0FBQSxFQUFnQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCLENBRmhCO0FBQUEsUUFHQSxhQUFBLEVBQWdCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixxQkFBaEIsQ0FIaEI7QUFBQSxRQUlBLFdBQUEsRUFBZ0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG1CQUFoQixDQUpoQjtBQUFBLFFBS0EsVUFBQSxFQUFnQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isa0JBQWhCLENBTGhCO0FBQUEsUUFNQSxRQUFBLEVBQWdCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQkFBaEIsQ0FOaEI7QUFBQSxRQU9BLE1BQUEsRUFBZ0IsU0FBQSxDQUFBLENBUGhCO0FBQUEsUUFRQSxPQUFBLEVBQWdCLE9BUmhCO0FBQUEsUUFTQSxJQUFBLEVBQWdCLElBVGhCO0FBQUEsUUFVQSxJQUFBLEVBQWdCLElBVmhCO09BREYsQ0FBQTtBQWFBLE1BQUEsSUFBRyxJQUFJLENBQUMsYUFBUjtBQUNJLFFBQUEsSUFBSSxDQUFDLEtBQUwsR0FBYSxJQUFJLENBQUMsYUFBbEIsQ0FESjtPQUFBLE1BQUE7QUFHSSxRQUFBLElBQUksQ0FBQyxLQUFMLEdBQWEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFaLElBQXFCLE1BQWxDLENBSEo7T0FiQTtBQUFBLE1BbUJBLFVBQUEsR0FBYSxTQUFTLENBQUMsR0FBVixDQUFjLElBQWQsRUFBb0IsbURBQXBCLENBbkJiLENBQUE7QUFBQSxNQW9CQSxJQUFJLENBQUMsR0FBTCxHQUFXLElBQUksQ0FBQyxHQUFMLElBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQXBDLElBQTBDLFVBQTFDLElBQXdELE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFwQi9FLENBQUE7QUFBQSxNQXNCQSxRQUFBLEdBQWUsSUFBQSxRQUFBLENBQVMsSUFBVCxDQXRCZixDQUFBO0FBQUEsTUF1QkEsUUFBUSxDQUFDLEVBQVQsQ0FBWSxRQUFaLEVBQXNCLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxJQUFsQixDQUF1QixJQUF2QixDQUF0QixDQXZCQSxDQUFBOzthQXlCVSxDQUFDLEtBQU07T0F6QmpCO0FBQUEsTUEwQkEsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBTSxLQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxNQUFkLEVBQXNCLFFBQXRCLEVBQU47UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQixDQTFCQSxDQUFBO2FBMkJBLFNBNUJjO0lBQUEsQ0F6RmhCO0FBQUEsSUF1SEEsU0FBQSxFQUFXLFNBQUMsU0FBRCxHQUFBO0FBQ1QsVUFBQSxnRUFBQTtBQUFBLE1BQUEsb0JBQUEsR0FBdUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRCQUFoQixDQUF2QixDQUFBO0FBQUEsTUFDQSxRQUFBLEdBQVcsSUFBQyxDQUFBLGNBQUQsQ0FBQSxDQURYLENBQUE7QUFBQSxNQUVBLFFBQVEsQ0FBQyxFQUFULENBQVksT0FBWixFQUFxQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBSW5CLFVBQUEsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBdEIsQ0FBQSxDQUFBLENBQUE7QUFBQSxVQUNBLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBZCxDQUFBLENBREEsQ0FBQTtpQkFHQSxLQUFDLENBQUEsZUFBRCxHQUFtQixTQVBBO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckIsQ0FGQSxDQUFBO0FBQUEsTUFVQSxTQUFBLEdBQVksVUFBQSxDQUFXLFNBQVgsQ0FWWixDQUFBO0FBQUEsTUFZQSxRQUFBLEdBQVcsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNULGNBQUEsSUFBQTtBQUFBLFVBQUEsSUFBQSxHQUFPLFVBQVcsQ0FBQyxPQUFBLEdBQU8sU0FBUixDQUFYLENBQWdDO0FBQUEsWUFBQSxLQUFBLEVBQU8sQ0FBQyxRQUFELENBQVA7V0FBaEMsQ0FBUCxDQUFBO0FBQUEsVUFDQSxVQUFVLENBQUMsVUFBVyxDQUFBLFNBQUEsQ0FBdEIsR0FBbUMsSUFEbkMsQ0FBQTtpQkFFQSxLQUFDLENBQUEsZUFBRCxHQUFtQixDQUFDLElBQUQsRUFBTyxJQUFJLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBbEIsRUFIVjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBWlgsQ0FBQTtBQUFBLE1BaUJBLFVBQUEsR0FBYSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQWpCYixDQUFBO0FBQUEsTUFrQkEsVUFBVSxDQUFDLGVBQVgsVUFBVSxDQUFDLGFBQWUsR0FsQjFCLENBQUE7QUFtQkEsTUFBQSxJQUFHLG9CQUFIO0FBQ0UsUUFBQSxJQUFHLFVBQVUsQ0FBQyxVQUFXLENBQUEsU0FBQSxDQUF0QixJQUFxQyxVQUFVLENBQUMsVUFBVyxDQUFBLFNBQUEsQ0FBVSxDQUFDLEtBQUssQ0FBQyxNQUF2QyxHQUFnRCxDQUF4RjtBQUNFLFVBQUEsSUFBQSxHQUFPLFVBQVUsQ0FBQyxVQUFXLENBQUEsU0FBQSxDQUE3QixDQUFBO0FBQUEsVUFDQSxJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSxRQUFiLENBRFAsQ0FBQTtBQUFBLFVBRUEsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsSUFBbEIsQ0FGQSxDQUFBO2lCQUdBLElBQUMsQ0FBQSxlQUFELEdBQW1CLENBQUMsSUFBRCxFQUFPLElBQVAsRUFKckI7U0FBQSxNQUFBO2lCQU1FLFFBQUEsQ0FBQSxFQU5GO1NBREY7T0FBQSxNQUFBO2VBU0UsUUFBQSxDQUFBLEVBVEY7T0FwQlM7SUFBQSxDQXZIWDtBQUFBLElBc0pBLFFBQUEsRUFBVSxTQUFDLE1BQUQsR0FBQTtBQUNSLFVBQUEsZ0NBQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxJQUFDLENBQUEsZUFBRCxDQUFBLENBQVQsQ0FBQTtBQUFBLE1BQ0EsTUFBQTtBQUFTLGdCQUFPLE1BQVA7QUFBQSxlQUNGLE1BREU7bUJBRUwsTUFBTSxDQUFDLFNBQVAsQ0FBQSxDQUFrQixDQUFDLElBQUksQ0FBQyxLQUZuQjtBQUFBLGVBR0YsV0FIRTttQkFJTCxNQUFNLENBQUMsZUFBUCxDQUFBLEVBSks7QUFBQTtVQURULENBQUE7QUFPQSxNQUFBLElBQUcsTUFBQSxJQUFXLElBQUMsQ0FBQSxlQUFmO0FBQ0UsUUFBQSxJQUFHLEtBQUssQ0FBQyxPQUFOLENBQWMsSUFBQyxDQUFBLGVBQWYsQ0FBSDtBQUNFLFVBQUEsT0FBZSxJQUFDLENBQUEsZUFBaEIsRUFBQyxjQUFELEVBQU8sY0FBUCxDQUFBO0FBQUEsVUFDQSxJQUFJLENBQUMsWUFBTCxDQUFrQixJQUFsQixDQURBLENBREY7U0FBQSxNQUFBO0FBSUUsVUFBQSxJQUFBLEdBQU8sSUFBQyxDQUFBLGVBQVIsQ0FKRjtTQUFBO0FBQUEsUUFNQSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQVQsQ0FBZSxNQUFNLENBQUMsSUFBUCxDQUFBLENBQWYsQ0FOQSxDQUFBO2VBT0EsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFWLENBQUEsRUFSRjtPQVJRO0lBQUEsQ0F0SlY7QUFBQSxJQXdLQSxnQkFBQSxFQUFrQixTQUFDLFFBQUQsR0FBQTthQUNoQixJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBa0IsSUFBQyxDQUFBLFNBQVMsQ0FBQyxPQUFYLENBQW1CLFFBQW5CLENBQWxCLEVBQWdELENBQWhELEVBRGdCO0lBQUEsQ0F4S2xCO0FBQUEsSUEyS0EsVUFBQSxFQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxPQUFYLENBQW1CLFNBQUMsSUFBRCxHQUFBO2VBQVUsSUFBSSxDQUFDLElBQUwsQ0FBQSxFQUFWO01BQUEsQ0FBbkIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsU0FBRCxHQUFhLEVBRGIsQ0FBQTthQUVBLElBQUMsQ0FBQSxXQUFXLENBQUMsUUFISjtJQUFBLENBM0tYO0FBQUEsSUFnTEEsU0FBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLFVBQUEsY0FBQTtBQUFBLE1BQUEsY0FBQSxHQUFpQixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQWYsQ0FBbUIsU0FBQyxJQUFELEdBQUE7ZUFBUyxJQUFJLENBQUMsU0FBTCxDQUFBLEVBQVQ7TUFBQSxDQUFuQixDQUFqQixDQUFBO2FBQ0E7QUFBQSxRQUFDLFNBQUEsRUFBVyxjQUFaO1FBRlE7SUFBQSxDQWhMVjtHQXRIRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/term3/index.coffee
