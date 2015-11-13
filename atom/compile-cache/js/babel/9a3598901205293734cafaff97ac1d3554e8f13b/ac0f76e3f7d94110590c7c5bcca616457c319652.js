Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.installPackages = installPackages;

var _atom = require('atom');

'use babel';

function installPackages(packageNames, callback, failedCallback) {
  var extractionRegex = /Installing (.*?) to .*? (.*)/;
  return new Promise(function (resolve, reject) {

    var errorContents = [];
    var parameters = ['install'].concat(packageNames);
    parameters.push('--production', '--color', 'false');

    new _atom.BufferedProcess({
      command: atom.packages.getApmPath(),
      args: parameters,
      options: {},
      stdout: function stdout(contents) {
        var matches = extractionRegex.exec(contents);
        if (matches[2] === '✓' || matches[2] === 'done') {
          callback(matches[1]);
        } else {
          errorContents.push("Error Installing " + matches[1] + "\n");
        }
      },
      stderr: function stderr(contents) {
        errorContents.push(contents);
      },
      exit: function exit() {
        if (errorContents.length) {
          errorContents = errorContents.join('');
          failedCallback(errorContents);
          return reject(new Error(errorContents));
        } else resolve();
      }
    });
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kb290Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci1wYWNrYWdlLWpzb24tdmFsaWRhdG9yL25vZGVfbW9kdWxlcy9hdG9tLXBhY2thZ2UtZGVwcy9saWIvaGVscGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O29CQUU4QixNQUFNOztBQUZwQyxXQUFXLENBQUE7O0FBSUosU0FBUyxlQUFlLENBQUMsWUFBWSxFQUFFLFFBQVEsRUFBRSxjQUFjLEVBQUU7QUFDdEUsTUFBTSxlQUFlLEdBQUcsOEJBQThCLENBQUE7QUFDdEQsU0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFTLE9BQU8sRUFBRSxNQUFNLEVBQUU7O0FBRTNDLFFBQUksYUFBYSxHQUFHLEVBQUUsQ0FBQTtBQUN0QixRQUFNLFVBQVUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUNuRCxjQUFVLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUE7O0FBRW5ELDhCQUFvQjtBQUNsQixhQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUU7QUFDbkMsVUFBSSxFQUFFLFVBQVU7QUFDaEIsYUFBTyxFQUFFLEVBQUU7QUFDWCxZQUFNLEVBQUUsZ0JBQVMsUUFBUSxFQUFFO0FBQ3pCLFlBQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDOUMsWUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxNQUFNLEVBQUU7QUFDL0Msa0JBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtTQUNyQixNQUFNO0FBQ0wsdUJBQWEsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFBO1NBQzVEO09BQ0Y7QUFDRCxZQUFNLEVBQUUsZ0JBQVMsUUFBUSxFQUFFO0FBQ3pCLHFCQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO09BQzdCO0FBQ0QsVUFBSSxFQUFFLGdCQUFXO0FBQ2YsWUFBSSxhQUFhLENBQUMsTUFBTSxFQUFFO0FBQ3hCLHVCQUFhLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtBQUN0Qyx3QkFBYyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQzdCLGlCQUFPLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFBO1NBQ3hDLE1BQU0sT0FBTyxFQUFFLENBQUE7T0FDakI7S0FDRixDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7Q0FDSCIsImZpbGUiOiIvVXNlcnMvZG9vdC8uYXRvbS9wYWNrYWdlcy9saW50ZXItcGFja2FnZS1qc29uLXZhbGlkYXRvci9ub2RlX21vZHVsZXMvYXRvbS1wYWNrYWdlLWRlcHMvbGliL2hlbHBlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7QnVmZmVyZWRQcm9jZXNzfSBmcm9tICdhdG9tJ1xuXG5leHBvcnQgZnVuY3Rpb24gaW5zdGFsbFBhY2thZ2VzKHBhY2thZ2VOYW1lcywgY2FsbGJhY2ssIGZhaWxlZENhbGxiYWNrKSB7XG4gIGNvbnN0IGV4dHJhY3Rpb25SZWdleCA9IC9JbnN0YWxsaW5nICguKj8pIHRvIC4qPyAoLiopL1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cbiAgICBsZXQgZXJyb3JDb250ZW50cyA9IFtdXG4gICAgY29uc3QgcGFyYW1ldGVycyA9IFsnaW5zdGFsbCddLmNvbmNhdChwYWNrYWdlTmFtZXMpXG4gICAgcGFyYW1ldGVycy5wdXNoKCctLXByb2R1Y3Rpb24nLCAnLS1jb2xvcicsICdmYWxzZScpXG5cbiAgICBuZXcgQnVmZmVyZWRQcm9jZXNzKHtcbiAgICAgIGNvbW1hbmQ6IGF0b20ucGFja2FnZXMuZ2V0QXBtUGF0aCgpLFxuICAgICAgYXJnczogcGFyYW1ldGVycyxcbiAgICAgIG9wdGlvbnM6IHt9LFxuICAgICAgc3Rkb3V0OiBmdW5jdGlvbihjb250ZW50cykge1xuICAgICAgICBjb25zdCBtYXRjaGVzID0gZXh0cmFjdGlvblJlZ2V4LmV4ZWMoY29udGVudHMpXG4gICAgICAgIGlmIChtYXRjaGVzWzJdID09PSAn4pyTJyB8fCBtYXRjaGVzWzJdID09PSAnZG9uZScpIHtcbiAgICAgICAgICBjYWxsYmFjayhtYXRjaGVzWzFdKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVycm9yQ29udGVudHMucHVzaChcIkVycm9yIEluc3RhbGxpbmcgXCIgKyBtYXRjaGVzWzFdICsgXCJcXG5cIilcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHN0ZGVycjogZnVuY3Rpb24oY29udGVudHMpIHtcbiAgICAgICAgZXJyb3JDb250ZW50cy5wdXNoKGNvbnRlbnRzKVxuICAgICAgfSxcbiAgICAgIGV4aXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoZXJyb3JDb250ZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICBlcnJvckNvbnRlbnRzID0gZXJyb3JDb250ZW50cy5qb2luKCcnKVxuICAgICAgICAgIGZhaWxlZENhbGxiYWNrKGVycm9yQ29udGVudHMpXG4gICAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoZXJyb3JDb250ZW50cykpXG4gICAgICAgIH0gZWxzZSByZXNvbHZlKClcbiAgICAgIH1cbiAgICB9KVxuICB9KVxufVxuIl19
//# sourceURL=/Users/doot/.atom/packages/linter-package-json-validator/node_modules/atom-package-deps/lib/helper.js
