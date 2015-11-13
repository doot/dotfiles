(function() {
  var Host, LocalFile, RemoteFile, Serializable, fs;

  Serializable = require('serializable');

  RemoteFile = require('./remote-file');

  Host = require('./host');

  fs = require('fs-plus');

  module.exports = LocalFile = (function() {
    Serializable.includeInto(LocalFile);

    atom.deserializers.add(LocalFile);

    function LocalFile(path, remoteFile, dtime, host) {
      this.path = path;
      this.remoteFile = remoteFile;
      this.dtime = dtime;
      this.host = host != null ? host : null;
      this.name = this.remoteFile.name;
    }

    LocalFile.prototype.serializeParams = function() {
      return {
        path: this.path,
        remoteFile: this.remoteFile.serialize(),
        dtime: this.dtime
      };
    };

    LocalFile.prototype.deserializeParams = function(params) {
      params.remoteFile = RemoteFile.deserialize(params.remoteFile);
      return params;
    };

    LocalFile.prototype["delete"] = function() {
      var _ref;
      fs.unlink(this.path, function() {
        if (typeof err !== "undefined" && err !== null) {
          return console.error(err);
        }
      });
      return (_ref = this.host) != null ? _ref.removeLocalFile(this) : void 0;
    };

    return LocalFile;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcmVtb3RlLWVkaXQvbGliL21vZGVsL2xvY2FsLWZpbGUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZDQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxjQUFSLENBQWYsQ0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQURiLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBSEwsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFDSixJQUFBLFlBQVksQ0FBQyxXQUFiLENBQXlCLFNBQXpCLENBQUEsQ0FBQTs7QUFBQSxJQUNBLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBbkIsQ0FBdUIsU0FBdkIsQ0FEQSxDQUFBOztBQUdhLElBQUEsbUJBQUUsSUFBRixFQUFTLFVBQVQsRUFBc0IsS0FBdEIsRUFBOEIsSUFBOUIsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLE9BQUEsSUFDYixDQUFBO0FBQUEsTUFEbUIsSUFBQyxDQUFBLGFBQUEsVUFDcEIsQ0FBQTtBQUFBLE1BRGdDLElBQUMsQ0FBQSxRQUFBLEtBQ2pDLENBQUE7QUFBQSxNQUR3QyxJQUFDLENBQUEsc0JBQUEsT0FBTyxJQUNoRCxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUMsQ0FBQSxVQUFVLENBQUMsSUFBcEIsQ0FEVztJQUFBLENBSGI7O0FBQUEsd0JBTUEsZUFBQSxHQUFpQixTQUFBLEdBQUE7YUFDZjtBQUFBLFFBQ0csTUFBRCxJQUFDLENBQUEsSUFESDtBQUFBLFFBRUUsVUFBQSxFQUFZLElBQUMsQ0FBQSxVQUFVLENBQUMsU0FBWixDQUFBLENBRmQ7QUFBQSxRQUdHLE9BQUQsSUFBQyxDQUFBLEtBSEg7UUFEZTtJQUFBLENBTmpCLENBQUE7O0FBQUEsd0JBYUEsaUJBQUEsR0FBbUIsU0FBQyxNQUFELEdBQUE7QUFDakIsTUFBQSxNQUFNLENBQUMsVUFBUCxHQUFvQixVQUFVLENBQUMsV0FBWCxDQUF1QixNQUFNLENBQUMsVUFBOUIsQ0FBcEIsQ0FBQTthQUNBLE9BRmlCO0lBQUEsQ0FibkIsQ0FBQTs7QUFBQSx3QkFpQkEsU0FBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLFVBQUEsSUFBQTtBQUFBLE1BQUEsRUFBRSxDQUFDLE1BQUgsQ0FBVSxJQUFDLENBQUEsSUFBWCxFQUFpQixTQUFBLEdBQUE7QUFBRyxRQUFBLElBQXFCLDBDQUFyQjtpQkFBQSxPQUFPLENBQUMsS0FBUixDQUFjLEdBQWQsRUFBQTtTQUFIO01BQUEsQ0FBakIsQ0FBQSxDQUFBOzhDQUNLLENBQUUsZUFBUCxDQUF1QixJQUF2QixXQUZNO0lBQUEsQ0FqQlIsQ0FBQTs7cUJBQUE7O01BUEosQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/remote-edit/lib/model/local-file.coffee
