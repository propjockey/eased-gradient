module.exports = function (grunt) {
  grunt.loadNpmTasks("grunt-steal")
  grunt.loadNpmTasks("grunt-eslint")
  grunt.loadNpmTasks("grunt-testee")

  grunt.initConfig({
    "steal-export": {
      dist: {
        steal: {
          config: "package.json!npm"
        },
        outputs: {
          "+cjs": {
            dest: moduleName => __dirname + "/dist/cjs/" + moduleName.replace(/.*src\//i, "") + ".js"
          },
          "+amd": {
            dest: moduleName => __dirname + "/dist/amd/" + moduleName.replace(/.*src\//i, "") + ".js"
          },
          "+global-js": {},
          "min": {
            format: "global",
            modules: ["eased-gradient"],
            dest: __dirname + "/dist/global/eased-gradient.min.js",
            minify: true
          }
        }
      }
    },
    "eslint": {
      options: {
        configFile: ".eslintrc.json"
      },
      target: ["Gruntfile.js", "src/**/*.js", "test/**/*.js"]
    },
    "testee": {
      options: {
        reporter: "dot",
        browsers: ["firefox"],
        coverage: {
          ignore: ["node_modules", "dist", "wasm.js"],
          reporters: ["lcov", "text", "html"]
        },
        "tunnel": {
          "type": "local"
        }
      },
      src: ["test/test.html"]
    }
  })

  grunt.registerTask("build", ["steal-export"])
  grunt.registerTask("test", ["eslint", "testee"])
}
