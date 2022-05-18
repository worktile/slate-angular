// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function(config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage"),
      require("@angular-devkit/build-angular/plugins/karma"),
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true, // removes the duplicated traces
    },
    coverageReporter: {
      dir: "coverage/slate-angular",
      subdir: ".",
      reporters: [
        { type: "html" },
        { type: "text-summary" },
        { type: "lcovonly" },
      ],
    },
    angularCli: {
      environment: "dev",
    },
    files: [],
    reporters: ["progress", "kjhtml"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["Chrome"],
    singleRun: false,
    customLaunchers: {
      ChromeHeadlessCI: {
        base: "ChromeHeadless",
        flags: ["--no-sandbox"],
      },
    },
    restartOnFileChange: true,
  });
};
