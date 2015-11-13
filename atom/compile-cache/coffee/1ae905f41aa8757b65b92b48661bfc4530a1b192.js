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
      if (atom.packages.loadedPackages['project-manager']) {
        this.toolBar.addButton({
          'icon': 'file-submodule',
          'tooltip': 'List projects',
          'callback': 'project-manager:list-projects'
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
        'icon': 'indent',
        'callback': 'editor:auto-indent',
        'tooltip': 'Auto indent (selection)',
        'iconset': 'fa'
      });
      this.toolBar.addButton({
        'icon': 'level-up',
        'callback': 'editor:fold-all',
        'tooltip': 'Fold all',
        'iconset': 'fa'
      });
      this.toolBar.addButton({
        'icon': 'level-down',
        'callback': 'editor:unfold-all',
        'tooltip': 'Unfold all',
        'iconset': 'fa'
      });
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
