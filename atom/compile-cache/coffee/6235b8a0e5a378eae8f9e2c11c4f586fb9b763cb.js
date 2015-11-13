(function() {
  var CompositeDisposable, Emitter, InterProcessData, InterProcessDataWatcher, Q, fs, _ref;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  Q = require('q');

  fs = require('fs-plus');

  InterProcessData = null;

  module.exports = InterProcessDataWatcher = (function() {
    function InterProcessDataWatcher(filePath) {
      this.filePath = filePath;
      this.justCommittedData = false;
      this.emitter = new Emitter;
      this.disposables = new CompositeDisposable;
      this.promisedData = Q.defer().promise;
      this.fsTimeout = void 0;
      fs.open(this.filePath, 'a', "0644", (function(_this) {
        return function() {
          _this.promisedData = _this.load();
          return _this.watcher();
        };
      })(this));
    }

    InterProcessDataWatcher.prototype.watcher = function() {
      return fs.watch(this.filePath, ((function(_this) {
        return function(event, filename) {
          if (_this.fsTimeout === void 0 && (event === 'change' || event === 'rename')) {
            return _this.fsTimeout = setTimeout((function() {
              _this.fsTimeout = void 0;
              _this.reloadIfNecessary();
              return _this.watcher();
            }), 2000);
          }
        };
      })(this)));
    };

    InterProcessDataWatcher.prototype.reloadIfNecessary = function() {
      var _ref1;
      if (this.justCommittedData !== true) {
        if ((_ref1 = this.data) != null) {
          _ref1.destroy();
        }
        this.data = void 0;
        return this.promisedData = this.load();
      } else if (this.justCommittedData === true) {
        return this.justCommittedData = false;
      }
    };

    InterProcessDataWatcher.prototype.getData = function() {
      var deferred;
      deferred = Q.defer();
      if (this.data === void 0) {
        this.promisedData.then((function(_this) {
          return function(resolvedData) {
            _this.data = resolvedData;
            _this.disposables.add(_this.data.onDidChange(function() {
              return _this.commit();
            }));
            return deferred.resolve(_this.data);
          };
        })(this));
      } else {
        deferred.resolve(this.data);
      }
      return deferred.promise;
    };

    InterProcessDataWatcher.prototype.destroy = function() {
      var _ref1;
      this.disposables.dispose();
      this.emitter.dispose();
      return (_ref1 = this.data) != null ? _ref1.destroy() : void 0;
    };

    InterProcessDataWatcher.prototype.load = function() {
      var deferred;
      deferred = Q.defer();
      fs.readFile(this.filePath, 'utf8', ((function(_this) {
        return function(err, data) {
          var e, interProcessData;
          if (InterProcessData == null) {
            InterProcessData = require('./inter-process-data');
          }
          if (err != null) {
            throw err;
          }
          interProcessData = void 0;
          if (data.length > 0) {
            try {
              return interProcessData = InterProcessData.deserialize(JSON.parse(data));
            } catch (_error) {
              e = _error;
              console.debug('Could not parse serialized remote-edit data! Creating an empty InterProcessData object!');
              console.debug(e);
              return interProcessData = new InterProcessData([]);
            } finally {
              _this.emitter.emit('did-change');
              deferred.resolve(interProcessData);
            }
          } else {
            deferred.resolve(new InterProcessData([]));
            return _this.emitter.emit('did-change');
          }
        };
      })(this)));
      return deferred.promise;
    };

    InterProcessDataWatcher.prototype.commit = function() {
      this.justCommittedData = true;
      fs.writeFile(this.filePath, JSON.stringify(this.data.serialize()), function(err) {
        if (err != null) {
          throw err;
        }
      });
      return this.emitter.emit('did-change');
    };

    InterProcessDataWatcher.prototype.onDidChange = function(callback) {
      return this.emitter.on('did-change', callback);
    };

    return InterProcessDataWatcher;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcmVtb3RlLWVkaXQvbGliL21vZGVsL2ludGVyLXByb2Nlc3MtZGF0YS13YXRjaGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxvRkFBQTs7QUFBQSxFQUFBLE9BQWlDLE9BQUEsQ0FBUSxNQUFSLENBQWpDLEVBQUMsMkJBQUEsbUJBQUQsRUFBc0IsZUFBQSxPQUF0QixDQUFBOztBQUFBLEVBQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxHQUFSLENBREosQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUZMLENBQUE7O0FBQUEsRUFLQSxnQkFBQSxHQUFtQixJQUxuQixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUNTLElBQUEsaUNBQUUsUUFBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsV0FBQSxRQUNiLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxpQkFBRCxHQUFxQixLQUFyQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQURYLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxXQUFELEdBQWUsR0FBQSxDQUFBLG1CQUZmLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxZQUFELEdBQWdCLENBQUMsQ0FBQyxLQUFGLENBQUEsQ0FBUyxDQUFDLE9BSDFCLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxTQUFELEdBQWEsTUFKYixDQUFBO0FBQUEsTUFNQSxFQUFFLENBQUMsSUFBSCxDQUFRLElBQUMsQ0FBQSxRQUFULEVBQW1CLEdBQW5CLEVBQXdCLE1BQXhCLEVBQWdDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDOUIsVUFBQSxLQUFDLENBQUEsWUFBRCxH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

//# sourceURL=/Users/doot/.atom/packages/remote-edit/lib/model/inter-process-data-watcher.coffee
