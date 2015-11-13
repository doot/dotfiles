(function() {
  var CompositeDisposable, Emitter, FtpHost, Host, InterProcessData, LocalFile, RemoteEditEditor, RemoteFile, Serializable, SftpHost, _, _ref;

  Serializable = require('serializable');

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  Host = null;

  FtpHost = null;

  SftpHost = null;

  LocalFile = null;

  RemoteFile = null;

  _ = null;

  RemoteEditEditor = null;

  module.exports = InterProcessData = (function() {
    Serializable.includeInto(InterProcessData);

    atom.deserializers.add(InterProcessData);

    function InterProcessData(hostList) {
      this.hostList = hostList;
      this.emitter = new Emitter;
      this.disposables = new CompositeDisposable;
      this.load(this.hostList);
    }

    InterProcessData.prototype.destroy = function() {
      var item, _i, _len, _ref1;
      this.disposables.dispose();
      this.emitter.dispose();
      _ref1 = this.hostList;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        item = _ref1[_i];
        item.destroy();
      }
      return this.hostList = [];
    };

    InterProcessData.prototype.onDidChange = function(callback) {
      return this.emitter.on('did-change', callback);
    };

    InterProcessData.prototype.load = function(hostList) {
      var host, _i, _len, _ref1;
      this.hostList = hostList != null ? hostList : [];
      _ref1 = this.hostList;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        host = _ref1[_i];
        this.addSubscriptionToHost(host);
      }
      if (atom.config.get('remote-edit.notifications')) {
        if (RemoteEditEditor == null) {
          RemoteEditEditor = require('../model/remote-edit-editor');
        }
        return this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
          return function(editor) {
            if (editor instanceof RemoteEditEditor) {
              return _this.disposables.add(editor.host.onInfo(function(info) {
                return atom.notifications.add(info.type, info.message);
              }));
            }
          };
        })(this)));
      }
    };

    InterProcessData.prototype.serializeParams = function() {
      var host;
      return {
        hostList: (function() {
          var _i, _len, _ref1, _results;
          _ref1 = this.hostList;
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            host = _ref1[_i];
            _results.push(host.serialize());
          }
          return _results;
        }).call(this)
      };
    };

    InterProcessData.prototype.deserializeParams = function(params) {
      var host, tmpArray, _i, _len, _ref1;
      tmpArray = [];
      if (params.hostList) {
        if (Host == null) {
          Host = require('./host');
        }
        if (FtpHost == null) {
          FtpHost = require('./ftp-host');
        }
        if (SftpHost == null) {
          SftpHost = require('./sftp-host');
        }
        if (LocalFile == null) {
          LocalFile = require('./local-file');
        }
        if (RemoteFile == null) {
          RemoteFile = require('./remote-file');
        }
        _ref1 = params.hostList;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          host = _ref1[_i];
          tmpArray.push(Host.deserialize(host));
        }
      }
      params.hostList = tmpArray;
      return params;
    };

    InterProcessData.prototype.addSubscriptionToHost = function(host) {
      this.disposables.add(host.onDidChange((function(_this) {
        return function() {
          return _this.emitter.emit('did-change');
        };
      })(this)));
      this.disposables.add(host.onDidDelete((function(_this) {
        return function(host) {
          if (_ == null) {
            _ = require('underscore-plus');
          }
          host.destroy();
          _this.hostList = _.reject(_this.hostList, (function(val) {
            return val === host;
          }));
          return _this.emitter.emit('did-change');
        };
      })(this)));
      if (atom.config.get('remote-edit.notifications')) {
        return this.disposables.add(host.onInfo((function(_this) {
          return function(info) {
            return atom.notifications.add(info.type, info.message);
          };
        })(this)));
      }
    };

    InterProcessData.prototype.addNewHost = function(host) {
      this.hostList.push(host);
      this.addSubscriptionToHost(host);
      return this.emitter.emit('did-change');
    };

    return InterProcessData;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcmVtb3RlLWVkaXQvbGliL21vZGVsL2ludGVyLXByb2Nlc3MtZGF0YS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdUlBQUE7O0FBQUEsRUFBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGNBQVIsQ0FBZixDQUFBOztBQUFBLEVBQ0EsT0FBaUMsT0FBQSxDQUFRLE1BQVIsQ0FBakMsRUFBQywyQkFBQSxtQkFBRCxFQUFzQixlQUFBLE9BRHRCLENBQUE7O0FBQUEsRUFJQSxJQUFBLEdBQU8sSUFKUCxDQUFBOztBQUFBLEVBS0EsT0FBQSxHQUFVLElBTFYsQ0FBQTs7QUFBQSxFQU1BLFFBQUEsR0FBVyxJQU5YLENBQUE7O0FBQUEsRUFPQSxTQUFBLEdBQVksSUFQWixDQUFBOztBQUFBLEVBUUEsVUFBQSxHQUFhLElBUmIsQ0FBQTs7QUFBQSxFQVNBLENBQUEsR0FBSSxJQVRKLENBQUE7O0FBQUEsRUFVQSxnQkFBQSxHQUFtQixJQVZuQixDQUFBOztBQUFBLEVBWUEsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUNKLElBQUEsWUFBWSxDQUFDLFdBQWIsQ0FBeUIsZ0JBQXpCLENBQUEsQ0FBQTs7QUFBQSxJQUNBLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBbkIsQ0FBdUIsZ0JBQXZCLENBREEsQ0FBQTs7QUFHYSxJQUFBLDBCQUFFLFFBQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFdBQUEsUUFDYixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQUFYLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxXQUFELEdBQWUsR0FBQSxDQUFBLG1CQURmLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxJQUFELENBQU0sSUFBQyxDQUFBLFFBQVAsQ0FGQSxD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

//# sourceURL=/Users/doot/.atom/packages/remote-edit/lib/model/inter-process-data.coffee
