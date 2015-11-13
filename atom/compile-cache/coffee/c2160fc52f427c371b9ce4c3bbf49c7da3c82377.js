(function() {
  var $, $$, CompositeDisposable, Dialog, FilesView, LocalFile, Q, SelectListView, async, fs, mkdirp, moment, os, path, upath, util, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, SelectListView = _ref.SelectListView;

  CompositeDisposable = require('atom').CompositeDisposable;

  LocalFile = require('../model/local-file');

  Dialog = require('./dialog');

  fs = require('fs');

  os = require('os');

  async = require('async');

  util = require('util');

  path = require('path');

  Q = require('q');

  _ = require('underscore-plus');

  mkdirp = require('mkdirp');

  moment = require('moment');

  upath = require('upath');

  module.exports = FilesView = (function(_super) {
    __extends(FilesView, _super);

    function FilesView() {
      this.openDirectory = __bind(this.openDirectory, this);
      this.openFile = __bind(this.openFile, this);
      this.updatePath = __bind(this.updatePath, this);
      return FilesView.__super__.constructor.apply(this, arguments);
    }

    FilesView.prototype.initialize = function(host) {
      this.host = host;
      FilesView.__super__.initialize.apply(this, arguments);
      this.addClass('filesview');
      this.disposables = new CompositeDisposable;
      return this.listenForEvents();
    };

    FilesView.prototype.connect = function(connectionOptions) {
      if (connectionOptions == null) {
        connectionOptions = {};
      }
      this.path = atom.config.get('remote-edit.rememberLastOpenDirectory') && (this.host.lastOpenDirectory != null) ? this.host.lastOpenDirectory : this.host.directory;
      return async.waterfall([
        (function(_this) {
          return function(callback) {
            if (_this.host.usePassword && (connectionOptions.password == null)) {
              if (_this.host.password === "" || _this.host.password === '' || (_this.host.password == null)) {
                return async.waterfall([
                  function(callback) {
                    var passwordDialog;
                    passwordDialog = new Dialog({
                      prompt: "Enter password"
                    });
                    return passwordDialog.toggle(callback);
                  }
                ], function(err, result) {
                  connectionOptions = _.extend({
                    password: result
                  }, connectionOptions);
                  _this.toggle();
                  return callback(null);
                });
              } else {
                return callback(null);
              }
            } else {
              return callback(null);
            }
          };
        })(this), (function(_this) {
          return function(callback) {
            if (!_this.host.isConnected()) {
              _this.setLoading("Connecting...");
              return _this.host.connect(callback, connectionOptions);
            } else {
              return callback(null);
            }
          };
        })(this), (function(_this) {
          return function(callback) {
            return _this.populate(callback);
          };
        })(this)
      ], (function(_this) {
        return function(err, result) {
          if (err != null) {
            console.error(err);
            if (err.code === 450 || err.type === "PERMISSION_DENIED") {
              return _this.setError("You do not have read permission to what you've specified as the default directory! See the console for more info.");
            } else if (err.code === 2 && _this.path === _this.host.lastOpenDirectory) {
              _this.host.lastOpenDirectory = void 0;
              return _this.connect(connectionOptions);
            } else if (_this.host.usePassword && (err.code === 530 || err.level === "connection-ssh")) {
              return async.waterfall([
                function(callback) {
                  var passwordDialog;
                  passwordDialog = new Dialog({
                    prompt: "Enter password"
                  });
                  return passwordDialog.toggle(callback);
                }
              ], function(err, result) {
                _this.toggle();
                return _this.connect({
                  password: result
                });
              });
            } else {
              return _this.setError(err);
            }
          }
        };
      })(this));
    };

    FilesView.prototype.getFilterKey = function() {
      return "name";
    };

    FilesView.prototype.destroy = function() {
      if (this.panel != null) {
        this.panel.destroy();
      }
      return this.disposables.dispose();
    };

    FilesView.prototype.cancelled = function() {
      var _ref1;
      this.hide();
      if ((_ref1 = this.host) != null) {
        _ref1.close();
      }
      return this.destroy();
    };

    FilesView.prototype.toggle = function() {
      var _ref1;
      if ((_ref1 = this.panel) != null ? _ref1.isVisible() : void 0) {
        return this.cancel();
      } else {
        return this.show();
      }
    };

    FilesView.prototype.show = function() {
      var _ref1;
      if ((_ref1 = this.panel) != null) {
        _ref1.destroy();
      }
      this.panel = atom.workspace.addModalPanel({
        item: this
      });
      this.panel.show();
      this.storeFocusedElement();
      return this.focusFilterEditor();
    };

    FilesView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.hide() : void 0;
    };

    FilesView.prototype.viewForItem = function(item) {
      return $$(function() {
        return this.li({
          "class": 'two-lines'
        }, (function(_this) {
          return function() {
            if (item.isFile) {
              _this.div({
                "class": 'primary-line icon icon-file-text'
              }, item.name);
            } else if (item.isDir) {
              _this.div({
                "class": 'primary-line icon icon-file-directory'
              }, item.name);
            } else if (item.isLink) {
              _this.div({
                "class": 'primary-line icon icon-file-symlink-file'
              }, item.name);
            }
            return _this.div({
              "class": 'secondary-line no-icon text-subtle'
            }, "Size: " + item.size + ", Mtime: " + item.lastModified + ", Permissions: " + item.permissions);
          };
        })(this));
      });
    };

    FilesView.prototype.populate = function(callback) {
      return async.waterfall([
        (function(_this) {
          return function(callback) {
            _this.setLoading("Loading...");
            return _this.host.getFilesMetadata(_this.path, callback);
          };
        })(this), (function(_this) {
          return function(items, callback) {
            if (atom.config.get('remote-edit.foldersOnTop')) {
              items = _.sortBy(items, 'isFile');
            }
            _this.setItems(items);
            return callback(void 0, void 0);
          };
        })(this)
      ], (function(_this) {
        return function(err, result) {
          if (err != null) {
            _this.setError(err);
          }
          return typeof callback === "function" ? callback(err, result) : void 0;
        };
      })(this));
    };

    FilesView.prototype.populateList = function() {
      FilesView.__super__.populateList.apply(this, arguments);
      return this.setError(path.resolve(this.path));
    };

    FilesView.prototype.getNewPath = function(next) {
      if (this.path[this.path.length - 1] === "/") {
        return this.path + next;
      } else {
        return this.path + "/" + next;
      }
    };

    FilesView.prototype.updatePath = function(next) {
      return this.path = upath.normalize(this.getNewPath(next));
    };

    FilesView.prototype.getDefaultSaveDirForHostAndFile = function(file, callback) {
      return async.waterfall([
        function(callback) {
          return fs.realpath(os.tmpDir(), callback);
        }, function(tmpDir, callback) {
          tmpDir = tmpDir + path.sep + "remote-edit";
          return fs.mkdir(tmpDir, (function(err) {
            if ((err != null) && err.code === 'EEXIST') {
              return callback(null, tmpDir);
            } else {
              return callback(err, tmpDir);
            }
          }));
        }, (function(_this) {
          return function(tmpDir, callback) {
            tmpDir = tmpDir + path.sep + _this.host.hashCode() + '_' + _this.host.username + "-" + _this.host.hostname + file.dirName;
            return mkdirp(tmpDir, (function(err) {
              if ((err != null) && err.code === 'EEXIST') {
                return callback(null, tmpDir);
              } else {
                return callback(err, tmpDir);
              }
            }));
          };
        })(this)
      ], function(err, savePath) {
        return callback(err, savePath);
      });
    };

    FilesView.prototype.openFile = function(file) {
      var dtime;
      this.setLoading("Downloading file...");
      dtime = moment().format("HH:mm:ss DD/MM/YY");
      return async.waterfall([
        (function(_this) {
          return function(callback) {
            return _this.getDefaultSaveDirForHostAndFile(file, callback);
          };
        })(this), (function(_this) {
          return function(savePath, callback) {
            var localFile;
            savePath = savePath + path.sep + dtime.replace(/([^a-z0-9\s]+)/gi, '').replace(/([\s]+)/gi, '-') + "_" + file.name;
            localFile = new LocalFile(savePath, file, dtime, _this.host);
            return _this.host.getFile(localFile, callback);
          };
        })(this)
      ], (function(_this) {
        return function(err, localFile) {
          var uri;
          if (err != null) {
            _this.setError(err);
            return console.error(err);
          } else {
            _this.host.addLocalFile(localFile);
            uri = "remote-edit://localFile/?localFile=" + (encodeURIComponent(JSON.stringify(localFile.serialize()))) + "&host=" + (encodeURIComponent(JSON.stringify(localFile.host.serialize())));
            atom.workspace.open(uri, {
              split: 'left'
            });
            _this.host.close();
            return _this.cancel();
          }
        };
      })(this));
    };

    FilesView.prototype.openDirectory = function(dir) {
      this.setLoading("Opening directory...");
      throw new Error("Not implemented yet!");
    };

    FilesView.prototype.confirmed = function(item) {
      if (item.isFile) {
        return this.openFile(item);
      } else if (item.isDir) {
        this.filterEditorView.setText('');
        this.setItems();
        this.updatePath(item.name);
        this.host.lastOpenDirectory = upath.normalize(item.path);
        this.host.invalidate();
        return this.populate();
      } else if (item.isLink) {
        if (atom.config.get('remote-edit.followLinks')) {
          this.filterEditorView.setText('');
          this.setItems();
          this.updatePath(item.name);
          return this.populate();
        } else {
          return this.openFile(item);
        }
      } else {
        return this.setError("Selected item is neither a file, directory or link!");
      }
    };

    FilesView.prototype.listenForEvents = function() {
      return this.disposables.add(atom.commands.add('atom-workspace', 'filesview:open', (function(_this) {
        return function() {
          var item;
          item = _this.getSelectedItem();
          if (item.isFile) {
            return _this.openFile(item);
          } else if (item.isDir) {
            return _this.openDirectory(item);
          }
        };
      })(this)));
    };

    return FilesView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcmVtb3RlLWVkaXQvbGliL3ZpZXcvZmlsZXMtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0lBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQSxPQUEwQixPQUFBLENBQVEsc0JBQVIsQ0FBMUIsRUFBQyxTQUFBLENBQUQsRUFBSSxVQUFBLEVBQUosRUFBUSxzQkFBQSxjQUFSLENBQUE7O0FBQUEsRUFDQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBREQsQ0FBQTs7QUFBQSxFQUVBLFNBQUEsR0FBWSxPQUFBLENBQVEscUJBQVIsQ0FGWixDQUFBOztBQUFBLEVBSUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBSlQsQ0FBQTs7QUFBQSxFQU1BLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQU5MLENBQUE7O0FBQUEsRUFPQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FQTCxDQUFBOztBQUFBLEVBUUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSLENBUlIsQ0FBQTs7QUFBQSxFQVNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQVRQLENBQUE7O0FBQUEsRUFVQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FWUCxDQUFBOztBQUFBLEVBV0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxHQUFSLENBWEosQ0FBQTs7QUFBQSxFQVlBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FaSixDQUFBOztBQUFBLEVBYUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBYlQsQ0FBQTs7QUFBQSxFQWNBLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUixDQWRULENBQUE7O0FBQUEsRUFlQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FmUixDQUFBOztBQUFBLEVBaUJBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFDSixnQ0FBQSxDQUFBOzs7Ozs7O0tBQUE7O0FBQUEsd0JBQUEsVUFBQSxHQUFZLFNBQUUsSUFBRixHQUFBO0FBQ1YsTUFEVyxJQUFDLENBQUEsT0FBQSxJQUNaLENBQUE7QUFBQSxNQUFBLDJDQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLFdBQVYsQ0FEQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsV0FBRCxHQUFlLEdBQUEsQ0FBQSxtQkFIZixDQUFBO2FBSUEsSUFBQyxDQUFBLGVBQUQsQ0FBQSxFQUxVO0lBQUEsQ0FBWixDQUFBOztBQUFBLHdCQU9BLE9BQUEsR0FBUyxTQUFDLGlCQUFELEdBQUE7O1FBQUMsb0JBQW9CO09BQzVCO0FBQUEsTUFBQSxJQUFDLENBQUEsSUFBRCxHQUFXLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1Q0FBaEIsQ0FBQSxJQUE2RCxxQ0FBaEUsR0FBOEYsSUFBQyxDQUFBLElBQUksQ0FBQyxpQkFBcEcsR0FBMkgsSUFBQyxDQUFBLElBQUksQ0FBQyxTQUF6SSxDQUFBO2FBQ0EsS0FBSyxDQUFDLFNBQU4sQ0FBZ0I7UUFDZCxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsUUFBRCxHQUFBO0FBQ0UsWUFBQSxJQUFHLEtBQUMsQ0FBQSxJQUFJLENBQUMsV0FBTixJQUF1QixvQ0FBMUI7QUFDRSxjQUFBLElBQUcsS0FBQyxDQUFBLElBQUksQ0FBQyxRQUFOLEtBQWtCLEVBQWxCLElBQXdCLEtBQUMsQ0FBQSxJQUFJLENBQUMsUUFBTixLQUFrQixFQUExQyxJQUFpRCw2QkFBcEQ7dUJBQ0UsS0FBSyxDQUFDLFNBQU4sQ0FBZ0I7a0JBQ2QsU0FBQyxRQUFELEdBQUE7QUFDRSx3QkFBQSxjQUFBO0FBQUEsb0JBQUEsY0FBQSxHQUFxQixJQUFBLE1BQUEsQ0FBTztBQUFBLHNCQUFDLE1BQUEsRUFBUSxnQkFBVDtxQkFBUCxDQUFyQixDQUFBOzJCQUNBLGNBQWMsQ0FBQyxNQUFmLENBQXNCLFFBQXRCLEVBRkY7a0JBQUEsQ0FEYztpQkFBaEIsRUFJRyxTQUFDLEdBQUQsRUFBTSxNQUFOLEdBQUE7QUFDRCxrQkFBQSxpQkFBQSxHQUFvQixDQUFDLENBQUMsTUFBRixDQUFTO0FBQUEsb0JBQUMsUUFBQSxFQUFVLE1BQVg7bUJBQVQsRUFBNkIsaUJBQTdCLENBQXBCLENBQUE7QUFBQSxrQkFDQSxLQUFDLENBQUEsTUFBRCxDQUFBLENBREEsQ0FBQTt5QkFFQSxRQUFBLENBQVMsSUFBVCxFQUhDO2dCQUFBLENBSkgsRUFERjtlQUFBLE1BQUE7dUJBV0UsUUFBQSxDQUFTLElBQVQsRUFYRjtlQURGO2FBQUEsTUFBQTtxQkFjRSxRQUFBLENBQVMsSUFBVCxFQWRGO2FBREY7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURjLEVBaUJkLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxRQUFELEdBQUE7QUFDRSxZQUFBLElBQUcsQ0FBQSxLQUFFLENBQUEsSUFBSSxDQUFDLFdBQU4sQ0FBQSxDQUFKO0FBQ0UsY0FBQSxLQUFDLENBQUEsVUFBRCxDQUFZLGVBQVosQ0FBQSxDQUFBO3FCQUNBLEtBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFjLFFBQWQsRUFBd0IsaUJBQXhCLEVBRkY7YUFBQSxNQUFBO3FCQUlFLFFBQUEsQ0FBUyxJQUFULEVBSkY7YUFERjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBakJjLEVBdUJkLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxRQUFELEdBQUE7bUJBQ0UsS0FBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWLEVBREY7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQXZCYztPQUFoQixFQXlCRyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxHQUFELEVBQU0sTUFBTixHQUFBO0FBQ0QsVUFBQSxJQUFHLFdBQUg7QUFDRSxZQUFBLE9BQU8sQ0FBQyxLQUFSLENBQWMsR0FBZCxDQUFBLENBQUE7QUFDQSxZQUFBLElBQUcsR0FBRyxDQUFDLElBQUosS0FBWSxHQUFaLElBQW1CLEdBQUcsQ0FBQyxJQUFKLEtBQVksbUJBQWxDO3FCQUNFLEtBQUMsQ0FBQSxRQUFELENBQVUsbUhBQVYsRUFERjthQUFBLE1BRUssSUFBRyxHQUFHLENBQUMsSUFBSixLQUFZLENBQVosSUFBa0IsS0FBQyxDQUFBLElBQUQsS0FBUyxLQUFDLENBQUEsSUFBSSxDQUFDLGlCQUFwQztBQUVILGNBQUEsS0FBQyxDQUFBLElBQUksQ0FBQyxpQkFBTixHQUEwQixNQUExQixDQUFBO3FCQUNBLEtBQUMsQ0FBQSxPQUFELENBQVMsaUJBQVQsRUFIRzthQUFBLE1BSUEsSUFBRyxLQUFDLENBQUEsSUFBSSxDQUFDLFdBQU4sSUFBc0IsQ0FBQyxHQUFHLENBQUMsSUFBSixLQUFZLEdBQVosSUFBbUIsR0FBRyxDQUFDLEtBQUosS0FBYSxnQkFBakMsQ0FBekI7cUJBQ0gsS0FBSyxDQUFDLFNBQU4sQ0FBZ0I7Z0JBQ2QsU0FBQyxRQUFELEdBQUE7QUFDRSxzQkFBQSxjQUFBO0FBQUEsa0JBQUEsY0FBQSxHQUFxQixJQUFBLE1BQUEsQ0FBTztBQUFBLG9CQUFDLE1BQUEsRUFBUSxnQkFBVDttQkFBUCxDQUFyQixDQUFBO3lCQUNBLGNBQWMsQ0FBQyxNQUFmLENBQXNCLFFBQXRCLEVBRkY7Z0JBQUEsQ0FEYztlQUFoQixFQUlHLFNBQUMsR0FBRCxFQUFNLE1BQU4sR0FBQTtBQUNELGdCQUFBLEtBQUMsQ0FBQSxNQUFELENBQUEsQ0FBQSxDQUFBO3VCQUNBLEtBQUMsQ0FBQSxPQUFELENBQVM7QUFBQSxrQkFBQyxRQUFBLEVBQVUsTUFBWDtpQkFBVCxFQUZDO2NBQUEsQ0FKSCxFQURHO2FBQUEsTUFBQTtxQkFVSCxLQUFDLENBQUEsUUFBRCxDQUFVLEdBQVYsRUFWRzthQVJQO1dBREM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQXpCSCxFQUZPO0lBQUEsQ0FQVCxDQUFBOztBQUFBLHdCQXdEQSxZQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1osYUFBTyxNQUFQLENBRFk7SUFBQSxDQXhEZCxDQUFBOztBQUFBLHdCQTJEQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFvQixrQkFBcEI7QUFBQSxRQUFBLElBQUMsQ0FBQSxLQUFLLENBQUMsT0FBUCxDQUFBLENBQUEsQ0FBQTtPQUFBO2FBQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUEsRUFGTztJQUFBLENBM0RULENBQUE7O0FBQUEsd0JBK0RBLFNBQUEsR0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLEtBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxJQUFELENBQUEsQ0FBQSxDQUFBOzthQUNLLENBQUUsS0FBUCxDQUFBO09BREE7YUFFQSxJQUFDLENBQUEsT0FBRCxDQUFBLEVBSFM7SUFBQSxDQS9EWCxDQUFBOztBQUFBLHdCQW9FQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sVUFBQSxLQUFBO0FBQUEsTUFBQSx3Q0FBUyxDQUFFLFNBQVIsQ0FBQSxVQUFIO2VBQ0UsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQURGO09BQUEsTUFBQTtlQUdFLElBQUMsQ0FBQSxJQUFELENBQUEsRUFIRjtPQURNO0lBQUEsQ0FwRVIsQ0FBQTs7QUFBQSx3QkEwRUEsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLFVBQUEsS0FBQTs7YUFBTSxDQUFFLE9BQVIsQ0FBQTtPQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUE2QjtBQUFBLFFBQUEsSUFBQSxFQUFNLElBQU47T0FBN0IsQ0FEVCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQSxDQUZBLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxtQkFBRCxDQUFBLENBSEEsQ0FBQTthQUlBLElBQUMsQ0FBQSxpQkFBRCxDQUFBLEVBTEk7SUFBQSxDQTFFTixDQUFBOztBQUFBLHdCQWlGQSxJQUFBLEdBQU0sU0FBQSxHQUFBO0FBQ0osVUFBQSxLQUFBO2lEQUFNLENBQUUsSUFBUixDQUFBLFdBREk7SUFBQSxDQWpGTixDQUFBOztBQUFBLHdCQW9GQSxXQUFBLEdBQWEsU0FBQyxJQUFELEdBQUE7YUFDWCxFQUFBLENBQUcsU0FBQSxHQUFBO2VBQ0QsSUFBQyxDQUFBLEVBQUQsQ0FBSTtBQUFBLFVBQUEsT0FBQSxFQUFPLFdBQVA7U0FBSixFQUF3QixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtBQUN0QixZQUFBLElBQUcsSUFBSSxDQUFDLE1BQVI7QUFDRSxjQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxnQkFBQSxPQUFBLEVBQU8sa0NBQVA7ZUFBTCxFQUFnRCxJQUFJLENBQUMsSUFBckQsQ0FBQSxDQURGO2FBQUEsTUFFSyxJQUFHLElBQUksQ0FBQyxLQUFSO0FBQ0gsY0FBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsZ0JBQUEsT0FBQSxFQUFPLHVDQUFQO2VBQUwsRUFBcUQsSUFBSSxDQUFDLElBQTFELENBQUEsQ0FERzthQUFBLE1BRUEsSUFBRyxJQUFJLENBQUMsTUFBUjtBQUNILGNBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGdCQUFBLE9BQUEsRUFBTywwQ0FBUDtlQUFMLEVBQXdELElBQUksQ0FBQyxJQUE3RCxDQUFBLENBREc7YUFKTDttQkFPQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sb0NBQVA7YUFBTCxFQUFtRCxRQUFBLEdBQVEsSUFBSSxDQUFDLElBQWIsR0FBa0IsV0FBbEIsR0FBNkIsSUFBSSxDQUFDLFlBQWxDLEdBQStDLGlCQUEvQyxHQUFnRSxJQUFJLENBQUMsV0FBeEgsRUFSc0I7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QixFQURDO01BQUEsQ0FBSCxFQURXO0lBQUEsQ0FwRmIsQ0FBQTs7QUFBQSx3QkFrR0EsUUFBQSxHQUFVLFNBQUMsUUFBRCxHQUFBO2FBQ1IsS0FBSyxDQUFDLFNBQU4sQ0FBZ0I7UUFDZCxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsUUFBRCxHQUFBO0FBQ0UsWUFBQSxLQUFDLENBQUEsVUFBRCxDQUFZLFlBQVosQ0FBQSxDQUFBO21CQUNBLEtBQUMsQ0FBQSxJQUFJLENBQUMsZ0JBQU4sQ0FBdUIsS0FBQyxDQUFBLElBQXhCLEVBQThCLFFBQTlCLEVBRkY7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURjLEVBSWQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFDLEtBQUQsRUFBUSxRQUFSLEdBQUE7QUFDRSxZQUFBLElBQXFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQkFBaEIsQ0FBckM7QUFBQSxjQUFBLEtBQUEsR0FBUSxDQUFDLENBQUMsTUFBRixDQUFTLEtBQVQsRUFBZ0IsUUFBaEIsQ0FBUixDQUFBO2FBQUE7QUFBQSxZQUNBLEtBQUMsQ0FBQSxRQUFELENBQVUsS0FBVixDQURBLENBQUE7bUJBRUEsUUFBQSxDQUFTLE1BQVQsRUFBb0IsTUFBcEIsRUFIRjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSmM7T0FBaEIsRUFRRyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxHQUFELEVBQU0sTUFBTixHQUFBO0FBQ0QsVUFBQSxJQUFrQixXQUFsQjtBQUFBLFlBQUEsS0FBQyxDQUFBLFFBQUQsQ0FBVSxHQUFWLENBQUEsQ0FBQTtXQUFBO2tEQUNBLFNBQVUsS0FBSyxpQkFGZDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBUkgsRUFEUTtJQUFBLENBbEdWLENBQUE7O0FBQUEsd0JBZ0hBLFlBQUEsR0FBYyxTQUFBLEdBQUE7QUFDWixNQUFBLDZDQUFBLFNBQUEsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFJLENBQUMsT0FBTCxDQUFhLElBQUMsQ0FBQSxJQUFkLENBQVYsRUFGWTtJQUFBLENBaEhkLENBQUE7O0FBQUEsd0JBb0hBLFVBQUEsR0FBWSxTQUFDLElBQUQsR0FBQTtBQUNWLE1BQUEsSUFBSSxJQUFDLENBQUEsSUFBSyxDQUFBLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTixHQUFlLENBQWYsQ0FBTixLQUEyQixHQUEvQjtlQUNFLElBQUMsQ0FBQSxJQUFELEdBQVEsS0FEVjtPQUFBLE1BQUE7ZUFHRSxJQUFDLENBQUEsSUFBRCxHQUFRLEdBQVIsR0FBYyxLQUhoQjtPQURVO0lBQUEsQ0FwSFosQ0FBQTs7QUFBQSx3QkEwSEEsVUFBQSxHQUFZLFNBQUMsSUFBRCxHQUFBO2FBQ1YsSUFBQyxDQUFBLElBQUQsR0FBUSxLQUFLLENBQUMsU0FBTixDQUFnQixJQUFDLENBQUEsVUFBRCxDQUFZLElBQVosQ0FBaEIsRUFERTtJQUFBLENBMUhaLENBQUE7O0FBQUEsd0JBNkhBLCtCQUFBLEdBQWlDLFNBQUMsSUFBRCxFQUFPLFFBQVAsR0FBQTthQUMvQixLQUFLLENBQUMsU0FBTixDQUFnQjtRQUNkLFNBQUMsUUFBRCxHQUFBO2lCQUNFLEVBQUUsQ0FBQyxRQUFILENBQVksRUFBRSxDQUFDLE1BQUgsQ0FBQSxDQUFaLEVBQXlCLFFBQXpCLEVBREY7UUFBQSxDQURjLEVBR2QsU0FBQyxNQUFELEVBQVMsUUFBVCxHQUFBO0FBQ0UsVUFBQSxNQUFBLEdBQVMsTUFBQSxHQUFTLElBQUksQ0FBQyxHQUFkLEdBQW9CLGFBQTdCLENBQUE7aUJBQ0EsRUFBRSxDQUFDLEtBQUgsQ0FBUyxNQUFULEVBQWlCLENBQUMsU0FBQyxHQUFELEdBQUE7QUFDaEIsWUFBQSxJQUFHLGFBQUEsSUFBUSxHQUFHLENBQUMsSUFBSixLQUFZLFFBQXZCO3FCQUNFLFFBQUEsQ0FBUyxJQUFULEVBQWUsTUFBZixFQURGO2FBQUEsTUFBQTtxQkFHRSxRQUFBLENBQVMsR0FBVCxFQUFjLE1BQWQsRUFIRjthQURnQjtVQUFBLENBQUQsQ0FBakIsRUFGRjtRQUFBLENBSGMsRUFZZCxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsTUFBRCxFQUFTLFFBQVQsR0FBQTtBQUNFLFlBQUEsTUFBQSxHQUFTLE1BQUEsR0FBUyxJQUFJLENBQUMsR0FBZCxHQUFvQixLQUFDLENBQUEsSUFBSSxDQUFDLFFBQU4sQ0FBQSxDQUFwQixHQUF1QyxHQUF2QyxHQUE2QyxLQUFDLENBQUEsSUFBSSxDQUFDLFFBQW5ELEdBQThELEdBQTlELEdBQW9FLEtBQUMsQ0FBQSxJQUFJLENBQUMsUUFBMUUsR0FBc0YsSUFBSSxDQUFDLE9BQXBHLENBQUE7bUJBQ0EsTUFBQSxDQUFPLE1BQVAsRUFBZSxDQUFDLFNBQUMsR0FBRCxHQUFBO0FBQ2QsY0FBQSxJQUFHLGFBQUEsSUFBUSxHQUFHLENBQUMsSUFBSixLQUFZLFFBQXZCO3VCQUNFLFFBQUEsQ0FBUyxJQUFULEVBQWUsTUFBZixFQURGO2VBQUEsTUFBQTt1QkFHRSxRQUFBLENBQVMsR0FBVCxFQUFjLE1BQWQsRUFIRjtlQURjO1lBQUEsQ0FBRCxDQUFmLEVBRkY7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVpjO09BQWhCLEVBcUJHLFNBQUMsR0FBRCxFQUFNLFFBQU4sR0FBQTtlQUNELFFBQUEsQ0FBUyxHQUFULEVBQWMsUUFBZCxFQURDO01BQUEsQ0FyQkgsRUFEK0I7SUFBQSxDQTdIakMsQ0FBQTs7QUFBQSx3QkF1SkEsUUFBQSxHQUFVLFNBQUMsSUFBRCxHQUFBO0FBQ1IsVUFBQSxLQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsVUFBRCxDQUFZLHFCQUFaLENBQUEsQ0FBQTtBQUFBLE1BQ0EsS0FBQSxHQUFRLE1BQUEsQ0FBQSxDQUFRLENBQUMsTUFBVCxDQUFnQixtQkFBaEIsQ0FEUixDQUFBO2FBRUEsS0FBSyxDQUFDLFNBQU4sQ0FBZ0I7UUFDZCxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsUUFBRCxHQUFBO21CQUNFLEtBQUMsQ0FBQSwrQkFBRCxDQUFpQyxJQUFqQyxFQUF1QyxRQUF2QyxFQURGO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEYyxFQUdkLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxRQUFELEVBQVcsUUFBWCxHQUFBO0FBQ0UsZ0JBQUEsU0FBQTtBQUFBLFlBQUEsUUFBQSxHQUFXLFFBQUEsR0FBVyxJQUFJLENBQUMsR0FBaEIsR0FBc0IsS0FBSyxDQUFDLE9BQU4sQ0FBYyxrQkFBZCxFQUFrQyxFQUFsQyxDQUFxQyxDQUFDLE9BQXRDLENBQThDLFdBQTlDLEVBQTJELEdBQTNELENBQXRCLEdBQXdGLEdBQXhGLEdBQThGLElBQUksQ0FBQyxJQUE5RyxDQUFBO0FBQUEsWUFDQSxTQUFBLEdBQWdCLElBQUEsU0FBQSxDQUFVLFFBQVYsRUFBb0IsSUFBcEIsRUFBMEIsS0FBMUIsRUFBaUMsS0FBQyxDQUFBLElBQWxDLENBRGhCLENBQUE7bUJBRUEsS0FBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQWMsU0FBZCxFQUF5QixRQUF6QixFQUhGO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FIYztPQUFoQixFQU9HLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEdBQUQsRUFBTSxTQUFOLEdBQUE7QUFDRCxjQUFBLEdBQUE7QUFBQSxVQUFBLElBQUcsV0FBSDtBQUNFLFlBQUEsS0FBQyxDQUFBLFFBQUQsQ0FBVSxHQUFWLENBQUEsQ0FBQTttQkFDQSxPQUFPLENBQUMsS0FBUixDQUFjLEdBQWQsRUFGRjtXQUFBLE1BQUE7QUFJRSxZQUFBLEtBQUMsQ0FBQSxJQUFJLENBQUMsWUFBTixDQUFtQixTQUFuQixDQUFBLENBQUE7QUFBQSxZQUNBLEdBQUEsR0FBTyxxQ0FBQSxHQUFvQyxDQUFDLGtCQUFBLENBQW1CLElBQUksQ0FBQyxTQUFMLENBQWUsU0FBUyxDQUFDLFNBQVYsQ0FBQSxDQUFmLENBQW5CLENBQUQsQ0FBcEMsR0FBK0YsUUFBL0YsR0FBc0csQ0FBQyxrQkFBQSxDQUFtQixJQUFJLENBQUMsU0FBTCxDQUFlLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBZixDQUFBLENBQWYsQ0FBbkIsQ0FBRCxDQUQ3RyxDQUFBO0FBQUEsWUFFQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsR0FBcEIsRUFBeUI7QUFBQSxjQUFBLEtBQUEsRUFBTyxNQUFQO2FBQXpCLENBRkEsQ0FBQTtBQUFBLFlBSUEsS0FBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQUEsQ0FKQSxDQUFBO21CQUtBLEtBQUMsQ0FBQSxNQUFELENBQUEsRUFURjtXQURDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FQSCxFQUhRO0lBQUEsQ0F2SlYsQ0FBQTs7QUFBQSx3QkE4S0EsYUFBQSxHQUFlLFNBQUMsR0FBRCxHQUFBO0FBQ2IsTUFBQSxJQUFDLENBQUEsVUFBRCxDQUFZLHNCQUFaLENBQUEsQ0FBQTtBQUNBLFlBQVUsSUFBQSxLQUFBLENBQU0sc0JBQU4sQ0FBVixDQUZhO0lBQUEsQ0E5S2YsQ0FBQTs7QUFBQSx3QkFrTEEsU0FBQSxHQUFXLFNBQUMsSUFBRCxHQUFBO0FBQ1QsTUFBQSxJQUFHLElBQUksQ0FBQyxNQUFSO2VBQ0UsSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFWLEVBREY7T0FBQSxNQUVLLElBQUcsSUFBSSxDQUFDLEtBQVI7QUFDSCxRQUFBLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxPQUFsQixDQUEwQixFQUExQixDQUFBLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxRQUFELENBQUEsQ0FEQSxDQUFBO0FBQUEsUUFFQSxJQUFDLENBQUEsVUFBRCxDQUFZLElBQUksQ0FBQyxJQUFqQixDQUZBLENBQUE7QUFBQSxRQUdBLElBQUMsQ0FBQSxJQUFJLENBQUMsaUJBQU4sR0FBMEIsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsSUFBSSxDQUFDLElBQXJCLENBSDFCLENBQUE7QUFBQSxRQUlBLElBQUMsQ0FBQSxJQUFJLENBQUMsVUFBTixDQUFBLENBSkEsQ0FBQTtlQUtBLElBQUMsQ0FBQSxRQUFELENBQUEsRUFORztPQUFBLE1BT0EsSUFBRyxJQUFJLENBQUMsTUFBUjtBQUNILFFBQUEsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IseUJBQWhCLENBQUg7QUFDRSxVQUFBLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxPQUFsQixDQUEwQixFQUExQixDQUFBLENBQUE7QUFBQSxVQUNBLElBQUMsQ0FBQSxRQUFELENBQUEsQ0FEQSxDQUFBO0FBQUEsVUFFQSxJQUFDLENBQUEsVUFBRCxDQUFZLElBQUksQ0FBQyxJQUFqQixDQUZBLENBQUE7aUJBR0EsSUFBQyxDQUFBLFFBQUQsQ0FBQSxFQUpGO1NBQUEsTUFBQTtpQkFNRSxJQUFDLENBQUEsUUFBRCxDQUFVLElBQVYsRUFORjtTQURHO09BQUEsTUFBQTtlQVVILElBQUMsQ0FBQSxRQUFELENBQVUscURBQVYsRUFWRztPQVZJO0lBQUEsQ0FsTFgsQ0FBQTs7QUFBQSx3QkF3TUEsZUFBQSxHQUFpQixTQUFBLEdBQUE7YUFDZixJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxnQkFBcEMsRUFBc0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNyRSxjQUFBLElBQUE7QUFBQSxVQUFBLElBQUEsR0FBTyxLQUFDLENBQUEsZUFBRCxDQUFBLENBQVAsQ0FBQTtBQUNBLFVBQUEsSUFBRyxJQUFJLENBQUMsTUFBUjttQkFDRSxLQUFDLENBQUEsUUFBRCxDQUFVLElBQVYsRUFERjtXQUFBLE1BRUssSUFBRyxJQUFJLENBQUMsS0FBUjttQkFDSCxLQUFDLENBQUEsYUFBRCxDQUFlLElBQWYsRUFERztXQUpnRTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXRELENBQWpCLEVBRGU7SUFBQSxDQXhNakIsQ0FBQTs7cUJBQUE7O0tBRHNCLGVBbEIxQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/remote-edit/lib/view/files-view.coffee
