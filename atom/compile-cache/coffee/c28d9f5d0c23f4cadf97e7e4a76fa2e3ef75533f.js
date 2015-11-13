(function() {
  var $, $$, Project, ProjectsListView, SelectListView, View, fs, path, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, SelectListView = _ref.SelectListView, View = _ref.View;

  fs = require('fs-plus');

  path = require('path');

  Project = require('../models/project');

  module.exports = ProjectsListView = (function(_super) {
    __extends(ProjectsListView, _super);

    function ProjectsListView() {
      this.getEmptyMessage = __bind(this.getEmptyMessage, this);
      return ProjectsListView.__super__.constructor.apply(this, arguments);
    }

    ProjectsListView.prototype.controller = null;

    ProjectsListView.prototype.cachedViews = new Map;

    ProjectsListView.prototype.activate = function() {
      return new ProjectsListView;
    };

    ProjectsListView.prototype.initialize = function(serializeState) {
      ProjectsListView.__super__.initialize.apply(this, arguments);
      return this.addClass('git-projects');
    };

    ProjectsListView.prototype.getFilterKey = function() {
      return 'title';
    };

    ProjectsListView.prototype.getFilterQuery = function() {
      return this.filterEditorView.getText();
    };

    ProjectsListView.prototype.cancelled = function() {
      return this.hide();
    };

    ProjectsListView.prototype.confirmed = function(project) {
      this.controller.openProject(project);
      return this.cancel();
    };

    ProjectsListView.prototype.getEmptyMessage = function(itemCount, filteredItemCount) {
      var msg, query;
      msg = "No repositories found in '" + (atom.config.get('git-projects.rootPath')) + "'";
      query = this.getFilterQuery();
      if (!filteredItemCount && query.length) {
        return "" + msg + " for '" + query + "'";
      }
      if (!itemCount) {
        return msg;
      }
      return ProjectsListView.__super__.getEmptyMessage.apply(this, arguments);
    };

    ProjectsListView.prototype.toggle = function(controller) {
      var _ref1;
      this.controller = controller;
      if ((_ref1 = this.panel) != null ? _ref1.isVisible() : void 0) {
        return this.hide();
      } else {
        return this.show();
      }
    };

    ProjectsListView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.hide() : void 0;
    };

    ProjectsListView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.loading.text("Looking for repositories ...");
      this.loadingArea.show();
      this.panel.show();
      this.cachedProjects = this.controller.projects;
      if (this.cachedProjects != null) {
        this.setItems(this.cachedProjects);
      }
      this.focusFilterEditor();
      return setImmediate((function(_this) {
        return function() {
          return _this.refreshItems();
        };
      })(this));
    };

    ProjectsListView.prototype.refreshItems = function() {
      this.cachedViews.clear();
      return this.controller.findGitRepos(null, (function(_this) {
        return function(repos) {
          var projectMap, _ref1;
          projectMap = {};
          if ((_ref1 = _this.cachedProjects) != null) {
            _ref1.forEach(function(project) {
              return projectMap[project.path] = project;
            });
          }
          repos.map(function(repo) {
            var project;
            project = projectMap[repo.path];
            if (project == null) {
              return repo;
            }
            repo.branch = project.branch;
            repo.dirty = project.dirty;
            repo.setStale(true);
            return repo;
          });
          return _this.setItems(repos);
        };
      })(this));
    };

    ProjectsListView.prototype.viewForItem = function(project) {
      var cachedView, createdSubview, subview, view;
      if (cachedView = this.cachedViews.get(project)) {
        return cachedView;
      }
      view = $$(function() {
        return this.li({
          "class": 'two-lines'
        }, (function(_this) {
          return function() {
            _this.div({
              "class": 'status status-added'
            });
            _this.div({
              "class": 'primary-line icon ' + project.icon
            }, function() {
              return _this.span(project.title);
            });
            return _this.div({
              "class": 'secondary-line no-icon'
            }, function() {
              return _this.span(project.path);
            });
          };
        })(this));
      });
      if (atom.config.get('git-projects.showGitInfo')) {
        createdSubview = null;
        subview = function() {
          createdSubview = $$(function() {
            this.span(" (" + project.branch + ")");
            if (project.dirty) {
              return this.span({
                "class": 'status status-modified icon icon-diff-modified'
              });
            }
          });
          return view.find('.primary-line').append(createdSubview);
        };
        if (project.hasGitInfo()) {
          subview();
        }
        if (!project.hasGitInfo() || project.isStale()) {
          project.readGitInfo(function() {
            if (createdSubview != null) {
              createdSubview.remove();
            }
            return subview();
          });
        }
      }
      this.cachedViews.set(project, view);
      return view;
    };

    return ProjectsListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXByb2plY3RzL2xpYi92aWV3cy9wcm9qZWN0cy1saXN0LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNFQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBZ0MsT0FBQSxDQUFRLHNCQUFSLENBQWhDLEVBQUMsU0FBQSxDQUFELEVBQUksVUFBQSxFQUFKLEVBQVEsc0JBQUEsY0FBUixFQUF3QixZQUFBLElBQXhCLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLE9BQUEsR0FBVSxPQUFBLENBQVEsbUJBQVIsQ0FIVixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHVDQUFBLENBQUE7Ozs7O0tBQUE7O0FBQUEsK0JBQUEsVUFBQSxHQUFZLElBQVosQ0FBQTs7QUFBQSwrQkFDQSxXQUFBLEdBQWEsR0FBQSxDQUFBLEdBRGIsQ0FBQTs7QUFBQSwrQkFHQSxRQUFBLEdBQVUsU0FBQSxHQUFBO2FBQ1IsR0FBQSxDQUFBLGlCQURRO0lBQUEsQ0FIVixDQUFBOztBQUFBLCtCQU1BLFVBQUEsR0FBWSxTQUFDLGNBQUQsR0FBQTtBQUNWLE1BQUEsa0RBQUEsU0FBQSxDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLGNBQVYsRUFGVTtJQUFBLENBTlosQ0FBQTs7QUFBQSwrQkFVQSxZQUFBLEdBQWMsU0FBQSxHQUFBO2FBQ1osUUFEWTtJQUFBLENBVmQsQ0FBQTs7QUFBQSwrQkFhQSxjQUFBLEdBQWdCLFNBQUEsR0FBQTthQUNkLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxPQUFs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

//# sourceURL=/Users/doot/.atom/packages/git-projects/lib/views/projects-list-view.coffee
