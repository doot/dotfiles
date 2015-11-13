(function() {
  var CompositeDisposable, PPError, PanelView, Watch, jQuery, loophole, path, _,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  path = require('path');

  _ = require('lodash');

  CompositeDisposable = require('atom').CompositeDisposable;

  jQuery = require('jquery');

  loophole = require('loophole');

  PPError = function(name, message) {
    this.name = name;
    this.message = message;
  };

  PPError.prototype = new Error();

  PanelView = require('./panel-view');

  Watch = require('./watch');

  module.exports = {
    config: require('./config'),
    toggleLive: function() {
      atom.config.set('preview-plus.livePreview', !atom.config.get('preview-plus.livePreview'));
      return this.previewStatus.live.toggleClass('on');
    },
    toggleHTML: function() {
      var editor, key;
      atom.config.set('preview-plus.htmlp', !atom.config.get('preview-plus.htmlp'));
      if (editor = atom.workspace.getActiveTextEditor()) {
        key = this.getGrammar(editor);
        if (atom.config.get('preview-plus.htmlp')) {
          if (__indexOf.call(this.config[key]["enum"], 'htmlp') >= 0) {
            return this.previewStatus.updateCompileTo('htmlp');
          }
        } else {
          return this.previewStatus.updateCompileTo(atom.config.get("preview-plus." + key));
        }
      }
    },
    showConfig: function() {
      var fileName;
      fileName = "" + __dirname + "/config.coffee";
      return atom.workspace.open(fileName, {
        searchAllPanes: true
      });
    },
    updateProject: function() {
      var projectPath, _base, _base1, _base2, _ref;
      this.project = ((_ref = this.state) != null ? _ref.projectState : void 0) || {};
      projectPath = atom.project.getPaths()[0];
      this.cproject = (_base = this.project)[projectPath] != null ? _base[projectPath] : _base[projectPath] = {};
      if ((_base1 = this.cproject).base == null) {
        _base1.base = projectPath;
      }
      if ((_base2 = this.cproject).url == null) {
        _base2.url = 'http://localhost';
      }
      return this.srcdir = __dirname;
    },
    consumeStatusBar: function(statusBar) {
      var StatusView, activePane;
      this.statusBar = statusBar;
      StatusView = require('./status-view').StatusView;
      this.previewStatus = new StatusView(this);
      activePane = atom.workspace.getActivePaneItem();
      return this.previewStatus.setCompilesTo(activePane);
    },
    activate: function(state) {
      var contextMenu, idx, itemSets;
      this.state = state;
      this.updateProject();
      atom.project.onDidChangePaths(this.updateProject);
      atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(activePane) {
          var subscribe, _ref;
          if (!activePane) {
            return;
          }
          if ((_ref = _this.previewStatus) != null) {
            _ref.setCompilesTo(activePane);
          }
          if (typeof subscribe !== "undefined" && subscribe !== null) {
            if (typeof subscribe.dispose === "function") {
              subscribe.dispose();
            }
          }
          return subscribe = typeof activePane.onDidChangeGrammar === "function" ? activePane.onDidChangeGrammar(function(grammar) {
            var _ref1;
            return (_ref1 = _this.previewStatus) != null ? _ref1.setCompilesTo(activePane) : void 0;
          }) : void 0;
        };
      })(this));
      atom.config.onDidChange('preview-plus.livePreview', (function(_this) {
        return function(obj) {
          var editor, editors, _i, _len;
          if (obj.newValue) {

          } else {
            _this.subscriptions.dispose();
            _this.subscriptions = new CompositeDisposable();
            _this.liveEditors = [];
          }
          editors = atom.workspace.getTextEditors();
          for (_i = 0, _len = editors.length; _i < _len; _i++) {
            editor = editors[_i];
            if (editor['preview-plus.livePreview'] != null) {
              editor['preview-plus.livePreview'] = obj.newValue;
            }
          }
          if (atom.workspace.getActiveTextEditor()) {
            if (obj.newValue) {
              _this.previewStatus.live.removeClass('off');
              return _this.toggle();
            } else {
              return _this.previewStatus.live.addClass('off');
            }
          }
        };
      })(this));
      atom.commands.add('atom-workspace', {
        'preview-plus:base': (function(_this) {
          return function() {
            return _this.base();
          };
        })(this)
      });
      atom.commands.add('atom-workspace', {
        'preview-plus:preview': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      });
      atom.commands.add('atom-workspace', {
        'preview-plus:toggleLive': (function(_this) {
          return function() {
            return _this.toggleLive();
          };
        })(this)
      });
      atom.commands.add('atom-workspace', {
        'preview-plus:toggleHTML': (function(_this) {
          return function() {
            return _this.toggleHTML();
          };
        })(this)
      });
      atom.commands.add('atom-workspace', {
        'preview-plus:config': (function(_this) {
          return function() {
            return _this.showConfig();
          };
        })(this)
      });
      this.liveEditors = this.views = [];
      this.subscriptions = new CompositeDisposable();
      idx = null;
      itemSets = atom.contextMenu.itemSets;
      contextMenu = _.find(itemSets, function(item, itemIdx) {
        var _ref;
        idx = itemIdx;
        return ((_ref = item.items[0]) != null ? _ref.command : void 0) === 'preview-plus:preview';
      });
      if (contextMenu != null) {
        itemSets.splice(idx, 1);
        itemSets.unshift(contextMenu);
      }
      return atom.contextMenu.itemSets = itemSets;
    },
    base: function() {
      var HTMLBaseView;
      if (this.htmlBaseView) {
        return this.htmlBaseView.parent().show();
      } else {
        HTMLBaseView = require('./htmlbase');
        this.htmlBaseView = new HTMLBaseView(this);
        atom.workspace.addModalPanel({
          item: this.htmlBaseView
        });
        return this.htmlBaseView.base.focus();
      }
    },
    toggle: function(opts) {
      var cfgs, compiled, data, dfd, e, ed, editor, editors, error, first_line, fpath, lang, liveSubscription, options, text, to, _i, _len, _ref;
      if (opts == null) {
        opts = {};
      }
      try {
        editor = null;
        if (opts.filePath) {
          editors = atom.workspace.getEditors();
          for (_i = 0, _len = editors.length; _i < _len; _i++) {
            ed = editors[_i];
            if (ed.getUri() === filePath) {
              editor = ed;
            }
          }
        } else {
          editor = atom.workspace.getActiveTextEditor();
        }
        if (!editor) {
          return;
        }
        _ref = this.getText(editor), text = _ref.text, fpath = _ref.fpath;
        cfgs = atom.config.get('preview-plus');
        if (editor['preview-plus.livePreview'] && !(__indexOf.call(this.liveEditors, editor) >= 0)) {
          this.liveEditors.push(editor);
          editor.buffer.stoppedChangingDelay = cfgs['liveMilliseconds'];
          liveSubscription = editor.onDidStopChanging(this.listen);
          editor['preview-plus.livePreview-subscription'] = liveSubscription;
          this.subscriptions.add(liveSubscription);
        }
        this.key = this.getGrammar(editor);
        this.toKey = this.getCompileTo(editor, this.key);
        if (typeof this.toKey !== 'string') {
          return;
        }
        to = this.config[this.key][this.toKey];
        lang = require("./lang/" + this.key);
        data = this.getContent('data', text);
        options = this.getContent('options', text);
        if (to.options instanceof Array && options) {
          to.options = _.union(to.options, options);
        } else {
          to.options = jQuery.extend(to.options, options);
        }
        compiled = lang[to.compile](fpath, text, to.options, data);
        if (typeof compiled === 'string') {
          return this.preview(editor, fpath, compiled);
        } else {
          dfd = compiled;
          dfd.done((function(_this) {
            return function(text) {
              if (_this.compiled = text) {
                return _this.preview(editor, fpath, text);
              }
            };
          })(this));
          return dfd.fail(function(text) {
            var e;
            e = new Error();
            e.name = 'console';
            e.message = text;
            throw e;
          });
        }
      } catch (_error) {
        e = _error;
        console.log(e.message);
        if (e.name === 'alert') {
          return alert(e.message);
        } else {
          if (e.location) {
            first_line = e.location.first_line;
            error = text.split('\n').slice(0, first_line).join('\n');
          }
          error += '\n' + e.toString().split('\n').slice(1).join('\n') + '\n' + e.message;
          return this.preview(editor, fpath, error, true);
        }
      }
    },
    getContent: function(tag, text) {
      var data, match, regex;
      regex = new RegExp("<pp-" + tag + ">([\\s\\S]*?)</pp-" + tag + ">");
      match = text.match(regex);
      if ((match != null) && match[1].trim()) {
        return data = loophole.allowUnsafeEval(function() {
          return eval("(" + match[1] + ")");
        });
      }
    },
    preview: function(editor, fpath, text, err) {
      var activePane, ext, grammar, split, syntax, title, to, _ref;
      if (err == null) {
        err = false;
      }
      activePane = atom.workspace.paneForItem(editor);
      split = this.getPosition(editor);
      to = (_ref = this.config[this.key]) != null ? _ref[this.toKey] : void 0;
      if (!to) {
        return atom.confirm('Cannot Preview');
      }
      ext = err ? "" + to.ext + ".err" : to.ext;
      if (this.toKey === 'htmlp') {
        if (text) {
          title = "browser-plus:///" + ((editor.getPath() || editor.getTitle()).replace(/\\/g, "/")) + ".htmlp";
        } else {
          fpath = fpath.replace(/\\/g, "/");
          title = "file:///" + fpath;
        }
      } else if (this.toKey === 'htmlu') {
        if (!text) {
          return;
        }
        title = text;
        text = null;
      } else {
        title = "preview~" + (editor.getTitle()) + "." + ext;
      }
      grammar = to && !err ? to.ext : syntax = editor.getGrammar();
      if (syntax == null) {
        syntax = atom.grammars.selectGrammar(grammar);
      }
      if (!err && editor.getSelectedText() && this.toKey !== 'htmlp') {
        if (this.panelItem) {
          return this.panelItem.showPanel(text, syntax);
        } else {
          this.panelItem = new PanelView(title, text, syntax);
          return atom.workspace.addBottomPanel({
            item: this.panelItem
          });
        }
      } else {
        return atom.workspace.open(title, {
          searchAllPanes: true,
          split: split,
          src: text
        }).then((function(_this) {
          return function(view) {
            var compiledPane, errView, subscription, uri, _ref1;
            _this.view = view;
            if (!((_ref1 = _this.view.pp) != null ? _ref1.orgURI : void 0)) {
              _this.view.save = function() {};
              _this.view.pp = {};
              _this.view.pp.orgURI = editor.getURI();
              if (_this.cproject.watch && !_this.watcher) {
                _this.watcher = new Watch(_this.cproject.watch);
              }
              _this.view.disposables.add(editor.onDidDestroy(function() {
                return _this.view.destroy();
              }));
              if (_this.watcher) {
                subscription = _this.view.disposables.add(_this.watcher.onDidChange(function() {
                  return _this.toggle({
                    filePath: _this.view.pp.orgURI
                  });
                }));
              }
              _this.views.push(_this.view);
            }
            if (_this.key === 'html' && !text) {

            } else {
              _this.view.setText(text);
            }
            if (ext === 'htmlp') {
              console.log(text);
            } else {
              _this.view.setGrammar(syntax);
              _this.view.moveToTop();
            }
            compiledPane = atom.workspace.getActivePane();
            uri = _this.view.getURI();
            if (path.extname(title) === '.err') {
              uri = uri.replace('.err', '');
              errView = compiledPane.itemForURI(uri);
            } else {
              errView = compiledPane.itemForURI("" + uri + ".err");
            }
            if (errView) {
              errView.destroy();
            }
            if (_this.view.get('preview-plus.cursorFocusBack') || atom.config.get('preview-plus.cursorFocusBack')) {
              return activePane.activate();
            }
          };
        })(this));
      }
    },
    getUrl: function(editor) {
      var text, url;
      text = editor.lineForScreenRow(editor.getCursor().getScreenRow()).text;
      url = this.getTextTag('pp-url', text) || this.getTextTag('pp-url', editor.getText()) || path.basename(editor.getPath());
      return "" + this.cproject.url + "/" + url;
    },
    getTextTag: function(tag, text) {
      var match, regex;
      regex = new RegExp("<" + tag + ">([\\s\\S]*?)</" + tag + ">");
      match = text.match(regex);
      if (match != null) {
        return match[1].trim();
      }
    },
    deactivate: function() {
      return this.previewStatus.destroy();
    },
    serialize: function() {
      var view, viewState, _i, _len, _ref;
      viewState = [];
      _ref = this.views;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        view = _ref[_i];
        if (typeof view.serialize === "function" ? view.serialize() : void 0) {
          viewState.push;
        }
      }
      return {
        previewState: this.previewStatus.serialize(),
        viewState: viewState,
        projectState: this.project
      };
    },
    listen: function() {
      var textEditor, view;
      textEditor = atom.workspace.getActiveTextEditor();
      if (textEditor) {
        view = atom.views.getView(textEditor);
        if (view) {
          return atom.commands.dispatch(view, 'preview-plus:preview');
        }
      }
    },
    getGrammar: function(editor) {
      var cfg, editorPath, ext, grammar, key;
      grammar = typeof editor.getGrammar === "function" ? editor.getGrammar() : void 0;
      if (!grammar) {
        return false;
      }
      key = null;
      cfg = _.find(this.config, function(val, k) {
        key = k;
        return (val.name != null) && val.name === grammar.name;
      });
      if (cfg == null) {
        cfg = _.find(this.config, function(val, k) {
          var _ref;
          key = k;
          return (val.alias != null) && (_ref = grammar.name, __indexOf.call(val.alias, _ref) >= 0);
        });
      }
      if (!cfg) {
        editorPath = editor.getPath();
        ext = path.extname(editorPath).slice(1);
      }
      if (cfg == null) {
        cfg = _.find(this.config, function(val, k) {
          key = k;
          return (val.fileTypes != null) && __indexOf.call(val.fileTypes, ext) >= 0;
        });
      }
      if (cfg == null) {
        cfg = _.find(this.config, function(val, k) {
          var regx;
          key = k;
          regx = new RegExp(grammar.name, "gi");
          if ((val.name != null) && val.name.search(regx) >= 0) {
            return true;
          }
        });
      }
      if (cfg) {
        return key;
      } else {
        throw new PPError('alert', 'Set the Grammar for the Editor');
      }
    },
    getPosition: function(editor) {
      var activePane, orientation, paneAxis, paneIndex, _ref;
      activePane = atom.workspace.paneForItem(editor);
      paneAxis = activePane.getParent();
      paneIndex = paneAxis.getPanes().indexOf(activePane);
      orientation = (_ref = paneAxis.orientation) != null ? _ref : 'horizontal';
      if (orientation === 'horizontal') {
        if (paneIndex === 0) {
          return 'right';
        } else {
          return 'left';
        }
      } else {
        if (paneIndex === 0) {
          return 'down';
        } else {
          return 'top';
        }
      }
    },
    getCompileTo: function(editor, key) {
      var toKey;
      if (!(toKey = editor['preview-plus.compileTo'])) {
        toKey = atom.config.get("preview-plus." + key);
        editor['preview-plus.compileTo'] = toKey;
      }
      return toKey || (function() {
        throw new PPError('alert', 'Cannot Preview');
      })();
    },
    getText: function(editor) {
      var fpath, selected, text;
      selected = editor.getSelectedText();
      if (!(selected || editor['preview-plus.livePreview'])) {
        fpath = editor.getPath();
      }
      text = selected || editor.getText();
      if (text.length === 0 || !text.trim()) {
        throw new PPError('alert', 'No Code to Compile');
      } else {
        return {
          text: text,
          fpath: fpath
        };
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcHJldmlldy1wbHVzL2xpYi9wcmV2aWV3LXBsdXMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlFQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBREosQ0FBQTs7QUFBQSxFQUVDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFGRCxDQUFBOztBQUFBLEVBR0EsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBSFQsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsR0FBVyxPQUFBLENBQVEsVUFBUixDQUpYLENBQUE7O0FBQUEsRUFLQSxPQUFBLEdBQVUsU0FBRSxJQUFGLEVBQVEsT0FBUixHQUFBO0FBQWlCLElBQWhCLElBQUMsQ0FBQSxPQUFBLElBQWUsQ0FBQTtBQUFBLElBQVYsSUFBQyxDQUFBLFVBQUEsT0FBUyxDQUFqQjtFQUFBLENBTFYsQ0FBQTs7QUFBQSxFQU1BLE9BQU8sQ0FBQyxTQUFSLEdBQXdCLElBQUEsS0FBQSxDQUFBLENBTnhCLENBQUE7O0FBQUEsRUFPQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FQWixDQUFBOztBQUFBLEVBUUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSLENBUlIsQ0FBQTs7QUFBQSxFQVVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFBUSxPQUFBLENBQVEsVUFBUixDQUFSO0FBQUEsSUFFQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMEJBQWhCLEVBQTRDLENBQUEsSUFBSyxDQUFDLE1BQU0sQ0FB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

//# sourceURL=/Users/doot/.atom/packages/preview-plus/lib/preview-plus.coffee
