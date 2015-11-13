(function() {
  var LinterPerl;

  LinterPerl = require("./linter-perl");

  module.exports = {
    config: {
      perlExecutablePath: {
        type: "string",
        "default": "",
        description: "DEPRECATED: use 'executablePath'"
      },
      executablePath: {
        type: "string",
        "default": "",
        description: "The absolute directory path containing interpreter binaries.\n(ex. \"/Users/user/.plenv/shims\")"
      },
      executeCommandViaShell: {
        type: "boolean",
        "default": false,
        description: "Is the command executed via `$SHELL -l`?\nThis is useful when PATH is setup in .bash_profile, etc.\nIf true, executablePath option is ignored."
      },
      autoDetectCarton: {
        type: "boolean",
        "default": false,
        description: "Is carton enabled if there are both \"cpanfile.snapshot\" and \"local/\"\nin the current root directory?"
      },
      additionalPerlOptions: {
        type: "string",
        "default": "",
        description: "This is passed to the perl interpreter directly."
      },
      incPathsFromProjectPath: {
        type: "array",
        "default": [".", "lib"],
        items: {
          type: "string"
        },
        description: "DEPRECATED: use 'incPathsFromProjectRoot'"
      },
      incPathsFromProjectRoot: {
        type: "array",
        "default": [".", "lib"],
        items: {
          type: "string"
        },
        description: "Relative include paths from the current root directory."
      },
      lintOptions: {
        type: "string",
        "default": "all",
        description: "B::Lint options; \"-MO=Lint,HERE\".\n(ex. \"all,no-bare-subs,no-context\")"
      }
    },
    activate: function() {
      return this.linterPerl = new LinterPerl(this.config);
    },
    deactivate: function() {
      this.linterPerl.destructor();
      return this.linterPerl = null;
    },
    provideLinter: function() {
      return this.linterPerl;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvbGludGVyLXBlcmwvbGliL2luaXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFVBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FBYixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxrQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEVBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSxrQ0FGYjtPQURGO0FBQUEsTUFNQSxjQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsRUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLGtHQUZiO09BUEY7QUFBQSxNQWFBLHNCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLGdKQUZiO09BZEY7QUFBQSxNQXFCQSxnQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSwwR0FGYjtPQXRCRjtBQUFBLE1BNEJBLHFCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsRUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLGtEQUZiO09BN0JGO0FBQUEsTUFrQ0EsdUJBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLE9BQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxDQUFDLEdBQUQsRUFBTSxLQUFOLENBRFQ7QUFBQSxRQUVBLEtBQUEsRUFDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLFFBQU47U0FIRjtBQUFBLFFBSUEsV0FBQSxFQUFhLDJDQUpiO09BbkNGO0FBQUEsTUEwQ0EsdUJBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLE9BQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxDQUFDLEdBQUQsRUFBTSxLQUFOLENBRFQ7QUFBQSxRQUVBLEtBQUEsRUFDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLFFBQU47U0FIRjtBQUFBLFFBSUEsV0FBQSxFQUFhLHlEQUpiO09BM0NGO0FBQUEsTUFrREEsV0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSw0RUFGYjtPQW5ERjtLQURGO0FBQUEsSUEyREEsUUFBQSxFQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxVQUFELEdBQWtCLElBQUEsVUFBQSxDQUFXLElBQUMsQ0FBQSxNQUFaLEVBRFY7SUFBQSxDQTNEVjtBQUFBLElBOERBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixNQUFBLElBQUMsQ0FBQSxVQUFVLENBQUMsVUFBWixDQUFBLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxVQUFELEdBQWMsS0FGSjtJQUFBLENBOURaO0FBQUEsSUFrRUEsYUFBQSxFQUFlLFNBQUEsR0FBQTthQUNiLElBQUMsQ0FBQSxXQURZO0lBQUEsQ0FsRWY7R0FKRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/linter-perl/lib/init.coffee
