(function() {
  module.exports = {
    deactivate: function() {
      var _ref;
      return (_ref = this.toolBar) != null ? _ref.removeItems() : void 0;
    },
    consumeToolBar: function(toolBar) {
      this.toolBar = toolBar('tool-bar-almighty');
      this.toolBar.addButton({
        icon: 'document-text',
        callback: 'application:open-file',
        tooltip: 'Open File',
        iconset: 'ion'
      });
      this.toolBar.addButton({
        'icon': 'folder',
        'callback': 'application:open-folder',
        'tooltip': 'Open Folder',
        'iconset': 'ion'
      });
      this.toolBar.addButton({
        'icon': 'archive',
        'callback': 'core:save',
        'tooltip': 'Save File',
        'iconset': 'ion'
      });
      if (atom.packages.loadedPackages['git-control']) {
        this.toolBar.addButton({
          'iconset': 'fa',
          'icon': 'bullseye',
          'tooltip': 'Git Control',
          'callback': 'git-control:toggle'
        });
      }
      if (atom.packages.loadedPackages['git-projects']) {
        this.toolBar.addButton({
          'iconset': 'fa',
          'icon': 'git',
          'tooltip': 'Git Projects',
          'callback': 'git-projects:toggle'
        });
      }
      this.toolBar.addSpacer();
      this.toolBar.addButton({
        'icon': 'columns',
        'iconset': 'fa',
        'tooltip': 'Split screen - Horizontally',
        'callback': 'pane:split-right'
      });
      this.toolBar.addButton({
        'icon': 'columns fa-rotate-270',
        'iconset': 'fa',
        'tooltip': 'Split screen - Vertically',
        'callback': 'pane:split-down'
      });
      this.toolBar.addSpacer();
      if (atom.packages.loadedPackages['merge-conflicts']) {
        this.toolBar.addButton({
          'icon': 'code-fork',
          'iconset': 'fa',
          'tooltip': 'Merge Conflicts',
          'callback': 'merge-conflicts:detect'
        });
      }
      this.toolBar.addButton({
        'iconset': 'fa',
        'icon': 'arrows-alt',
        'tooltip': 'Toggle Fullscreen',
        'callback': 'window:toggle-full-screen'
      });
      this.toolBar.addButton({
        'icon': 'sitemap',
        'callback': 'tree-view:toggle',
        'tooltip': 'Toggle Sidebar',
        'iconset': 'fa'
      });
      if (atom.packages.loadedPackages['minimap']) {
        this.toolBar.addButton({
          'icon': 'map',
          'callback': 'minimap:toggle',
          'tooltip': 'Toggle Minimap',
          'iconset': 'ion'
        });
      }
      this.toolBar.addSpacer();
      this.toolBar.addButton({
        'icon': 'refresh',
        'callback': 'window:reload',
        'tooltip': 'Reload Window',
        'iconset': 'ion'
      });
      if (atom.packages.loadedPackages['term3']) {
        this.toolBar.addButton({
          'icon': 'terminal',
          'callback': 'term3:open-split-down',
          'tooltip': 'Term3 Split Down'
        });
      } else if (atom.packages.loadedPackages['term2']) {
        this.toolBar.addButton({
          'icon': 'terminal',
          'callback': 'term2:open-split-down',
          'tooltip': 'Term2 Split Down'
        });
      }
      this.toolBar.addButton({
        'icon': 'bug',
        'callback': 'window:toggle-dev-tools',
        'tooltip': 'Toggle Developer Tools'
      });
      return this.toolBar.addButton({
        'icon': 'gear-a',
        'callback': 'settings-view:open',
        'tooltip': 'Open Settings View',
        'iconset': 'ion'
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvdG9vbC1iYXItYWxtaWdodHkvbGliL3Rvb2wtYmFyLWFsbWlnaHR5LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSxJQUFBO2lEQUFRLENBQUUsV0FBVixDQUFBLFdBRFU7SUFBQSxDQUFaO0FBQUEsSUFHQSxjQUFBLEVBQWdCLFNBQUMsT0FBRCxHQUFBO0FBQ2QsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLE9BQUEsQ0FBUSxtQkFBUixDQUFYLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBVCxDQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sZUFBTjtBQUFBLFFBQ0EsUUFBQSxFQUFVLHVCQURWO0FBQUEsUUFFQSxPQUFBLEVBQVMsV0FGVDtBQUFBLFFBR0EsT0FBQSxFQUFTLEtBSFQ7T0FERixDQUZBLENBQUE7QUFBQSxNQVFBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBVCxDQUNFO0FBQUEsUUFBQSxNQUFBLEVBQVEsUUFBUjtBQUFBLFFBQ0EsVUFBQSxFQUFZLHlCQURaO0FBQUEsUUFFQSxTQUFBLEVBQVcsYUFGWDtBQUFBLFFBR0EsU0FBQSxFQUFXLEtBSFg7T0FERixDQVJBLENBQUE7QUFBQSxNQWNBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBVCxDQUNFO0FBQUEsUUFBQSxNQUFBLEVBQVEsU0FBUjtBQUFBLFFBQ0EsVUFBQSxFQUFZLFdBRFo7QUFBQSxRQUVBLFNBQUEsRUFBVyxXQUZYO0FBQUEsUUFHQSxTQUFBLEVBQVcsS0FIWDtPQURGLENBZEEsQ0FBQTtBQW9CQSxNQUFBLElBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFlLENB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

//# sourceURL=/Users/doot/.atom/packages/tool-bar-almighty/lib/tool-bar-almighty.coffee
