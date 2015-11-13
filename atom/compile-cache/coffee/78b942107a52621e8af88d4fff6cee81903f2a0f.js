(function() {
  var TaskPool, os,
    __slice = [].slice;

  os = require('os');

  TaskPool = (function() {
    TaskPool.prototype.liveCount = 0;

    TaskPool.prototype.tasks = [];

    TaskPool.prototype.working = false;

    function TaskPool(size) {
      this.size = size != null ? size : 4;
    }

    TaskPool.prototype.run = function() {
      var interval, work;
      this.working = true;
      interval = null;
      work = (function(_this) {
        return function() {
          var args, callback, task, _ref;
          if (!_this.working) {
            return clearInterval(interval);
          }
          if (_this.liveCount >= _this.size) {
            return;
          }
          if (!_this.tasks.length) {
            return _this.stop();
          }
          _ref = _this.tasks.shift(), task = _ref.task, args = _ref.args, callback = _ref.callback;
          task.on('result', callback);
          _this.liveCount++;
          return task.start.apply(task, __slice.call(args).concat([function() {
            return _this.liveCount--;
          }]));
        };
      })(this);
      return interval = setInterval(work, 10);
    };

    TaskPool.prototype.stop = function() {
      return this.working = false;
    };

    TaskPool.prototype.add = function() {
      var args, callback, task, _i;
      task = arguments[0], args = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), callback = arguments[_i++];
      this.tasks.push({
        task: task,
        args: args,
        callback: callback
      });
      if (!this.working) {
        return this.run();
      }
    };

    return TaskPool;

  })();

  module.exports = new TaskPool(Math.max(os.cpus().length - 2, 1));

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXByb2plY3RzL2xpYi90YXNrLXBvb2wuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFlBQUE7SUFBQSxrQkFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUFMLENBQUE7O0FBQUEsRUFFTTtBQUNKLHVCQUFBLFNBQUEsR0FBVyxDQUFYLENBQUE7O0FBQUEsdUJBQ0EsS0FBQSxHQUFPLEVBRFAsQ0FBQTs7QUFBQSx1QkFFQSxPQUFBLEdBQVMsS0FGVCxDQUFBOztBQUlhLElBQUEsa0JBQUUsSUFBRixHQUFBO0FBQVcsTUFBVixJQUFDLENBQUEsc0JBQUEsT0FBSyxDQUFJLENBQVg7SUFBQSxDQUpiOztBQUFBLHVCQU1BLEdBQUEsR0FBSyxTQUFBLEdBQUE7QUFDSCxVQUFBLGNBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBWCxDQUFBO0FBQUEsTUFDQSxRQUFBLEdBQVcsSUFEWCxDQUFBO0FBQUEsTUFHQSxJQUFBLEdBQU8sQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNMLGNBQUEsMEJBQUE7QUFBQSxVQUFBLElBQUEsQ0FBQSxLQUF1QyxDQUFBLE9BQXZDO0FBQUEsbUJBQU8sYUFBQSxDQUFjLFFBQWQsQ0FBUCxDQUFBO1dBQUE7QUFDQSxVQUFBLElBQVUsS0FBQyxDQUFBLFNBQUQsSUFBYyxLQUFDLENBQUEsSUFBekI7QUFBQSxrQkFBQSxDQUFBO1dBREE7QUFFQSxVQUFBLElBQUEsQ0FBQSxLQUF1QixDQUFBLEtBQUssQ0FBQyxNQUE3QjtBQUFBLG1CQUFPLEtBQUMsQ0FBQSxJQUFELENBQUEsQ0FBUCxDQUFBO1dBRkE7QUFBQSxVQUlBLE9BQXlCLEtBQUMsQ0FBQSxLQUFLLENBQUMsS0FBUCxDQUFBLENBQXpCLEVBQUMsWUFBQSxJQUFELEVBQU8sWUFBQSxJQUFQLEVBQWEsZ0JBQUEsUUFKYixDQUFBO0FBQUEsVUFLQSxJQUFJLENBQUMsRUFBTCxDQUFRLFFBQVIsRUFBa0IsUUFBbEIsQ0FMQSxDQUFBO0FBQUEsVUFPQSxLQUFDLENBQUEsU0FBRCxFQVBBLENBQUE7aUJBUUEsSUFBSSxDQUFDLEtBQUwsYUFBVyxhQUFBLElBQUEsQ0FBQSxRQUFTLENBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxTQUFELEdBQUg7VUFBQSxDQUFBLENBQVQsQ0FBWCxFQVRLO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FIUCxDQUFBO2FBY0EsUUFBQSxHQUFXLFdBQUEsQ0FBWSxJQUFaLEVBQWtCLEVBQWxCLEVBZlI7SUFBQSxDQU5MLENBQUE7O0FBQUEsdUJBdUJBLElBQUEsR0FBTSxTQUFBLEdBQUE7YUFDSixJQUFDLENBQUEsT0FBRCxHQUFXLE1BRFA7SUFBQSxDQXZCTixDQUFBOztBQUFBLHVCQTBCQSxHQUFBLEdBQUssU0FBQSxHQUFBO0FBQ0gsVUFBQSx3QkFBQTtBQUFBLE1BREkscUJBQU0scUdBQVMsMEJBQ25CLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFZO0FBQUEsUUFBQyxNQUFBLElBQUQ7QUFBQSxRQUFPLE1BQUEsSUFBUDtBQUFBLFFBQWEsVUFBQSxRQUFiO09BQVosQ0FBQSxDQUFBO0FBQ0EsTUFBQSxJQUFBLENBQUEsSUFBZSxDQUFBLE9BQWY7ZUFBQSxJQUFDLENBQUEsR0FBRCxDQUFBLEVBQUE7T0FGRztJQUFBLENBMUJMLENBQUE7O29CQUFBOztNQUhGLENBQUE7O0FBQUEsRUFpQ0EsTUFBTSxDQUFDLE9BQVAsR0FDTSxJQUFBLFFBQUEsQ0FBUyxJQUFJLENBQUMsR0FBTCxDQUFTLEVBQUUsQ0FBQyxJQUFILENBQUEsQ0FBUyxDQUFDLE1BQVYsR0FBbUIsQ0FBNUIsRUFBK0IsQ0FBL0IsQ0FBVCxDQWxDTixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/git-projects/lib/task-pool.coffee
