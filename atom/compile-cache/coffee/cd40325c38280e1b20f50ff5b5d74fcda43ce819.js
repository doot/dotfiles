(function() {
  var Minimap, MinimapElement, fs, isVisible, mousedown, mousemove, mouseup, mousewheel, path, realOffsetLeft, realOffsetTop, sleep, stylesheet, touchmove, touchstart, _ref;

  fs = require('fs-plus');

  path = require('path');

  Minimap = require('../lib/minimap');

  MinimapElement = require('../lib/minimap-element');

  stylesheet = require('./helpers/workspace').stylesheet;

  _ref = require('./helpers/events'), mousemove = _ref.mousemove, mousedown = _ref.mousedown, mouseup = _ref.mouseup, mousewheel = _ref.mousewheel, touchstart = _ref.touchstart, touchmove = _ref.touchmove;

  realOffsetTop = function(o) {
    return o.offsetTop;
  };

  realOffsetLeft = function(o) {
    return o.offsetLeft;
  };

  isVisible = function(node) {
    return node.offsetWidth > 0 || node.offsetHeight > 0;
  };

  sleep = function(duration) {
    var t;
    t = new Date;
    return waitsFor(function() {
      return new Date - t > duration;
    });
  };

  describe('MinimapElement', function() {
    var dir, editor, editorElement, jasmineContent, largeSample, mediumSample, minimap, minimapElement, smallSample, _ref1;
    _ref1 = [], editor = _ref1[0], minimap = _ref1[1], largeSample = _ref1[2], mediumSample = _ref1[3], smallSample = _ref1[4], jasmineContent = _ref1[5], editorElement = _ref1[6], minimapElement = _ref1[7], dir = _ref1[8];
    beforeEach(function() {
      jasmineContent = document.body.querySelector('#jasmine-content');
      atom.config.set('minimap.charHeight', 4);
      atom.config.set('minimap.charWidth', 2);
      atom.config.set('minimap.interline', 1);
      atom.config.set('minimap.textOpacity', 1);
      MinimapElement.registerViewProvider();
      editor = atom.workspace.buildTextEditor({});
      editorElement = atom.views.getView(editor);
      jasmineContent.insertBefore(editorElement, jasmineContent.firstChild);
      editorElement.setHeight(50);
      minimap = new Minimap({
        textEditor: editor
      });
      dir = atom.project.getDirectories()[0];
      largeSample = fs.readFileSync(dir.resolve('large-file.coffee')).toString();
      mediumSample = fs.readFileSync(dir.resolve('two-hundred.txt')).toString();
      smallSample = fs.readFileSync(dir.resolve('sample.coffee')).toString();
      editor.setText(largeSample);
      return minimapElement = atom.views.getView(minimap);
    });
    it('has been registered in the view registry', function() {
      return expect(minimapElement).toExist();
    });
    it('has stored the minimap as its model', function() {
      return expect(minimapElement.getModel()).toBe(minimap);
    });
    it('has a canvas in a shadow DOM', function() {
      return expect(minimapElement.shadowRoot.querySelector('canvas')).toExist();
    });
    it('has a div representing the visible area', function() {
      return expect(minimapElement.shadowRoot.querySelector('.minimap-visible-area')).toExist();
    });
    return describe('when attached to the text editor element', function() {
      var canvas, lastFn, nextAnimationFrame, noAnimationFrame, visibleArea, _ref2;
      _ref2 = [], noAnimationFrame = _ref2[0], nextAnimationFrame = _ref2[1], lastFn = _ref2[2], canvas = _ref2[3], visibleArea = _ref2[4];
      beforeEach(function() {
        var requestAnimationFrameSafe;
        noAnimationFrame = function() {
          throw new Error('No animation frame requested');
        };
        nextAnimationFrame = noAnimationFrame;
        requestAnimationFrameSafe = window.requestAnimationFrame;
        return spyOn(window, 'requestAnimationFrame').andCallFake(function(fn) {
          lastFn = fn;
          return nextAnimationFrame = function() {
            nextAnimationFrame = noAnimationFrame;
            return fn();
          };
        });
      });
      beforeEach(function() {
        canvas = minimapElement.shadowRoot.querySelector('canvas');
        editorElement.setWidth(200);
        editorElement.setHeight(50);
        editorElement.setScrollTop(1000);
        editorElement.setScrollLeft(200);
        return minimapElement.attach();
      });
      afterEach(function() {
        return minimap.destroy();
      });
      it('takes the height of the editor', function() {
        expect(minimapElement.offsetHeight).toEqual(editorElement.clientHeight);
        return expect(minimapElement.offsetWidth).toBeCloseTo(editorElement.clientWidth / 10, 0);
      });
      it('knows when attached to a text editor', function() {
        return expect(minimapElement.attachedToTextEditor).toBeTruthy();
      });
      it('resizes the canvas to fit the minimap', function() {
        expect(canvas.offsetHeight / devicePixelRatio).toBeCloseTo(minimapElement.offsetHeight + minimap.getLineHeight(), 0);
        return expect(canvas.offsetWidth / devicePixelRatio).toBeCloseTo(minimapElement.offsetWidth, 0);
      });
      it('requests an update', function() {
        return expect(minimapElement.frameRequested).toBeTruthy();
      });
      describe('with css filters', function() {
        describe('when a hue-rotate filter is applied to a rgb color', function() {
          var additionnalStyleNode;
          additionnalStyleNode = [][0];
          beforeEach(function() {
            minimapElement.invalidateCache();
            additionnalStyleNode = document.createElement('style');
            additionnalStyleNode.textContent = "" + stylesheet + "\n\n.editor {\n  color: red;\n  -webkit-filter: hue-rotate(180deg);\n}";
            return jasmineContent.appendChild(additionnalStyleNode);
          });
          return it('computes the new color by applying the hue rotation', function() {
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              nextAnimationFrame();
              return expect(minimapElement.retrieveStyleFromDom(['.editor'], 'color')).toEqual("rgb(0, " + 0x6d + ", " + 0x6d + ")");
            });
          });
        });
        return describe('when a hue-rotate filter is applied to a rgba color', function() {
          var additionnalStyleNode;
          additionnalStyleNode = [][0];
          beforeEach(function() {
            minimapElement.invalidateCache();
            additionnalStyleNode = document.createElement('style');
            additionnalStyleNode.textContent = "" + stylesheet + "\n\n.editor {\n  color: rgba(255,0,0,0);\n  -webkit-filter: hue-rotate(180deg);\n}";
            return jasmineContent.appendChild(additionnalStyleNode);
          });
          return it('computes the new color by applying the hue rotation', function() {
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              nextAnimationFrame();
              return expect(minimapElement.retrieveStyleFromDom(['.editor'], 'color')).toEqual("rgba(0, " + 0x6d + ", " + 0x6d + ", 0)");
            });
          });
        });
      });
      describe('when the update is performed', function() {
        beforeEach(function() {
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          return runs(function() {
            nextAnimationFrame();
            return visibleArea = minimapElement.shadowRoot.querySelector('.minimap-visible-area');
          });
        });
        it('sets the visible area width and height', function() {
          expect(visibleArea.offsetWidth).toEqual(minimapElement.clientWidth);
          return expect(visibleArea.offsetHeight).toBeCloseTo(minimap.getTextEditorScaledHeight(), 0);
        });
        it('sets the visible visible area offset', function() {
          expect(realOffsetTop(visibleArea)).toBeCloseTo(minimap.getTextEditorScaledScrollTop() - minimap.getScrollTop(), 0);
          return expect(realOffsetLeft(visibleArea)).toBeCloseTo(minimap.getTextEditorScaledScrollLeft(), 0);
        });
        it('offsets the canvas when the scroll does not match line height', function() {
          editorElement.setScrollTop(1004);
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          return runs(function() {
            nextAnimationFrame();
            return expect(realOffsetTop(canvas)).toBeCloseTo(-2, -1);
          });
        });
        it('does not fail to update render the invisible char when modified', function() {
          atom.config.set('editor.showInvisibles', true);
          atom.config.set('editor.invisibles', {
            cr: '*'
          });
          return expect(function() {
            return nextAnimationFrame();
          }).not.toThrow();
        });
        it('renders the visible line decorations', function() {
          spyOn(minimapElement, 'drawLineDecorations').andCallThrough();
          minimap.decorateMarker(editor.markBufferRange([[1, 0], [1, 10]]), {
            type: 'line',
            color: '#0000FF'
          });
          minimap.decorateMarker(editor.markBufferRange([[10, 0], [10, 10]]), {
            type: 'line',
            color: '#0000FF'
          });
          minimap.decorateMarker(editor.markBufferRange([[100, 0], [100, 10]]), {
            type: 'line',
            color: '#0000FF'
          });
          editorElement.setScrollTop(0);
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          return runs(function() {
            nextAnimationFrame();
            expect(minimapElement.drawLineDecorations).toHaveBeenCalled();
            return expect(minimapElement.drawLineDecorations.calls.length).toEqual(2);
          });
        });
        it('renders the visible highlight decorations', function() {
          spyOn(minimapElement, 'drawHighlightDecoration').andCallThrough();
          minimap.decorateMarker(editor.markBufferRange([[1, 0], [1, 4]]), {
            type: 'highlight-under',
            color: '#0000FF'
          });
          minimap.decorateMarker(editor.markBufferRange([[2, 20], [2, 30]]), {
            type: 'highlight-over',
            color: '#0000FF'
          });
          minimap.decorateMarker(editor.markBufferRange([[100, 3], [100, 5]]), {
            type: 'highlight-under',
            color: '#0000FF'
          });
          editorElement.setScrollTop(0);
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          return runs(function() {
            nextAnimationFrame();
            expect(minimapElement.drawHighlightDecoration).toHaveBeenCalled();
            return expect(minimapElement.drawHighlightDecoration.calls.length).toEqual(2);
          });
        });
        it('renders the visible outline decorations', function() {
          spyOn(minimapElement, 'drawHighlightOutlineDecoration').andCallThrough();
          minimap.decorateMarker(editor.markBufferRange([[1, 4], [3, 6]]), {
            type: 'highlight-outline',
            color: '#0000ff'
          });
          minimap.decorateMarker(editor.markBufferRange([[6, 0], [6, 7]]), {
            type: 'highlight-outline',
            color: '#0000ff'
          });
          minimap.decorateMarker(editor.markBufferRange([[100, 3], [100, 5]]), {
            type: 'highlight-outline',
            color: '#0000ff'
          });
          editorElement.setScrollTop(0);
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          return runs(function() {
            nextAnimationFrame();
            expect(minimapElement.drawHighlightOutlineDecoration).toHaveBeenCalled();
            return expect(minimapElement.drawHighlightOutlineDecoration.calls.length).toEqual(4);
          });
        });
        describe('when the editor is scrolled', function() {
          beforeEach(function() {
            editorElement.setScrollTop(2000);
            editorElement.setScrollLeft(50);
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return it('updates the visible area', function() {
            expect(realOffsetTop(visibleArea)).toBeCloseTo(minimap.getTextEditorScaledScrollTop() - minimap.getScrollTop(), 0);
            return expect(realOffsetLeft(visibleArea)).toBeCloseTo(minimap.getTextEditorScaledScrollLeft(), 0);
          });
        });
        describe('when the editor is resized to a greater size', function() {
          beforeEach(function() {
            var height;
            height = editorElement.getHeight();
            editorElement.style.width = '800px';
            editorElement.style.height = '500px';
            minimapElement.measureHeightAndWidth();
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return it('detects the resize and adjust itself', function() {
            expect(minimapElement.offsetWidth).toBeCloseTo(editorElement.offsetWidth / 10, 0);
            expect(minimapElement.offsetHeight).toEqual(editorElement.offsetHeight);
            expect(canvas.offsetWidth / devicePixelRatio).toBeCloseTo(minimapElement.offsetWidth, 0);
            return expect(canvas.offsetHeight / devicePixelRatio).toBeCloseTo(minimapElement.offsetHeight + minimap.getLineHeight(), 0);
          });
        });
        describe('when the editor visible content is changed', function() {
          beforeEach(function() {
            editorElement.setScrollLeft(0);
            editorElement.setScrollTop(1400);
            editor.setSelectedBufferRange([[101, 0], [102, 20]]);
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              nextAnimationFrame();
              spyOn(minimapElement, 'drawLines').andCallThrough();
              return editor.insertText('foo');
            });
          });
          return it('rerenders the part that have changed', function() {
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              nextAnimationFrame();
              expect(minimapElement.drawLines).toHaveBeenCalled();
              expect(minimapElement.drawLines.argsForCall[0][1]).toEqual(100);
              return expect(minimapElement.drawLines.argsForCall[0][2]).toEqual(101);
            });
          });
        });
        return describe('when the editor visibility change', function() {
          it('does not modify the size of the canvas', function() {
            var canvasHeight, canvasWidth;
            canvasWidth = minimapElement.canvas.width;
            canvasHeight = minimapElement.canvas.height;
            editorElement.style.display = 'none';
            minimapElement.measureHeightAndWidth();
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              nextAnimationFrame();
              expect(minimapElement.canvas.width).toEqual(canvasWidth);
              return expect(minimapElement.canvas.height).toEqual(canvasHeight);
            });
          });
          return describe('from hidden to visible', function() {
            beforeEach(function() {
              editorElement.style.display = 'none';
              minimapElement.checkForVisibilityChange();
              spyOn(minimapElement, 'requestForcedUpdate');
              editorElement.style.display = '';
              return minimapElement.pollDOM();
            });
            return it('requests an update of the whole minimap', function() {
              return expect(minimapElement.requestForcedUpdate).toHaveBeenCalled();
            });
          });
        });
      });
      describe('mouse scroll controls', function() {
        beforeEach(function() {
          editorElement.setWidth(400);
          editorElement.setHeight(400);
          editorElement.setScrollTop(0);
          editorElement.setScrollLeft(0);
          nextAnimationFrame();
          minimapElement.measureHeightAndWidth();
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          return runs(function() {
            return nextAnimationFrame();
          });
        });
        describe('using the mouse scrollwheel over the minimap', function() {
          beforeEach(function() {
            spyOn(editorElement.component.presenter, 'setScrollTop').andCallFake(function() {});
            return mousewheel(minimapElement, 0, 15);
          });
          return it('relays the events to the editor view', function() {
            return expect(editorElement.component.presenter.setScrollTop).toHaveBeenCalled();
          });
        });
        describe('middle clicking the minimap', function() {
          var maxScroll, originalLeft, _ref3;
          _ref3 = [], canvas = _ref3[0], visibleArea = _ref3[1], originalLeft = _ref3[2], maxScroll = _ref3[3];
          beforeEach(function() {
            canvas = minimapElement.canvas, visibleArea = minimapElement.visibleArea;
            originalLeft = visibleArea.getBoundingClientRect().left;
            return maxScroll = minimap.getTextEditorMaxScrollTop();
          });
          it('scrolls to the top using the middle mouse button', function() {
            mousedown(canvas, {
              x: originalLeft + 1,
              y: 0,
              btn: 1
            });
            return expect(editorElement.getScrollTop()).toEqual(0);
          });
          describe('scrolling to the middle using the middle mouse button', function() {
            var canvasMidY;
            canvasMidY = void 0;
            beforeEach(function() {
              var actualMidY, editorMidY, height, top, _ref4;
              editorMidY = editorElement.getHeight() / 2.0;
              _ref4 = canvas.getBoundingClientRect(), top = _ref4.top, height = _ref4.height;
              canvasMidY = top + (height / 2.0);
              actualMidY = Math.min(canvasMidY, editorMidY);
              return mousedown(canvas, {
                x: originalLeft + 1,
                y: actualMidY,
                btn: 1
              });
            });
            it('scrolls the editor to the middle', function() {
              var middleScrollTop;
              middleScrollTop = Math.round(maxScroll / 2.0);
              return expect(editorElement.getScrollTop()).toEqual(middleScrollTop);
            });
            return it('updates the visible area to be centered', function() {
              waitsFor(function() {
                return nextAnimationFrame !== noAnimationFrame;
              });
              return runs(function() {
                var height, top, visibleCenterY, _ref4;
                nextAnimationFrame();
                _ref4 = visibleArea.getBoundingClientRect(), top = _ref4.top, height = _ref4.height;
                visibleCenterY = top + (height / 2);
                return expect(visibleCenterY).toBeCloseTo(200, 0);
              });
            });
          });
          return describe('scrolling the editor to an arbitrary location', function() {
            var scrollRatio, scrollTo, _ref4;
            _ref4 = [], scrollTo = _ref4[0], scrollRatio = _ref4[1];
            beforeEach(function() {
              scrollTo = 101;
              scrollRatio = (scrollTo - minimap.getTextEditorScaledHeight() / 2) / (minimap.getVisibleHeight() - minimap.getTextEditorScaledHeight());
              scrollRatio = Math.max(0, scrollRatio);
              scrollRatio = Math.min(1, scrollRatio);
              mousedown(canvas, {
                x: originalLeft + 1,
                y: scrollTo,
                btn: 1
              });
              waitsFor(function() {
                return nextAnimationFrame !== noAnimationFrame;
              });
              return runs(function() {
                return nextAnimationFrame();
              });
            });
            it('scrolls the editor to an arbitrary location', function() {
              var expectedScroll;
              expectedScroll = maxScroll * scrollRatio;
              return expect(editorElement.getScrollTop()).toBeCloseTo(expectedScroll, 0);
            });
            return describe('dragging the visible area with middle mouse button ' + 'after scrolling to the arbitrary location', function() {
              var originalTop;
              originalTop = [][0];
              beforeEach(function() {
                originalTop = visibleArea.getBoundingClientRect().top;
                mousemove(visibleArea, {
                  x: originalLeft + 1,
                  y: scrollTo + 40
                });
                waitsFor(function() {
                  return nextAnimationFrame !== noAnimationFrame;
                });
                return runs(function() {
                  return nextAnimationFrame();
                });
              });
              afterEach(function() {
                return minimapElement.endDrag();
              });
              return it('scrolls the editor so that the visible area was moved down ' + 'by 40 pixels from the arbitrary location', function() {
                var top;
                top = visibleArea.getBoundingClientRect().top;
                return expect(top).toBeCloseTo(originalTop + 40, -1);
              });
            });
          });
        });
        describe('pressing the mouse on the minimap canvas (without scroll animation)', function() {
          beforeEach(function() {
            var t;
            t = 0;
            spyOn(minimapElement, 'getTime').andCallFake(function() {
              var n;
              n = t;
              t += 100;
              return n;
            });
            spyOn(minimapElement, 'requestUpdate').andCallFake(function() {});
            atom.config.set('minimap.scrollAnimation', false);
            canvas = minimapElement.canvas;
            return mousedown(canvas);
          });
          return it('scrolls the editor to the line below the mouse', function() {
            var height, left, middle, scrollTop, top, width, _ref3;
            _ref3 = minimapElement.canvas.getBoundingClientRect(), top = _ref3.top, left = _ref3.left, width = _ref3.width, height = _ref3.height;
            middle = top + height / 2;
            return scrollTop = expect(editorElement.getScrollTop()).toBeGreaterThan(380);
          });
        });
        describe('pressing the mouse on the minimap canvas (with scroll animation)', function() {
          beforeEach(function() {
            var t;
            t = 0;
            spyOn(minimapElement, 'getTime').andCallFake(function() {
              var n;
              n = t;
              t += 100;
              return n;
            });
            spyOn(minimapElement, 'requestUpdate').andCallFake(function() {});
            atom.config.set('minimap.scrollAnimation', true);
            atom.config.set('minimap.scrollAnimationDuration', 300);
            canvas = minimapElement.canvas;
            mousedown(canvas);
            return waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
          });
          return it('scrolls the editor gradually to the line below the mouse', function() {
            return waitsFor(function() {
              nextAnimationFrame !== noAnimationFrame && nextAnimationFrame();
              return editorElement.getScrollTop() >= 380;
            });
          });
        });
        describe('dragging the visible area', function() {
          var originalTop, _ref3;
          _ref3 = [], visibleArea = _ref3[0], originalTop = _ref3[1];
          beforeEach(function() {
            var left, _ref4;
            visibleArea = minimapElement.visibleArea;
            _ref4 = visibleArea.getBoundingClientRect(), originalTop = _ref4.top, left = _ref4.left;
            mousedown(visibleArea, {
              x: left + 10,
              y: originalTop + 10
            });
            mousemove(visibleArea, {
              x: left + 10,
              y: originalTop + 50
            });
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          afterEach(function() {
            return minimapElement.endDrag();
          });
          it('scrolls the editor so that the visible area was moved down by 40 pixels', function() {
            var top;
            top = visibleArea.getBoundingClientRect().top;
            return expect(top).toBeCloseTo(originalTop + 40, -1);
          });
          return it('stops the drag gesture when the mouse is released outside the minimap', function() {
            var left, top, _ref4;
            _ref4 = visibleArea.getBoundingClientRect(), top = _ref4.top, left = _ref4.left;
            mouseup(jasmineContent, {
              x: left - 10,
              y: top + 80
            });
            spyOn(minimapElement, 'drag');
            mousemove(visibleArea, {
              x: left + 10,
              y: top + 50
            });
            return expect(minimapElement.drag).not.toHaveBeenCalled();
          });
        });
        describe('dragging the visible area using touch events', function() {
          var originalTop, _ref3;
          _ref3 = [], visibleArea = _ref3[0], originalTop = _ref3[1];
          beforeEach(function() {
            var left, _ref4;
            visibleArea = minimapElement.visibleArea;
            _ref4 = visibleArea.getBoundingClientRect(), originalTop = _ref4.top, left = _ref4.left;
            touchstart(visibleArea, {
              x: left + 10,
              y: originalTop + 10
            });
            touchmove(visibleArea, {
              x: left + 10,
              y: originalTop + 50
            });
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          afterEach(function() {
            return minimapElement.endDrag();
          });
          it('scrolls the editor so that the visible area was moved down by 40 pixels', function() {
            var top;
            top = visibleArea.getBoundingClientRect().top;
            return expect(top).toBeCloseTo(originalTop + 40, -1);
          });
          return it('stops the drag gesture when the mouse is released outside the minimap', function() {
            var left, top, _ref4;
            _ref4 = visibleArea.getBoundingClientRect(), top = _ref4.top, left = _ref4.left;
            mouseup(jasmineContent, {
              x: left - 10,
              y: top + 80
            });
            spyOn(minimapElement, 'drag');
            touchmove(visibleArea, {
              x: left + 10,
              y: top + 50
            });
            return expect(minimapElement.drag).not.toHaveBeenCalled();
          });
        });
        describe('when the minimap cannot scroll', function() {
          var originalTop, _ref3;
          _ref3 = [], visibleArea = _ref3[0], originalTop = _ref3[1];
          beforeEach(function() {
            var sample;
            sample = fs.readFileSync(dir.resolve('seventy.txt')).toString();
            editor.setText(sample);
            return editorElement.setScrollTop(0);
          });
          return describe('dragging the visible area', function() {
            beforeEach(function() {
              waitsFor(function() {
                return nextAnimationFrame !== noAnimationFrame;
              });
              runs(function() {
                var left, top, _ref4;
                nextAnimationFrame();
                visibleArea = minimapElement.visibleArea;
                _ref4 = visibleArea.getBoundingClientRect(), top = _ref4.top, left = _ref4.left;
                originalTop = top;
                mousedown(visibleArea, {
                  x: left + 10,
                  y: top + 10
                });
                return mousemove(visibleArea, {
                  x: left + 10,
                  y: top + 50
                });
              });
              waitsFor(function() {
                return nextAnimationFrame !== noAnimationFrame;
              });
              return runs(function() {
                return nextAnimationFrame();
              });
            });
            afterEach(function() {
              return minimapElement.endDrag();
            });
            return it('scrolls based on a ratio adjusted to the minimap height', function() {
              var top;
              top = visibleArea.getBoundingClientRect().top;
              return expect(top).toBeCloseTo(originalTop + 40, -1);
            });
          });
        });
        return describe('when scroll past end is enabled', function() {
          beforeEach(function() {
            atom.config.set('editor.scrollPastEnd', true);
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return describe('dragging the visible area', function() {
            var originalTop, _ref3;
            _ref3 = [], visibleArea = _ref3[0], originalTop = _ref3[1];
            beforeEach(function() {
              var left, top, _ref4;
              visibleArea = minimapElement.visibleArea;
              _ref4 = visibleArea.getBoundingClientRect(), top = _ref4.top, left = _ref4.left;
              originalTop = top;
              mousedown(visibleArea, {
                x: left + 10,
                y: top + 10
              });
              mousemove(visibleArea, {
                x: left + 10,
                y: top + 50
              });
              waitsFor(function() {
                return nextAnimationFrame !== noAnimationFrame;
              });
              return runs(function() {
                return nextAnimationFrame();
              });
            });
            afterEach(function() {
              return minimapElement.endDrag();
            });
            return it('scrolls the editor so that the visible area was moved down by 40 pixels', function() {
              var top;
              top = visibleArea.getBoundingClientRect().top;
              return expect(top).toBeCloseTo(originalTop + 40, -1);
            });
          });
        });
      });
      describe('when the model is a stand-alone minimap', function() {
        beforeEach(function() {
          return minimap.setStandAlone(true);
        });
        it('has a stand-alone attribute', function() {
          return expect(minimapElement.hasAttribute('stand-alone')).toBeTruthy();
        });
        it('sets the minimap size when measured', function() {
          minimapElement.measureHeightAndWidth();
          expect(minimap.width).toEqual(minimapElement.clientWidth);
          return expect(minimap.height).toEqual(minimapElement.clientHeight);
        });
        it('does not display the visible area', function() {
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          return runs(function() {
            nextAnimationFrame();
            return expect(isVisible(minimapElement.visibleArea)).toBeFalsy();
          });
        });
        it('does not display the quick settings button', function() {
          atom.config.set('minimap.displayPluginsControls', true);
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          return runs(function() {
            nextAnimationFrame();
            return expect(isVisible(minimapElement.openQuickSettings)).toBeFalsy();
          });
        });
        describe('when minimap.minimapScrollIndicator setting is true', function() {
          beforeEach(function() {
            editor.setText(mediumSample);
            editorElement.setScrollTop(50);
            waitsFor(function() {
              return minimapElement.frameRequested;
            });
            runs(function() {
              nextAnimationFrame();
              return atom.config.set('minimap.minimapScrollIndicator', true);
            });
            waitsFor(function() {
              return minimapElement.frameRequested;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return it('offsets the scroll indicator by the difference', function() {
            var indicator;
            indicator = minimapElement.shadowRoot.querySelector('.minimap-scroll-indicator');
            return expect(realOffsetLeft(indicator)).toBeCloseTo(minimapElement.offsetWidth, -1);
          });
        });
        return describe('pressing the mouse on the minimap canvas', function() {
          beforeEach(function() {
            var t;
            jasmineContent.appendChild(minimapElement);
            t = 0;
            spyOn(minimapElement, 'getTime').andCallFake(function() {
              var n;
              n = t;
              t += 100;
              return n;
            });
            spyOn(minimapElement, 'requestUpdate').andCallFake(function() {});
            atom.config.set('minimap.scrollAnimation', false);
            canvas = minimapElement.canvas;
            return mousedown(canvas);
          });
          return it('does not scroll the editor to the line below the mouse', function() {
            return expect(editorElement.getScrollTop()).toEqual(1000);
          });
        });
      });
      describe('when the model is destroyed', function() {
        beforeEach(function() {
          return minimap.destroy();
        });
        it('detaches itself from its parent', function() {
          return expect(minimapElement.parentNode).toBeNull();
        });
        return it('stops the DOM polling interval', function() {
          spyOn(minimapElement, 'pollDOM');
          sleep(200);
          return runs(function() {
            return expect(minimapElement.pollDOM).not.toHaveBeenCalled();
          });
        });
      });
      describe('when the atom styles are changed', function() {
        beforeEach(function() {
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          runs(function() {
            var styleNode;
            nextAnimationFrame();
            spyOn(minimapElement, 'requestForcedUpdate').andCallThrough();
            spyOn(minimapElement, 'invalidateCache').andCallThrough();
            styleNode = document.createElement('style');
            styleNode.textContent = 'body{ color: #233; }';
            return atom.styles.emitter.emit('did-add-style-element', styleNode);
          });
          return waitsFor(function() {
            return minimapElement.frameRequested;
          });
        });
        return it('forces a refresh with cache invalidation', function() {
          expect(minimapElement.requestForcedUpdate).toHaveBeenCalled();
          return expect(minimapElement.invalidateCache).toHaveBeenCalled();
        });
      });
      describe('when minimap.textOpacity is changed', function() {
        beforeEach(function() {
          spyOn(minimapElement, 'requestForcedUpdate').andCallThrough();
          atom.config.set('minimap.textOpacity', 0.3);
          waitsFor(function() {
            return minimapElement.frameRequested;
          });
          return runs(function() {
            return nextAnimationFrame();
          });
        });
        return it('requests a complete update', function() {
          return expect(minimapElement.requestForcedUpdate).toHaveBeenCalled();
        });
      });
      describe('when minimap.displayCodeHighlights is changed', function() {
        beforeEach(function() {
          spyOn(minimapElement, 'requestForcedUpdate').andCallThrough();
          atom.config.set('minimap.displayCodeHighlights', true);
          waitsFor(function() {
            return minimapElement.frameRequested;
          });
          return runs(function() {
            return nextAnimationFrame();
          });
        });
        return it('requests a complete update', function() {
          return expect(minimapElement.requestForcedUpdate).toHaveBeenCalled();
        });
      });
      describe('when minimap.charWidth is changed', function() {
        beforeEach(function() {
          spyOn(minimapElement, 'requestForcedUpdate').andCallThrough();
          atom.config.set('minimap.charWidth', 1);
          waitsFor(function() {
            return minimapElement.frameRequested;
          });
          return runs(function() {
            return nextAnimationFrame();
          });
        });
        return it('requests a complete update', function() {
          return expect(minimapElement.requestForcedUpdate).toHaveBeenCalled();
        });
      });
      describe('when minimap.charHeight is changed', function() {
        beforeEach(function() {
          spyOn(minimapElement, 'requestForcedUpdate').andCallThrough();
          atom.config.set('minimap.charHeight', 1);
          waitsFor(function() {
            return minimapElement.frameRequested;
          });
          return runs(function() {
            return nextAnimationFrame();
          });
        });
        return it('requests a complete update', function() {
          return expect(minimapElement.requestForcedUpdate).toHaveBeenCalled();
        });
      });
      describe('when minimap.interline is changed', function() {
        beforeEach(function() {
          spyOn(minimapElement, 'requestForcedUpdate').andCallThrough();
          atom.config.set('minimap.interline', 2);
          waitsFor(function() {
            return minimapElement.frameRequested;
          });
          return runs(function() {
            return nextAnimationFrame();
          });
        });
        return it('requests a complete update', function() {
          return expect(minimapElement.requestForcedUpdate).toHaveBeenCalled();
        });
      });
      describe('when minimap.displayMinimapOnLeft setting is true', function() {
        it('moves the attached minimap to the left', function() {
          atom.config.set('minimap.displayMinimapOnLeft', true);
          return expect(minimapElement.classList.contains('left')).toBeTruthy();
        });
        return describe('when the minimap is not attached yet', function() {
          beforeEach(function() {
            editor = atom.workspace.buildTextEditor({});
            editorElement = atom.views.getView(editor);
            editorElement.setHeight(50);
            editor.setLineHeightInPixels(10);
            minimap = new Minimap({
              textEditor: editor
            });
            minimapElement = atom.views.getView(minimap);
            jasmineContent.insertBefore(editorElement, jasmineContent.firstChild);
            atom.config.set('minimap.displayMinimapOnLeft', true);
            return minimapElement.attach();
          });
          return it('moves the attached minimap to the left', function() {
            return expect(minimapElement.classList.contains('left')).toBeTruthy();
          });
        });
      });
      describe('when minimap.adjustMinimapWidthToSoftWrap is true', function() {
        var minimapWidth;
        minimapWidth = [][0];
        beforeEach(function() {
          minimapWidth = minimapElement.offsetWidth;
          atom.config.set('editor.softWrap', true);
          atom.config.set('editor.softWrapAtPreferredLineLength', true);
          atom.config.set('editor.preferredLineLength', 2);
          atom.config.set('minimap.adjustMinimapWidthToSoftWrap', true);
          waitsFor(function() {
            return minimapElement.frameRequested;
          });
          return runs(function() {
            return nextAnimationFrame();
          });
        });
        it('adjusts the width of the minimap canvas', function() {
          return expect(minimapElement.canvas.width / devicePixelRatio).toEqual(4);
        });
        it('offsets the minimap by the difference', function() {
          expect(realOffsetLeft(minimapElement)).toBeCloseTo(editorElement.clientWidth - 4, -1);
          return expect(minimapElement.clientWidth).toEqual(4);
        });
        describe('the dom polling routine', function() {
          return it('does not change the value', function() {
            atom.views.performDocumentPoll();
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              nextAnimationFrame();
              return expect(minimapElement.canvas.width / devicePixelRatio).toEqual(4);
            });
          });
        });
        describe('when the editor is resized', function() {
          beforeEach(function() {
            atom.config.set('editor.preferredLineLength', 6);
            editorElement.style.width = '100px';
            editorElement.style.height = '100px';
            atom.views.performDocumentPoll();
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return it('makes the minimap smaller than soft wrap', function() {
            expect(minimapElement.offsetWidth).toBeCloseTo(12, -1);
            return expect(minimapElement.style.marginRight).toEqual('');
          });
        });
        describe('and when minimap.minimapScrollIndicator setting is true', function() {
          beforeEach(function() {
            editor.setText(mediumSample);
            editorElement.setScrollTop(50);
            waitsFor(function() {
              return minimapElement.frameRequested;
            });
            runs(function() {
              nextAnimationFrame();
              return atom.config.set('minimap.minimapScrollIndicator', true);
            });
            waitsFor(function() {
              return minimapElement.frameRequested;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return it('offsets the scroll indicator by the difference', function() {
            var indicator;
            indicator = minimapElement.shadowRoot.querySelector('.minimap-scroll-indicator');
            return expect(realOffsetLeft(indicator)).toBeCloseTo(2, -1);
          });
        });
        describe('and when minimap.displayPluginsControls setting is true', function() {
          beforeEach(function() {
            return atom.config.set('minimap.displayPluginsControls', true);
          });
          return it('offsets the scroll indicator by the difference', function() {
            var openQuickSettings;
            openQuickSettings = minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings');
            return expect(realOffsetLeft(openQuickSettings)).not.toBeCloseTo(2, -1);
          });
        });
        describe('and then disabled', function() {
          beforeEach(function() {
            atom.config.set('minimap.adjustMinimapWidthToSoftWrap', false);
            waitsFor(function() {
              return minimapElement.frameRequested;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return it('adjusts the width of the minimap', function() {
            expect(minimapElement.offsetWidth).toBeCloseTo(editorElement.offsetWidth / 10, -1);
            return expect(minimapElement.style.width).toEqual('');
          });
        });
        return describe('and when preferredLineLength >= 16384', function() {
          beforeEach(function() {
            atom.config.set('editor.preferredLineLength', 16384);
            waitsFor(function() {
              return minimapElement.frameRequested;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return it('adjusts the width of the minimap', function() {
            expect(minimapElement.offsetWidth).toBeCloseTo(editorElement.offsetWidth / 10, -1);
            return expect(minimapElement.style.width).toEqual('');
          });
        });
      });
      describe('when minimap.minimapScrollIndicator setting is true', function() {
        beforeEach(function() {
          editor.setText(mediumSample);
          editorElement.setScrollTop(50);
          waitsFor(function() {
            return minimapElement.frameRequested;
          });
          runs(function() {
            return nextAnimationFrame();
          });
          return atom.config.set('minimap.minimapScrollIndicator', true);
        });
        it('adds a scroll indicator in the element', function() {
          return expect(minimapElement.shadowRoot.querySelector('.minimap-scroll-indicator')).toExist();
        });
        describe('and then deactivated', function() {
          return it('removes the scroll indicator from the element', function() {
            atom.config.set('minimap.minimapScrollIndicator', false);
            return expect(minimapElement.shadowRoot.querySelector('.minimap-scroll-indicator')).not.toExist();
          });
        });
        describe('on update', function() {
          beforeEach(function() {
            var height;
            height = editorElement.getHeight();
            editorElement.style.height = '500px';
            atom.views.performDocumentPoll();
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return it('adjusts the size and position of the indicator', function() {
            var height, indicator, scroll;
            indicator = minimapElement.shadowRoot.querySelector('.minimap-scroll-indicator');
            height = editorElement.getHeight() * (editorElement.getHeight() / minimap.getHeight());
            scroll = (editorElement.getHeight() - height) * minimap.getTextEditorScrollRatio();
            expect(indicator.offsetHeight).toBeCloseTo(height, 0);
            return expect(realOffsetTop(indicator)).toBeCloseTo(scroll, 0);
          });
        });
        return describe('when the minimap cannot scroll', function() {
          beforeEach(function() {
            editor.setText(smallSample);
            waitsFor(function() {
              return minimapElement.frameRequested;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          it('removes the scroll indicator', function() {
            return expect(minimapElement.shadowRoot.querySelector('.minimap-scroll-indicator')).not.toExist();
          });
          return describe('and then can scroll again', function() {
            beforeEach(function() {
              editor.setText(largeSample);
              waitsFor(function() {
                return minimapElement.frameRequested;
              });
              return runs(function() {
                return nextAnimationFrame();
              });
            });
            return it('attaches the scroll indicator', function() {
              return waitsFor(function() {
                return minimapElement.shadowRoot.querySelector('.minimap-scroll-indicator');
              });
            });
          });
        });
      });
      describe('when minimap.absoluteMode setting is true', function() {
        beforeEach(function() {
          return atom.config.set('minimap.absoluteMode', true);
        });
        it('adds a absolute class to the minimap element', function() {
          return expect(minimapElement.classList.contains('absolute')).toBeTruthy();
        });
        return describe('when minimap.displayMinimapOnLeft setting is true', function() {
          return it('also adds a left class to the minimap element', function() {
            atom.config.set('minimap.displayMinimapOnLeft', true);
            expect(minimapElement.classList.contains('absolute')).toBeTruthy();
            return expect(minimapElement.classList.contains('left')).toBeTruthy();
          });
        });
      });
      return describe('when minimap.displayPluginsControls setting is true', function() {
        var openQuickSettings, quickSettingsElement, workspaceElement, _ref3;
        _ref3 = [], openQuickSettings = _ref3[0], quickSettingsElement = _ref3[1], workspaceElement = _ref3[2];
        beforeEach(function() {
          return atom.config.set('minimap.displayPluginsControls', true);
        });
        it('has a div to open the quick settings', function() {
          return expect(minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings')).toExist();
        });
        describe('clicking on the div', function() {
          beforeEach(function() {
            workspaceElement = atom.views.getView(atom.workspace);
            jasmineContent.appendChild(workspaceElement);
            openQuickSettings = minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings');
            mousedown(openQuickSettings);
            return quickSettingsElement = workspaceElement.querySelector('minimap-quick-settings');
          });
          afterEach(function() {
            return minimapElement.quickSettingsElement.destroy();
          });
          it('opens the quick settings view', function() {
            return expect(quickSettingsElement).toExist();
          });
          return it('positions the quick settings view next to the minimap', function() {
            var minimapBounds, settingsBounds;
            minimapBounds = minimapElement.canvas.getBoundingClientRect();
            settingsBounds = quickSettingsElement.getBoundingClientRect();
            expect(realOffsetTop(quickSettingsElement)).toBeCloseTo(minimapBounds.top, 0);
            return expect(realOffsetLeft(quickSettingsElement)).toBeCloseTo(minimapBounds.left - settingsBounds.width, 0);
          });
        });
        describe('when the displayMinimapOnLeft setting is enabled', function() {
          return describe('clicking on the div', function() {
            beforeEach(function() {
              atom.config.set('minimap.displayMinimapOnLeft', true);
              workspaceElement = atom.views.getView(atom.workspace);
              jasmineContent.appendChild(workspaceElement);
              openQuickSettings = minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings');
              mousedown(openQuickSettings);
              return quickSettingsElement = workspaceElement.querySelector('minimap-quick-settings');
            });
            afterEach(function() {
              return minimapElement.quickSettingsElement.destroy();
            });
            return it('positions the quick settings view next to the minimap', function() {
              var minimapBounds, settingsBounds;
              minimapBounds = minimapElement.canvas.getBoundingClientRect();
              settingsBounds = quickSettingsElement.getBoundingClientRect();
              expect(realOffsetTop(quickSettingsElement)).toBeCloseTo(minimapBounds.top, 0);
              return expect(realOffsetLeft(quickSettingsElement)).toBeCloseTo(minimapBounds.right, 0);
            });
          });
        });
        describe('when the adjustMinimapWidthToSoftWrap setting is enabled', function() {
          var controls;
          controls = [][0];
          beforeEach(function() {
            atom.config.set('editor.softWrap', true);
            atom.config.set('editor.softWrapAtPreferredLineLength', true);
            atom.config.set('editor.preferredLineLength', 2);
            atom.config.set('minimap.adjustMinimapWidthToSoftWrap', true);
            nextAnimationFrame();
            controls = minimapElement.shadowRoot.querySelector('.minimap-controls');
            openQuickSettings = minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings');
            editorElement.style.width = '1024px';
            atom.views.performDocumentPoll();
            waitsFor(function() {
              return minimapElement.frameRequested;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          it('adjusts the size of the control div to fit in the minimap', function() {
            return expect(controls.clientWidth).toEqual(minimapElement.canvas.clientWidth / devicePixelRatio);
          });
          it('positions the controls div over the canvas', function() {
            var canvasRect, controlsRect;
            controlsRect = controls.getBoundingClientRect();
            canvasRect = minimapElement.canvas.getBoundingClientRect();
            expect(controlsRect.left).toEqual(canvasRect.left);
            return expect(controlsRect.right).toEqual(canvasRect.right);
          });
          return describe('when the displayMinimapOnLeft setting is enabled', function() {
            beforeEach(function() {
              return atom.config.set('minimap.displayMinimapOnLeft', true);
            });
            it('adjusts the size of the control div to fit in the minimap', function() {
              return expect(controls.clientWidth).toEqual(minimapElement.canvas.clientWidth / devicePixelRatio);
            });
            it('positions the controls div over the canvas', function() {
              var canvasRect, controlsRect;
              controlsRect = controls.getBoundingClientRect();
              canvasRect = minimapElement.canvas.getBoundingClientRect();
              expect(controlsRect.left).toEqual(canvasRect.left);
              return expect(controlsRect.right).toEqual(canvasRect.right);
            });
            return describe('clicking on the div', function() {
              beforeEach(function() {
                workspaceElement = atom.views.getView(atom.workspace);
                jasmineContent.appendChild(workspaceElement);
                openQuickSettings = minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings');
                mousedown(openQuickSettings);
                return quickSettingsElement = workspaceElement.querySelector('minimap-quick-settings');
              });
              afterEach(function() {
                return minimapElement.quickSettingsElement.destroy();
              });
              return it('positions the quick settings view next to the minimap', function() {
                var minimapBounds, settingsBounds;
                minimapBounds = minimapElement.canvas.getBoundingClientRect();
                settingsBounds = quickSettingsElement.getBoundingClientRect();
                expect(realOffsetTop(quickSettingsElement)).toBeCloseTo(minimapBounds.top, 0);
                return expect(realOffsetLeft(quickSettingsElement)).toBeCloseTo(minimapBounds.right, 0);
              });
            });
          });
        });
        describe('when the quick settings view is open', function() {
          beforeEach(function() {
            workspaceElement = atom.views.getView(atom.workspace);
            jasmineContent.appendChild(workspaceElement);
            openQuickSettings = minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings');
            mousedown(openQuickSettings);
            return quickSettingsElement = workspaceElement.querySelector('minimap-quick-settings');
          });
          it('sets the on right button active', function() {
            return expect(quickSettingsElement.querySelector('.btn.selected:last-child')).toExist();
          });
          describe('clicking on the code highlight item', function() {
            beforeEach(function() {
              var item;
              item = quickSettingsElement.querySelector('li.code-highlights');
              return mousedown(item);
            });
            it('toggles the code highlights on the minimap element', function() {
              return expect(minimapElement.displayCodeHighlights).toBeTruthy();
            });
            return it('requests an update', function() {
              return expect(minimapElement.frameRequested).toBeTruthy();
            });
          });
          describe('clicking on the absolute mode item', function() {
            beforeEach(function() {
              var item;
              item = quickSettingsElement.querySelector('li.absolute-mode');
              return mousedown(item);
            });
            return it('toggles the absolute-mode setting', function() {
              expect(atom.config.get('minimap.absoluteMode')).toBeTruthy();
              return expect(minimapElement.absoluteMode).toBeTruthy();
            });
          });
          describe('clicking on the on left button', function() {
            beforeEach(function() {
              var item;
              item = quickSettingsElement.querySelector('.btn:first-child');
              return mousedown(item);
            });
            it('toggles the displayMinimapOnLeft setting', function() {
              return expect(atom.config.get('minimap.displayMinimapOnLeft')).toBeTruthy();
            });
            return it('changes the buttons activation state', function() {
              expect(quickSettingsElement.querySelector('.btn.selected:last-child')).not.toExist();
              return expect(quickSettingsElement.querySelector('.btn.selected:first-child')).toExist();
            });
          });
          describe('core:move-left', function() {
            beforeEach(function() {
              return atom.commands.dispatch(quickSettingsElement, 'core:move-left');
            });
            it('toggles the displayMinimapOnLeft setting', function() {
              return expect(atom.config.get('minimap.displayMinimapOnLeft')).toBeTruthy();
            });
            return it('changes the buttons activation state', function() {
              expect(quickSettingsElement.querySelector('.btn.selected:last-child')).not.toExist();
              return expect(quickSettingsElement.querySelector('.btn.selected:first-child')).toExist();
            });
          });
          describe('core:move-right when the minimap is on the right', function() {
            beforeEach(function() {
              atom.config.set('minimap.displayMinimapOnLeft', true);
              return atom.commands.dispatch(quickSettingsElement, 'core:move-right');
            });
            it('toggles the displayMinimapOnLeft setting', function() {
              return expect(atom.config.get('minimap.displayMinimapOnLeft')).toBeFalsy();
            });
            return it('changes the buttons activation state', function() {
              expect(quickSettingsElement.querySelector('.btn.selected:first-child')).not.toExist();
              return expect(quickSettingsElement.querySelector('.btn.selected:last-child')).toExist();
            });
          });
          describe('clicking on the open settings button again', function() {
            beforeEach(function() {
              return mousedown(openQuickSettings);
            });
            it('closes the quick settings view', function() {
              return expect(workspaceElement.querySelector('minimap-quick-settings')).not.toExist();
            });
            return it('removes the view from the element', function() {
              return expect(minimapElement.quickSettingsElement).toBeNull();
            });
          });
          return describe('when an external event destroys the view', function() {
            beforeEach(function() {
              return minimapElement.quickSettingsElement.destroy();
            });
            return it('removes the view reference from the element', function() {
              return expect(minimapElement.quickSettingsElement).toBeNull();
            });
          });
        });
        describe('then disabling it', function() {
          beforeEach(function() {
            return atom.config.set('minimap.displayPluginsControls', false);
          });
          return it('removes the div', function() {
            return expect(minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings')).not.toExist();
          });
        });
        return describe('with plugins registered in the package', function() {
          var minimapPackage, pluginA, pluginB, _ref4;
          _ref4 = [], minimapPackage = _ref4[0], pluginA = _ref4[1], pluginB = _ref4[2];
          beforeEach(function() {
            waitsForPromise(function() {
              return atom.packages.activatePackage('minimap').then(function(pkg) {
                return minimapPackage = pkg.mainModule;
              });
            });
            return runs(function() {
              var Plugin;
              Plugin = (function() {
                function Plugin() {}

                Plugin.prototype.active = false;

                Plugin.prototype.activatePlugin = function() {
                  return this.active = true;
                };

                Plugin.prototype.deactivatePlugin = function() {
                  return this.active = false;
                };

                Plugin.prototype.isActive = function() {
                  return this.active;
                };

                return Plugin;

              })();
              pluginA = new Plugin;
              pluginB = new Plugin;
              minimapPackage.registerPlugin('dummyA', pluginA);
              minimapPackage.registerPlugin('dummyB', pluginB);
              workspaceElement = atom.views.getView(atom.workspace);
              jasmineContent.appendChild(workspaceElement);
              openQuickSettings = minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings');
              mousedown(openQuickSettings);
              return quickSettingsElement = workspaceElement.querySelector('minimap-quick-settings');
            });
          });
          it('creates one list item for each registered plugin', function() {
            return expect(quickSettingsElement.querySelectorAll('li').length).toEqual(5);
          });
          it('selects the first item of the list', function() {
            return expect(quickSettingsElement.querySelector('li.selected:first-child')).toExist();
          });
          describe('core:confirm', function() {
            beforeEach(function() {
              return atom.commands.dispatch(quickSettingsElement, 'core:confirm');
            });
            it('disable the plugin of the selected item', function() {
              return expect(pluginA.isActive()).toBeFalsy();
            });
            describe('triggered a second time', function() {
              beforeEach(function() {
                return atom.commands.dispatch(quickSettingsElement, 'core:confirm');
              });
              return it('enable the plugin of the selected item', function() {
                return expect(pluginA.isActive()).toBeTruthy();
              });
            });
            describe('on the code highlight item', function() {
              var initial;
              initial = [][0];
              beforeEach(function() {
                initial = minimapElement.displayCodeHighlights;
                atom.commands.dispatch(quickSettingsElement, 'core:move-down');
                atom.commands.dispatch(quickSettingsElement, 'core:move-down');
                return atom.commands.dispatch(quickSettingsElement, 'core:confirm');
              });
              return it('toggles the code highlights on the minimap element', function() {
                return expect(minimapElement.displayCodeHighlights).toEqual(!initial);
              });
            });
            return describe('on the absolute mode item', function() {
              var initial;
              initial = [][0];
              beforeEach(function() {
                initial = atom.config.get('minimap.absoluteMode');
                atom.commands.dispatch(quickSettingsElement, 'core:move-down');
                atom.commands.dispatch(quickSettingsElement, 'core:move-down');
                atom.commands.dispatch(quickSettingsElement, 'core:move-down');
                return atom.commands.dispatch(quickSettingsElement, 'core:confirm');
              });
              return it('toggles the code highlights on the minimap element', function() {
                return expect(atom.config.get('minimap.absoluteMode')).toEqual(!initial);
              });
            });
          });
          describe('core:move-down', function() {
            beforeEach(function() {
              return atom.commands.dispatch(quickSettingsElement, 'core:move-down');
            });
            it('selects the second item', function() {
              return expect(quickSettingsElement.querySelector('li.selected:nth-child(2)')).toExist();
            });
            describe('reaching a separator', function() {
              beforeEach(function() {
                return atom.commands.dispatch(quickSettingsElement, 'core:move-down');
              });
              return it('moves past the separator', function() {
                return expect(quickSettingsElement.querySelector('li.code-highlights.selected')).toExist();
              });
            });
            return describe('then core:move-up', function() {
              beforeEach(function() {
                return atom.commands.dispatch(quickSettingsElement, 'core:move-up');
              });
              return it('selects again the first item of the list', function() {
                return expect(quickSettingsElement.querySelector('li.selected:first-child')).toExist();
              });
            });
          });
          return describe('core:move-up', function() {
            beforeEach(function() {
              return atom.commands.dispatch(quickSettingsElement, 'core:move-up');
            });
            it('selects the last item', function() {
              return expect(quickSettingsElement.querySelector('li.selected:last-child')).toExist();
            });
            describe('reaching a separator', function() {
              beforeEach(function() {
                atom.commands.dispatch(quickSettingsElement, 'core:move-up');
                return atom.commands.dispatch(quickSettingsElement, 'core:move-up');
              });
              return it('moves past the separator', function() {
                return expect(quickSettingsElement.querySelector('li.selected:nth-child(2)')).toExist();
              });
            });
            return describe('then core:move-down', function() {
              beforeEach(function() {
                return atom.commands.dispatch(quickSettingsElement, 'core:move-down');
              });
              return it('selects again the first item of the list', function() {
                return expect(quickSettingsElement.querySelector('li.selected:first-child')).toExist();
              });
            });
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvbWluaW1hcC9zcGVjL21pbmltYXAtZWxlbWVudC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzS0FBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxnQkFBUixDQUZWLENBQUE7O0FBQUEsRUFHQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSx3QkFBUixDQUhqQixDQUFBOztBQUFBLEVBSUMsYUFBYyxPQUFBLENBQVEscUJBQVIsRUFBZCxVQUpELENBQUE7O0FBQUEsRUFLQSxPQUFxRSxPQUFBLENBQVEsa0JBQVIsQ0FBckUsRUFBQyxpQkFBQSxTQUFELEVBQVksaUJBQUEsU0FBWixFQUF1QixlQUFBLE9BQXZCLEVBQWdDLGtCQUFBLFVBQWhDLEVBQTRDLGtCQUFBLFVBQTVDLEVBQXdELGlCQUFBLFNBTHhELENBQUE7O0FBQUEsRUFPQSxhQUFBLEdBQWdCLFNBQUMsQ0FBRCxHQUFBO1dBR2QsQ0FBQyxDQUFDLFVBSFk7RUFBQSxDQVBoQixDQUFBOztBQUFBLEVBWUEsY0FBQSxHQUFpQixTQUFDLENBQUQsR0FBQTtXQUdmLENBQUMsQ0FBQyxXQUhhO0VBQUEsQ0FaakIsQ0FBQTs7QUFBQSxFQWlCQSxTQUFBLEdBQVksU0FBQyxJQUFELEdBQUE7V0FBVSxJQUFJLENBQUMsV0FBTCxHQUFtQixDQUFuQixJQUF3QixJQUFJLENBQUMsWUFBTCxHQUFvQixFQUF0RDtFQUFBLENBakJaLENBQUE7O0FBQUEsRUFzQkEsS0FBQSxHQUFRLFNBQUMsUUFBRCxHQUFBO0FBQ04sUUFBQSxDQUFBO0FBQUEs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

//# sourceURL=/Users/doot/.atom/packages/minimap/spec/minimap-element-spec.coffee
