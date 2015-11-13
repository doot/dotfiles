(function() {
  var $, BrowserView, CompilerView, SelectListView, StatusView, View, exec, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('atom-space-pen-views'), View = _ref.View, SelectListView = _ref.SelectListView;

  exec = require('child_process').exec;

  $ = require('jquery');

  CompilerView = (function(_super) {
    __extends(CompilerView, _super);

    function CompilerView() {
      return CompilerView.__super__.constructor.apply(this, arguments);
    }

    CompilerView.prototype.initialize = function(items, statusView, item) {
      var compileTo, _ref1;
      this.statusView = statusView;
      CompilerView.__super__.initialize.apply(this, arguments);
      this.addClass('overlay from-top');
      this.setItems(items);
      atom.workspace.addModalPanel({
        item: this
      });
      this.focusFilterEditor();
      if (((_ref1 = this.statusView.compileTo.children()) != null ? _ref1.length : void 0) > 0) {
        return this.selectItemView(this.list.find("li").has('span'));
      } else {
        compileTo = this.statusView.compileTo.text();
        return this.selectItemView(this.list.find("li:contains('" + compileTo + "')"));
      }
    };

    CompilerView.prototype.viewForItem = function(item) {
      var $li;
      if (typeof item === 'string') {
        return "<li>" + item + "</li>";
      } else {
        $li = $('<li></li>').append(item.element);
        return $li.data('selectList', this);
      }
    };

    CompilerView.prototype.confirmed = function(item) {
      this.statusView.updateCompileTo(item);
      if (typeof item === 'string') {
        return this.cancel();
      }
    };

    CompilerView.prototype.cancelled = function() {
      return this.parent().remove();
    };

    return CompilerView;

  })(SelectListView);

  BrowserView = (function(_super) {
    __extends(BrowserView, _super);

    function BrowserView() {
      return BrowserView.__super__.constructor.apply(this, arguments);
    }

    BrowserView.prototype.initialize = function(model) {
      this.model = model;
      return this.browser = this.model.config.browser[process.platform];
    };

    BrowserView.content = function() {
      return this.span({
        "class": 'icon-browser-plus',
        click: 'openBrowser'
      }, (function(_this) {
        return function() {
          _this.span({
            "class": "icon-chrome",
            click: 'openChrome'
          });
          _this.span({
            "class": "icon-ie",
            click: 'openIE'
          });
          _this.span({
            "class": "icon-firefox",
            click: 'openFirefox'
          });
          return _this.span({
            "class": "icon-opera",
            click: 'openOpera'
          });
        };
      })(this));
    };

    BrowserView.prototype.openChrome = function(evt) {
      var _ref1, _ref2;
      return this.open((_ref1 = this.browser) != null ? (_ref2 = _ref1.CHROME) != null ? _ref2.cmd : void 0 : void 0, evt);
    };

    BrowserView.prototype.openIE = function(evt) {
      var _ref1, _ref2;
      return this.open((_ref1 = this.browser) != null ? (_ref2 = _ref1.IE) != null ? _ref2.cmd : void 0 : void 0, evt);
    };

    BrowserView.prototype.openFirefox = function(evt) {
      var _ref1, _ref2;
      return this.open((_ref1 = this.browser) != null ? (_ref2 = _ref1.FF) != null ? _ref2.cmd : void 0 : void 0, evt);
    };

    BrowserView.prototype.openOpera = function(evt) {
      var _ref1, _ref2;
      return this.open((_ref1 = this.browser) != null ? (_ref2 = _ref1.OPERA) != null ? _ref2.cmd : void 0 : void 0, evt);
    };

    BrowserView.prototype.openBrowser = function(evt) {
      var _ref1, _ref2;
      return this.open((_ref1 = this.browser) != null ? (_ref2 = _ref1.CHROME) != null ? _ref2.cmd : void 0 : void 0, evt);
    };

    BrowserView.prototype.openSafari = function(evt) {
      var _ref1, _ref2;
      return this.open((_ref1 = this.browser) != null ? (_ref2 = _ref1.SAFARI) != null ? _ref2.cmd : void 0 : void 0, evt);
    };

    BrowserView.prototype.open = function(cmd, evt) {
      var editor, fpath, li, ls;
      if (!cmd) {
        alert('Please maintain browser commands for your OS in config');
        return false;
      }
      editor = atom.workspace.getActiveTextEditor();
      fpath = editor.getPath();
      ls = exec("" + cmd + " " + fpath);
      li = $(evt.target).closest('li');
      if (li.length > 0 && (li.data('selectList') != null)) {
        li.data('selectList').parent().remove();
      }
      return false;
    };

    return BrowserView;

  })(View);

  StatusView = (function(_super) {
    __extends(StatusView, _super);

    function StatusView() {
      return StatusView.__super__.constructor.apply(this, arguments);
    }

    StatusView.content = function() {
      return this.div({
        "class": 'preview-plus-status inline-block'
      }, (function(_this) {
        return function() {
          _this.span("Live", {
            "class": "live off ",
            outlet: "live",
            click: 'toggleLive'
          });
          _this.span({
            "class": "compileTo",
            outlet: "compileTo",
            click: 'compile'
          });
          return _this.span("▼", {
            "class": "enums",
            outlet: "enums",
            click: 'compilesTo'
          });
        };
      })(this));
    };

    StatusView.prototype.initialize = function(model) {
      this.model = model;
      this.statusBarTile = this.model.statusBar.addRightTile({
        item: this,
        priority: 9999
      });
      return this.clicks = 0;
    };

    StatusView.prototype.compilesTo = function() {
      var item, items, key, to, view;
      key = this.model.getGrammar(this.editor);
      to = this.editor['preview-plus.compileTo'];
      items = (function() {
        var _i, _len, _ref1, _results;
        _ref1 = this.model.config[key]["enum"];
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          item = _ref1[_i];
          if (view = this.model.config[key][item].view) {
            _results.push(new view(this.model));
          } else {
            _results.push(item);
          }
        }
        return _results;
      }).call(this);
      return new CompilerView(items, this, to);
    };

    StatusView.prototype.compile = function(evt) {
      var timer, _ref1;
      this.clicks++;
      if (this.clicks === 1) {
        return timer = setTimeout((function(_this) {
          return function() {
            evt.originalEvent.target.getClass;
            _this.clicks = 0;
            return _this.model.toggle();
          };
        })(this), 300);
      } else {
        if (this.editor['preview-plus.htmlp'] != null) {
          clearTimeout(timer);
          this.updateCompileTo(((_ref1 = this.cproject) != null ? _ref1.htmlu : void 0) ? 'htmlu' : 'htmlp');
          return this.clicks = 0;
        }
      }
    };

    StatusView.prototype.getCompileTo = function(compileTo) {
      var compileToKey, compileToView, item, key, _i, _len, _ref1;
      compileToKey = compileTo;
      compileToView = void 0;
      key = this.model.getGrammar(this.editor);
      this.model.config[key]["enum"];
      if (this.model.config[key][compileTo]) {
        if (this.model.config[key][compileTo].view) {
          compileToView = this.model.config[key][compileTo].view;
        }
      } else {
        _ref1 = this.model.config[key]["enum"];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          item = _ref1[_i];
          if (this.model.config[key][item].view != null) {
            if (this.model.config[key][item].view === compileTo) {
              compileToKey = item;
            }
            compileToView = new this.model.config[key][item].view(this.model);
          }
        }
      }
      return {
        compileToKey: compileToKey,
        compileToView: compileToView
      };
    };

    StatusView.prototype.updateCompileTo = function(compileTo) {
      var compileToKey, compileToView, _ref1;
      _ref1 = this.getCompileTo(compileTo), compileToKey = _ref1.compileToKey, compileToView = _ref1.compileToView;
      if (compileToKey === 'htmlp') {
        this.editor['preview-plus.htmlp'] = true;
      } else {
        if (this.editor['preview-plus.htmlp'] != null) {
          this.editor['preview-plus.htmlp'] = false;
        }
      }
      this.editor['preview-plus.compileTo'] = compileToKey;
      if (compileToView) {
        return this.compileTo.empty().append(compileToView);
      } else {
        this.compileTo.empty().text(compileToKey);
        return this.model.toggle();
      }
    };

    StatusView.prototype.show = function() {
      return StatusView.__super__.show.apply(this, arguments);
    };

    StatusView.prototype.toggleLive = function() {
      var idx, live, liveSubscription;
      live = this.editor['preview-plus.livePreview'];
      this.live.toggleClass('off');
      this.editor['preview-plus.livePreview'] = !live;
      if (live) {
        liveSubscription = this.editor['preview-plus.livePreview-subscription'];
        if (liveSubscription) {
          idx = this.model.liveEditors.indexOf(this.editor);
          if (idx > -1) {
            this.model.liveEditors.splice(idx, 1);
          }
          return liveSubscription.dispose();
        }
      } else {
        return this.model.toggle();
      }
    };

    StatusView.prototype.setLive = function() {
      var live, _ref1;
      live = (_ref1 = this.editor['preview-plus.livePreview']) != null ? _ref1 : atom.config.get('preview-plus.livePreview');
      this.editor['preview-plus.livePreview'] = live;
      this.live.toggleClass('off', !live);
      return this.live.toggleClass('on', atom.config.get('preview-plus.livePreview'));
    };

    StatusView.prototype.setCompilesTo = function(editor) {
      var compileTo, compileToKey, compileToView, e, key, toKey, _ref1, _ref2, _ref3;
      this.editor = editor;
      try {
        this.show();
        key = this.model.getGrammar(this.editor);
        if (!this.editor['preview-plus.compileTo']) {
          toKey = this.model.getCompileTo(this.editor, key);
          this.editor['preview-plus.compileTo'] = toKey;
          if (this.model.config[key].cursorFocusBack) {
            this.editor['preview-plus.cursorFocusBack'] = this.model.config[key].cursorFocusBack;
          }
          if (this.model.config[key][toKey].cursorFocusBack) {
            this.editor['preview-plus.cursorFocusBack'] = this.model.config[key][toKey].cursorFocusBack;
          }
          if (((_ref1 = this.model.config[key]["enum"]) != null ? _ref1.length : void 0) > 1) {
            this.editor['preview-plus.enum'] = true;
          }
          if ((this.editor['preview-plus.htmlp'] == null) && (__indexOf.call(this.model.config[key]["enum"], 'htmlp') >= 0 || __indexOf.call(this.model.config[key]["enum"], 'htmlu') >= 0)) {
            this.editor['preview-plus.htmlp'] = atom.config.get('preview-plus.htmlp');
          }
        }
        compileToView = compileTo = this.editor['preview-plus.compileTo'];
        if (this.editor['preview-plus.htmlp']) {
          compileToKey = compileTo = __indexOf.call(this.model.config[key]["enum"], 'htmlu') >= 0 && ((_ref2 = this.cproject) != null ? _ref2.htmlu : void 0) ? 'htmlu' : 'htmlp';
        } else {
          _ref3 = this.getCompileTo(compileTo), compileToKey = _ref3.compileToKey, compileToView = _ref3.compileToView;
        }
        this.editor['preview-plus.compileTo'] = compileToKey;
        if (compileToView) {
          this.compileTo.empty().append(compileToView);
        } else {
          this.compileTo.empty().text(compileToKey);
        }
        this.compileTo.toggleClass('htmlp', atom.config.get('preview-plus.htmlp'));
        if (this.editor['preview-plus.enum']) {
          this.enums.show();
        }
        return this.setLive();
      } catch (_error) {
        e = _error;
        this.hide();
        return console.log('Not a Preview-Plus Editor', e);
      }
    };

    StatusView.prototype.hide = function() {
      return StatusView.__super__.hide.apply(this, arguments);
    };

    StatusView.prototype.destroy = function() {};

    return StatusView;

  })(View);

  module.exports = {
    StatusView: StatusView,
    BrowserView: BrowserView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcHJldmlldy1wbHVzL2xpYi9zdGF0dXMtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMEVBQUE7SUFBQTs7eUpBQUE7O0FBQUEsRUFBQSxPQUF3QixPQUFBLENBQVEsc0JBQVIsQ0FBeEIsRUFBQyxZQUFBLElBQUQsRUFBTSxzQkFBQSxjQUFOLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGVBQVIsQ0FBd0IsQ0FBQyxJQUZoQyxDQUFBOztBQUFBLEVBSUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBSkosQ0FBQTs7QUFBQSxFQUtNO0FBQ0osbUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLDJCQUFBLFVBQUEsR0FBWSxTQUFDLEtBQUQsRUFBUSxVQUFSLEVBQW1CLElBQW5CLEdBQUE7QUFDVixVQUFBLGdCQUFBO0FBQUEsTUFEaUIsSUFBQyxDQUFBLGFBQUEsVUFDbEIsQ0FBQTtBQUFBLE1BQUEsOENBQUEsU0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxRQUFELENBQVUsa0JBQVYsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsUUFBRCxDQUFVLEtBQVYsQ0FGQSxDQUFBO0FBQUEsTUFHQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7QUFBQSxRQUFBLElBQUEsRUFBSyxJQUFMO09BQTdCLENBSEEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLGlCQUFELENBQUEsQ0FKQSxDQUFBO0FBS0EsTUFBQSxtRUFBbUMsQ0FBRSxnQkFBbEMsR0FBMkMsQ0FBOUM7ZUFDRSxJQUFDLENBQUEsY0FBRCxDQUFnQixJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBVyxJQUFYLENBQWdCLENBQUMsR0FBakIsQ0FBcUIs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

//# sourceURL=/Users/doot/.atom/packages/preview-plus/lib/status-view.coffee
