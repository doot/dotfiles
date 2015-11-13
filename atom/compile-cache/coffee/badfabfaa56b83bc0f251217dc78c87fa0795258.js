(function() {
  var $, BrowserPlusModel, BrowserPlusView, CompositeDisposable, URL, View, favList, jQ, loophole, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  _ref = require('atom-space-pen-views'), View = _ref.View, $ = _ref.$;

  loophole = require('./eval');

  URL = require('url');

  jQ = require('../node_modules/jquery/dist/jquery.js');

  require('jquery-ui/autocomplete');

  BrowserPlusModel = require('./browser-plus-model');

  _ = require('lodash');

  favList = require('./fav-view');

  module.exports = BrowserPlusView = (function(_super) {
    __extends(BrowserPlusView, _super);

    function BrowserPlusView(model) {
      this.model = model;
      this.deActivateSelection = __bind(this.deActivateSelection, this);
      this.subscriptions = new CompositeDisposable;
      this.model.view = this;
      this.model.onDidDestroy((function(_this) {
        return function() {
          return jQ(_this.uri).autocomplete('destroy');
        };
      })(this));
      BrowserPlusView.__super__.constructor.apply(this, arguments);
    }

    BrowserPlusView.content = function(params) {
      var resources, src, srcdir, url;
      srcdir = atom.packages.getPackageDirPaths('browser-plus')[0] + '/browser-plus';
      if ((url = params.uri).indexOf('browser-plus://history') >= 0) {
        resources = "" + srcdir + "/resources/";
        url = "file://" + resources + "history.html";
      }
      if (params.src) {
        src = params.src.replace(/"/g, '&quot;');
        if (src.includes("data:text/html,")) {
          url = src;
        } else {
          url = "data:text/html, " + src;
        }
      }
      return this.div({
        "class": 'browser-plus'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'uri native-key-bindings'
          }, function() {
            _this.div({
              "class": 'nav-btns-left'
            }, function() {
              _this.span({
                id: 'back',
                "class": 'mega-octicon octicon-arrow-left',
                outlet: 'back'
              });
              _this.span({
                id: 'forward',
                "class": 'mega-octicon octicon-arrow-right',
                outlet: 'forward'
              });
              _this.span({
                id: 'refresh',
                "class": 'mega-octicon octicon-sync',
                outlet: 'refresh'
              });
              _this.span({
                id: 'select',
                "class": 'mega-octicon octicon-eye',
                outlet: 'select'
              });
              _this.span({
                id: 'history',
                "class": 'mega-octicon octicon-book',
                outlet: 'history'
              });
              _this.span({
                id: 'fav',
                "class": 'mega-octicon octicon-star',
                outlet: 'fav'
              });
              return _this.span({
                id: 'favList',
                "class": 'octicon octicon-arrow-down',
                outlet: 'favList'
              });
            });
            return _this.div({
              "class": 'nav-btns'
            }, function() {
              _this.div({
                "class": 'nav-btns-right'
              }, function() {
                _this.span({
                  id: 'print',
                  "class": 'icon-browser-pluss icon-print',
                  outlet: 'print'
                });
                _this.span({
                  id: 'thumbs',
                  "class": 'mega-octicon octicon-thumbsup',
                  outlet: 'thumbs'
                });
                _this.span({
                  id: 'live',
                  "class": 'mega-octicon octicon-zap',
                  outlet: 'live'
                });
                return _this.span({
                  id: 'devtool',
                  "class": 'mega-octicon octicon-tools',
                  outlet: 'devtool'
                });
              });
              return _this.div({
                "class": 'input-uri'
              }, function() {
                return _this.input({
                  "class": "native-key-bindings",
                  type: 'text',
                  id: 'uri',
                  outlet: 'uri',
                  value: "" + params.uri
                });
              });
            });
          });
          if (atom.config.get('browser-plus.node')) {
            return _this.tag('webview', {
              "class": "native-key-bindings",
              outlet: 'htmlv',
              nodeintegration: 'on',
              plugins: 'on',
              src: "" + url,
              disablewebsecurity: 'on',
              allowfileaccessfromfiles: 'on',
              allowPointerLock: 'on',
              preload: "file:///" + srcdir + "/resources/bp-client.js"
            });
          } else {
            return _this.tag('webview', {
              "class": "native-key-bindings",
              outlet: 'htmlv',
              preload: "file:///" + srcdir + "/resources/bp-client.js",
              plugins: 'on',
              src: "" + url,
              disablewebsecurity: 'on',
              allowfileaccessfromfiles: 'on',
              allowPointerLock: 'on'
            });
          }
        };
      })(this));
    };

    BrowserPlusView.prototype.initialize = function() {
      var select, src, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
      src = (function(_this) {
        return function(req, res) {
          var fav, hist, histDate, history, hists, key, pattern, searchUrl, title, uris, _i, _j, _len, _len1, _ref1;
          pattern = RegExp("" + req.term, "i");
          history = [];
          fav = _.filter(_this.model.browserPlus.fav, function(fav) {
            return fav.uri.match(pattern) || fav.title.match(pattern);
          });
          _ref1 = _this.model.browserPlus.history;
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            histDate = _ref1[_i];
            for (key in histDate) {
              hists = histDate[key];
              for (_j = 0, _len1 = hists.length; _j < _len1; _j++) {
                hist = hists[_j];
                title = _this.model.browserPlus.title[hist.uri];
                if (hist.uri.match(pattern) || (title != null ? title.match(pattern) : void 0)) {
                  history.push(hist.uri);
                }
              }
            }
          }
          uris = _.union(_.pluck(fav, "uri"), history);
          res(uris);
          searchUrl = 'http://api.bing.com/osjson.aspx';
          return (function() {
            return jQ.ajax({
              url: searchUrl,
              dataType: 'json',
              data: {
                query: req.term,
                'web.count': 10
              },
              success: (function(_this) {
                return function(data) {
                  var dat, search, _k, _len2, _ref2;
                  uris = uris.slice(0, 11);
                  search = "http://www.google.com/search?as_q=";
                  _ref2 = data[1].slice(0, 11);
                  for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                    dat = _ref2[_k];
                    uris.push({
                      label: dat,
                      value: search + dat
                    });
                  }
                  return res(uris);
                };
              })(this)
            });
          })();
        };
      })(this);
      select = (function(_this) {
        return function(event, ui) {
          return _this.goToUrl(ui.item.value);
        };
      })(this);
      jQ(this.uri).autocomplete({
        source: src,
        minLength: 2,
        select: select
      });
      this.subscriptions.add(atom.tooltips.add(this.back, {
        title: 'Back'
      }));
      this.subscriptions.add(atom.tooltips.add(this.forward, {
        title: 'Forward'
      }));
      this.subscriptions.add(atom.tooltips.add(this.refresh, {
        title: 'Refresh'
      }));
      this.subscriptions.add(atom.tooltips.add(this.select, {
        title: 'Select'
      }));
      this.subscriptions.add(atom.tooltips.add(this.history, {
        title: 'View Hist/ctrl+h'
      }));
      this.subscriptions.add(atom.tooltips.add(this.print, {
        title: 'Print'
      }));
      this.subscriptions.add(atom.tooltips.add(this.favList, {
        title: 'View Favorites'
      }));
      this.subscriptions.add(atom.tooltips.add(this.fav, {
        title: 'Favoritize'
      }));
      this.subscriptions.add(atom.tooltips.add(this.live, {
        title: 'Live'
      }));
      this.subscriptions.add(atom.tooltips.add(this.devtool, {
        title: 'Dev Tools-f12'
      }));
      this.liveOn = false;
      this.subscriptions.add(atom.tooltips.add(this.thumbs, {
        title: 'Preview'
      }));
      this.element.onkeydown = (function(_this) {
        return function() {
          return _this.showDevTool(arguments);
        };
      })(this);
      if (this.model.uri.indexOf('file:///') >= 0) {
        this.checkFav();
      }
      if (this.model.uri.indexOf('browser-plus://history') >= 0) {
        this.hist = true;
        this.model.browserPlus.histView = this;
      } else {
        Array.observe(this.model.browserPlus.fav, (function(_this) {
          return function(ele) {
            return _this.checkFav();
          };
        })(this));
      }
      if ((_ref1 = this.htmlv[0]) != null) {
        _ref1.addEventListener("permissionrequest", function(e) {
          return e.request.allow();
        });
      }
      if ((_ref2 = this.htmlv[0]) != null) {
        _ref2.addEventListener("console-message", (function(_this) {
          return function(e) {
            var MOMENT, data, date, delDate, his, hist, i, idx, indx, item, itm, itms, key, moment, obj, title, uri, _i, _j, _len, _len1, _ref3, _ref4, _ref5, _ref6;
            if (_this.model.uri === 'browser-plus://history') {
              if (e.message.includes('~browser-plus-hist-clear~')) {
                _this.model.browserPlus.history = [];
                if ((_ref3 = _this.htmlv[0]) != null) {
                  _ref3.executeJavaScript("riot.mount('hist',eval(" + data + ")); histTag = (riot.update())[0]");
                }
              }
              if (e.message.includes('~browser-plus-hist-del-date~')) {
                delDate = e.message.replace('~browser-plus-hist-del-date~', '');
                hist = _this.model.browserPlus.history;
                for (i = _i = 0, _len = hist.length; _i < _len; i = ++_i) {
                  key = hist[i];
                  for (date in key) {
                    obj = key[date];
                    if (date === delDate) {
                      hist.splice(i, 1);
                    }
                  }
                }
              }
              if (e.message.includes('~browser-plus-hist-delete~')) {
                item = e.message.replace('~browser-plus-hist-delete~', '');
                item = loophole.allowUnsafeEval(function() {
                  return eval("(" + item + ")");
                });
                MOMENT = require("../resources/moment.min.js");
                moment = MOMENT(item.date).format('YYYYMMDD');
                hist = _this.model.browserPlus.history;
                if (!(hist || hist.length === 0)) {
                  return;
                }
                for (_j = 0, _len1 = hist.length; _j < _len1; _j++) {
                  his = hist[_j];
                  for (date in his) {
                    itms = his[date];
                    if (date === moment) {
                      for (idx in itms) {
                        itm = itms[idx];
                        if (itm.date === item.date) {
                          itms.splice(idx, 1);
                        }
                      }
                    }
                  }
                }
              }
            }
            if (e.message.includes('~browser-plus-href~')) {
              if (_this.model.uri === 'browser-plus://history') {
                data = {
                  hist: _this.model.browserPlus.history,
                  fav: _this.model.browserPlus.fav,
                  title: _this.model.browserPlus.title,
                  favIcon: _this.model.browserPlus.favIcon
                };
                data = JSON.stringify(data);
                return (_ref4 = _this.htmlv[0]) != null ? _ref4.executeJavaScript("riot.mount('hist',eval(" + data + ")); histTag = (riot.update())[0]") : void 0;
              } else {
                data = e.message.replace('~browser-plus-href~', '');
                indx = data.indexOf(' ');
                uri = data.substr(0, indx);
                title = data.substr(indx + 1);
                if (!BrowserPlusModel.checkUrl(uri)) {
                  uri = atom.config.get('browser-plus.homepage') || "http://www.google.com";
                  atom.notifications.addSuccess("Redirecting to " + uri);
                  if ((_ref5 = _this.htmlv[0]) != null) {
                    _ref5.executeJavaScript("location.href = '" + uri + "'");
                  }
                  return;
                }
                if (uri && uri !== _this.model.uri) {
                  _this.uri.val(uri);
                  _this.model.uri = uri;
                }
                if (title) {
                  _this.model.browserPlus.title[_this.model.uri] = title;
                  if (title !== _this.model.getTitle()) {
                    _this.model.setTitle(title);
                  }
                } else {
                  _this.model.browserPlus.title[_this.model.uri] = uri;
                  _this.model.setTitle(uri);
                }
                _this.select.removeClass('active');
                _this.deActivateSelection();
                _this.live.toggleClass('active', _this.liveOn);
                if (!_this.liveOn) {
                  if ((_ref6 = _this.liveSubscription) != null) {
                    _ref6.dispose();
                  }
                }
                _this.checkNav();
                _this.checkFav();
                _this.addHistory();
                if (atom.config.get('browser-plus.node')) {
                  return setTimeout(function() {
                    var _ref10, _ref7, _ref8, _ref9;
                    if ((_ref7 = _this.htmlv[0]) != null) {
                      _ref7.executeJavaScript(_this.model.browserPlus.CSSjs);
                    }
                    if ((_ref8 = _this.htmlv[0]) != null) {
                      _ref8.executeJavaScript(_this.model.browserPlus.Selectorjs);
                    }
                    if ((_ref9 = _this.htmlv[0]) != null) {
                      _ref9.executeJavaScript(_this.model.browserPlus.JQueryjs);
                    }
                    return (_ref10 = _this.htmlv[0]) != null ? _ref10.executeJavaScript(_this.model.browserPlus.js) : void 0;
                  }, 100);
                }
              }
            }
          };
        })(this));
      }
      if ((_ref3 = this.htmlv[0]) != null) {
        _ref3.addEventListener("page-favicon-updated", (function(_this) {
          return function(e) {
            var icon, style;
            _this.model.browserPlus.favIcon[_this.model.uri] = icon = e.favicons[0];
            _this.model.iconName = Math.floor(Math.random() * 10000);
            _this.model.updateIcon();
            style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = ".title.icon.icon-" + _this.model.iconName + " {\n  background-size: 16px 16px;\n  background-repeat: no-repeat;\n  padding-left: 20px;\n  background-image: url('" + icon + "');\n  background-position-y: 5px;\n}";
            document.getElementsByTagName('head')[0].appendChild(style);
            return _this.liveHistory();
          };
        })(this));
      }
      if ((_ref4 = this.htmlv[0]) != null) {
        _ref4.addEventListener("page-title-set", (function(_this) {
          return function(e) {
            _this.model.browserPlus.title[_this.model.uri] = e.title;
            _this.liveHistory();
            return _this.model.setTitle(e.title);
          };
        })(this));
      }
      if ((_ref5 = this.htmlv[0]) != null) {
        _ref5.addEventListener("ipc-message", (function(_this) {
          return function(evt) {
            var _ref6, _ref7;
            switch (evt.channel) {
              case 'selection':
                _this.htmlSrc = (_ref6 = evt.args[0]) != null ? _ref6.html : void 0;
                return _this.css = (_ref7 = evt.args[0]) != null ? _ref7.css : void 0;
            }
          };
        })(this));
      }
      this.devtool.on('click', (function(_this) {
        return function(evt) {
          return _this.toggleDevTool();
        };
      })(this));
      this.print.on('click', (function(_this) {
        return function(evt) {
          var _ref6;
          return (_ref6 = _this.htmlv[0]) != null ? _ref6.print() : void 0;
        };
      })(this));
      this.live.on('click', (function(_this) {
        return function(evt) {
          var _ref6;
          if (_this.model.uri === 'browser-plus://history') {
            return;
          }
          if (_this.model.src) {
            return;
          }
          _this.liveOn = !_this.liveOn;
          _this.live.toggleClass('active', _this.liveOn);
          if (_this.liveOn) {
            if ((_ref6 = _this.htmlv[0]) != null) {
              _ref6.executeJavaScript("location.href = '" + _this.model.uri + "'");
            }
            _this.liveSubscription = new CompositeDisposable;
            _this.liveSubscription.add(atom.workspace.observeTextEditors(function(editor) {
              return _this.liveSubscription.add(editor.onDidSave(function() {
                var timeout;
                timeout = atom.config.get('browser-plus.live');
                return setTimeout(function() {
                  var _ref7, _ref8;
                  return (_ref7 = _this.htmlv) != null ? (_ref8 = _ref7[0]) != null ? typeof _ref8.executeJavaScript === "function" ? _ref8.executeJavaScript("location.href = '" + _this.model.uri + "'") : void 0 : void 0 : void 0;
                }, timeout);
              }));
            }));
            return _this.model.onDidDestroy(function() {
              return _this.liveSubscription.dispose();
            });
          } else {
            return _this.liveSubscription.dispose();
          }
        };
      })(this));
      this.select.on('click', (function(_this) {
        return function(evt) {
          if (!atom.config.get('browser-plus.node')) {
            alert('change browser-plus config to allow node integeration');
            return;
          }
          _this.select.toggleClass('active');
          return _this.deActivateSelection();
        };
      })(this));
      this.thumbs.on('click', (function(_this) {
        return function(evt) {
          var className, cssText, html, key, styl, val, _ref6;
          if (!atom.config.get('browser-plus.node')) {
            alert('change browser-plus config to allow node integeration/ preview');
            return;
          }
          if (!_this.htmlSrc) {
            return;
          }
          cssText = "";
          _ref6 = _this.css;
          for (className in _ref6) {
            styl = _ref6[className];
            cssText += " ." + className + "{  ";
            for (key in styl) {
              val = styl[key];
              cssText += "" + key + ": " + val + ";  ";
            }
            cssText += " }  ";
          }
          html = "data:text/html,\n<html>\n  <head>\n    <meta bp-uri='browser-plus://preview'>\n    <base href='" + (_this.uri.val()) + "'>\n    <style type='text/css'>\n      " + cssText + "\n    </style>\n  </head>\n  <body>\n     " + (_this.htmlSrc.replace(/"/g, '\'')) + "\n  </body>\n</html>";
          return atom.workspace.open('browser-plus://preview', {
            split: 'left',
            searchAllPanes: true,
            src: html
          });
        };
      })(this));
      this.fav.on('click', (function(_this) {
        return function(evt) {
          var data, delCount, favs, _ref6, _ref7;
          if (_this.model.src) {
            return;
          }
          if ((_ref6 = _this.htmlv[0]) != null ? _ref6.getUrl().includes('data:text/html,') : void 0) {
            return;
          }
          if (_this.model.uri.includes('browser-plus:')) {
            return;
          }
          favs = _this.model.browserPlus.fav;
          if (_this.fav.hasClass('active')) {
            _this.removeFav(_this.model);
          } else {
            data = {
              uri: _this.model.uri,
              title: _this.model.browserPlus.title[_this.model.uri] || _this.model.uri,
              favIcon: _this.model.browserPlus.favIcon[_this.model.uri]
            };
            favs.push(data);
            delCount = favs.length - atom.config.get('browser-plus.fav');
            if (delCount > 0) {
              favs.splice(0, delCount);
            }
          }
          _this.fav.toggleClass('active');
          return (_ref7 = _this.model.browserPlus.histView) != null ? _ref7.htmlv[0].send('updFav', _this.model.browserPlus.fav) : void 0;
        };
      })(this));
      if ((_ref6 = this.htmlv[0]) != null) {
        _ref6.addEventListener('new-window', function(e) {
          return atom.workspace.open(e.url, {
            split: 'left',
            searchAllPanes: true
          });
        });
      }
      if ((_ref7 = this.htmlv[0]) != null) {
        _ref7.addEventListener("did-start-loading", (function(_this) {
          return function() {
            var _ref8;
            return (_ref8 = _this.htmlv[0]) != null ? _ref8.shadowRoot.firstChild.style.height = '95%' : void 0;
          };
        })(this));
      }
      this.history.on('click', (function(_this) {
        return function(evt) {
          return atom.workspace.open('browser-plus://history', {
            split: 'left',
            searchAllPanes: true
          });
        };
      })(this));
      this.back.on('click', (function(_this) {
        return function(evt) {
          var _ref8, _ref9;
          if (((_ref8 = _this.htmlv[0]) != null ? _ref8.canGoBack() : void 0) && $( this).hasClass('active')) {
            return (_ref9 = _this.htmlv[0]) != null ? _ref9.goBack() : void 0;
          }
        };
      })(this));
      this.favList.on('click', (function(_this) {
        return function(evt) {
          return new favList(_this.model.browserPlus.fav);
        };
      })(this));
      this.forward.on('click', (function(_this) {
        return function(evt) {
          var _ref8, _ref9;
          if (((_ref8 = _this.htmlv[0]) != null ? _ref8.canGoForward() : void 0) && $( this).hasClass('active')) {
            return (_ref9 = _this.htmlv[0]) != null ? _ref9.goForward() : void 0;
          }
        };
      })(this));
      this.uri.on('keypress', (function(_this) {
        return function(evt) {
          var localhostPattern, url, urls, _ref8;
          if (evt.which === 13) {
            urls = URL.parse( this.value);
            url =  this.value;
            if (url.indexOf(' ') >= 0) {
              url = "http://www.google.com/search?as_q=" + url;
            } else {
              localhostPattern = /^(http:\/\/)?localhost/i;
              if (url.search(localhostPattern) < 0 && url.indexOf('.') < 0) {
                url = "http://www.google.com/search?as_q=" + url;
              } else {
                if ((_ref8 = urls.protocol) === 'http' || _ref8 === 'https' || _ref8 === 'file:') {
                  if (urls.protocol === 'file:') {
                    url = url.replace(/\\/g, "/");
                  } else {
                    url = URL.format(urls);
                  }
                } else if (url.indexOf('localhost') !== -1) {
                  url = url.replace(localhostPattern, 'http://127.0.0.1');
                } else {
                  urls.protocol = 'http';
                  url = URL.format(urls);
                }
              }
            }
            return _this.goToUrl(url);
          }
        };
      })(this));
      return this.refresh.on('click', (function(_this) {
        return function(evt) {
          var _ref8;
          if (_this.model.uri === 'browser-plus://history') {
            return;
          }
          return (_ref8 = _this.htmlv[0]) != null ? _ref8.executeJavaScript("location.href = '" + _this.model.uri + "'") : void 0;
        };
      })(this));
    };

    BrowserPlusView.prototype.goToUrl = function(url) {
      var _ref1;
      if (!BrowserPlusModel.checkUrl(url)) {
        return;
      }
      jQ(this.uri).autocomplete("close");
      this.select.removeClass('active');
      this.deActivateSelection();
      this.liveOn = false;
      this.live.toggleClass('active', this.liveOn);
      if (!this.liveOn) {
        if ((_ref1 = this.liveSubscription) != null) {
          _ref1.dispose();
        }
      }
      this.uri.val(url);
      this.model.uri = url;
      return this.htmlv.attr('src', url);
    };

    BrowserPlusView.prototype.showDevTool = function(evt) {
      if (evt[0].keyIdentifier === "F12") {
        return this.toggleDevTool();
      }
    };

    BrowserPlusView.prototype.deActivateSelection = function() {
      var _ref1, _ref2;
      if (this.select.hasClass('active')) {
        return (_ref1 = this.htmlv[0]) != null ? _ref1.send('select') : void 0;
      } else {
        return (_ref2 = this.htmlv[0]) != null ? _ref2.send('deselect') : void 0;
      }
    };

    BrowserPlusView.prototype.removeFav = function(favorite) {
      var favr, idx, _i, _len, _ref1;
      _ref1 = this.model.browserPlus.fav;
      for (idx = _i = 0, _len = _ref1.length; _i < _len; idx = ++_i) {
        favr = _ref1[idx];
        if (favr.uri === favorite.uri) {
          return this.model.browserPlus.fav.splice(idx, 1);
        }
      }
    };

    BrowserPlusView.prototype.setSrc = function(text) {
      var _ref1;
      return (_ref1 = this.htmlv[0]) != null ? _ref1.src = "data:text/html," + text : void 0;
    };

    BrowserPlusView.prototype.checkFav = function() {
      var favr, _i, _len, _ref1, _results;
      this.fav.removeClass('active');
      _ref1 = this.model.browserPlus.fav;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        favr = _ref1[_i];
        if (favr.uri === this.model.uri) {
          _results.push(this.fav.addClass('active'));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    BrowserPlusView.prototype.toggleDevTool = function() {
      var open, _ref1, _ref2, _ref3;
      open = (_ref1 = this.htmlv[0]) != null ? _ref1.isDevToolsOpened() : void 0;
      if (open) {
        if ((_ref2 = this.htmlv[0]) != null) {
          _ref2.closeDevTools();
        }
      } else {
        if ((_ref3 = this.htmlv[0]) != null) {
          _ref3.openDevTools();
        }
      }
      return $(this.devtool).toggleClass('active', !open);
    };

    BrowserPlusView.prototype.checkNav = function() {
      var _ref1, _ref2, _ref3;
      $(this.forward).toggleClass('active', (_ref1 = this.htmlv[0]) != null ? _ref1.canGoForward() : void 0);
      $(this.back).toggleClass('active', (_ref2 = this.htmlv[0]) != null ? _ref2.canGoBack() : void 0);
      if ((_ref3 = this.htmlv[0]) != null ? _ref3.canGoForward() : void 0) {
        if (this.clearForward) {
          $(this.forward).toggleClass('active', false);
          return this.clearForward = false;
        } else {
          return $(this.forward).toggleClass('active', true);
        }
      }
    };

    BrowserPlusView.prototype.addHistory = function() {
      var histToday, history, obj, today, todays, url, yyyymmdd, _ref1;
      url = (_ref1 = this.htmlv[0]) != null ? _ref1.getUrl() : void 0;
      if (url.includes('browser-plus://') || url.includes('data:text/html,')) {
        return;
      }
      yyyymmdd = function() {
        var date, dd, mm, yyyy;
        date = new Date();
        yyyy = date.getFullYear().toString();
        mm = (date.getMonth() + 1).toString();
        dd = date.getDate().toString();
        return yyyy + (mm[1] ? mm : '0' + mm[0]) + (dd[1] ? dd : '0' + dd[0]);
      };
      today = yyyymmdd();
      history = this.model.browserPlus.history;
      if (!(history || (history.length = 0))) {
        return;
      }
      todays = history.filter(function(ele, idx, arr) {
        if (Object.keys(ele)[0] === today) {
          return true;
        }
      });
      if (todays.length === 0) {
        histToday = [];
        obj = {};
        obj[today] = histToday;
        history.unshift(obj);
      } else {
        histToday = todays[0][today];
      }
      histToday.unshift({
        date: new Date().toString(),
        uri: this.uri.val()
      });
      return this.liveHistory();
    };

    BrowserPlusView.prototype.getTitle = function() {
      return this.model.getTitle();
    };

    BrowserPlusView.prototype.liveHistory = function() {
      var favIconJSON, histJSON, titleJSON;
      histJSON = JSON.stringify(this.model.browserPlus.history);
      titleJSON = JSON.stringify(this.model.browserPlus.title);
      favIconJSON = JSON.stringify(this.model.browserPlus.favIcon);
      return setTimeout((function(_this) {
        return function() {
          var _ref1;
          return (_ref1 = _this.model.browserPlus.histView) != null ? _ref1.htmlv[0].executeJavaScript(" histTag.opts.hist = eval(" + histJSON + "); histTag.opts.title = eval(" + titleJSON + ");histTag.opts.favIcon = eval(" + favIconJSON + ");histTag.update();") : void 0;
        };
      })(this), 2000);
    };

    BrowserPlusView.prototype.serialize = function() {};

    BrowserPlusView.prototype.destroy = function() {
      return jQ(this.uri).autocomplete('destroy');
    };

    return BrowserPlusView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYnJvd3Nlci1wbHVzL2xpYi9icm93c2VyLXBsdXMtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsb0dBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQyxzQkFBd0IsT0FBQSxDQUFRLE1BQVIsRUFBeEIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQVcsT0FBQSxDQUFRLHNCQUFSLENBQVgsRUFBQyxZQUFBLElBQUQsRUFBTSxTQUFBLENBRE4sQ0FBQTs7QUFBQSxFQUVBLFFBQUEsR0FBVyxPQUFBLENBQVEsUUFBUixDQUZYLENBQUE7O0FBQUEsRUFHQSxHQUFBLEdBQU0sT0FBQSxDQUFRLEtBQVIsQ0FITixDQUFBOztBQUFBLEVBSUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSx1Q0FBUixDQUpMLENBQUE7O0FBQUEsRUFLQSxPQUFBLENBQVEsd0JBQVIsQ0FMQSxDQUFBOztBQUFBLEVBTUEsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHNCQUFSLENBTm5CLENBQUE7O0FBQUEsRUFPQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FQSixDQUFBOztBQUFBLEVBVUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxZQUFSLENBVlYsQ0FBQTs7QUFBQSxFQVdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixzQ0FBQSxDQUFBOztBQUFhLElBQUEseUJBQUUsS0FBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsUUFBQSxLQUNiLENBQUE7QUFBQSx1RUFBQSxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBQWpCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxHQUFjLElBRGQsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLEtB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

//# sourceURL=/Users/doot/.atom/packages/browser-plus/lib/browser-plus-view.coffee
