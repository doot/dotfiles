(function() {
  var CherryPickSelectBranch, git, gitCherryPick;

  git = require('../git');

  CherryPickSelectBranch = require('../views/cherry-pick-select-branch-view');

  gitCherryPick = function(repo) {
    var currentHead, head, heads, i, _i, _len;
    heads = repo.getReferences().heads;
    currentHead = repo.getShortHead();
    for (i = _i = 0, _len = heads.length; _i < _len; i = ++_i) {
      head = heads[i];
      heads[i] = head.replace('refs/heads/', '');
    }
    heads = heads.filter(function(head) {
      return head !== currentHead;
    });
    return new CherryPickSelectBranch(repo, heads, currentHead);
  };

  module.exports = gitCherryPick;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtY2hlcnJ5LXBpY2suY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBDQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLHNCQUFBLEdBQXlCLE9BQUEsQ0FBUSx5Q0FBUixDQUR6QixDQUFBOztBQUFBLEVBR0EsYUFBQSxHQUFnQixTQUFDLElBQUQsR0FBQTtBQUNkLFFBQUEscUNBQUE7QUFBQSxJQUFBLEtBQUEsR0FBUSxJQUFJLENBQUMsYUFBTCxDQUFBLENBQW9CLENBQUMsS0FBN0IsQ0FBQTtBQUFBLElBQ0EsV0FBQSxHQUFjLElBQUksQ0FBQyxZQUFMLENBQUEsQ0FEZCxDQUFBO0FBR0EsU0FBQSxvREFBQTtzQkFBQTtBQUNFLE1BQUEsS0FBTSxDQUFBLENBQUEsQ0FBTixHQUFXLElBQUksQ0FBQyxPQUFMLENBQWEsYUFBYixFQUE0QixFQUE1QixDQUFYLENBREY7QUFBQSxLQUhBO0FBQUEsSUFNQSxLQUFBLEdBQVEsS0FBSyxDQUFDLE1BQU4sQ0FBYSxTQUFDLElBQUQsR0FBQTthQUFVLElBQUEsS0FBVSxZQUFwQjtJQUFBLENBQWIsQ0FOUixDQUFBO1dBT0ksSUFBQSxzQkFBQSxDQUF1QixJQUF2QixFQUE2QixLQUE3QixFQUFvQyxXQUFwQyxFQVJVO0VBQUEsQ0FIaEIsQ0FBQTs7QUFBQSxFQWFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGFBYmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-cherry-pick.coffee
