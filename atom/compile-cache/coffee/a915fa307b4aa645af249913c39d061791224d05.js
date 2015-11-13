(function() {
  var $, CompositeDisposable, FtpHost, Host, HostView, SftpHost, TextEditorView, View, err, fs, keytar, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View, TextEditorView = _ref.TextEditorView;

  CompositeDisposable = require('atom').CompositeDisposable;

  Host = require('../model/host');

  SftpHost = require('../model/sftp-host');

  FtpHost = require('../model/ftp-host');

  fs = require('fs-plus');

  try {
    keytar = require('keytar');
  } catch (_error) {
    err = _error;
    console.debug('Keytar could not be loaded! Passwords will be stored in cleartext to remoteEdit.json!');
    keytar = void 0;
  }

  module.exports = HostView = (function(_super) {
    __extends(HostView, _super);

    function HostView() {
      return HostView.__super__.constructor.apply(this, arguments);
    }

    HostView.content = function() {
      return this.div({
        "class": 'host-view'
      }, (function(_this) {
        return function() {
          _this.h2("Connection settings", {
            "class": "host-header"
          });
          _this.label('Hostname:');
          _this.subview('hostname', new TextEditorView({
            mini: true
          }));
          _this.label('Default directory:');
          _this.subview('directory', new TextEditorView({
            mini: true
          }));
          _this.label('Username:');
          _this.subview('username', new TextEditorView({
            mini: true
          }));
          _this.label('Port:');
          _this.subview('port', new TextEditorView({
            mini: true
          }));
          _this.h2("Authentication settings", {
            "class": "host-header"
          });
          _this.div({
            "class": 'block',
            outlet: 'authenticationButtonsBlock'
          }, function() {
            return _this.div({
              "class": 'btn-group'
            }, function() {
              _this.button({
                "class": 'btn selected',
                outlet: 'userAgentButton',
                click: 'userAgentButtonClick'
              }, 'User agent');
              _this.button({
                "class": 'btn',
                outlet: 'privateKeyButton',
                click: 'privateKeyButtonClick'
              }, 'Private key');
              return _this.button({
                "class": 'btn',
                outlet: 'passwordButton',
                click: 'passwordButtonClick'
              }, 'Password');
            });
          });
          _this.div({
            "class": 'block',
            outlet: 'passwordBlock'
          }, function() {
            _this.label('Password:');
            _this.subview('password', new TextEditorView({
              mini: true
            }));
            _this.label('Passwords are by default stored in cleartext! Leave password field empty if you want to be prompted.', {
              "class": 'text-warning'
            });
            return _this.label('Passwords can be saved to default system keychain by enabling option in settings.', {
              "class": 'text-warning'
            });
          });
          _this.div({
            "class": 'block',
            outlet: 'privateKeyBlock'
          }, function() {
            _this.label('Private key path:');
            _this.subview('privateKeyPath', new TextEditorView({
              mini: true
            }));
            _this.label('Private key passphrase:');
            _this.subview('privateKeyPassphrase', new TextEditorView({
              mini: true
            }));
            _this.label('Passphrases are by default stored in cleartext! Leave Passphrases field empty if you want to be prompted.', {
              "class": 'text-warning'
            });
            return _this.label('Passphrases can be saved to default system keychain by enabling option in settings.', {
              "class": 'text-warning'
            });
          });
          _this.h2("Additional settings", {
            "class": "host-header"
          });
          _this.label('Alias:');
          _this.subview('alias', new TextEditorView({
            mini: true
          }));
          return _this.div({
            "class": 'block',
            outlet: 'buttonBlock'
          }, function() {
            _this.button({
              "class": 'inline-block btn pull-right',
              outlet: 'cancelButton',
              click: 'cancel'
            }, 'Cancel');
            return _this.button({
              "class": 'inline-block btn pull-right',
              outlet: 'saveButton',
              click: 'confirm'
            }, 'Save');
          });
        };
      })(this));
    };

    HostView.prototype.initialize = function(host, ipdw) {
      var keytarPassphrase, keytarPassword, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;
      this.host = host;
      this.ipdw = ipdw;
      if (this.host == null) {
        throw new Error("Parameter \"host\" undefined!");
      }
      this.disposables = new CompositeDisposable;
      this.disposables.add(atom.commands.add('atom-workspace', {
        'core:confirm': (function(_this) {
          return function() {
            return _this.confirm();
          };
        })(this),
        'core:cancel': (function(_this) {
          return function(event) {
            _this.cancel();
            return event.stopPropagation();
          };
        })(this)
      }));
      this.alias.setText((_ref1 = this.host.alias) != null ? _ref1 : "");
      this.hostname.setText((_ref2 = this.host.hostname) != null ? _ref2 : "");
      this.directory.setText((_ref3 = this.host.directory) != null ? _ref3 : "/");
      this.username.setText((_ref4 = this.host.username) != null ? _ref4 : "");
      this.port.setText((_ref5 = this.host.port) != null ? _ref5 : "");
      if (atom.config.get('remote-edit.storePasswordsUsingKeytar') && (keytar != null)) {
        keytarPassword = keytar.getPassword(this.host.getServiceNamePassword(), this.host.getServiceAccount());
        this.password.setText(keytarPassword != null ? keytarPassword : "");
      } else {
        this.password.setText((_ref6 = this.host.password) != null ? _ref6 : "");
      }
      this.privateKeyPath.setText((_ref7 = this.host.privateKeyPath) != null ? _ref7 : atom.config.get('remote-edit.sshPrivateKeyPath'));
      if (atom.config.get('remote-edit.storePasswordsUsingKeytar') && (this.host instanceof SftpHost) && (keytar != null)) {
        keytarPassphrase = keytar.getPassword(this.host.getServiceNamePassphrase(), this.host.getServiceAccount());
        return this.privateKeyPassphrase.setText(keytarPassphrase != null ? keytarPassphrase : "");
      } else {
        return this.privateKeyPassphrase.setText((_ref8 = this.host.passphrase) != null ? _ref8 : "");
      }
    };

    HostView.prototype.userAgentButtonClick = function() {
      this.privateKeyButton.toggleClass('selected', false);
      this.userAgentButton.toggleClass('selected', true);
      this.passwordButton.toggleClass('selected', false);
      this.passwordBlock.hide();
      return this.privateKeyBlock.hide();
    };

    HostView.prototype.privateKeyButtonClick = function() {
      this.privateKeyButton.toggleClass('selected', true);
      this.userAgentButton.toggleClass('selected', false);
      this.passwordButton.toggleClass('selected', false);
      this.passwordBlock.hide();
      this.privateKeyBlock.show();
      return this.privateKeyPath.focus();
    };

    HostView.prototype.passwordButtonClick = function() {
      this.privateKeyButton.toggleClass('selected', false);
      this.userAgentButton.toggleClass('selected', false);
      this.passwordButton.toggleClass('selected', true);
      this.privateKeyBlock.hide();
      this.passwordBlock.show();
      return this.password.focus();
    };

    HostView.prototype.confirm = function() {
      var keytarResult;
      this.cancel();
      this.host.alias = this.alias.getText();
      this.host.hostname = this.hostname.getText();
      this.host.directory = this.directory.getText();
      this.host.username = this.username.getText();
      this.host.port = this.port.getText();
      if (this.host instanceof SftpHost) {
        this.host.useAgent = this.userAgentButton.hasClass('selected');
        this.host.usePrivateKey = this.privateKeyButton.hasClass('selected');
        this.host.usePassword = this.passwordButton.hasClass('selected');
        if (this.privateKeyButton.hasClass('selected')) {
          this.host.privateKeyPath = fs.absolute(this.privateKeyPath.getText());
          if (atom.config.get('remote-edit.storePasswordsUsingKeytar') && (this.privateKeyPassphrase.getText().length > 0) && (keytar != null)) {
            keytar.replacePassword(this.host.getServiceNamePassphrase(), this.host.getServiceAccount(), this.privateKeyPassphrase.getText());
            this.host.passphrase = "***** keytar *****";
          } else if (atom.config.get('remote-edit.storePasswordsUsingKeytar') && (this.privateKeyPassphrase.getText().length === 0)) {
            keytar.deletePassword(this.host.getServiceNamePassphrase(), this.host.getServiceAccount());
            this.host.passphrase = "";
          } else {
            this.host.passphrase = this.privateKeyPassphrase.getText();
          }
        }
        if (this.passwordButton.hasClass('selected')) {
          if (atom.config.get('remote-edit.storePasswordsUsingKeytar') && (this.password.getText().length > 0) && (keytar != null)) {
            keytarResult = keytar.replacePassword(this.host.getServiceNamePassword(), this.host.getServiceAccount(), this.password.getText());
            this.host.password = "***** keytar *****";
          } else if (atom.config.get('remote-edit.storePasswordsUsingKeytar') && (this.password.getText().length === 0) && (keytar != null)) {
            keytar.deletePassword(this.host.getServiceNamePassword(), this.host.getServiceAccount());
            this.host.password = "";
          } else {
            this.host.password = this.password.getText();
          }
        }
      } else if (this.host instanceof FtpHost) {
        this.host.usePassword = true;
        if (atom.config.get('remote-edit.storePasswordsUsingKeytar') && (this.password.getText().length > 0) && (keytar != null)) {
          keytarResult = keytar.replacePassword(this.host.getServiceNamePassword(), this.host.getServiceAccount(), this.password.getText());
          this.host.password = "***** keytar *****";
        } else if (atom.config.get('remote-edit.storePasswordsUsingKeytar') && (this.password.getText().length === 0) && (keytar != null)) {
          keytar.deletePassword(this.host.getServiceNamePassword(), this.host.getServiceAccount());
          this.host.password = "";
        } else {
          this.host.password = this.password.getText();
        }
      } else {
        throw new Error("\"host\" is not valid type!", this.host);
      }
      if (this.ipdw != null) {
        return this.ipdw.getData().then((function(_this) {
          return function(data) {
            return data.addNewHost(_this.host);
          };
        })(this));
      } else {
        return this.host.invalidate();
      }
    };

    HostView.prototype.destroy = function() {
      if (this.panel != null) {
        this.panel.destroy();
      }
      return this.disposables.dispose();
    };

    HostView.prototype.cancel = function() {
      this.cancelled();
      this.restoreFocus();
      return this.destroy();
    };

    HostView.prototype.cancelled = function() {
      return this.hide();
    };

    HostView.prototype.toggle = function() {
      var _ref1;
      if ((_ref1 = this.panel) != null ? _ref1.isVisible() : void 0) {
        return this.cancel();
      } else {
        return this.show();
      }
    };

    HostView.prototype.show = function() {
      if (this.host instanceof SftpHost) {
        this.authenticationButtonsBlock.show();
        if (this.host.usePassword) {
          this.passwordButton.click();
        } else if (this.host.usePrivateKey) {
          this.privateKeyButton.click();
        } else if (this.host.useAgent) {
          this.userAgentButton.click();
        }
      } else if (this.host instanceof FtpHost) {
        this.authenticationButtonsBlock.hide();
        this.passwordBlock.show();
        this.privateKeyBlock.hide();
      } else {
        throw new Error("\"host\" is unknown!", this.host);
      }
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.storeFocusedElement();
      return this.hostname.focus();
    };

    HostView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.hide() : void 0;
    };

    HostView.prototype.storeFocusedElement = function() {
      return this.previouslyFocusedElement = $(document.activeElement);
    };

    HostView.prototype.restoreFocus = function() {
      var _ref1;
      return (_ref1 = this.previouslyFocusedElement) != null ? _ref1.focus() : void 0;
    };

    return HostView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcmVtb3RlLWVkaXQvbGliL3ZpZXcvaG9zdC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzR0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBNEIsT0FBQSxDQUFRLHNCQUFSLENBQTVCLEVBQUMsU0FBQSxDQUFELEVBQUksWUFBQSxJQUFKLEVBQVUsc0JBQUEsY0FBVixDQUFBOztBQUFBLEVBQ0Msc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQURELENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGVBQVIsQ0FIUCxDQUFBOztBQUFBLEVBSUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxvQkFBUixDQUpYLENBQUE7O0FBQUEsRUFLQSxPQUFBLEdBQVUsT0FBQSxDQUFRLG1CQUFSLENBTFYsQ0FBQTs7QUFBQSxFQU9BLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQVBMLENBQUE7O0FBU0E7QUFDRSxJQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUixDQUFULENBREY7R0FBQSxjQUFBO0FBR0UsSUFESSxZQUNKLENBQUE7QUFBQSxJQUFBLE9BQU8sQ0FBQyxLQUFSLENBQWMsdUZBQWQsQ0FBQSxDQUFBO0FBQUEsSUFDQSxNQUFBLEdBQVMsTUFEVCxDQUhGO0dBVEE7O0FBQUEsRUFlQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBQ0osK0JBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsUUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sV0FBUDtPQUFMLEVBQXlCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDdkIsVUFBQSxLQUFD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

//# sourceURL=/Users/doot/.atom/packages/remote-edit/lib/view/host-view.coffee
