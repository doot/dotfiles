(function() {
  var $$, CompositeDisposable, LocalFile, OpenFilesView, Q, SelectListView, async, fs, moment, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  CompositeDisposable = require('atom').CompositeDisposable;

  async = require('async');

  Q = require('q');

  _ = require('underscore-plus');

  fs = require('fs-plus');

  moment = require('moment');

  LocalFile = require('../model/local-file');

  module.exports = OpenFilesView = (function(_super) {
    __extends(OpenFilesView, _super);

    function OpenFilesView() {
      return OpenFilesView.__super__.constructor.apply(this, arguments);
    }

    OpenFilesView.prototype.initialize = function(ipdw) {
      this.ipdw = ipdw;
      OpenFilesView.__super__.initialize.apply(this, arguments);
      this.addClass('open-files-view');
      this.createItemsFromIpdw();
      this.disposables = new CompositeDisposable;
      this.disposables.add(this.ipdw.onDidChange((function(_this) {
        return function() {
          return _this.createItemsFromIpdw();
        };
      })(this)));
      return this.listenForEvents();
    };

    OpenFilesView.prototype.destroy = function() {
      if (this.panel != null) {
        this.panel.destroy();
      }
      return this.disposables.dispose();
    };

    OpenFilesView.prototype.cancelled = function() {
      this.hide();
      return this.destroy();
    };

    OpenFilesView.prototype.toggle = function() {
      var _ref1;
      if ((_ref1 = this.panel) != null ? _ref1.isVisible() : void 0) {
        return this.cancel();
      } else {
        return this.show();
      }
    };

    OpenFilesView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.storeFocusedElement();
      return this.focusFilterEditor();
    };

    OpenFilesView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.hide() : void 0;
    };

    OpenFilesView.prototype.getFilterKey = function() {
      return "name";
    };

    OpenFilesView.prototype.viewForItem = function(localFile) {
      return $$(function() {
        return this.li({
          "class": 'two-lines'
        }, (function(_this) {
          return function() {
            var mtime;
            _this.div({
              "class": 'primary-line icon globe'
            }, "" + localFile.host.protocol + "://" + localFile.host.username + "@" + localFile.host.hostname + ":" + localFile.host.port + localFile.remoteFile.path);
            mtime = moment(fs.stat(localFile.path, function(stat) {
              var _ref1;
              return stat != null ? (_ref1 = stat.mtime) != null ? _ref1.getTime() : void 0 : void 0;
            })).format("HH:mm:ss DD/MM/YY");
            return _this.div({
              "class": 'secondary-line no-icon text-subtle'
            }, "Downloaded: " + localFile.dtime + ", Mtime: " + mtime);
          };
        })(this));
      });
    };

    OpenFilesView.prototype.confirmed = function(localFile) {
      var uri;
      uri = "remote-edit://localFile/?localFile=" + (encodeURIComponent(JSON.stringify(localFile.serialize()))) + "&host=" + (encodeURIComponent(JSON.stringify(localFile.host.serialize())));
      atom.workspace.open(uri, {
        split: 'left'
      });
      return this.cancel();
    };

    OpenFilesView.prototype.listenForEvents = function() {
      return this.disposables.add(atom.commands.add('atom-workspace', 'openfilesview:delete', (function(_this) {
        return function() {
          var item;
          item = _this.getSelectedItem();
          if (item != null) {
            _this.items = _.reject(_this.items, (function(val) {
              return val === item;
            }));
            item["delete"]();
            return _this.setLoading();
          }
        };
      })(this)));
    };

    OpenFilesView.prototype.createItemsFromIpdw = function() {
      return this.ipdw.getData().then((function(_this) {
        return function(data) {
          var localFiles;
          localFiles = [];
          async.each(data.hostList, (function(host, callback) {
            return async.each(host.localFiles, (function(file, callback) {
              file.host = host;
              return localFiles.push(file);
            }), (function(err) {
              if (err != null) {
                return console.error(err);
              }
            }));
          }), (function(err) {
            if (err != null) {
              return console.error(err);
            }
          }));
          return _this.setItems(localFiles);
        };
      })(this));
    };

    return OpenFilesView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcmVtb3RlLWVkaXQvbGliL3ZpZXcvb3Blbi1maWxlcy12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnR0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBdUIsT0FBQSxDQUFRLHNCQUFSLENBQXZCLEVBQUMsVUFBQSxFQUFELEVBQUssc0JBQUEsY0FBTCxDQUFBOztBQUFBLEVBQ0Msc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQURELENBQUE7O0FBQUEsRUFHQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FIUixDQUFBOztBQUFBLEVBSUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxHQUFSLENBSkosQ0FBQTs7QUFBQSxFQUtBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FMSixDQUFBOztBQUFBLEVBTUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBTkwsQ0FBQTs7QUFBQSxFQU9BLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUixDQVBULENBQUE7O0FBQUEsRUFTQSxTQUFBLEdBQVksT0FBQSxDQUFRLHFCQUFSLENBVFosQ0FBQTs7QUFBQSxFQVdBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFDSixvQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsNEJBQUEsVUFBQSxHQUFZLFNBQUUsSUFBRixHQUFBO0FBQ1YsTUFEVyxJQUFDLENBQUEsT0FBQSxJQUNaLENBQUE7QUFBQSxNQUFBLCtDQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLGlCQUFWLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLG1CQUFELENBQUEsQ0FGQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsV0FBRCxHQUFlLEdBQUEsQ0FBQSxt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

//# sourceURL=/Users/doot/.atom/packages/remote-edit/lib/view/open-files-view.coffee
