(function() {
  var $, $$, CompositeDisposable, Emitter, FilesView, FtpHost, HostView, HostsView, SelectListView, SftpHost, _, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, SelectListView = _ref.SelectListView;

  _ref1 = require('atom'), CompositeDisposable = _ref1.CompositeDisposable, Emitter = _ref1.Emitter;

  _ = require('underscore-plus');

  FilesView = require('./files-view');

  HostView = require('./host-view');

  SftpHost = require('../model/sftp-host');

  FtpHost = require('../model/ftp-host');

  module.exports = HostsView = (function(_super) {
    __extends(HostsView, _super);

    function HostsView() {
      return HostsView.__super__.constructor.apply(this, arguments);
    }

    HostsView.prototype.initialize = function(ipdw) {
      this.ipdw = ipdw;
      HostsView.__super__.initialize.apply(this, arguments);
      this.createItemsFromIpdw();
      this.addClass('hosts-view');
      this.disposables = new CompositeDisposable;
      this.disposables.add(this.ipdw.onDidChange((function(_this) {
        return function() {
          return _this.createItemsFromIpdw();
        };
      })(this)));
      return this.listenForEvents();
    };

    HostsView.prototype.destroy = function() {
      if (this.panel != null) {
        this.panel.destroy();
      }
      return this.disposables.dispose();
    };

    HostsView.prototype.cancelled = function() {
      this.hide();
      return this.destroy();
    };

    HostsView.prototype.toggle = function() {
      var _ref2;
      if ((_ref2 = this.panel) != null ? _ref2.isVisible() : void 0) {
        return this.cancel();
      } else {
        return this.show();
      }
    };

    HostsView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.storeFocusedElement();
      return this.focusFilterEditor();
    };

    HostsView.prototype.hide = function() {
      var _ref2;
      return (_ref2 = this.panel) != null ? _ref2.hide() : void 0;
    };

    HostsView.prototype.getFilterKey = function() {
      return "hostname";
    };

    HostsView.prototype.viewForItem = function(item) {
      var keyBindings;
      keyBindings = this.keyBindings;
      return $$(function() {
        return this.li({
          "class": 'two-lines'
        }, (function(_this) {
          return function() {
            var authType;
            _this.div({
              "class": 'primary-line'
            }, function() {
              if (item.alias != null) {
                _this.span({
                  "class": 'inline-block highlight'
                }, "" + item.alias);
              }
              return _this.span({
                "class": 'inline-block'
              }, "" + item.username + "@" + item.hostname + ":" + item.port + ":" + item.directory);
            });
            if (item instanceof SftpHost) {
              authType = "not set";
              if (item.usePassword && (item.password === "" || item.password === '' || (item.password == null))) {
                authType = "password (not set)";
              } else if (item.usePassword) {
                authType = "password (set)";
              } else if (item.usePrivateKey) {
                authType = "key";
              } else if (item.useAgent) {
                authType = "agent";
              }
              return _this.div({
                "class": "secondary-line"
              }, ("Type: SFTP, Open files: " + item.localFiles.length + ", Auth: ") + authType);
            } else if (item instanceof FtpHost) {
              authType = "not set";
              if (item.usePassword && (item.password === "" || item.password === '' || (item.password == null))) {
                authType = "password (not set)";
              } else {
                authType = "password (set)";
              }
              return _this.div({
                "class": "secondary-line"
              }, ("Type: FTP, Open files: " + item.localFiles.length + ", Auth: ") + authType);
            } else {
              return _this.div({
                "class": "secondary-line"
              }, "Type: UNDEFINED");
            }
          };
        })(this));
      });
    };

    HostsView.prototype.confirmed = function(item) {
      var filesView;
      this.cancel();
      filesView = new FilesView(item);
      filesView.connect();
      return filesView.toggle();
    };

    HostsView.prototype.listenForEvents = function() {
      this.disposables.add(atom.commands.add('atom-workspace', 'hostview:delete', (function(_this) {
        return function() {
          var item;
          item = _this.getSelectedItem();
          if (item != null) {
            item["delete"]();
            return _this.setLoading();
          }
        };
      })(this)));
      return this.disposables.add(atom.commands.add('atom-workspace', 'hostview:edit', (function(_this) {
        return function() {
          var hostView, item;
          item = _this.getSelectedItem();
          if (item != null) {
            hostView = new HostView(item);
            hostView.toggle();
            return _this.cancel();
          }
        };
      })(this)));
    };

    HostsView.prototype.createItemsFromIpdw = function() {
      return this.ipdw.getData().then((function(_this) {
        return function(resolved) {
          return _this.setItems(resolved.hostList);
        };
      })(this));
    };

    return HostsView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcmVtb3RlLWVkaXQvbGliL3ZpZXcvaG9zdHMtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0hBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQTBCLE9BQUEsQ0FBUSxzQkFBUixDQUExQixFQUFDLFNBQUEsQ0FBRCxFQUFJLFVBQUEsRUFBSixFQUFRLHNCQUFBLGNBQVIsQ0FBQTs7QUFBQSxFQUNBLFFBQWlDLE9BQUEsQ0FBUSxNQUFSLENBQWpDLEVBQUMsNEJBQUEsbUJBQUQsRUFBc0IsZ0JBQUEsT0FEdEIsQ0FBQTs7QUFBQSxFQUVBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FGSixDQUFBOztBQUFBLEVBSUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSLENBSlosQ0FBQTs7QUFBQSxFQUtBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQUxYLENBQUE7O0FBQUEsRUFPQSxRQUFBLEdBQVcsT0FBQSxDQUFRLG9CQUFSLENBUFgsQ0FBQTs7QUFBQSxFQVFBLE9BQUEsR0FBVSxPQUFBLENBQVEsbUJBQVIsQ0FSVixDQUFBOztBQUFBLEVBVUEsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUNKLGdDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx3QkFBQSxVQUFBLEdBQVksU0FBRSxJQUFGLEdBQUE7QUFDVixNQURXLElBQUMsQ0FBQSxPQUFBLElBQ1osQ0FBQTtBQUFBLE1BQUEsMkNBQUEsU0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxtQkFBRCxDQUFBLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFFBQUQsQ0FBVSxZQUFWLENBRkEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxHQUFBLENBQUEsbUJBSmYsQ0FB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

//# sourceURL=/Users/doot/.atom/packages/remote-edit/lib/view/hosts-view.coffee
