(function() {
  var PJV, fs, path;

  fs = require("fs");

  path = require("path");

  PJV = require('package-json-validator').PJV;

  module.exports = {
    name: "package-json-validator",
    grammarScopes: ['source.json'],
    scope: 'file',
    lintOnFly: true,
    types: {
      errors: 'Error',
      warnings: 'Warning',
      recommendations: 'Recommendation'
    },
    lint: function(textEditor) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var filePath, text;
          filePath = textEditor.getPath();
          if (!(filePath && /package\.json$/.test(filePath))) {
            return resolve([]);
          }
          text = textEditor.getText();
          return _this.lintText(text, function(result) {
            var messsage, messsages, typeKey, typeLabel, _i, _len, _ref, _ref1;
            messsages = [];
            _ref = _this.types;
            for (typeKey in _ref) {
              typeLabel = _ref[typeKey];
              if (!result[typeKey]) {
                continue;
              }
              _ref1 = result[typeKey];
              for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                messsage = _ref1[_i];
                messsages.push({
                  type: typeLabel,
                  text: messsage,
                  filePath: filePath,
                  range: [[0, 0], [0, 0]]
                });
              }
            }
            return resolve(messsages);
          });
        };
      })(this));
    },
    lintText: function(text, callback) {
      var options, spec;
      spec = this.config('spec', 'npm');
      options = {
        warnings: this.config('show_warnings', true),
        recommendations: this.config('show_recommendations', true)
      };
      return callback(PJV.validate(text, spec, options));
    },
    config: function(key, defaultValue) {
      if (defaultValue == null) {
        defaultValue = null;
      }
      return atom.config.get("linter-linter-package-json-validator." + key) || defaultValue;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvbGludGVyLXBhY2thZ2UtanNvbi12YWxpZGF0b3IvbGliL3BhY2thZ2UtanNvbi12YWxpZGF0b3ItcHJvdmlkZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGFBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLEdBQUEsR0FBTSxPQUFBLENBQVEsd0JBQVIsQ0FBaUMsQ0FBQyxHQUZ4QyxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsSUFBQSxFQUFNLHdCQUFOO0FBQUEsSUFFQSxhQUFBLEVBQWUsQ0FBQyxhQUFELENBRmY7QUFBQSxJQUlBLEtBQUEsRUFBTyxNQUpQO0FBQUEsSUFNQSxTQUFBLEVBQVcsSUFOWDtBQUFBLElBUUEsS0FBQSxFQUNFO0FBQUEsTUFBQSxNQUFBLEVBQVEsT0FBUjtBQUFBLE1BQ0EsUUFBQSxFQUFVLFNBRFY7QUFBQSxNQUVBLGVBQUEsRUFBaUIsZ0JBRmpCO0tBVEY7QUFBQSxJQWFBLElBQUEsRUFBTSxTQUFDLFVBQUQsR0FBQTtBQUVKLGFBQVcsSUFBQSxPQUFBLENBQVEsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtBQUVqQixjQUFBLGNBQUE7QUFBQSxVQUFBLFFBQUEsR0FBVyxVQUFVLENBQUMsT0FBWCxDQUFBLENBQVgsQ0FBQTtBQUNBLFVBQUEsSUFBQSxDQUFBLENBQTBCLFFBQUEsSUFBYSxnQkFBZ0IsQ0FBQyxJQUFqQixDQUFzQixRQUF0QixDQUF2QyxDQUFBO0FBQUEsbUJBQU8sT0FBQSxDQUFRLEVBQVIsQ0FBUCxDQUFBO1dBREE7QUFBQSxVQUdBLElBQUEsR0FBTyxVQUFVLENBQUMsT0FBWCxDQUFBLENBSFAsQ0FBQTtpQkFLQSxLQUFDLENBQUEsUUFBRCxDQUFVLElBQVYsRUFBZ0IsU0FBQyxNQUFELEdBQUE7QUFFZCxnQkFBQSw4REFBQTtBQUFBLFlBQUEsU0FBQSxHQUFZLEVBQVosQ0FBQTtBQUVBO0FBQUEsaUJBQUEsZUFBQTt3Q0FBQTtBQUNFLGNBQUEsSUFBQSxDQUFBLE1BQXVCLENBQUEsT0FBQSxDQUF2QjtBQUFBLHlCQUFBO2VBQUE7QUFFQTtBQUFBLG1CQUFBLDRDQUFBO3FDQUFBO0FBQ0UsZ0JBQUEsU0FBUyxDQUFDLElBQVYsQ0FBZTtBQUFBLGtCQUNiLElBQUEsRUFBTSxTQURPO0FBQUEsa0JBRWIsSUFBQSxFQUFNLFFBRk87QUFBQSxrQkFHYixRQUFBLEVBQVUsUUFIRztBQUFBLGtCQUliLEtBQUEsRUFBTyxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBVCxDQUpNO2lCQUFmLENBQUEsQ0FERjtBQUFBLGVBSEY7QUFBQSxhQUZBO21CQWFBLE9BQUEsQ0FBUSxTQUFSLEVBZmM7VUFBQSxDQUFoQixFQVBpQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVIsQ0FBWCxDQUZJO0lBQUEsQ0FiTjtBQUFBLElBdUNBLFFBQUEsRUFBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEdBQUE7QUFDUixVQUFBLGFBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxJQUFDLENBQUEsTUFBRCxDQUFRLE1BQVIsRUFBZ0IsS0FBaEIsQ0FBUCxDQUFBO0FBQUEsTUFDQSxPQUFBLEdBQ0U7QUFBQSxRQUFBLFFBQUEsRUFBVSxJQUFDLENBQUEsTUFBRCxDQUFRLGVBQVIsRUFBeUIsSUFBekIsQ0FBVjtBQUFBLFFBQ0EsZUFBQSxFQUFpQixJQUFDLENBQUEsTUFBRCxDQUFRLHNCQUFSLEVBQWdDLElBQWhDLENBRGpCO09BRkYsQ0FBQTthQU1BLFFBQUEsQ0FBUyxHQUFHLENBQUMsUUFBSixDQUFhLElBQWIsRUFBbUIsSUFBbkIsRUFBeUIsT0FBekIsQ0FBVCxFQVBRO0lBQUEsQ0F2Q1Y7QUFBQSxJQWdEQSxNQUFBLEVBQVEsU0FBQyxHQUFELEVBQU0sWUFBTixHQUFBOztRQUFNLGVBQWU7T0FDM0I7YUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBaUIsdUNBQUEsR0FBdUMsR0FBeEQsQ0FBQSxJQUFrRSxhQUQ1RDtJQUFBLENBaERSO0dBTkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/linter-package-json-validator/lib/package-json-validator-provider.coffee
