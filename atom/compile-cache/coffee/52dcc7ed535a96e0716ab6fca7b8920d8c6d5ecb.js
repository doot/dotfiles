(function() {
  var FtpHost, Host, LocalFile, Path, RemoteFile, Serializable, async, err, filesize, fs, ftp, keytar, moment, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Host = require('./host');

  RemoteFile = require('./remote-file');

  LocalFile = require('./local-file');

  async = require('async');

  filesize = require('file-size');

  moment = require('moment');

  ftp = require('ftp');

  Serializable = require('serializable');

  Path = require('path');

  _ = require('underscore-plus');

  fs = require('fs-plus');

  try {
    keytar = require('keytar');
  } catch (_error) {
    err = _error;
    console.debug('Keytar could not be loaded! Passwords will be stored in cleartext to remoteEdit.json!');
    keytar = void 0;
  }

  module.exports = FtpHost = (function(_super) {
    __extends(FtpHost, _super);

    Serializable.includeInto(FtpHost);

    atom.deserializers.add(FtpHost);

    Host.registerDeserializers(FtpHost);

    FtpHost.prototype.connection = void 0;

    FtpHost.prototype.protocol = "ftp";

    function FtpHost(alias, hostname, directory, username, port, localFiles, usePassword, password, lastOpenDirectory) {
      this.alias = alias != null ? alias : null;
      this.hostname = hostname;
      this.directory = directory;
      this.username = username;
      this.port = port != null ? port : "21";
      this.localFiles = localFiles != null ? localFiles : [];
      this.usePassword = usePassword != null ? usePassword : true;
      this.password = password;
      this.lastOpenDirectory = lastOpenDirectory;
      FtpHost.__super__.constructor.call(this, this.alias, this.hostname, this.directory, this.username, this.port, this.localFiles, this.usePassword, this.lastOpenDirectory);
    }

    FtpHost.prototype.createRemoteFileFromListObj = function(name, item) {
      var remoteFile;
      if (!((item.name != null) && item.name !== '..' && item.name !== '.')) {
        return void 0;
      }
      remoteFile = new RemoteFile(Path.normalize(name + '/' + item.name).split(Path.sep).join('/'), false, false, false, filesize(item.size).human(), null, null);
      if (item.type === "d") {
        remoteFile.isDir = true;
      } else if (item.type === "-") {
        remoteFile.isFile = true;
      } else if (item.type === 'l') {
        remoteFile.isLink = true;
      }
      if (item.rights != null) {
        remoteFile.permissions = this.convertRWXToNumber(item.rights.user) + this.convertRWXToNumber(item.rights.group) + this.convertRWXToNumber(item.rights.other);
      }
      if (item.date != null) {
        remoteFile.lastModified = moment(item.date).format("HH:mm:ss DD/MM/YYYY");
      }
      return remoteFile;
    };

    FtpHost.prototype.convertRWXToNumber = function(str) {
      var i, toreturn, _i, _len;
      toreturn = 0;
      for (_i = 0, _len = str.length; _i < _len; _i++) {
        i = str[_i];
        if (i === 'r') {
          toreturn += 4;
        } else if (i === 'w') {
          toreturn += 2;
        } else if (i === 'x') {
          toreturn += 1;
        }
      }
      return toreturn.toString();
    };

    FtpHost.prototype.getServiceNamePassword = function() {
      return "atom.remote-edit.ftp.password";
    };

    FtpHost.prototype.getConnectionString = function(connectionOptions) {
      var keytarPassword;
      if (atom.config.get('remote-edit.storePasswordsUsingKeytar') && (keytar != null)) {
        keytarPassword = keytar.getPassword(this.getServiceNamePassword(), this.getServiceAccount());
        return _.extend({
          host: this.hostname,
          port: this.port,
          user: this.username,
          password: keytarPassword
        }, connectionOptions);
      } else {
        return _.extend({
          host: this.hostname,
          port: this.port,
          user: this.username,
          password: this.password
        }, connectionOptions);
      }
    };

    FtpHost.prototype.close = function(callback) {
      var _ref;
      if ((_ref = this.connection) != null) {
        _ref.end();
      }
      return typeof callback === "function" ? callback(null) : void 0;
    };

    FtpHost.prototype.connect = function(callback, connectionOptions) {
      if (connectionOptions == null) {
        connectionOptions = {};
      }
      this.emitter.emit('info', {
        message: "Connecting to ftp://" + this.username + "@" + this.hostname + ":" + this.port,
        type: 'info'
      });
      return async.waterfall([
        (function(_this) {
          return function(callback) {
            _this.connection = new ftp();
            _this.connection.on('error', function(err) {
              _this.connection.end();
              _this.emitter.emit('info', {
                message: "Error occured when connecting to ftp://" + _this.username + "@" + _this.hostname + ":" + _this.port,
                type: 'error'
              });
              return typeof callback === "function" ? callback(err) : void 0;
            });
            _this.connection.on('ready', function() {
              _this.emitter.emit('info', {
                message: "Successfully connected to ftp://" + _this.username + "@" + _this.hostname + ":" + _this.port,
                type: 'success'
              });
              return callback(null);
            });
            return _this.connection.connect(_this.getConnectionString(connectionOptions));
          };
        })(this)
      ], function(err) {
        return typeof callback === "function" ? callback(err) : void 0;
      });
    };

    FtpHost.prototype.isConnected = function() {
      return (this.connection != null) && this.connection.connected;
    };

    FtpHost.prototype.getFilesMetadata = function(path, callback) {
      return async.waterfall([
        (function(_this) {
          return function(callback) {
            return _this.connection.list(path, callback);
          };
        })(this), (function(_this) {
          return function(files, callback) {
            return async.map(files, (function(item, callback) {
              return callback(null, _this.createRemoteFileFromListObj(path, item));
            }), callback);
          };
        })(this), function(objects, callback) {
          return async.filter(objects, (function(item, callback) {
            return callback(item != null);
          }), (function(result) {
            return callback(null, result);
          }));
        }, function(objects, callback) {
          objects.push(new RemoteFile(path + "/..", false, true, false, null, null, null));
          if (atom.config.get('remote-edit.showHiddenFiles')) {
            return callback(null, objects);
          } else {
            return async.filter(objects, (function(item, callback) {
              return item.isHidden(callback);
            }), (function(result) {
              return callback(null, result);
            }));
          }
        }
      ], (function(_this) {
        return function(err, result) {
          if (err != null) {
            _this.emitter.emit('info', {
              message: "Error occured when reading remote directory ftp://" + _this.username + "@" + _this.hostname + ":" + _this.port + ":" + path,
              type: 'error'
            });
            if (err != null) {
              console.error(err);
            }
            return typeof callback === "function" ? callback(err) : void 0;
          } else {
            return typeof callback === "function" ? callback(err, result.sort(function(a, b) {
              if (a.name.toLowerCase() >= b.name.toLowerCase()) {
                return 1;
              } else {
                return -1;
              }
            })) : void 0;
          }
        };
      })(this));
    };

    FtpHost.prototype.getFile = function(localFile, callback) {
      this.emitter.emit('info', {
        message: "Getting remote file ftp://" + this.username + "@" + this.hostname + ":" + this.port + localFile.remoteFile.path,
        type: 'info'
      });
      return async.waterfall([
        (function(_this) {
          return function(callback) {
            return _this.connection.get(localFile.remoteFile.path, callback);
          };
        })(this), (function(_this) {
          return function(readableStream, callback) {
            var writableStream;
            writableStream = fs.createWriteStream(localFile.path);
            readableStream.pipe(writableStream);
            return readableStream.on('end', function() {
              return callback(null);
            });
          };
        })(this)
      ], (function(_this) {
        return function(err) {
          if (err != null) {
            _this.emitter.emit('info', {
              message: "Error when reading remote file ftp://" + _this.username + "@" + _this.hostname + ":" + _this.port + localFile.remoteFile.path,
              type: 'error'
            });
            return typeof callback === "function" ? callback(err, localFile) : void 0;
          } else {
            _this.emitter.emit('info', {
              message: "Successfully read remote file ftp://" + _this.username + "@" + _this.hostname + ":" + _this.port + localFile.remoteFile.path,
              type: 'success'
            });
            return typeof callback === "function" ? callback(null, localFile) : void 0;
          }
        };
      })(this));
    };

    FtpHost.prototype.writeFile = function(localFile, callback) {
      this.emitter.emit('info', {
        message: "Writing remote file ftp://" + this.username + "@" + this.hostname + ":" + this.port + localFile.remoteFile.path,
        type: 'info'
      });
      return async.waterfall([
        (function(_this) {
          return function(callback) {
            return _this.connection.put(localFile.path, localFile.remoteFile.path, callback);
          };
        })(this)
      ], (function(_this) {
        return function(err) {
          if (err != null) {
            _this.emitter.emit('info', {
              message: "Error occured when writing remote file ftp://" + _this.username + "@" + _this.hostname + ":" + _this.port + localFile.remoteFile.path,
              type: 'error'
            });
            if (err != null) {
              console.error(err);
            }
          } else {
            _this.emitter.emit('info', {
              message: "Successfully wrote remote file ftp://" + _this.username + "@" + _this.hostname + ":" + _this.port + localFile.remoteFile.path,
              type: 'success'
            });
          }
          _this.close();
          return typeof callback === "function" ? callback(err) : void 0;
        };
      })(this));
    };

    FtpHost.prototype.serializeParams = function() {
      var localFile;
      return {
        alias: this.alias,
        hostname: this.hostname,
        directory: this.directory,
        username: this.username,
        port: this.port,
        localFiles: (function() {
          var _i, _len, _ref, _results;
          _ref = this.localFiles;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            localFile = _ref[_i];
            _results.push(localFile.serialize());
          }
          return _results;
        }).call(this),
        usePassword: this.usePassword,
        password: this.password,
        lastOpenDirectory: this.lastOpenDirectory
      };
    };

    FtpHost.prototype.deserializeParams = function(params) {
      var localFile, tmpArray, _i, _len, _ref;
      tmpArray = [];
      _ref = params.localFiles;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        localFile = _ref[_i];
        tmpArray.push(LocalFile.deserialize(localFile, {
          host: this
        }));
      }
      params.localFiles = tmpArray;
      return params;
    };

    return FtpHost;

  })(Host);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcmVtb3RlLWVkaXQvbGliL21vZGVsL2Z0cC1ob3N0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwR0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUVBLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUZiLENBQUE7O0FBQUEsRUFHQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FIWixDQUFBOztBQUFBLEVBS0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSLENBTFIsQ0FBQTs7QUFBQSxFQU1BLFFBQUEsR0FBVyxPQUFBLENBQVEsV0FBUixDQU5YLENBQUE7O0FBQUEsRUFPQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVIsQ0FQVCxDQUFBOztBQUFBLEVBUUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxLQUFSLENBUk4sQ0FBQTs7QUFBQSxFQVNBLFlBQUEsR0FBZSxPQUFBLENBQVEsY0FBUixDQVRmLENBQUE7O0FBQUEsRUFVQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FWUCxDQUFBOztBQUFBLEVBV0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQVhKLENBQUE7O0FBQUEsRUFZQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FaTCxDQUFBOztBQWNBO0FBQ0UsSUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVIsQ0FBVCxDQURGO0dBQUEsY0FBQTtBQUdFLElBREksWUFDSixDQUFBO0FBQUEsSUFBQSxPQUFPLENBQUMsS0FBUixDQUFjLHVGQUFkLENBQUEsQ0FBQTtBQUFBLElBQ0EsTUFBQSxHQUFTLE1BRFQsQ0FIRjtHQWRBOztBQUFBLEVBb0JBLE1BQU0sQ0FBQyxPQUFQ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

//# sourceURL=/Users/doot/.atom/packages/remote-edit/lib/model/ftp-host.coffee
