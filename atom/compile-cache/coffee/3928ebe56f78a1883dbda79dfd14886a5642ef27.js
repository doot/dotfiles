(function() {
  var Dialog, DisplayBuffer, Editor, FtpHost, Host, LocalFile, RemoteEditEditor, Serializable, SftpHost, TextEditor, async, e, path, resourcePath, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  path = require('path');

  resourcePath = atom.config.resourcePath;

  try {
    Editor = require(path.resolve(resourcePath, 'src', 'editor'));
  } catch (_error) {
    e = _error;
  }

  TextEditor = Editor != null ? Editor : require(path.resolve(resourcePath, 'src', 'text-editor'));

  DisplayBuffer = require(path.resolve(resourcePath, 'src', 'display-buffer'));

  Serializable = require('serializable');

  Host = null;

  FtpHost = null;

  SftpHost = null;

  LocalFile = null;

  async = null;

  Dialog = null;

  _ = null;

  module.exports = RemoteEditEditor = (function(_super) {
    __extends(RemoteEditEditor, _super);

    Serializable.includeInto(RemoteEditEditor);

    atom.deserializers.add(RemoteEditEditor);

    TextEditor.registerDeserializer(RemoteEditEditor);

    function RemoteEditEditor(_arg) {
      var buffer, initialColumn, initialLine, registerEditor, softWrap, suppressCursorCreation, tabLength;
      this.softTabs = _arg.softTabs, initialLine = _arg.initialLine, initialColumn = _arg.initialColumn, tabLength = _arg.tabLength, softWrap = _arg.softWrap, this.displayBuffer = _arg.displayBuffer, buffer = _arg.buffer, registerEditor = _arg.registerEditor, suppressCursorCreation = _arg.suppressCursorCreation, this.mini = _arg.mini, this.host = _arg.host, this.localFile = _arg.localFile;
      RemoteEditEditor.__super__.constructor.call(this, {
        softTabs: this.softTabs,
        initialLine: initialLine,
        initialColumn: initialColumn,
        tabLength: tabLength,
        softWrap: softWrap,
        displayBuffer: this.displayBuffer,
        buffer: buffer,
        registerEditor: registerEditor,
        suppressCursorCreation: suppressCursorCreation,
        mini: this.mini
      });
    }

    RemoteEditEditor.prototype.getIconName = function() {
      return "globe";
    };

    RemoteEditEditor.prototype.getTitle = function() {
      var sessionPath;
      if (this.localFile != null) {
        return this.localFile.name;
      } else if (sessionPath = this.getPath()) {
        return path.basename(sessionPath);
      } else {
        return "undefined";
      }
    };

    RemoteEditEditor.prototype.getLongTitle = function() {
      var directory, fileName, i, relativePath;
      if (Host == null) {
        Host = require('./host');
      }
      if (FtpHost == null) {
        FtpHost = require('./ftp-host');
      }
      if (SftpHost == null) {
        SftpHost = require('./sftp-host');
      }
      if (i = this.localFile.remoteFile.path.indexOf(this.host.directory) > -1) {
        relativePath = this.localFile.remoteFile.path.slice(i + this.host.directory.length);
      }
      fileName = this.getTitle();
      if (this.host instanceof SftpHost && (this.host != null) && (this.localFile != null)) {
        directory = relativePath != null ? relativePath : "sftp://" + this.host.username + "@" + this.host.hostname + ":" + this.host.port + this.localFile.remoteFile.path;
      } else if (this.host instanceof FtpHost && (this.host != null) && (this.localFile != null)) {
        directory = relativePath != null ? relativePath : "ftp://" + this.host.username + "@" + this.host.hostname + ":" + this.host.port + this.localFile.remoteFile.path;
      } else {
        directory = atom.project.relativize(path.dirname(sessionPath));
        directory = directory.length > 0 ? directory : path.basename(path.dirname(sessionPath));
      }
      return "" + fileName + " - " + directory;
    };

    RemoteEditEditor.prototype.onDidSaved = function(callback) {
      return this.emitter.on('did-saved', callback);
    };

    RemoteEditEditor.prototype.save = function() {
      this.buffer.save();
      this.emitter.emit('saved');
      return this.initiateUpload();
    };

    RemoteEditEditor.prototype.saveAs = function(filePath) {
      this.buffer.saveAs(filePath);
      this.localFile.path = filePath;
      this.emitter.emit('saved');
      return this.initiateUpload();
    };

    RemoteEditEditor.prototype.initiateUpload = function() {
      var chosen;
      if (atom.config.get('remote-edit.uploadOnSave')) {
        return this.upload();
      } else {
        if (Dialog == null) {
          Dialog = require('../view/dialog');
        }
        chosen = atom.confirm({
          message: "File has been saved. Do you want to upload changes to remote host?",
          detailedMessage: "The changes exists on disk and can be uploaded later.",
          buttons: ["Upload", "Cancel"]
        });
        switch (chosen) {
          case 0:
            return this.upload();
          case 1:
        }
      }
    };

    RemoteEditEditor.prototype.upload = function(connectionOptions) {
      if (connectionOptions == null) {
        connectionOptions = {};
      }
      if (async == null) {
        async = require('async');
      }
      if (_ == null) {
        _ = require('underscore-plus');
      }
      if ((this.localFile != null) && (this.host != null)) {
        return async.waterfall([
          (function(_this) {
            return function(callback) {
              if (_this.host.usePassword && (connectionOptions.password == null)) {
                if (_this.host.password === "" || _this.host.password === '' || (_this.host.password == null)) {
                  return async.waterfall([
                    function(callback) {
                      var passwordDialog;
                      if (Dialog == null) {
                        Dialog = require('../view/dialog');
                      }
                      passwordDialog = new Dialog({
                        prompt: "Enter password"
                      });
                      return passwordDialog.toggle(callback);
                    }
                  ], function(err, result) {
                    connectionOptions = _.extend({
                      password: result
                    }, connectionOptions);
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
                return _this.host.connect(callback, connectionOptions);
              } else {
                return callback(null);
              }
            };
          })(this), (function(_this) {
            return function(callback) {
              return _this.host.writeFile(_this.localFile, callback);
            };
          })(this)
        ], (function(_this) {
          return function(err) {
            if ((err != null) && _this.host.usePassword) {
              return async.waterfall([
                function(callback) {
                  var passwordDialog;
                  if (Dialog == null) {
                    Dialog = require('../view/dialog');
                  }
                  passwordDialog = new Dialog({
                    prompt: "Enter password"
                  });
                  return passwordDialog.toggle(callback);
                }
              ], function(err, result) {
                return _this.upload({
                  password: result
                });
              });
            }
          };
        })(this));
      } else {
        return console.error('LocalFile and host not defined. Cannot upload file!');
      }
    };

    RemoteEditEditor.prototype.serializeParams = function() {
      var _ref, _ref1;
      return {
        id: this.id,
        softTabs: this.softTabs,
        scrollTop: this.scrollTop,
        scrollLeft: this.scrollLeft,
        displayBuffer: this.displayBuffer.serialize(),
        title: this.title,
        localFile: (_ref = this.localFile) != null ? _ref.serialize() : void 0,
        host: (_ref1 = this.host) != null ? _ref1.serialize() : void 0
      };
    };

    RemoteEditEditor.prototype.deserializeParams = function(params) {
      params.displayBuffer = DisplayBuffer.deserialize(params.displayBuffer);
      params.registerEditor = true;
      if (params.localFile != null) {
        LocalFile = require('../model/local-file');
        params.localFile = LocalFile.deserialize(params.localFile);
      }
      if (params.host != null) {
        Host = require('../model/host');
        FtpHost = require('../model/ftp-host');
        SftpHost = require('../model/sftp-host');
        params.host = Host.deserialize(params.host);
      }
      return params;
    };

    return RemoteEditEditor;

  })(TextEditor);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcmVtb3RlLWVkaXQvbGliL21vZGVsL3JlbW90ZS1lZGl0LWVkaXRvci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsOElBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxZQUFBLEdBQWUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUQzQixDQUFBOztBQUVBO0FBQ0UsSUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLElBQUksQ0FBQyxPQUFMLENBQWEsWUFBYixFQUEyQixLQUEzQixFQUFrQyxRQUFsQyxDQUFSLENBQVQsQ0FERjtHQUFBLGNBQUE7QUFFTSxJQUFBLFVBQUEsQ0FGTjtHQUZBOztBQUFBLEVBTUEsVUFBQSxvQkFBYSxTQUFTLE9BQUEsQ0FBUSxJQUFJLENBQUMsT0FBTCxDQUFhLFlBQWIsRUFBMkIsS0FBM0IsRUFBa0MsYUFBbEMsQ0FBUixDQU50QixDQUFBOztBQUFBLEVBUUEsYUFBQSxHQUFnQixPQUFBLENBQVEsSUFBSSxDQUFDLE9BQUwsQ0FBYSxZQUFiLEVBQTJCLEtBQTNCLEVBQWtDLGdCQUFsQyxDQUFSLENBUmhCLENBQUE7O0FBQUEsRUFTQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGNBQVIsQ0FUZixDQUFBOztBQUFBLEVBWUEsSUFBQSxHQUFPLElBWlAsQ0FBQTs7QUFBQSxFQWFBLE9BQUEsR0FBVSxJQWJWLENBQUE7O0FBQUEsRUFjQSxRQUFBLEdBQVcsSUFkWCxDQUFBOztBQUFBLEVBZUEsU0FBQSxHQUFZLElBZlosQ0FBQTs7QUFBQSxFQWdCQSxLQUFBLEdBQVEsSUFoQlIsQ0FBQTs7QUFBQSxFQWlCQSxNQUFBLEdBQVMsSUFqQlQsQ0FBQTs7QUFBQSxFQWtCQSxDQUFBLEdBQUksSUFsQkosQ0FBQTs7QUFBQSxFQW9CQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBQ0osdUNBQUEsQ0FBQTs7QUFBQSxJQUFBLFlBQVksQ0FBQyxXQUFiLENBQXlCLGdCQUF6QixDQUFBLENBQUE7O0FBQUEsSUFDQSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQW5CLENBQXVCLGdCQUF2QixDQURBLENBQUE7O0FBQUEsSUFHQSxVQUFVLENBQUMsb0JBQVgsQ0FBZ0MsZ0JBQWhDLENBSEEsQ0FBQTs7QUFLYSxJQUFBLDBCQUFDLElBQUQsR0FBQTtBQUNYLFVBQUEsK0ZBQUE7QUFBQSxNQURhLElBQUMsQ0FBQSxnQkFBQSxVQUFVLG1CQUFBLGFBQWEscUJBQUEsZUFBZSxpQkFBQSxXQUFXLGdCQUFBLFVBQVUsSUFBQyxDQUFBLHFCQUFBLGVBQWUsY0FBQSxRQUFRLHNCQUFBLGdCQUFnQiw4QkFBQSx3QkFBd0IsSUFBQyxDQUFBLFlBQUEsTUFBTSxJQUFDLENBQUEsWUFBQSxNQUFNLElBQUMsQ0FBQSxpQkFBQSxTQUN4SixDQUFBO0FBQUEsTUFBQSxrREFBTTtBQUFBLFFBQUUsVUFBRCxJQUFDLENBQUEsUUFBRjtBQUFBLFFBQVksYUFBQSxXQUFaO0FBQUEsUUFBeUIsZUFBQSxhQUF6QjtBQUFBLFFBQXdDLFdBQUEsU0FBeEM7QUFBQSxRQUFtRCxVQUFBLFFBQW5EO0FBQUEsUUFBOEQsZUFBRCxJQUFDLENBQUEsYUFBOUQ7QUFBQSxRQUE2RSxRQUFBLE1BQTdFO0FBQUEsUUFBcUYsZ0JBQUEsY0FBckY7QUFBQSxRQUFxRyx3QkFBQSxzQkFBckc7QUFBQSxRQUE4SCxNQUFELElBQUMsQ0FBQSxJQUE5SDtPQUFOLENBQUEsQ0FEVztJQUFBLENBTGI7O0FBQUEsK0JBUUEsV0FBQSxHQUFhLFNBQUEsR0FBQTthQUNYLFFBRFc7SUFBQSxDQVJiLENBQUE7O0FBQUEsK0JBV0EsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLFVBQUEsV0FBQTtBQUFBLE1BQUEsSUFBRyxzQkFBSDtlQUNFLElBQUMsQ0FBQSxTQUFTLENBQUMsS0FEYjtPQUFBLE1BRUssSUFBRyxXQUFBLEdBQWMsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUFqQjtlQUNILElBQUksQ0FBQyxRQUFMLENBQWMsV0FBZCxFQURHO09BQUEsTUFBQTtlQUdILFlBSEc7T0FIRztJQUFBLENBWFYsQ0FBQTs7QUFBQSwrQkFtQkEsWUFBQSxHQUFjLFNBQUEsR0FBQTtBQUNaLFVBQUEsb0NBQUE7O1FBQUEsT0FBUSxPQUFBLENBQVEsUUFBUjtPQUFSOztRQUNBLFVBQVcsT0FBQSxDQUFRLFlBQVI7T0FEWDs7UUFFQSxXQUFZLE9BQUEsQ0FBUSxhQUFSO09BRlo7QUFJQSxNQUFBLElBQUcsQ0FBQSxHQUFJLElBQUMsQ0FBQSxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUEzQixDQUFtQyxJQUFDLENBQUEsSUFBSSxDQUFDLFNBQXpDLENBQUEsR0FBc0QsQ0FBQSxDQUE3RDtBQUNFLFFBQUEsWUFBQSxHQUFlLElBQUMsQ0FBQSxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUssc0NBQTFDLENBREY7T0FKQTtBQUFBLE1BT0EsUUFBQSxHQUFXLElBQUMsQ0FBQSxRQUFELENBQUEsQ0FQWCxDQUFBO0FBUUEsTUFBQSxJQUFHLElBQUMsQ0FBQSxJQUFELFlBQWlCLFFBQWpCLElBQThCLG1CQUE5QixJQUF5Qyx3QkFBNUM7QUFDRSxRQUFBLFNBQUEsR0FBZSxvQkFBSCxHQUFzQixZQUF0QixHQUF5QyxTQUFBLEdBQVMsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFmLEdBQXdCLEdBQXhCLEdBQTJCLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBakMsR0FBMEMsR0FBMUMsR0FBNkMsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFuRCxHQUEwRCxJQUFDLENBQUEsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFySSxDQURGO09BQUEsTUFFSyxJQUFHLElBQUMsQ0FBQSxJQUFELFlBQWlCLE9BQWpCLElBQTZCLG1CQUE3QixJQUF3Qyx3QkFBM0M7QUFDSCxRQUFBLFNBQUEsR0FBZSxvQkFBSCxHQUFzQixZQUF0QixHQUF5QyxRQUFBLEdBQVEsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFkLEdBQXVCLEdBQXZCLEdBQTBCLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBaEMsR0FBeUMsR0FBekMsR0FBNEMsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFsRCxHQUF5RCxJQUFDLENBQUEsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFwSSxDQURHO09BQUEsTUFBQTtBQUdILFFBQUEsU0FBQSxHQUFZLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBYixDQUF3QixJQUFJLENBQUMsT0FBTCxDQUFhLFdBQWIsQ0FBeEIsQ0FBWixDQUFBO0FBQUEsUUFDQSxTQUFBLEdBQWUsU0FBUyxDQUFDLE1BQVYsR0FBbUIsQ0FBdEIsR0FBNkIsU0FBN0IsR0FBNEMsSUFBSSxDQUFDLFFBQUwsQ0FBYyxJQUFJLENBQUMsT0FBTCxDQUFhLFdBQWIsQ0FBZCxDQUR4RCxDQUhHO09BVkw7YUFnQkEsRUFBQSxHQUFHLFFBQUgsR0FBWSxLQUFaLEdBQWlCLFVBakJMO0lBQUEsQ0FuQmQsQ0FBQTs7QUFBQSwrQkFzQ0EsVUFBQSxHQUFZLFNBQUMsUUFBRCxHQUFBO2FBQ1YsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksV0FBWixFQUF5QixRQUF6QixFQURVO0lBQUEsQ0F0Q1osQ0FBQTs7QUFBQSwrQkF5Q0EsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLE1BQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxPQUFkLENBREEsQ0FBQTthQUVBLElBQUMsQ0FBQSxjQUFELENBQUEsRUFISTtJQUFBLENBekNOLENBQUE7O0FBQUEsK0JBOENBLE1BQUEsR0FBUSxTQUFDLFFBQUQsR0FBQTtBQUNOLE1BQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLENBQWUsUUFBZixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxTQUFTLENBQUMsSUFBWCxHQUFrQixRQURsQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxPQUFkLENBRkEsQ0FBQTthQUdBLElBQUMsQ0FBQSxjQUFELENBQUEsRUFKTTtJQUFBLENBOUNSLENBQUE7O0FBQUEsK0JBb0RBLGNBQUEsR0FBZ0IsU0FBQSxHQUFBO0FBQ2QsVUFBQSxNQUFBO0FBQUEsTUFBQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQkFBaEIsQ0FBSDtlQUNFLElBQUMsQ0FBQSxNQUFELENBQUEsRUFERjtPQUFBLE1BQUE7O1VBR0UsU0FBVSxPQUFBLENBQVEsZ0JBQVI7U0FBVjtBQUFBLFFBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxPQUFMLENBQ1A7QUFBQSxVQUFBLE9BQUEsRUFBUyxvRUFBVDtBQUFBLFVBQ0EsZUFBQSxFQUFpQix1REFEakI7QUFBQSxVQUVBLE9BQUEsRUFBUyxDQUFDLFFBQUQsRUFBVyxRQUFYLENBRlQ7U0FETyxDQURULENBQUE7QUFLQSxnQkFBTyxNQUFQO0FBQUEsZUFDTyxDQURQO21CQUNjLElBQUMsQ0FBQSxNQUFELENBQUEsRUFEZDtBQUFBLGVBRU8sQ0FGUDtBQUFBLFNBUkY7T0FEYztJQUFBLENBcERoQixDQUFBOztBQUFBLCtCQWlFQSxNQUFBLEdBQVEsU0FBQyxpQkFBRCxHQUFBOztRQUFDLG9CQUFvQjtPQUMzQjs7UUFBQSxRQUFTLE9BQUEsQ0FBUSxPQUFSO09BQVQ7O1FBQ0EsSUFBSyxPQUFBLENBQVEsaUJBQVI7T0FETDtBQUVBLE1BQUEsSUFBRyx3QkFBQSxJQUFnQixtQkFBbkI7ZUFDRSxLQUFLLENBQUMsU0FBTixDQUFnQjtVQUNkLENBQUEsU0FBQSxLQUFBLEdBQUE7bUJBQUEsU0FBQyxRQUFELEdBQUE7QUFDRSxjQUFBLElBQUcsS0FBQyxDQUFBLElBQUksQ0FBQyxXQUFOLElBQXVCLG9DQUExQjtBQUNFLGdCQUFBLElBQUcsS0FBQyxDQUFBLElBQUksQ0FBQyxRQUFOLEtBQWtCLEVBQWxCLElBQXdCLEtBQUMsQ0FBQSxJQUFJLENBQUMsUUFBTixLQUFrQixFQUExQyxJQUFpRCw2QkFBcEQ7eUJBQ0UsS0FBSyxDQUFDLFNBQU4sQ0FBZ0I7b0JBQ2QsU0FBQyxRQUFELEdBQUE7QUFDRSwwQkFBQSxjQUFBOzt3QkFBQSxTQUFVLE9BQUEsQ0FBUSxnQkFBUjt1QkFBVjtBQUFBLHNCQUNBLGNBQUEsR0FBcUIsSUFBQSxNQUFBLENBQU87QUFBQSx3QkFBQyxNQUFBLEVBQVEsZ0JBQVQ7dUJBQVAsQ0FEckIsQ0FBQTs2QkFFQSxjQUFjLENBQUMsTUFBZixDQUFzQixRQUF0QixFQUhGO29CQUFBLENBRGM7bUJBQWhCLEVBS0csU0FBQyxHQUFELEVBQU0sTUFBTixHQUFBO0FBQ0Qsb0JBQUEsaUJBQUEsR0FBb0IsQ0FBQyxDQUFDLE1BQUYsQ0FBUztBQUFBLHNCQUFDLFFBQUEsRUFBVSxNQUFYO3FCQUFULEVBQTZCLGlCQUE3QixDQUFwQixDQUFBOzJCQUNBLFFBQUEsQ0FBUyxJQUFULEVBRkM7a0JBQUEsQ0FMSCxFQURGO2lCQUFBLE1BQUE7eUJBV0UsUUFBQSxDQUFTLElBQVQsRUFYRjtpQkFERjtlQUFBLE1BQUE7dUJBY0UsUUFBQSxDQUFTLElBQVQsRUFkRjtlQURGO1lBQUEsRUFBQTtVQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEYyxFQWlCZCxDQUFBLFNBQUEsS0FBQSxHQUFBO21CQUFBLFNBQUMsUUFBRCxHQUFBO0FBQ0UsY0FBQSxJQUFHLENBQUEsS0FBRSxDQUFBLElBQUksQ0FBQyxXQUFOLENBQUEsQ0FBSjt1QkFDRSxLQUFDLENBQUEsSUFBSSxDQUFDLE9BQU4sQ0FBYyxRQUFkLEVBQXdCLGlCQUF4QixFQURGO2VBQUEsTUFBQTt1QkFHRSxRQUFBLENBQVMsSUFBVCxFQUhGO2VBREY7WUFBQSxFQUFBO1VBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQWpCYyxFQXNCZCxDQUFBLFNBQUEsS0FBQSxHQUFBO21CQUFBLFNBQUMsUUFBRCxHQUFBO3FCQUNFLEtBQUMsQ0FBQSxJQUFJLENBQUMsU0FBTixDQUFnQixLQUFDLENBQUEsU0FBakIsRUFBNEIsUUFBNUIsRUFERjtZQUFBLEVBQUE7VUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBdEJjO1NBQWhCLEVBd0JHLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxHQUFELEdBQUE7QUFDRCxZQUFBLElBQUcsYUFBQSxJQUFTLEtBQUMsQ0FBQSxJQUFJLENBQUMsV0FBbEI7cUJBQ0UsS0FBSyxDQUFDLFNBQU4sQ0FBZ0I7Z0JBQ2QsU0FBQyxRQUFELEdBQUE7QUFDRSxzQkFBQSxjQUFBOztvQkFBQSxTQUFVLE9BQUEsQ0FBUSxnQkFBUjttQkFBVjtBQUFBLGtCQUNBLGNBQUEsR0FBcUIsSUFBQSxNQUFBLENBQU87QUFBQSxvQkFBQyxNQUFBLEVBQVEsZ0JBQVQ7bUJBQVAsQ0FEckIsQ0FBQTt5QkFFQSxjQUFjLENBQUMsTUFBZixDQUFzQixRQUF0QixFQUhGO2dCQUFBLENBRGM7ZUFBaEIsRUFLRyxTQUFDLEdBQUQsRUFBTSxNQUFOLEdBQUE7dUJBQ0QsS0FBQyxDQUFBLE1BQUQsQ0FBUTtBQUFBLGtCQUFDLFFBQUEsRUFBVSxNQUFYO2lCQUFSLEVBREM7Y0FBQSxDQUxILEVBREY7YUFEQztVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBeEJILEVBREY7T0FBQSxNQUFBO2VBcUNFLE9BQU8sQ0FBQyxLQUFSLENBQWMscURBQWQsRUFyQ0Y7T0FITTtJQUFBLENBakVSLENBQUE7O0FBQUEsK0JBMkdBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsVUFBQSxXQUFBO2FBQUE7QUFBQSxRQUFBLEVBQUEsRUFBSSxJQUFDLENBQUEsRUFBTDtBQUFBLFFBQ0EsUUFBQSxFQUFVLElBQUMsQ0FBQSxRQURYO0FBQUEsUUFFQSxTQUFBLEVBQVcsSUFBQyxDQUFBLFNBRlo7QUFBQSxRQUdBLFVBQUEsRUFBWSxJQUFDLENBQUEsVUFIYjtBQUFBLFFBSUEsYUFBQSxFQUFlLElBQUMsQ0FBQSxhQUFhLENBQUMsU0FBZixDQUFBLENBSmY7QUFBQSxRQUtBLEtBQUEsRUFBTyxJQUFDLENBQUEsS0FMUjtBQUFBLFFBTUEsU0FBQSx3Q0FBcUIsQ0FBRSxTQUFaLENBQUEsVUFOWDtBQUFBLFFBT0EsSUFBQSxxQ0FBVyxDQUFFLFNBQVAsQ0FBQSxVQVBOO1FBRGU7SUFBQSxDQTNHakIsQ0FBQTs7QUFBQSwrQkFxSEEsaUJBQUEsR0FBbUIsU0FBQyxNQUFELEdBQUE7QUFDakIsTUFBQSxNQUFNLENBQUMsYUFBUCxHQUF1QixhQUFhLENBQUMsV0FBZCxDQUEwQixNQUFNLENBQUMsYUFBakMsQ0FBdkIsQ0FBQTtBQUFBLE1BQ0EsTUFBTSxDQUFDLGNBQVAsR0FBd0IsSUFEeEIsQ0FBQTtBQUVBLE1BQUEsSUFBRyx3QkFBSDtBQUNFLFFBQUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxxQkFBUixDQUFaLENBQUE7QUFBQSxRQUNBLE1BQU0sQ0FBQyxTQUFQLEdBQW1CLFNBQVMsQ0FBQyxXQUFWLENBQXNCLE1BQU0sQ0FBQyxTQUE3QixDQURuQixDQURGO09BRkE7QUFLQSxNQUFBLElBQUcsbUJBQUg7QUFDRSxRQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsZUFBUixDQUFQLENBQUE7QUFBQSxRQUNBLE9BQUEsR0FBVSxPQUFBLENBQVEsbUJBQVIsQ0FEVixDQUFBO0FBQUEsUUFFQSxRQUFBLEdBQVcsT0FBQSxDQUFRLG9CQUFSLENBRlgsQ0FBQTtBQUFBLFFBR0EsTUFBTSxDQUFDLElBQVAsR0FBYyxJQUFJLENBQUMsV0FBTCxDQUFpQixNQUFNLENBQUMsSUFBeEIsQ0FIZCxDQURGO09BTEE7YUFVQSxPQVhpQjtJQUFBLENBckhuQixDQUFBOzs0QkFBQTs7S0FENkIsV0FyQmpDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/remote-edit/lib/model/remote-edit-editor.coffee
