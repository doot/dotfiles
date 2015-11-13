Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _jsonlint = require('jsonlint');

var _jsonlint2 = _interopRequireDefault(_jsonlint);

'use babel';

var LinterJsonLint = (function () {
  function LinterJsonLint() {
    _classCallCheck(this, LinterJsonLint);
  }

  _createClass(LinterJsonLint, null, [{
    key: 'activate',
    value: function activate() {
      require("atom-package-deps").install("linter-jsonlint");
    }
  }, {
    key: 'provideLinter',
    value: function provideLinter() {
      var _this = this;

      return {
        grammarScopes: ['source.json'],
        scope: 'file',
        lintOnFly: true,
        lint: function lint(editor) {

          var path = editor.getPath();
          var text = editor.getText();

          try {
            _jsonlint2['default'].parse(text);
          } catch (e) {

            var line = Number(e.message.match(_this.regex)[1]);
            var column = 0;

            return [{
              type: 'Error',
              text: e.message,
              filePath: path,
              range: new _atom.Range([line, column], [line, column + 1])
            }];
          }

          return [];
        }
      };
    }
  }, {
    key: 'regex',
    value: '.+?line\\s(\\d+)',
    enumerable: true
  }]);

  return LinterJsonLint;
})();

exports['default'] = LinterJsonLint;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kb290Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci1qc29ubGludC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUVzQixNQUFNOzt3QkFDTixVQUFVOzs7O0FBSGhDLFdBQVcsQ0FBQzs7SUFLUyxjQUFjO1dBQWQsY0FBYzswQkFBZCxjQUFjOzs7ZUFBZCxjQUFjOztXQUlsQixvQkFBRztBQUNoQixhQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztLQUN6RDs7O1dBRW1CLHlCQUFHOzs7QUFDckIsYUFBTztBQUNMLHFCQUFhLEVBQUUsQ0FBQyxhQUFhLENBQUM7QUFDOUIsYUFBSyxFQUFFLE1BQU07QUFDYixpQkFBUyxFQUFFLElBQUk7QUFDZixZQUFJLEVBQUUsY0FBQyxNQUFNLEVBQUs7O0FBRWhCLGNBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM1QixjQUFJLElBQUksR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7O0FBRTVCLGNBQUk7QUFDRixrQ0FBUyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7V0FDdEIsQ0FBQyxPQUFPLENBQUMsRUFBRTs7QUFFVixnQkFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsRCxnQkFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDOztBQUVmLG1CQUFPLENBQUM7QUFDTixrQkFBSSxFQUFFLE9BQU87QUFDYixrQkFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPO0FBQ2Ysc0JBQVEsRUFBRSxJQUFJO0FBQ2QsbUJBQUssRUFBRSxnQkFBVSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDckQsQ0FBQyxDQUFDO1dBQ0o7O0FBRUQsaUJBQU8sRUFBRSxDQUFDO1NBQ1g7T0FDRixDQUFBO0tBQ0Y7OztXQWxDYyxrQkFBa0I7Ozs7U0FGZCxjQUFjOzs7cUJBQWQsY0FBYyIsImZpbGUiOiIvVXNlcnMvZG9vdC8uYXRvbS9wYWNrYWdlcy9saW50ZXItanNvbmxpbnQvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgUmFuZ2UgfSBmcm9tICdhdG9tJztcbmltcG9ydCBqc29ubGludCAgZnJvbSAnanNvbmxpbnQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW50ZXJKc29uTGludCB7XG5cbiAgc3RhdGljIHJlZ2V4ID0gJy4rP2xpbmVcXFxccyhcXFxcZCspJ1xuXG4gIHN0YXRpYyBhY3RpdmF0ZSgpIHtcbiAgICByZXF1aXJlKFwiYXRvbS1wYWNrYWdlLWRlcHNcIikuaW5zdGFsbChcImxpbnRlci1qc29ubGludFwiKTtcbiAgfVxuXG4gIHN0YXRpYyBwcm92aWRlTGludGVyKCkge1xuICAgIHJldHVybiB7XG4gICAgICBncmFtbWFyU2NvcGVzOiBbJ3NvdXJjZS5qc29uJ10sXG4gICAgICBzY29wZTogJ2ZpbGUnLFxuICAgICAgbGludE9uRmx5OiB0cnVlLFxuICAgICAgbGludDogKGVkaXRvcikgPT4ge1xuXG4gICAgICAgIGxldCBwYXRoID0gZWRpdG9yLmdldFBhdGgoKTtcbiAgICAgICAgbGV0IHRleHQgPSBlZGl0b3IuZ2V0VGV4dCgpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAganNvbmxpbnQucGFyc2UodGV4dCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcblxuICAgICAgICAgIGxldCBsaW5lID0gTnVtYmVyKGUubWVzc2FnZS5tYXRjaCh0aGlzLnJlZ2V4KVsxXSk7XG4gICAgICAgICAgbGV0IGNvbHVtbiA9IDA7XG5cbiAgICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICAgIHR5cGU6ICdFcnJvcicsXG4gICAgICAgICAgICB0ZXh0OiBlLm1lc3NhZ2UsXG4gICAgICAgICAgICBmaWxlUGF0aDogcGF0aCxcbiAgICAgICAgICAgIHJhbmdlOiBuZXcgUmFuZ2UoW2xpbmUsIGNvbHVtbl0sIFtsaW5lLCBjb2x1bW4gKyAxXSlcbiAgICAgICAgICB9XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxufVxuIl19
//# sourceURL=/Users/doot/.atom/packages/linter-jsonlint/index.js
