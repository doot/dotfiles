(function() {
  var TagListView, git, gitTags;

  git = require('../git');

  TagListView = require('../views/tag-list-view');

  gitTags = function(repo) {
    this.TagListView = null;
    return git.cmd({
      args: ['tag', '-ln'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return this.TagListView = new TagListView(repo, data);
      },
      exit: function() {
        if (this.TagListView == null) {
          return new TagListView(repo);
        }
      }
    });
  };

  module.exports = gitTags;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtdGFncy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUJBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSx3QkFBUixDQURkLENBQUE7O0FBQUEsRUFHQSxPQUFBLEdBQVUsU0FBQyxJQUFELEdBQUE7QUFDUixJQUFBLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBZixDQUFBO1dBQ0EsR0FBRyxDQUFDLEdBQUosQ0FDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLENBQUMsS0FBRCxFQUFRLEtBQVIsQ0FBTjtBQUFBLE1BQ0EsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBREw7QUFBQSxNQUVBLE1BQUEsRUFBUSxTQUFDLElBQUQsR0FBQTtlQUFVLElBQUMsQ0FBQSxXQUFELEdBQW1CLElBQUEsV0FBQSxDQUFZLElBQVosRUFBa0IsSUFBbEIsRUFBN0I7TUFBQSxDQUZSO0FBQUEsTUFHQSxJQUFBLEVBQU0sU0FBQSxHQUFBO0FBQUcsUUFBQSxJQUE2Qix3QkFBN0I7aUJBQUksSUFBQSxXQUFBLENBQVksSUFBWixFQUFKO1NBQUg7TUFBQSxDQUhOO0tBREYsRUFGUTtFQUFBLENBSFYsQ0FBQTs7QUFBQSxFQVdBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE9BWGpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-tags.coffee
