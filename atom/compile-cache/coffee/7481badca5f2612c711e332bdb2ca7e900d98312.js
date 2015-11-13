(function() {
  var Emitter, Host, Serializable, async, fs, hash, osenv, _;

  Serializable = require('serializable');

  async = require('async');

  Emitter = require('atom').Emitter;

  hash = require('string-hash');

  _ = require('underscore-plus');

  osenv = require('osenv');

  fs = require('fs-plus');

  module.exports = Host = (function() {
    Serializable.includeInto(Host);

    atom.deserializers.add(Host);

    function Host(alias, hostname, directory, username, port, localFiles, usePassword, lastOpenDirectory) {
      this.alias = alias != null ? alias : null;
      this.hostname = hostname;
      this.directory = directory != null ? directory : "/";
      this.username = username != null ? username : osenv.user();
      this.port = port;
      this.localFiles = localFiles != null ? localFiles : [];
      this.usePassword = usePassword;
      this.lastOpenDirectory = lastOpenDirectory;
      this.emitter = new Emitter;
      if (atom.config.get('remote-edit.clearFileList')) {
        _.each(this.localFiles, (function(_this) {
          return function(val) {
            return _this.removeLocalFile(val);
          };
        })(this));
      } else {
        _.each(this.localFiles, (function(_this) {
          return function(val) {
            return fs.exists(val.path, function(exists) {
              if (!exists) {
                return _this.removeLocalFile(val);
              }
            });
          };
        })(this));
      }
    }

    Host.prototype.getServiceAccount = function() {
      return "" + this.username + "@" + this.hostname + ":" + this.port;
    };

    Host.prototype.destroy = function() {
      return this.emitter.dispose();
    };

    Host.prototype.getConnectionString = function() {
      throw new Error("Function getConnectionString() needs to be implemented by subclasses!");
    };

    Host.prototype.connect = function(callback, connectionOptions) {
      if (connectionOptions == null) {
        connectionOptions = {};
      }
      throw new Error("Function connect(callback) needs to be implemented by subclasses!");
    };

    Host.prototype.close = function(callback) {
      throw new Error("Needs to be implemented by subclasses!");
    };

    Host.prototype.getFilesMetadata = function(path, callback) {
      throw new Error("Function getFiles(Callback) needs to be implemented by subclasses!");
    };

    Host.prototype.getFile = function(localFile, callback) {
      throw new Error("Must be implemented in subclass!");
    };

    Host.prototype.writeFile = function(localFile, callback) {
      throw new Error("Must be implemented in subclass!");
    };

    Host.prototype.serializeParams = function() {
      throw new Error("Must be implemented in subclass!");
    };

    Host.prototype.isConnected = function() {
      throw new Error("Must be implemented in subclass!");
    };

    Host.prototype.hashCode = function() {
      return hash(this.hostname + this.directory + this.username + this.port);
    };

    Host.prototype.addLocalFile = function(localFile) {
      this.localFiles.push(localFile);
      return this.emitter.emit('did-change', localFile);
    };

    Host.prototype.removeLocalFile = function(localFile) {
      this.localFiles = _.reject(this.localFiles, (function(val) {
        return val === localFile;
      }));
      return this.emitter.emit('did-change', localFile);
    };

    Host.prototype["delete"] = function() {
      var file, _i, _len, _ref;
      _ref = this.localFiles;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        file["delete"]();
      }
      return this.emitter.emit('did-delete', this);
    };

    Host.prototype.invalidate = function() {
      return this.emitter.emit('did-change');
    };

    Host.prototype.onDidChange = function(callback) {
      return this.emitter.on('did-change', callback);
    };

    Host.prototype.onDidDelete = function(callback) {
      return this.emitter.on('did-delete', callback);
    };

    Host.prototype.onInfo = function(callback) {
      return this.emitter.on('info', callback);
    };

    return Host;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcmVtb3RlLWVkaXQvbGliL21vZGVsL2hvc3QuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNEQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxjQUFSLENBQWYsQ0FBQTs7QUFBQSxFQUNBLEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUixDQURSLENBQUE7O0FBQUEsRUFFQyxVQUFXLE9BQUEsQ0FBUSxNQUFSLEVBQVgsT0FGRCxDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxhQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUlBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FKSixDQUFBOztBQUFBLEVBS0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSLENBTFIsQ0FBQTs7QUFBQSxFQU1BLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQU5MLENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBQ0osSUFBQSxZQUFZLENBQUMsV0FBYixDQUF5QixJQUF6QixDQUFBLENBQUE7O0FBQUEsSUFDQSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQW5CLENBQXVCLElBQXZCLENBREEsQ0FBQTs7QUFHYSxJQUFBLGNBQUUsS0FBRixFQUFpQixRQUFqQixFQUE0QixTQUE1QixFQUE4QyxRQUE5QyxFQUF3RSxJQUF4RSxFQUErRSxVQUEvRSxFQUFpRyxXQUFqRyxFQUErRyxpQkFBL0csR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLHdCQUFBLFFBQVEsSUFDckIsQ0FBQTtBQUFBLE1BRDJCLElBQUMsQ0FBQSxXQUFBLFFBQzVCLENBQUE7QUFBQSxNQURzQyxJQUFDLENBQUEsZ0NBQUEsWUFBWSxHQUNuRCxDQUFBO0FBQUEsTUFEd0QsSUFBQyxD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

//# sourceURL=/Users/doot/.atom/packages/remote-edit/lib/model/host.coffee
