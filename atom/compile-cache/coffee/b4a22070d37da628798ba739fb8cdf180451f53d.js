(function() {
  var Host, LocalFile, Path, RemoteFile, Serializable, SftpHost, async, err, filesize, fs, keytar, moment, osenv, ssh2, util, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Host = require('./host');

  RemoteFile = require('./remote-file');

  LocalFile = require('./local-file');

  fs = require('fs-plus');

  ssh2 = require('ssh2');

  async = require('async');

  util = require('util');

  filesize = require('file-size');

  moment = require('moment');

  Serializable = require('serializable');

  Path = require('path');

  osenv = require('osenv');

  _ = require('underscore-plus');

  try {
    keytar = require('keytar');
  } catch (_error) {
    err = _error;
    console.debug('Keytar could not be loaded! Passwords will be stored in cleartext to remoteEdit.json!');
    keytar = void 0;
  }

  module.exports = SftpHost = (function(_super) {
    __extends(SftpHost, _super);

    Serializable.includeInto(SftpHost);

    atom.deserializers.add(SftpHost);

    Host.registerDeserializers(SftpHost);

    SftpHost.prototype.connection = void 0;

    SftpHost.prototype.protocol = "sftp";

    function SftpHost(alias, hostname, directory, username, port, localFiles, usePassword, useAgent, usePrivateKey, password, passphrase, privateKeyPath, lastOpenDirectory) {
      this.alias = alias != null ? alias : null;
      this.hostname = hostname;
      this.directory = directory;
      this.username = username;
      this.port = port != null ? port : "22";
      this.localFiles = localFiles != null ? localFiles : [];
      this.usePassword = usePassword != null ? usePassword : false;
      this.useAgent = useAgent != null ? useAgent : true;
      this.usePrivateKey = usePrivateKey != null ? usePrivateKey : false;
      this.password = password;
      this.passphrase = passphrase;
      this.privateKeyPath = privateKeyPath;
      this.lastOpenDirectory = lastOpenDirectory;
      SftpHost.__super__.constructor.call(this, this.alias, this.hostname, this.directory, this.username, this.port, this.localFiles, this.usePassword, this.lastOpenDirectory);
    }

    SftpHost.prototype.getConnectionStringUsingAgent = function() {
      var connectionString;
      connectionString = {
        host: this.hostname,
        port: this.port,
        username: this.username
      };
      if (atom.config.get('remote-edit.agentToUse') !== 'Default') {
        _.extend(connectionString, {
          agent: atom.config.get('remote-edit.agentToUse')
        });
      } else if (process.platform === "win32") {
        _.extend(connectionString, {
          agent: 'pageant'
        });
      } else {
        _.extend(connectionString, {
          agent: process.env['SSH_AUTH_SOCK']
        });
      }
      return connectionString;
    };

    SftpHost.prototype.getConnectionStringUsingKey = function() {
      var keytarPassphrase;
      if (atom.config.get('remote-edit.storePasswordsUsingKeytar') && (keytar != null)) {
        keytarPassphrase = keytar.getPassword(this.getServiceNamePassphrase(), this.getServiceAccount());
        return {
          host: this.hostname,
          port: this.port,
          username: this.username,
          privateKey: this.getPrivateKey(this.privateKeyPath),
          passphrase: keytarPassphrase
        };
      } else {
        return {
          host: this.hostname,
          port: this.port,
          username: this.username,
          privateKey: this.getPrivateKey(this.privateKeyPath),
          passphrase: this.passphrase
        };
      }
    };

    SftpHost.prototype.getConnectionStringUsingPassword = function() {
      var keytarPassword;
      if (atom.config.get('remote-edit.storePasswordsUsingKeytar') && (keytar != null)) {
        keytarPassword = keytar.getPassword(this.getServiceNamePassword(), this.getServiceAccount());
        return {
          host: this.hostname,
          port: this.port,
          username: this.username,
          password: keytarPassword
        };
      } else {
        return {
          host: this.hostname,
          port: this.port,
          username: this.username,
          password: this.password
        };
      }
    };

    SftpHost.prototype.getPrivateKey = function(path) {
      if (path[0] === "~") {
        path = Path.normalize(osenv.home() + path.substring(1, path.length));
      }
      return fs.readFileSync(path, 'ascii', function(err, data) {
        if (err != null) {
          throw err;
        }
        return data.trim();
      });
    };

    SftpHost.prototype.createRemoteFileFromFile = function(path, file) {
      var remoteFile;
      remoteFile = new RemoteFile(Path.normalize("" + path + "/" + file.filename).split(Path.sep).join('/'), file.longname[0] === '-', file.longname[0] === 'd', file.longname[0] === 'l', filesize(file.attrs.size).human(), parseInt(file.attrs.mode, 10).toString(8).substr(2, 4), moment(file.attrs.mtime * 1000).format("HH:mm:ss DD/MM/YYYY"));
      return remoteFile;
    };

    SftpHost.prototype.getServiceNamePassword = function() {
      return "atom.remote-edit.ssh.password";
    };

    SftpHost.prototype.getServiceNamePassphrase = function() {
      return "atom.remote-edit.ssh.passphrase";
    };

    SftpHost.prototype.getConnectionString = function(connectionOptions) {
      if (this.useAgent) {
        return _.extend(this.getConnectionStringUsingAgent(), connectionOptions);
      } else if (this.usePrivateKey) {
        return _.extend(this.getConnectionStringUsingKey(), connectionOptions);
      } else if (this.usePassword) {
        return _.extend(this.getConnectionStringUsingPassword(), connectionOptions);
      } else {
        throw new Error("No valid connection method is set for SftpHost!");
      }
    };

    SftpHost.prototype.close = function(callback) {
      var _ref;
      if ((_ref = this.connection) != null) {
        _ref.end();
      }
      return typeof callback === "function" ? callback(null) : void 0;
    };

    SftpHost.prototype.connect = function(callback, connectionOptions) {
      if (connectionOptions == null) {
        connectionOptions = {};
      }
      this.emitter.emit('info', {
        message: "Connecting to sftp://" + this.username + "@" + this.hostname + ":" + this.port,
        type: 'info'
      });
      return async.waterfall([
        (function(_this) {
          return function(callback) {
            if (_this.usePrivateKey) {
              return fs.exists(_this.privateKeyPath, (function(exists) {
                if (exists) {
                  return callback(null);
                } else {
                  _this.emitter.emit('info', {
                    message: "Private key does not exist!",
                    type: 'error'
                  });
                  return callback(new Error("Private key does not exist"));
                }
              }));
            } else {
              return callback(null);
            }
          };
        })(this), (function(_this) {
          return function(callback) {
            _this.connection = new ssh2();
            _this.connection.on('error', function(err) {
              _this.emitter.emit('info', {
                message: "Error occured when connecting to sftp://" + _this.username + "@" + _this.hostname + ":" + _this.port,
                type: 'error'
              });
              _this.connection.end();
              return callback(err);
            });
            _this.connection.on('ready', function() {
              _this.emitter.emit('info', {
                message: "Successfully connected to sftp://" + _this.username + "@" + _this.hostname + ":" + _this.port,
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

    SftpHost.prototype.isConnected = function() {
      return (this.connection != null) && this.connection._state === 'authenticated';
    };

    SftpHost.prototype.getFilesMetadata = function(path, callback) {
      return async.waterfall([
        (function(_this) {
          return function(callback) {
            return _this.connection.sftp(callback);
          };
        })(this), function(sftp, callback) {
          return sftp.readdir(path, callback);
        }, (function(_this) {
          return function(files, callback) {
            return async.map(files, (function(file, callback) {
              return callback(null, _this.createRemoteFileFromFile(path, file));
            }), callback);
          };
        })(this), function(objects, callback) {
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
              message: "Error occured when reading remote directory sftp://" + _this.username + "@" + _this.hostname + ":" + _this.port + ":" + path,
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

    SftpHost.prototype.getFile = function(localFile, callback) {
      this.emitter.emit('info', {
        message: "Getting remote file sftp://" + this.username + "@" + this.hostname + ":" + this.port + localFile.remoteFile.path,
        type: 'info'
      });
      return async.waterfall([
        (function(_this) {
          return function(callback) {
            return _this.connection.sftp(callback);
          };
        })(this), (function(_this) {
          return function(sftp, callback) {
            return sftp.fastGet(localFile.remoteFile.path, localFile.path, function(err) {
              return callback(err, sftp);
            });
          };
        })(this)
      ], (function(_this) {
        return function(err, sftp) {
          if (err != null) {
            _this.emitter.emit('info', {
              message: "Error when reading remote file sftp://" + _this.username + "@" + _this.hostname + ":" + _this.port + localFile.remoteFile.path,
              type: 'error'
            });
          }
          if (err == null) {
            _this.emitter.emit('info', {
              message: "Successfully read remote file sftp://" + _this.username + "@" + _this.hostname + ":" + _this.port + localFile.remoteFile.path,
              type: 'success'
            });
          }
          return typeof callback === "function" ? callback(err, localFile) : void 0;
        };
      })(this));
    };

    SftpHost.prototype.writeFile = function(localFile, callback) {
      this.emitter.emit('info', {
        message: "Writing remote file sftp://" + this.username + "@" + this.hostname + ":" + this.port + localFile.remoteFile.path,
        type: 'info'
      });
      return async.waterfall([
        (function(_this) {
          return function(callback) {
            return _this.connection.sftp(callback);
          };
        })(this), function(sftp, callback) {
          return sftp.fastPut(localFile.path, localFile.remoteFile.path, callback);
        }
      ], (function(_this) {
        return function(err) {
          if (err != null) {
            _this.emitter.emit('info', {
              message: "Error occured when writing remote file sftp://" + _this.username + "@" + _this.hostname + ":" + _this.port + localFile.remoteFile.path,
              type: 'error'
            });
            if (err != null) {
              console.error(err);
            }
          } else {
            _this.emitter.emit('info', {
              message: "Successfully wrote remote file sftp://" + _this.username + "@" + _this.hostname + ":" + _this.port + localFile.remoteFile.path,
              type: 'success'
            });
          }
          _this.close();
          return typeof callback === "function" ? callback(err) : void 0;
        };
      })(this));
    };

    SftpHost.prototype.serializeParams = function() {
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
        useAgent: this.useAgent,
        usePrivateKey: this.usePrivateKey,
        usePassword: this.usePassword,
        password: this.password,
        passphrase: this.passphrase,
        privateKeyPath: this.privateKeyPath,
        lastOpenDirectory: this.lastOpenDirectory
      };
    };

    SftpHost.prototype.deserializeParams = function(params) {
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

    return SftpHost;

  })(Host);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcmVtb3RlLWVkaXQvbGliL21vZGVsL3NmdHAtaG9zdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUhBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FEYixDQUFBOztBQUFBLEVBRUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSLENBRlosQ0FBQTs7QUFBQSxFQUlBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUpMLENBQUE7O0FBQUEsRUFLQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FMUCxDQUFBOztBQUFBLEVBTUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSLENBTlIsQ0FBQTs7QUFBQSxFQU9BLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQVBQLENBQUE7O0FBQUEsRUFRQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFdBQVIsQ0FSWCxDQUFBOztBQUFBLEVBU0EsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBVFQsQ0FBQTs7QUFBQSxFQVVBLFlBQUEsR0FBZSxPQUFBLENBQVEsY0FBUixDQVZmLENBQUE7O0FBQUEsRUFXQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FYUCxDQUFBOztBQUFBLEVBWUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSLENBWlIsQ0FBQTs7QUFBQSxFQWFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FiSixDQUFBOztBQWNBO0FBQ0UsSUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVIsQ0FBVCxDQURGO0dBQUEsY0FBQTtBQUdFLElBREksWUFDSixDQUFBO0FBQUEsSUFBQSxPQUFP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

//# sourceURL=/Users/doot/.atom/packages/remote-edit/lib/model/sftp-host.coffee
