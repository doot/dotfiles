(function() {
  var Stream, command, fs, html2jade, jQuery, path, spawn, tmp;

  html2jade = require('html2jade');

  spawn = require('child_process').spawn;

  tmp = require('tmp');

  fs = require('fs');

  path = require('path');

  Stream = require('stream');

  jQuery = require('jquery');

  command = require('./command');

  module.exports = {
    getContent: function(tag, text) {
      var match, regex;
      regex = new RegExp("<pp-" + tag + ">([\\s\\S]*?)</pp-" + tag + ">");
      match = text.match(regex);
      if ((match != null) && (match[1] != null)) {
        return match[1].trim();
      }
    },
    slim: function(fpath, text, options) {
      if (options == null) {
        options = [];
      }
      return command.compileFile(fpath, text, 'html2slim', options);
    },
    jade: function(fpath, text, options) {
      var dfd;
      if (options == null) {
        options = {};
      }
      text = text.replace(/\n/g, '');
      dfd = new jQuery.Deferred();
      tmp.file(function(err, fwpath, fw) {
        if (err) {
          dfd.reject(new Error(err));
          return;
        }
        return fs.writeFile(fwpath, text, function(err) {
          var cmd, ls;
          if (err) {
            dfd.reject(new Error(err));
            return;
          }
          cmd = 'html2jade';
          if (process.platform.slice(0, 3) === 'win') {
            cmd = "html2jade.cmd";
          }
          ls = spawn(cmd, [fwpath]);
          return ls.on('close', function(code) {
            return fs.readFile(fwpath.replace('.tmp', '.jade'), function(err, data) {
              if (err) {
                return dfd.reject(err.toString());
              } else {
                return dfd.resolve(data.toString());
              }
            });
          });
        });
      });
      return dfd.promise();
    },
    htmlp: function(fpath, text) {
      if (fpath) {
        return '';
      } else {
        return text;
      }
    },
    htmlu: function(fpath, text) {
      var ed, fname, _ref;
      fname = path.basename(fpath);
      ed = atom.workspace.getActiveTextEditor();
      if (text = this.getContent('url', ed.lineTextForBufferRow(ed.getCursorScreenPosition().row))) {
        return text;
      }
      if (text = this.getContent('url', ed.getText())) {
        return text;
      }
      if (((_ref = this.cproject) != null ? _ref.base : void 0) != null) {
        fname = fpath.replace(this.cproject.base, '');
        if (this.cproject.url != null) {
          return "" + this.cproject.url + fname;
        }
      }
      return "http://127.0.0.1/" + fname;
    },
    haml: function(fpath, text, options) {
      if (options == null) {
        options = ['-s'];
      }
      return command.compile(fpath, text, 'html2haml', options);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcHJldmlldy1wbHVzL2xpYi9sYW5nL2h0bWwuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLHdEQUFBOztBQUFBLEVBQUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxXQUFSLENBQVosQ0FBQTs7QUFBQSxFQUNBLEtBQUEsR0FBUSxPQUFBLENBQVEsZUFBUixDQUF3QixDQUFDLEtBRGpDLENBQUE7O0FBQUEsRUFFQSxHQUFBLEdBQU0sT0FBQSxDQUFRLEtBQVIsQ0FGTixDQUFBOztBQUFBLEVBR0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBSEwsQ0FBQTs7QUFBQSxFQUlBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUpQLENBQUE7O0FBQUEsRUFNQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVIsQ0FOVCxDQUFBOztBQUFBLEVBT0EsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBUFQsQ0FBQTs7QUFBQSxFQVFBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQVJWLENBQUE7O0FBQUEsRUFVQSxNQUFNLENBQUMsT0FBUCxHQUNJO0FBQUEsSUFBQSxVQUFBLEVBQVksU0FBQyxHQUFELEVBQUssSUFBTCxHQUFBO0FBQ1IsVUFBQSxZQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVksSUFBQSxNQUFBLENBQVEsTUFBQSxHQUFNLEdBQU4sR0FBVSxvQkFBVixHQUE4QixHQUE5QixHQUFrQyxHQUExQyxDQUFaLENBQUE7QUFBQSxNQUNBLEtBQUEsR0FBUSxJQUFJLENBQUMsS0FBTCxDQUFXLEtBQVgsQ0FEUixDQUFBO0FBRUEsTUFBQSxJQUFtQixlQUFBLElBQVcsa0JBQTlCO2VBQUEsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLElBQVQsQ0FBQSxFQUFBO09BSFE7SUFBQSxDQUFaO0FBQUEsSUFLQSxJQUFBLEVBQU0sU0FBQyxLQUFELEVBQU8sSUFBUCxFQUFZLE9BQVosR0FBQTs7UUFBWSxVQUFRO09BQ3hCO2FBQUEsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsS0FBcEIsRUFBMEIsSUFBMUIsRUFBK0IsV0FBL0IsRUFBMkMsT0FBM0MsRUFESTtJQUFBLENBTE47QUFBQSxJQU9BLElBQUEsRUFBTSxTQUFDLEtBQUQsRUFBTyxJQUFQLEVBQVksT0FBWixHQUFBO0FBQ0osVUFBQSxHQUFBOztRQURnQixVQUFRO09BQ3hCO0FBQUEsTUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSxLQUFiLEVBQW9CLEVBQXBCLENBQVAsQ0FBQTtBQUFBLE1BRUEsR0FBQSxHQUFVLElBQUEsTUFBTSxDQUFDLFFBQVAsQ0FBQSxDQUZWLENBQUE7QUFBQSxNQUdBLEdBQUcsQ0FBQyxJQUFKLENBQVMsU0FBQyxHQUFELEVBQUssTUFBTCxFQUFZLEVBQVosR0FBQTtBQUNQLFFBQUEsSUFBRyxHQUFIO0FBQ0UsVUFBQSxHQUFHLENBQUMsTUFBSixDQUFlLElBQUEsS0FBQSxDQUFNLEdBQU4sQ0FBZixDQUFBLENBQUE7QUFDQSxnQkFBQSxDQUZGO1NBQUE7ZUFHQSxFQUFFLENBQUMsU0FBSCxDQUFhLE1BQWIsRUFBb0IsSUFBcEIsRUFBeUIsU0FBQyxHQUFELEdBQUE7QUFDdkIsY0FBQSxPQUFBO0FBQUEsVUFBQSxJQUFHLEdBQUg7QUFDRSxZQUFBLEdBQUcsQ0FBQyxNQUFKLENBQWUsSUFBQSxLQUFBLENBQU0sR0FBTixDQUFmLENBQUEsQ0FBQTtBQUNBLGtCQUFBLENBRkY7V0FBQTtBQUFBLFVBR0EsR0FBQSxHQUFNLFdBSE4sQ0FBQTtBQUlBLFVBQUEsSUFBRyxPQUFPLENBQUMsUUFBUyxZQUFqQixLQUEwQixLQUE3QjtBQUNFLFlBQUEsR0FBQSxHQUFNLGVBQU4sQ0FERjtXQUpBO0FBQUEsVUFNQSxFQUFBLEdBQUssS0FBQSxDQUFNLEdBQU4sRUFBVSxDQUFDLE1BQUQsQ0FBVixDQU5MLENBQUE7aUJBT0EsRUFBRSxDQUFDLEVBQUgsQ0FBTSxPQUFOLEVBQWUsU0FBQyxJQUFELEdBQUE7bUJBQ2IsRUFBRSxDQUFDLFFBQUgsQ0FBWSxNQUFNLENBQUMsT0FBUCxDQUFlLE1BQWYsRUFBc0IsT0FBdEIsQ0FBWixFQUEyQyxTQUFDLEdBQUQsRUFBSyxJQUFMLEdBQUE7QUFDekMsY0FBQSxJQUFHLEdBQUg7dUJBQ0UsR0FBRyxDQUFDLE1BQUosQ0FBVyxHQUFHLENBQUMsUUFBSixDQUFBLENBQVgsRUFERjtlQUFBLE1BQUE7dUJBR0UsR0FBRyxDQUFDLE9BQUosQ0FBWSxJQUFJLENBQUMsUUFBTCxDQUFBLENBQVosRUFIRjtlQUR5QztZQUFBLENBQTNDLEVBRGE7VUFBQSxDQUFmLEVBUnVCO1FBQUEsQ0FBekIsRUFKTztNQUFBLENBQVQsQ0FIQSxDQUFBO2FBcUJBLEdBQUcsQ0FBQyxPQUFKLENBQUEsRUF0Qkk7SUFBQSxDQVBOO0FBQUEsSUEyQ0EsS0FBQSxFQUFPLFNBQUMsS0FBRCxFQUFPLElBQVAsR0FBQTtBQUNMLE1BQUEsSUFBRyxLQUFIO2VBQWMsR0FBZDtPQUFBLE1BQUE7ZUFBc0IsS0FBdEI7T0FESztJQUFBLENBM0NQO0FBQUEsSUE4Q0EsS0FBQSxFQUFPLFNBQUMsS0FBRCxFQUFPLElBQVAsR0FBQTtBQUNMLFVBQUEsZUFBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLElBQUksQ0FBQyxRQUFMLENBQWMsS0FBZCxDQUFSLENBQUE7QUFBQSxNQUVBLEVBQUEsR0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FGTCxDQUFBO0FBR0EsTUFBQSxJQUFlLElBQUEsR0FBTyxJQUFDLENBQUEsVUFBRCxDQUFZLEtBQVosRUFBa0IsRUFBRSxDQUFDLG9CQUFILENBQXdCLEVBQUUsQ0FBQyx1QkFBSCxDQUFBLENBQTRCLENBQUMsR0FBckQsQ0FBbEIsQ0FBdEI7QUFBQSxlQUFPLElBQVAsQ0FBQTtPQUhBO0FBSUEsTUFBQSxJQUFlLElBQUEsR0FBTyxJQUFDLENBQUEsVUFBRCxDQUFZLEtBQVosRUFBa0IsRUFBRSxDQUFDLE9BQUgsQ0FBQSxDQUFsQixDQUF0QjtBQUFBLGVBQU8sSUFBUCxDQUFBO09BSkE7QUFPQSxNQUFBLElBQUcsNkRBQUg7QUFDRSxRQUFBLEtBQUEsR0FBUSxLQUFLLENBQUMsT0FBTixDQUFjLElBQUMsQ0FBQSxRQUFRLENBQUMsSUFBeEIsRUFBNkIsRUFBN0IsQ0FBUixDQUFBO0FBQ0EsUUFBQSxJQUFxQyx5QkFBckM7QUFBQSxpQkFBTyxFQUFBLEdBQUcsSUFBQyxDQUFBLFFBQVEsQ0FBQyxHQUFiLEdBQW1CLEtBQTFCLENBQUE7U0FGRjtPQVBBO2FBV0MsbUJBQUEsR0FBbUIsTUFaZjtJQUFBLENBOUNQO0FBQUEsSUFpRUEsSUFBQSxFQUFNLFNBQUMsS0FBRCxFQUFPLElBQVAsRUFBWSxPQUFaLEdBQUE7O1FBQVksVUFBUSxDQUFDLElBQUQ7T0FDeEI7YUFBQSxPQUFPLENBQUMsT0FBUixDQUFnQixLQUFoQixFQUFzQixJQUF0QixFQUEyQixXQUEzQixFQUF1QyxPQUF2QyxFQURJO0lBQUEsQ0FqRU47R0FYSixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/preview-plus/lib/lang/html.coffee
