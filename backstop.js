/* Quick guide to BackstopJS commands

  backstop reference --configPath=backstop.js --pathFile=paths --env=local --refHost=http://site.dev
  backstop test --configPath=backstop.js --pathFile=paths --env=local --testHost=http://site.dev

*/

var arguments = require('minimist')(process.argv.slice(2)); // grabs the process arguments
var defaultPaths = ['/']; // default path just checks the homepage
var scenarios = []; // The array that'll have the URL paths to check

/*
  Work out the environments that are being compared
 */
 // Site for reference screenshots
if (!arguments.refHost) {
  arguments.refHost = "http://local.dev"; // Default ref environment
}

// Site for test screenshots
if (!arguments.testHost) {
  arguments.testHost = "http://local.dev"; // Default test environment
}

/*
  Work out which paths to use: an array from a file, a supplied array, or the defaults
 */
 // We'll be using the array from paths.js
if (arguments.pathFile) {
  var pathConfig = require('./'+arguments.pathFile+'.js');
  var paths = pathConfig.array;
} else if (arguments.paths) {
  pathString = arguments.paths;
  var paths = pathString.split(',');
} else {
  var paths = defaultPaths; // keep with the default of just the homepage
}

// Scenarios are a default part of config for BackstopJS
// Explanations for the sections below are at https://www.npmjs.com/package/backstopjs
for (var k = 0; k < paths.length; k++) {
  scenarios.push (
    {
      "label": paths[k],
      "referenceUrl": arguments.refHost+paths[k],
      "url": arguments.testHost+paths[k],
      "hideSelectors": [],
      "removeSelectors": [],
      "selectors": ["document"], // "document" will snapshot the entire page
      "delay": 1000,
      "misMatchThreshold" : 0.1
    }
  );
}

/*
  Work out the directories to save screenshots
 */
if (!arguments.env) {
  arguments.env = "screenshots"; // used for comparing two different environments
  var saveDirectories = {
    "bitmaps_reference": "./backstop_data/screenshots_reference",
    "bitmaps_test": "./backstop_data/screenshots_test",
    "html_report": "./backstop_data/screenshots_html_report",
    "ci_report": "./backstop_data/screenshots_ci_report"
  };
 } else if (arguments.env) {
  var saveDirectories = {
    "bitmaps_reference": "./backstop_data/"+arguments.env+"_reference",
    "bitmaps_test": "./backstop_data/"+arguments.env+"_test",
    "html_report": "./backstop_data/"+arguments.env+"_html_report",
    "ci_report": "./backstop_data/"+arguments.env+"_ci_report"
  };
}

// BackstopJS configuration
module.exports =
{
  "id": "project_"+arguments.env+"_config",
  "viewports": [
    {
      "name": "desktop",
      "width": 1600,
      "height": 2000
    },
    {
      "name": "mobile",
      "width": 375,
      "height": 2000
    }
  ],
  "scenarios":
    scenarios,
  "paths":
    saveDirectories,
  "casperFlags": ["--ignore-ssl-errors=true", "--ssl-protocol=any"],
  "engine": "phantomjs", // alternate can be slimerjs
  "report": ["browser"],
  "debug": false
};
