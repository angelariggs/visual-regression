Default configuration and README for visual regression testing

#Contents of This File
* [Overview of BackstopJS](#overview-of-backstopjs)
* [Using a Javascript Config File](#using-a-javascript-config-file)
* [BackstopJS Setup for Local Machines](#backstopjs-setup-for-local-machines)
* [BackstopJS Commands and Use](#backstopjs-commands-and-use)
* [Sites with Basic Auth](#sites-with-basic-auth)
* [Using BackstopJS for Feature Branches](#using-backstopjs-for-feature-branches)
* [Using BackstopJS for Deploys](#using-backstopjs-for-deploys)
* [Using BackstopJS to Compare Two Different Environments](#using-backstopjs-to-compare-two-different-environments)
* [Additional Notes](#additional-notes)

#Overview of BackstopJS
BackstopJS is an npm package used for visual regression testing. It creates screenshot references based on CSS selectors, and runs subsequent tests against those screenshots to check for changes. More information and documentation can be found [here](https://www.npmjs.com/package/backstopjs), including how to re-run a reference for a single item, instead of the entire config file.

#Using a Javascript Config File
By default, BackstopJS uses JSON config files. This setup means that you need a separarate config file for different environments, which gets pretty tedious if you need to update URL paths. Instead, we've started using Javascript config files, which allow us to create an array of relative URLs to use against any environment, based on arguments used in your BackstopJS commands. Many thanks to [Tom Phippen](http://fivemilemedia.co.uk/blog/backstopjs-javascript-configuration) for doing the heavy lifting here.

#BackstopJS Setup for Local Machines
This is for a fresh setup of BackstopJS on a project. See [BackstopJS Commands and Use](#backstopjs-commands-and-use) below for information on running visual regression tests when BackstopJS is already set up on a project.
* Make sure you have `npm` and `node` installed
* Create a feature branch so you can merge in these changes once you're done
* Create a `/tests/backstop` directory in the project root
* Run: `npm install -g backstopjs`
* Run: `backstop genConfig`
    * This will create a `backstop_data` folder and a `backstop.json` file.
    * Rename `backstop.json` to `backstop.js`
* Run: `npm install minimist`
* Add `/tests/backstop/backstop_data` and `/tests/backstop/node_modules` to the `.gitignore` in the project root
* Copy the contents of [the config file](https://github.com/metaltoad/visual-regression/blob/master/backstop.js) from the Visual Regression repo into the `backstop.js` file you just renamed.
    * Update values for following sections to match your project:
        * `arguments.refHost`
        * `arguments.testHost`
    * If desired, update the `delay` and `misMatchThreshold` values in the `scenarios.push` array
    * If desired, update or add viewport settings in the `module.exports`
* Copy the [paths.js file](https://github.com/metaltoad/visual-regression/blob/master/paths.js) into `<project root>/tests/backstop`
    * Add your relative URLs to the `pathConfig` array
* Copy the [visual regression README](https://github.com/metaltoad/visual-regression/blob/master/README.md) into `<project root>/tests/backstop`

#BackstopJS Commands and Use
This section is for using BackstopJS after it's already been set up on a project. If you need information about setting up a project with BackstopJS, please see the [BackstopJS Setup for Local Machines](#backstopjs-setup-for-local-machines) section above.

If BackstopJS is already set up on a project, but you haven't used it yet, you'll need to run through the following steps first:
* `npm install -g backstopjs`
* `npm install minimist`

The `backstop_data` folder is in the .gitignore, so it won't be included in the repo. But it will be created automatically when you run references and tests, and is determined by the `paths` value in the `backstop.js` configuration.

The basic commands look like this:
* References: `backstop reference --configPath=backstop.js --pathFile=paths --env=<environment> --refHost=<environment URL>`
* Tests: `backstop test --configPath=backstop.js --pathFile=paths --env=<environment> --testHost=<environment URL>`
* Reports: `backstop openReport --configPath=backstop.js --env=<environment>`
  * After the test completes, BackstopJS should automatically open the visual regression report in a new browswer window. You would run the `openReport` command in order to manually open the report.

Let's break that down:
* configPath: The BackstopJS configuration file
* pathFile: The filename (without the file extension) that contains the array of relative URLs
* env: The environment you're testing; local, dev, staging, or prod
    * This will determine the screenshots' filenames, and the directory names where the screenshots are stored, so stick to things that make sense (like the examples I gave you)
    * The `env` argument needs to be the same for both reference and test
* refHost / testHost: The base URL of the website that you're testing

So if you're running references on the dev environment of a website, your command would be something like: `backstop reference --configPath=backstop.js --pathFile=paths --env=dev --refHost=http://dev-site.com/`

#Sites with Basic Auth

If the site you're taking screenshots of has basic auth, you'll need to adjust your entries for `refHost` and `testHost`. The pattern is:
`backstop reference --configPath=backstop.js --pathFile=paths --env=staging --refHost=http://username:password\@staging-site.com`.
* Note the `\@`. The slash is not literal, it's to escape the `@` when you run the command in Terminal.

#Using BackstopJS for Feature Branches
  1. Check out the dev branch, or whichever branch you want to use as source of truth
  2. Seed with whichever database is source of truth
  3. Make sure your local site is functional. It's terrible to spend the time running BackstopJS on a borked site.
  4. Navigate to `<project root>/tests/backstop` and run the `reference` command.
  5. When the reference screenshots are done, check out the feature branch and run any necessary updates, such as feature reverts, database updates, and CSS compiling
  6. Make sure you're back in `<project root>/tests/backstop`, and run the `test` command.

#Using BackstopJS for Deploys
When deploying up the environments to prod, you'll want to re-run references and tests against each environment to ensure no visual regressions are introduced. Since you're not testing locally, it won't matter what branch you're on. Using the staging environment as an example, the general practice for this would be:

1. Navigate back to `<project root>/tests/backstop`
2. Run the `reference` command to get the pre-deploy comparisons.
3. Once the references have finished running, deploy the code and make any necessary changes, like indexing Solr or clearing caches
4. Run the `test` command
5. Check the report and make sure nothing's borked

#Using BackstopJS to Compare Two Different Environments
You can use BackstopJS with different environments for reference and test. This could be useful in a few cases, one of which is launching a new site. With this setup, you can run references against staging environment, and then run a test against prod on the initial prod deploy to make sure it looks like you expect.

When comparing different environments, exclude the `--env` argument from your commands. The config file is set up with a default argument `screenshots` for this case. You exclude it from your command because the filenames need to be the same in order to compare and create a report.

Commands:
* Reference (staging): `backstop reference --configPath=backstop.js --pathFile=paths --refHost=http://staging-site.com`
* Test (prod): `backstop test --configPath=backstop.js --pathFile=paths --testHost=http://prod-site.com`

#Additional Notes
While running the BackstopJS test, you may receive an error in Terminal similar to:

```
Error: ENFILE: file table overflow, open '/Users/<user>/Sites/<project>/backstop_data/bitmaps_test/20160502-170325/49_18_footer_3_desktop.png'
    at Error (native)
```
The [solution](http://superuser.com/questions/827984/open-files-limit-does-not-work-as-before-in-osx-yosemite/828010#828010) for this is to: Open `/etc/sysctl.conf` in an IDE (or create `sysctl.conf` in your /etc folder, if it doesn't already exist) and insert the following settings:
```
kern.sysv.shmmax=1073741824
kern.sysv.shmmin=1
kern.sysv.shmmni=4096
kern.sysv.shmseg=32
kern.sysv.shmall=1179648
kern.maxfilesperproc=65536
kern.maxfiles=65536
```
