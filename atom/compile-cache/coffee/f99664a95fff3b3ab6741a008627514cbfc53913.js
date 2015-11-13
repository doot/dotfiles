(function() {
  var $, FileItem, FileView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('atom-space-pen-views'), View = _ref.View, $ = _ref.$;

  FileItem = (function(_super) {
    __extends(FileItem, _super);

    function FileItem() {
      return FileItem.__super__.constructor.apply(this, arguments);
    }

    FileItem.content = function(file) {
      return this.div({
        "class": "file " + file.type,
        'data-name': file.name
      }, (function(_this) {
        return function() {
          _this.i({
            "class": 'icon check clickable',
            click: 'select'
          });
          _this.i({
            "class": "icon file-" + file.type
          });
          return _this.span({
            "class": 'clickable',
            click: 'select'
          }, file.name);
        };
      })(this));
    };

    FileItem.prototype.initialize = function(file) {
      return this.file = file;
    };

    FileItem.prototype.select = function() {
      return this.file.select(this.file.name);
    };

    return FileItem;

  })(View);

  module.exports = FileView = (function(_super) {
    __extends(FileView, _super);

    function FileView() {
      return FileView.__super__.constructor.apply(this, arguments);
    }

    FileView.content = function() {
      return this.div({
        "class": 'files'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'heading clickable'
          }, function() {
            _this.i({
              click: 'toggleBranch',
              "class": 'icon forked'
            });
            _this.span({
              click: 'toggleBranch'
            }, 'Workspace');
            return _this.div({
              "class": 'action',
              click: 'selectAll'
            }, function() {
              _this.span('Select');
              _this.i({
                "class": 'icon check'
              });
              return _this.input({
                "class": 'invisible',
                type: 'checkbox',
                outlet: 'allCheckbox',
                checked: true
              });
            });
          });
          return _this.div({
            "class": 'placeholder'
          }, 'No local working copy changes detected');
        };
      })(this));
    };

    FileView.prototype.initialize = function() {
      this.files = {};
      this.arrayOfFiles = new Array;
      return this.hidden = false;
    };

    FileView.prototype.toggleBranch = function() {
      if (this.hidden) {
        this.addAll(this.arrayOfFiles);
      } else {
        this.clearAll();
      }
      return this.hidden = !this.hidden;
    };

    FileView.prototype.hasSelected = function() {
      var file, name, _ref1;
      _ref1 = this.files;
      for (name in _ref1) {
        file = _ref1[name];
        if (file.selected) {
          return true;
        }
      }
      return false;
    };

    FileView.prototype.getSelected = function() {
      var file, files, name, _ref1;
      files = {
        all: [],
        add: [],
        rem: []
      };
      _ref1 = this.files;
      for (name in _ref1) {
        file = _ref1[name];
        if (!file.selected) {
          continue;
        }
        files.all.push(name);
        switch (file.type) {
          case 'deleted':
            files.rem.push(name);
            break;
          default:
            files.add.push(name);
        }
      }
      return files;
    };

    FileView.prototype.showSelected = function() {
      var file, fnames, name, _ref1;
      fnames = [];
      this.arrayOfFiles = Object.keys(this.files).map((function(_this) {
        return function(file) {
          return _this.files[file];
        };
      })(this));
      this.find('.file').toArray().forEach((function(_this) {
        return function(div) {
          var f, name;
          f = $(div);
          if (name = f.attr('data-name')) {
            if (_this.files[name].selected) {
              fnames.push(name);
              f.addClass('active');
            } else {
              f.removeClass('active');
            }
          }
        };
      })(this));
      _ref1 = this.files;
      for (name in _ref1) {
        file = _ref1[name];
        if (__indexOf.call(fnames, name) < 0) {
          file.selected = false;
        }
      }
      this.parentView.showSelectedFiles();
    };

    FileView.prototype.clearAll = function() {
      this.find('>.file').remove();
    };

    FileView.prototype.addAll = function(files) {
      var file, fnames, name, select, _ref1;
      fnames = [];
      this.clearAll();
      if (files.length) {
        this.removeClass('none');
        select = (function(_this) {
          return function(name) {
            return _this.selectFile(name);
          };
        })(this);
        files.forEach((function(_this) {
          return function(file) {
            var _base, _name;
            fnames.push(file.name);
            file.select = select;
            (_base = _this.files)[_name = file.name] || (_base[_name] = {
              name: file.name
            });
            _this.files[file.name].type = file.type;
            _this.files[file.name].selected = file.selected;
            _this.append(new FileItem(file));
          };
        })(this));
      } else {
        this.addClass('none');
      }
      _ref1 = this.files;
      for (name in _ref1) {
        file = _ref1[name];
        if (__indexOf.call(fnames, name) < 0) {
          file.selected = false;
        }
      }
      this.showSelected();
    };

    FileView.prototype.selectFile = function(name) {
      if (name) {
        this.files[name].selected = !!!this.files[name].selected;
      }
      this.allCheckbox.prop('checked', false);
      this.showSelected();
    };

    FileView.prototype.selectAll = function() {
      var file, name, val, _ref1;
      if (this.hidden) {
        return;
      }
      val = !!!this.allCheckbox.prop('checked');
      this.allCheckbox.prop('checked', val);
      _ref1 = this.files;
      for (name in _ref1) {
        file = _ref1[name];
        file.selected = val;
      }
      this.showSelected();
    };

    FileView.prototype.unselectAll = function() {
      var file, name, _i, _len, _ref1;
      _ref1 = this.files;
      for (file = _i = 0, _len = _ref1.length; _i < _len; file = ++_i) {
        name = _ref1[file];
        if (file.selected) {
          file.selected = false;
        }
      }
    };

    return FileView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LWNvbnRyb2wvbGliL3ZpZXdzL2ZpbGUtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsaUNBQUE7SUFBQTs7eUpBQUE7O0FBQUEsRUFBQSxPQUFZLE9BQUEsQ0FBUSxzQkFBUixDQUFaLEVBQUMsWUFBQSxJQUFELEVBQU8sU0FBQSxDQUFQLENBQUE7O0FBQUEsRUFFTTtBQUNKLCtCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLFFBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxJQUFELEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQVEsT0FBQSxHQUFPLElBQUksQ0FBQyxJQUFwQjtBQUFBLFFBQTRCLFdBQUEsRUFBYSxJQUFJLENBQUMsSUFBOUM7T0FBTCxFQUF5RCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3ZELFVBQUEsS0FBQyxDQUFBLENBQUQsQ0FBRztBQUFBLFlBQUEsT0FBQSxFQUFPLHNCQUFQO0FBQUEsWUFBK0IsS0FBQSxFQUFPLFFBQXRDO1dBQUgsQ0FBQSxDQUFBO0FBQUEsVUFDQSxLQUFDLENBQUEsQ0FBRCxDQUFHO0FBQUEsWUFBQSxPQUFBLEVBQVEsWUFBQSxHQUFZLElBQUksQ0FBQyxJQUF6QjtXQUFILENBREEsQ0FBQTtpQkFFQSxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsWUFBQSxPQUFBLEVBQU8sV0FBUDtBQUFBLFlBQW9CLEtBQUEsRUFBTyxRQUEzQjtXQUFOLEVBQTJDLElBQUksQ0FBQyxJQUFoRCxFQUh1RDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpELEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsdUJBTUEsVUFBQSxHQUFZLFNB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

//# sourceURL=/Users/doot/.atom/packages/git-control/lib/views/file-view.coffee
