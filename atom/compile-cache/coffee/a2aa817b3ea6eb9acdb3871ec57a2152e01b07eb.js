(function() {
  var CSON, Project, ProjectDeserialized, ReadGitInfoTask, Task, TaskPool, fs, git, _path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  git = require('git-utils');

  _path = require('path');

  CSON = require('season');

  fs = require('fs');

  Task = require('atom').Task;

  ReadGitInfoTask = require.resolve('../read-git-info-task');

  TaskPool = require('../task-pool');

  Project = (function() {
    Project.prototype._stale = false;

    Project.prototype.setStale = function(value) {
      return this._stale = value;
    };

    Project.prototype.isStale = function() {
      return this._stale;
    };

    Project.prototype.dirty = null;

    Project.prototype.branch = null;

    Project.deserialize = function(instance) {
      return new ProjectDeserialized(instance);
    };

    function Project(path) {
      this.path = path;
      this.icon = "icon-repo";
      this.ignored = false;
      this.title = _path.basename(this.path);
      this.readConfigFile();
    }

    Project.prototype.readGitInfo = function(cb) {
      var task;
      task = new Task(ReadGitInfoTask);
      return TaskPool.add(task, this.path, (function(_this) {
        return function(data) {
          _this.branch = data.branch;
          _this.dirty = data.dirty;
          return cb();
        };
      })(this));
    };

    Project.prototype.hasGitInfo = function() {
      return (this.branch != null) && (this.dirty != null);
    };

    Project.prototype.readConfigFile = function() {
      var data, filepath;
      filepath = this.path + _path.sep + ".git-project";
      if (fs.existsSync(filepath)) {
        data = CSON.readFileSync(filepath);
        if (data != null) {
          if (data['title'] != null) {
            this.title = data['title'];
          }
          if (data['ignore'] != null) {
            this.ignored = data['ignore'];
          }
          if (data['icon'] != null) {
            return this.icon = data['icon'];
          }
        }
      }
    };

    return Project;

  })();

  ProjectDeserialized = (function(_super) {
    __extends(ProjectDeserialized, _super);

    function ProjectDeserialized(instance) {
      this.path = instance.path;
      this.icon = instance.icon;
      this.ignored = instance.ignored;
      this.title = instance.title;
      this.dirty = instance.dirty;
      this.branch = instance.branch;
    }

    return ProjectDeserialized;

  })(Project);

  module.exports = Project;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXByb2plY3RzL2xpYi9tb2RlbHMvcHJvamVjdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUZBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsV0FBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE1BQVIsQ0FEUixDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUhMLENBQUE7O0FBQUEsRUFLQyxPQUFRLE9BQUEsQ0FBUSxNQUFSLEVBQVIsSUFMRCxDQUFBOztBQUFBLEVBTUEsZUFBQSxHQUFrQixPQUFPLENBQUMsT0FBUixDQUFnQix1QkFBaEIsQ0FObEIsQ0FBQTs7QUFBQSxFQU9BLFFBQUEsR0FBVyxPQUFBLENBQVEsY0FBUixDQVBYLENBQUE7O0FBQUEsRUFTTTtBQUVKLHNCQUFBLE1BQUEsR0FBUSxLQUFSLENBQUE7O0FBQUEsc0JBQ0EsUUFBQSxHQUFVLFNBQUMsS0FBRCxHQUFBO2FBQVcsSUFBQyxDQUFBLE1BQUQsR0FBVSxNQUFyQjtJQUFBLENBRFYsQ0FBQTs7QUFBQSxzQkFFQSxPQUFBLEdBQVMsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLE9BQUo7SUFBQSxDQUZULENBQUE7O0FBQUEsc0JBS0EsS0FBQSxHQUFPLElBTFAsQ0FBQTs7QUFBQSxzQkFNQSxNQUFBLEdBQVEsSUFOUixDQUFBOztBQUFBLElBUUEsT0FBQyxDQUFBLFdBQUQsR0FBYyxTQUFDLFFBQUQsR0FBQTthQUNSLElBQUEsbUJBQUEsQ0FBb0IsUUFBcEIsRUFEUTtJQUFBLENBUmQsQ0FBQTs7QUFXYSxJ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

//# sourceURL=/Users/doot/.atom/packages/git-projects/lib/models/project.coffee
