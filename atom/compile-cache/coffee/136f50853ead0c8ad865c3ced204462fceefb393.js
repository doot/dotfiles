(function() {
  var FindGitReposTask, Project, ProjectsListView, Task, fs, path, utils;

  fs = require('fs-plus');

  path = require('path');

  Task = require('atom').Task;

  utils = null;

  Project = null;

  ProjectsListView = null;

  FindGitReposTask = null;

  module.exports = {
    config: {
      rootPath: {
        title: "Root paths",
        description: "Paths to folders containing Git repositories, separated by semicolons.",
        type: "string",
        "default": fs.absolute(fs.getHomeDirectory() + ("" + path.sep + "repos"))
      },
      ignoredPath: {
        title: "Ignored paths",
        description: "Paths to folders that should be ignored, separated by semicolons.",
        type: "string",
        "default": ""
      },
      ignoredPatterns: {
        title: "Ignored patterns",
        description: "Patterns that should be ignored (e.g.: node_modules), separated by semicolons.",
        type: "string",
        "default": "node_modules;\\.git"
      },
      sortBy: {
        title: "Sort by",
        type: "string",
        "default": "Project name",
        "enum": ["Project name", "Latest modification date", "Size"]
      },
      maxDepth: {
        title: "Max Folder Depth",
        type: 'integer',
        "default": 5,
        minimum: 1
      },
      openInDevMode: {
        title: "Open in development mode",
        type: "boolean",
        "default": false
      },
      notificationsEnabled: {
        title: "Notifications enabled",
        type: "boolean",
        "default": true
      },
      showGitInfo: {
        title: "Show repositories status",
        description: "Display the branch and a status icon in the list of projects",
        type: "boolean",
        "default": true
      }
    },
    projects: null,
    view: null,
    activate: function(state) {
      var filter, map;
      if (state.projectsCache != null) {
        if (utils == null) {
          utils = require('./utils');
        }
        if (Project == null) {
          Project = require('./models/project');
        }
        filter = function(project) {
          return utils.isRepositorySync(project.path);
        };
        map = function(project) {
          return Project.deserialize(project);
        };
        this.projects = state.projectsCache.filter(filter).map(map);
      }
      return atom.commands.add('atom-workspace', {
        'git-projects:toggle': (function(_this) {
          return function() {
            return _this.createView().toggle(_this);
          };
        })(this)
      });
    },
    serialize: function() {
      return {
        projectsCache: this.projects
      };
    },
    openProject: function(project) {
      var options;
      return atom.open(options = {
        pathsToOpen: [project.path],
        devMode: atom.config.get('git-projects.openInDevMode')
      });
    },
    createView: function() {
      if (ProjectsListView == null) {
        ProjectsListView = require('./views/projects-list-view');
      }
      return this.view != null ? this.view : this.view = new ProjectsListView();
    },
    findGitRepos: function(root, cb) {
      var config, rootPaths, task;
      if (root == null) {
        root = atom.config.get('git-projects.rootPath');
      }
      if (utils == null) {
        utils = require('./utils');
      }
      if (Project == null) {
        Project = require('./models/project');
      }
      if (FindGitReposTask == null) {
        FindGitReposTask = require.resolve('./find-git-repos-task');
      }
      rootPaths = utils.parsePathString(root);
      if (rootPaths == null) {
        return cb(this.projects);
      }
      config = {
        maxDepth: atom.config.get('git-projects.maxDepth'),
        sortBy: atom.config.get('git-projects.sortBy'),
        ignoredPath: atom.config.get('git-projects.ignoredPath'),
        ignoredPatterns: atom.config.get('git-projects.ignoredPatterns')
      };
      task = Task.once(FindGitReposTask, root, config, (function(_this) {
        return function() {
          return cb(_this.projects);
        };
      })(this));
      return task.on('found-repos', (function(_this) {
        return function(data) {
          return _this.projects = data.map(function(project) {
            return Project.deserialize(project);
          });
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXByb2plY3RzL2xpYi9naXQtcHJvamVjdHMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtFQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQyxPQUFRLE9BQUEsQ0FBUSxNQUFSLEVBQVIsSUFGRCxDQUFBOztBQUFBLEVBS0EsS0FBQSxHQUFRLElBTFIsQ0FBQTs7QUFBQSxFQU1BLE9BQUEsR0FBVSxJQU5WLENBQUE7O0FBQUEsRUFPQSxnQkFBQSxHQUFtQixJQVBuQixDQUFBOztBQUFBLEVBUUEsZ0JBQUEsR0FBbUIsSUFSbkIsQ0FBQTs7QUFBQSxFQVVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sWUFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLHdFQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLEVBQUUsQ0FBQyxRQUFILENBQVksRUFBRSxDQUFDLGdCQUFILENBQUEsQ0FBQSxHQUF3QixDQUFBLEVBQUEsR0FBRyxJQUFJLENBQUMsR0FBUixHQUFZLE9BQVosQ0FBcEMsQ0FIVDtPQURGO0FBQUEsTUFLQSxXQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxlQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsbUVBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxRQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsRUFIVDtPQU5GO0FBQUEsTUFVQSxlQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFB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

//# sourceURL=/Users/doot/.atom/packages/git-projects/lib/git-projects.coffee
