(function() {
  var AncestorsMethods, CanvasDrawer, CompositeDisposable, DOMStylesReader, Disposable, EventsDelegation, MinimapElement, MinimapQuickSettingsElement, debounce, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  debounce = require('underscore-plus').debounce;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable;

  _ref1 = require('atom-utils'), EventsDelegation = _ref1.EventsDelegation, AncestorsMethods = _ref1.AncestorsMethods;

  DOMStylesReader = require('./mixins/dom-styles-reader');

  CanvasDrawer = require('./mixins/canvas-drawer');

  MinimapQuickSettingsElement = null;

  MinimapElement = (function(_super) {
    __extends(MinimapElement, _super);

    function MinimapElement() {
      this.relayMousewheelEvent = __bind(this.relayMousewheelEvent, this);
      return MinimapElement.__super__.constructor.apply(this, arguments);
    }

    DOMStylesReader.includeInto(MinimapElement);

    CanvasDrawer.includeInto(MinimapElement);

    EventsDelegation.includeInto(MinimapElement);

    AncestorsMethods.includeInto(MinimapElement);


    /* Public */

    MinimapElement.prototype.displayMinimapOnLeft = false;

    MinimapElement.prototype.createdCallback = function() {
      this.subscriptions = new CompositeDisposable;
      this.initializeContent();
      return this.observeConfig({
        'minimap.displayMinimapOnLeft': (function(_this) {
          return function(displayMinimapOnLeft) {
            var swapPosition;
            swapPosition = (_this.minimap != null) && displayMinimapOnLeft !== _this.displayMinimapOnLeft;
            _this.displayMinimapOnLeft = displayMinimapOnLeft;
            return _this.updateMinimapFlexPosition();
          };
        })(this),
        'minimap.minimapScrollIndicator': (function(_this) {
          return function(minimapScrollIndicator) {
            _this.minimapScrollIndicator = minimapScrollIndicator;
            if (_this.minimapScrollIndicator && (_this.scrollIndicator == null)) {
              _this.initializeScrollIndicator();
            } else if (_this.scrollIndicator != null) {
              _this.disposeScrollIndicator();
            }
            if (_this.attached) {
              return _this.requestUpdate();
            }
          };
        })(this),
        'minimap.displayPluginsControls': (function(_this) {
          return function(displayPluginsControls) {
            _this.displayPluginsControls = displayPluginsControls;
            if (_this.displayPluginsControls && (_this.openQuickSettings == null)) {
              return _this.initializeOpenQuickSettings();
            } else if (_this.openQuickSettings != null) {
              return _this.disposeOpenQuickSettings();
            }
          };
        })(this),
        'minimap.textOpacity': (function(_this) {
          return function(textOpacity) {
            _this.textOpacity = textOpacity;
            if (_this.attached) {
              return _this.requestForcedUpdate();
            }
          };
        })(this),
        'minimap.displayCodeHighlights': (function(_this) {
          return function(displayCodeHighlights) {
            _this.displayCodeHighlights = displayCodeHighlights;
            if (_this.attached) {
              return _this.requestForcedUpdate();
            }
          };
        })(this),
        'minimap.adjustMinimapWidthToSoftWrap': (function(_this) {
          return function(adjustToSoftWrap) {
            _this.adjustToSoftWrap = adjustToSoftWrap;
            if (_this.attached) {
              return _this.measureHeightAndWidth();
            }
          };
        })(this),
        'minimap.useHardwareAcceleration': (function(_this) {
          return function(useHardwareAcceleration) {
            _this.useHardwareAcceleration = useHardwareAcceleration;
            if (_this.attached) {
              return _this.requestUpdate();
            }
          };
        })(this),
        'minimap.absoluteMode': (function(_this) {
          return function(absoluteMode) {
            _this.absoluteMode = absoluteMode;
            return _this.classList.toggle('absolute', _this.absoluteMode);
          };
        })(this),
        'editor.preferredLineLength': (function(_this) {
          return function() {
            if (_this.attached) {
              return _this.measureHeightAndWidth();
            }
          };
        })(this),
        'editor.softWrap': (function(_this) {
          return function() {
            if (_this.attached) {
              return _this.requestUpdate();
            }
          };
        })(this),
        'editor.softWrapAtPreferredLineLength': (function(_this) {
          return function() {
            if (_this.attached) {
              return _this.requestUpdate();
            }
          };
        })(this)
      });
    };

    MinimapElement.prototype.attachedCallback = function() {
      this.subscriptions.add(atom.views.pollDocument((function(_this) {
        return function() {
          return _this.pollDOM();
        };
      })(this)));
      this.measureHeightAndWidth();
      this.updateMinimapFlexPosition();
      this.attached = true;
      this.attachedToTextEditor = this.parentNode === this.getTextEditorElementRoot();
      return this.subscriptions.add(atom.styles.onDidAddStyleElement((function(_this) {
        return function() {
          _this.invalidateCache();
          return _this.requestForcedUpdate();
        };
      })(this)));
    };

    MinimapElement.prototype.detachedCallback = function() {
      return this.attached = false;
    };

    MinimapElement.prototype.isVisible = function() {
      return this.offsetWidth > 0 || this.offsetHeight > 0;
    };

    MinimapElement.prototype.attach = function(parent) {
      if (this.attached) {
        return;
      }
      return (parent != null ? parent : this.getTextEditorElementRoot()).appendChild(this);
    };

    MinimapElement.prototype.detach = function() {
      if (!this.attached) {
        return;
      }
      if (this.parentNode == null) {
        return;
      }
      return this.parentNode.removeChild(this);
    };

    MinimapElement.prototype.updateMinimapFlexPosition = function() {
      return this.classList.toggle('left', this.displayMinimapOnLeft);
    };

    MinimapElement.prototype.destroy = function() {
      this.subscriptions.dispose();
      this.detach();
      return this.minimap = null;
    };

    MinimapElement.prototype.initializeContent = function() {
      var canvasMousedown, elementMousewheel, visibleAreaMousedown;
      this.initializeCanvas();
      this.shadowRoot = this.createShadowRoot();
      this.shadowRoot.appendChild(this.canvas);
      this.visibleArea = document.createElement('div');
      this.visibleArea.classList.add('minimap-visible-area');
      this.shadowRoot.appendChild(this.visibleArea);
      this.controls = document.createElement('div');
      this.controls.classList.add('minimap-controls');
      this.shadowRoot.appendChild(this.controls);
      elementMousewheel = (function(_this) {
        return function(e) {
          return _this.relayMousewheelEvent(e);
        };
      })(this);
      canvasMousedown = (function(_this) {
        return function(e) {
          return _this.mousePressedOverCanvas(e);
        };
      })(this);
      visibleAreaMousedown = (function(_this) {
        return function(e) {
          return _this.startDrag(e);
        };
      })(this);
      this.addEventListener('mousewheel', elementMousewheel);
      this.canvas.addEventListener('mousedown', canvasMousedown);
      this.visibleArea.addEventListener('mousedown', visibleAreaMousedown);
      this.visibleArea.addEventListener('touchstart', visibleAreaMousedown);
      return this.subscriptions.add(new Disposable((function(_this) {
        return function() {
          _this.removeEventListener('mousewheel', elementMousewheel);
          _this.canvas.removeEventListener('mousedown', canvasMousedown);
          _this.visibleArea.removeEventListener('mousedown', visibleAreaMousedown);
          return _this.visibleArea.removeEventListener('touchstart', visibleAreaMousedown);
        };
      })(this)));
    };

    MinimapElement.prototype.initializeScrollIndicator = function() {
      this.scrollIndicator = document.createElement('div');
      this.scrollIndicator.classList.add('minimap-scroll-indicator');
      return this.controls.appendChild(this.scrollIndicator);
    };

    MinimapElement.prototype.disposeScrollIndicator = function() {
      this.controls.removeChild(this.scrollIndicator);
      return this.scrollIndicator = void 0;
    };

    MinimapElement.prototype.initializeOpenQuickSettings = function() {
      if (this.openQuickSettings != null) {
        return;
      }
      this.openQuickSettings = document.createElement('div');
      this.openQuickSettings.classList.add('open-minimap-quick-settings');
      this.controls.appendChild(this.openQuickSettings);
      return this.openQuickSettingSubscription = this.subscribeTo(this.openQuickSettings, {
        'mousedown': (function(_this) {
          return function(e) {
            var left, right, top, _ref2;
            e.preventDefault();
            e.stopPropagation();
            if (_this.quickSettingsElement != null) {
              _this.quickSettingsElement.destroy();
              return _this.quickSettingsSubscription.dispose();
            } else {
              if (MinimapQuickSettingsElement == null) {
                MinimapQuickSettingsElement = require('./minimap-quick-settings-element');
              }
              _this.quickSettingsElement = new MinimapQuickSettingsElement;
              _this.quickSettingsElement.setModel(_this);
              _this.quickSettingsSubscription = _this.quickSettingsElement.onDidDestroy(function() {
                return _this.quickSettingsElement = null;
              });
              _ref2 = _this.canvas.getBoundingClientRect(), top = _ref2.top, left = _ref2.left, right = _ref2.right;
              _this.quickSettingsElement.style.top = top + 'px';
              _this.quickSettingsElement.attach();
              if (_this.displayMinimapOnLeft) {
                return _this.quickSettingsElement.style.left = right + 'px';
              } else {
                return _this.quickSettingsElement.style.left = (left - _this.quickSettingsElement.clientWidth) + 'px';
              }
            }
          };
        })(this)
      });
    };

    MinimapElement.prototype.disposeOpenQuickSettings = function() {
      if (this.openQuickSettings == null) {
        return;
      }
      this.controls.removeChild(this.openQuickSettings);
      this.openQuickSettingSubscription.dispose();
      return this.openQuickSettings = void 0;
    };

    MinimapElement.prototype.getTextEditor = function() {
      return this.minimap.getTextEditor();
    };

    MinimapElement.prototype.getTextEditorElement = function() {
      return this.editorElement != null ? this.editorElement : this.editorElement = atom.views.getView(this.getTextEditor());
    };

    MinimapElement.prototype.getTextEditorElementRoot = function() {
      var editorElement, _ref2;
      editorElement = this.getTextEditorElement();
      return (_ref2 = editorElement.shadowRoot) != null ? _ref2 : editorElement;
    };

    MinimapElement.prototype.getDummyDOMRoot = function(shadowRoot) {
      if (shadowRoot) {
        return this.getTextEditorElementRoot();
      } else {
        return this.getTextEditorElement();
      }
    };

    MinimapElement.prototype.getModel = function() {
      return this.minimap;
    };

    MinimapElement.prototype.setModel = function(minimap) {
      this.minimap = minimap;
      this.subscriptions.add(this.minimap.onDidChangeScrollTop((function(_this) {
        return function() {
          return _this.requestUpdate();
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidChangeScrollLeft((function(_this) {
        return function() {
          return _this.requestUpdate();
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidDestroy((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidChangeConfig((function(_this) {
        return function() {
          if (_this.attached) {
            return _this.requestForcedUpdate();
          }
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidChangeStandAlone((function(_this) {
        return function() {
          if (_this.minimap.isStandAlone()) {
            _this.setAttribute('stand-alone', true);
          } else {
            _this.removeAttribute('stand-alone');
          }
          return _this.requestUpdate();
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidChange((function(_this) {
        return function(change) {
          _this.pendingChanges.push(change);
          return _this.requestUpdate();
        };
      })(this)));
      if (this.minimap.isStandAlone()) {
        this.setAttribute('stand-alone', true);
      }
      if ((this.width != null) && (this.height != null)) {
        this.minimap.setScreenHeightAndWidth(this.height, this.width);
      }
      return this.minimap;
    };

    MinimapElement.prototype.requestUpdate = function() {
      if (this.frameRequested) {
        return;
      }
      this.frameRequested = true;
      return requestAnimationFrame((function(_this) {
        return function() {
          _this.update();
          return _this.frameRequested = false;
        };
      })(this));
    };

    MinimapElement.prototype.requestForcedUpdate = function() {
      this.offscreenFirstRow = null;
      this.offscreenLastRow = null;
      return this.requestUpdate();
    };

    MinimapElement.prototype.update = function() {
      var canvasTop, canvasTransform, indicatorHeight, indicatorScroll, minimapScreenHeight, visibleAreaLeft, visibleAreaTop, visibleWidth;
      if (!(this.attached && this.isVisible() && (this.minimap != null))) {
        return;
      }
      visibleAreaLeft = this.minimap.getTextEditorScaledScrollLeft();
      visibleAreaTop = this.minimap.getTextEditorScaledScrollTop() - this.minimap.getScrollTop();
      visibleWidth = Math.min(this.canvas.width / devicePixelRatio, this.width);
      if (this.adjustToSoftWrap && this.flexBasis) {
        this.style.flexBasis = this.flexBasis + 'px';
      } else {
        this.style.flexBasis = null;
      }
      if (atom.inSpecMode()) {
        this.applyStyles(this.visibleArea, {
          width: visibleWidth + 'px',
          height: this.minimap.getTextEditorScaledHeight() + 'px',
          top: visibleAreaTop + 'px',
          left: visibleAreaLeft + 'px'
        });
      } else {
        this.applyStyles(this.visibleArea, {
          width: visibleWidth + 'px',
          height: this.minimap.getTextEditorScaledHeight() + 'px',
          transform: this.makeTranslate(visibleAreaLeft, visibleAreaTop)
        });
      }
      this.applyStyles(this.controls, {
        width: visibleWidth + 'px'
      });
      canvasTop = this.minimap.getFirstVisibleScreenRow() * this.minimap.getLineHeight() - this.minimap.getScrollTop();
      canvasTransform = this.makeTranslate(0, canvasTop);
      if (devicePixelRatio !== 1) {
        canvasTransform += " " + this.makeScale(1 / devicePixelRatio);
      }
      if (atom.inSpecMode()) {
        this.applyStyles(this.canvas, {
          top: canvasTop + 'px'
        });
      } else {
        this.applyStyles(this.canvas, {
          transform: canvasTransform
        });
      }
      if (this.minimapScrollIndicator && this.minimap.canScroll() && !this.scrollIndicator) {
        this.initializeScrollIndicator();
      }
      if (this.scrollIndicator != null) {
        minimapScreenHeight = this.minimap.getScreenHeight();
        indicatorHeight = minimapScreenHeight * (minimapScreenHeight / this.minimap.getHeight());
        indicatorScroll = (minimapScreenHeight - indicatorHeight) * this.minimap.getCapedTextEditorScrollRatio();
        if (atom.inSpecMode()) {
          this.applyStyles(this.scrollIndicator, {
            height: indicatorHeight + 'px',
            top: indicatorScroll + 'px'
          });
        } else {
          this.applyStyles(this.scrollIndicator, {
            height: indicatorHeight + 'px',
            transform: this.makeTranslate(0, indicatorScroll)
          });
        }
        if (!this.minimap.canScroll()) {
          this.disposeScrollIndicator();
        }
      }
      return this.updateCanvas();
    };

    MinimapElement.prototype.setDisplayCodeHighlights = function(displayCodeHighlights) {
      this.displayCodeHighlights = displayCodeHighlights;
      if (this.attached) {
        return this.requestForcedUpdate();
      }
    };

    MinimapElement.prototype.pollDOM = function() {
      var visibilityChanged;
      visibilityChanged = this.checkForVisibilityChange();
      if (this.isVisible()) {
        if (!this.wasVisible) {
          this.requestForcedUpdate();
        }
        return this.measureHeightAndWidth(visibilityChanged, false);
      }
    };

    MinimapElement.prototype.checkForVisibilityChange = function() {
      if (this.isVisible()) {
        if (this.wasVisible) {
          return false;
        } else {
          return this.wasVisible = true;
        }
      } else {
        if (this.wasVisible) {
          this.wasVisible = false;
          return true;
        } else {
          return this.wasVisible = false;
        }
      }
    };

    MinimapElement.prototype.measureHeightAndWidth = function(visibilityChanged, forceUpdate) {
      var canvasWidth, lineLength, softWrap, softWrapAtPreferredLineLength, wasResized, width;
      if (forceUpdate == null) {
        forceUpdate = true;
      }
      if (this.minimap == null) {
        return;
      }
      wasResized = this.width !== this.clientWidth || this.height !== this.clientHeight;
      this.height = this.clientHeight;
      this.width = this.clientWidth;
      canvasWidth = this.width;
      if (this.minimap != null) {
        this.minimap.setScreenHeightAndWidth(this.height, this.width);
      }
      if (wasResized || visibilityChanged || forceUpdate) {
        this.requestForcedUpdate();
      }
      if (!this.isVisible()) {
        return;
      }
      if (wasResized || forceUpdate) {
        if (this.adjustToSoftWrap) {
          lineLength = atom.config.get('editor.preferredLineLength');
          softWrap = atom.config.get('editor.softWrap');
          softWrapAtPreferredLineLength = atom.config.get('editor.softWrapAtPreferredLineLength');
          width = lineLength * this.minimap.getCharWidth();
          if (softWrap && softWrapAtPreferredLineLength && lineLength && width <= this.width) {
            this.flexBasis = width;
            canvasWidth = width;
          } else {
            delete this.flexBasis;
          }
        } else {
          delete this.flexBasis;
        }
        if (canvasWidth !== this.canvas.width || this.height !== this.canvas.height) {
          this.canvas.width = canvasWidth * devicePixelRatio;
          return this.canvas.height = (this.height + this.minimap.getLineHeight()) * devicePixelRatio;
        }
      }
    };

    MinimapElement.prototype.observeConfig = function(configs) {
      var callback, config, _results;
      if (configs == null) {
        configs = {};
      }
      _results = [];
      for (config in configs) {
        callback = configs[config];
        _results.push(this.subscriptions.add(atom.config.observe(config, callback)));
      }
      return _results;
    };

    MinimapElement.prototype.mousePressedOverCanvas = function(e) {
      var height, top, _ref2;
      if (this.minimap.isStandAlone()) {
        return;
      }
      if (e.which === 1) {
        return this.leftMousePressedOverCanvas(e);
      } else if (e.which === 2) {
        this.middleMousePressedOverCanvas(e);
        _ref2 = this.visibleArea.getBoundingClientRect(), top = _ref2.top, height = _ref2.height;
        return this.startDrag({
          which: 2,
          pageY: top + height / 2
        });
      } else {

      }
    };

    MinimapElement.prototype.leftMousePressedOverCanvas = function(_arg) {
      var duration, from, pageY, row, scrollTop, step, target, textEditor, to, y;
      pageY = _arg.pageY, target = _arg.target;
      y = pageY - target.getBoundingClientRect().top;
      row = Math.floor(y / this.minimap.getLineHeight()) + this.minimap.getFirstVisibleScreenRow();
      textEditor = this.minimap.getTextEditor();
      scrollTop = row * textEditor.getLineHeightInPixels() - this.minimap.getTextEditorHeight() / 2;
      if (atom.config.get('minimap.scrollAnimation')) {
        from = this.minimap.getTextEditorScrollTop();
        to = scrollTop;
        step = (function(_this) {
          return function(now) {
            return _this.minimap.setTextEditorScrollTop(now);
          };
        })(this);
        duration = atom.config.get('minimap.scrollAnimationDuration');
        return this.animate({
          from: from,
          to: to,
          duration: duration,
          step: step
        });
      } else {
        return this.minimap.setTextEditorScrollTop(scrollTop);
      }
    };

    MinimapElement.prototype.middleMousePressedOverCanvas = function(_arg) {
      var offsetTop, pageY, ratio, y;
      pageY = _arg.pageY;
      offsetTop = this.getBoundingClientRect().top;
      y = pageY - offsetTop - this.minimap.getTextEditorScaledHeight() / 2;
      ratio = y / (this.minimap.getVisibleHeight() - this.minimap.getTextEditorScaledHeight());
      return this.minimap.setTextEditorScrollTop(ratio * this.minimap.getTextEditorMaxScrollTop());
    };

    MinimapElement.prototype.relayMousewheelEvent = function(e) {
      var editorElement;
      editorElement = atom.views.getView(this.minimap.textEditor);
      return editorElement.component.onMouseWheel(e);
    };

    MinimapElement.prototype.startDrag = function(e) {
      var dragOffset, initial, mousemoveHandler, mouseupHandler, offsetTop, pageY, top, which;
      which = e.which, pageY = e.pageY;
      if (!this.minimap) {
        return;
      }
      if (which !== 1 && which !== 2 && (e.touches == null)) {
        return;
      }
      top = this.visibleArea.getBoundingClientRect().top;
      offsetTop = this.getBoundingClientRect().top;
      dragOffset = pageY - top;
      initial = {
        dragOffset: dragOffset,
        offsetTop: offsetTop
      };
      mousemoveHandler = (function(_this) {
        return function(e) {
          return _this.drag(e, initial);
        };
      })(this);
      mouseupHandler = (function(_this) {
        return function(e) {
          return _this.endDrag(e, initial);
        };
      })(this);
      document.body.addEventListener('mousemove', mousemoveHandler);
      document.body.addEventListener('mouseup', mouseupHandler);
      document.body.addEventListener('mouseleave', mouseupHandler);
      document.body.addEventListener('touchmove', mousemoveHandler);
      document.body.addEventListener('touchend', mouseupHandler);
      return this.dragSubscription = new Disposable(function() {
        document.body.removeEventListener('mousemove', mousemoveHandler);
        document.body.removeEventListener('mouseup', mouseupHandler);
        document.body.removeEventListener('mouseleave', mouseupHandler);
        document.body.removeEventListener('touchmove', mousemoveHandler);
        return document.body.removeEventListener('touchend', mouseupHandler);
      });
    };

    MinimapElement.prototype.drag = function(e, initial) {
      var ratio, y;
      if (!this.minimap) {
        return;
      }
      if (e.which !== 1 && e.which !== 2 && (e.touches == null)) {
        return;
      }
      y = e.pageY - initial.offsetTop - initial.dragOffset;
      ratio = y / (this.minimap.getVisibleHeight() - this.minimap.getTextEditorScaledHeight());
      return this.minimap.setTextEditorScrollTop(ratio * this.minimap.getTextEditorMaxScrollTop());
    };

    MinimapElement.prototype.endDrag = function(e, initial) {
      if (!this.minimap) {
        return;
      }
      return this.dragSubscription.dispose();
    };

    MinimapElement.prototype.applyStyles = function(element, styles) {
      var cssText, property, value;
      cssText = '';
      for (property in styles) {
        value = styles[property];
        cssText += "" + property + ": " + value + "; ";
      }
      return element.style.cssText = cssText;
    };

    MinimapElement.prototype.makeTranslate = function(x, y) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      if (this.useHardwareAcceleration) {
        return "translate3d(" + x + "px, " + y + "px, 0)";
      } else {
        return "translate(" + x + "px, " + y + "px)";
      }
    };

    MinimapElement.prototype.makeScale = function(x, y) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = x;
      }
      if (this.useHardwareAcceleration) {
        return "scale3d(" + x + ", " + y + ", 1)";
      } else {
        return "scale(" + x + ", " + y + ")";
      }
    };

    MinimapElement.prototype.getTime = function() {
      return new Date();
    };

    MinimapElement.prototype.animate = function(_arg) {
      var duration, from, start, step, swing, to, update;
      from = _arg.from, to = _arg.to, duration = _arg.duration, step = _arg.step;
      start = this.getTime();
      swing = function(progress) {
        return 0.5 - Math.cos(progress * Math.PI) / 2;
      };
      update = (function(_this) {
        return function() {
          var delta, passed, progress;
          passed = _this.getTime() - start;
          if (duration === 0) {
            progress = 1;
          } else {
            progress = passed / duration;
          }
          if (progress > 1) {
            progress = 1;
          }
          delta = swing(progress);
          step(from + (to - from) * delta);
          if (progress < 1) {
            return requestAnimationFrame(update);
          }
        };
      })(this);
      return update();
    };

    return MinimapElement;

  })(HTMLElement);

  module.exports = MinimapElement = document.registerElement('atom-text-editor-minimap', {
    prototype: MinimapElement.prototype
  });

  MinimapElement.registerViewProvider = function() {
    return atom.views.addViewProvider(require('./minimap'), function(model) {
      var element;
      element = new MinimapElement;
      element.setModel(model);
      return element;
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvbWluaW1hcC1lbGVtZW50LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzS0FBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFDLFdBQVksT0FBQSxDQUFRLGlCQUFSLEVBQVosUUFBRCxDQUFBOztBQUFBLEVBQ0EsT0FBb0MsT0FBQSxDQUFRLE1BQVIsQ0FBcEMsRUFBQywyQkFBQSxtQkFBRCxFQUFzQixrQkFBQSxVQUR0QixDQUFBOztBQUFBLEVBRUEsUUFBdUMsT0FBQSxDQUFRLFlBQVIsQ0FBdkMsRUFBQyx5QkFBQSxnQkFBRCxFQUFtQix5QkFBQSxnQkFGbkIsQ0FBQTs7QUFBQSxFQUdBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLDRCQUFSLENBSGxCLENBQUE7O0FBQUEsRUFJQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHdCQUFSLENBSmYsQ0FBQTs7QUFBQSxFQU1BLDJCQUFBLEdBQThCLElBTjlCLENBQUE7O0FBQUEsRUFvQk07QUFDSixxQ0FBQSxDQUFBOzs7OztLQUFBOztBQUFBLElBQUEsZUFBZSxDQUFDLFdBQWhCLENBQTRCLGNBQTVCLENBQUEsQ0FBQTs7QUFBQSxJQUNBLFlBQVksQ0FBQyxXQUFiLENBQXlCLGNBQXpCLENBREEsQ0FBQTs7QUFBQSxJQUVBLGdCQUFnQixDQUFDLFdBQWpCLENBQTZCLGNBQTdCLENBRkEsQ0FBQTs7QUFBQSxJQUdBLGdCQUFnQixDQUFDLFdBQWpCLENBQTZCLGNBQTdCLENBSEEsQ0FBQTs7QUFLQTtBQUFBLGdCQUxBOztBQUFBLDZCQU9BLG9CQUFBLEdBQXNCLEtBUHRCLENBQUE7O0FBQUEsNkJBa0JBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEs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

//# sourceURL=/Users/doot/.atom/packages/minimap/lib/minimap-element.coffee
