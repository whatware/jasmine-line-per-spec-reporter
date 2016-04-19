# jasmine-line-per-spec-reporter 0.2.0 (2016-04-19)

Always report one line per spec, regardless of spec status.

Provided as a reporter class for the jasmine test framework.

## Example

The output format is:
```sh
status-right-padded - spec-number-left-padded/total-spec-count - full suite/spec description
                                                                 indented expect messages
                                                                 are output on FAILURE
```

Such that output would look like:

```sh
Passed   -   1/4 - Suite one Sub-suite AAA Spec one
FAILED   -   2/4 - Suite one Sub-suite BBB Spec two
                   Expected 1 to be 0.

Pending  -   3/4 - Suite one Sub-suite BBB Spec three
Disabled -   4/4 - Suite one Sub-suite CCC Spec four
```

Given these suites/specs:

```js
describe('Suite one', () => {
    describe('Sub-suite AAA', () => {
        it('Spec one', () => {
            expect(0).toBe(0);
        });
    });

    describe('Sub-suite BBB', () => {
        it('Spec two', () => {
            expect(1).toBe(0);
        });

        xit('Spec three', () => {
            expect(0).toBe(0);
        });
    });

    xdescribe('Sub-suite CCC', () => {
        it('Spec four', () => {
            expect(0).toBe(0);
        });
    });
});
```

## Installation

The easiest way is to keep `jasmine-line-per-spec-reporter` as a `devDependency` in your `package.json`. Just run

```sh
npm install jasmine-line-per-spec-reporter --save-dev
```

to let `npm` automatically add it there.

## Configuration

### `protractor`

In your `protractor.conf.js` file:

- At the top, or with the other `require` lines, add:

    ```js
    const JasmineLinePerSpecReporter = require('jasmine-line-per-spec-reporter');
    ```

- In the `config.onPrepare` function, add:

    ```js
        if (browser.params.linePerSpecReporter === true) {
            jasmine.getEnv().addReporter(new JasmineLinePerSpecReporter(jasmine));
        }
    ```

- You can also see **stack trace** lines that only match the path to your spec files,
without all the extra stack trace junk you get from the default reporter.
E.g., If you project root folder is `my-project-folder` and all your tests are in `my-project-folder/test/spec`,
then in the `config.onPrepare` function, add:

    ```js
        if (browser.params.linePerSpecReporter === true) {
            const conifg = {
                failureExpectationMessageSuffixLine: '',
                failureSuffixLine: null,
                showStackTrace: true,
                showStackTraceRegExMatch: /^.*[\\\/](my-project-folder[\\\/]test[\\\/]spec[\\\/].*)\)$/g,
                showStackTraceRegExReplace: '  at $1',
                showStackTraceRegExShowMax: 1
            };
            jasmine.getEnv().addReporter(new JasmineLinePerSpecReporter(jasmine, config));
        }
    ```
    
    This will produce output for each failure showing only the first stack trace line that matches your criteria, like the following:

    ```sh
    Passed   -   1/4 - Suite one Sub-suite AAA Spec one
    FAILED   -   2/4 - Suite one Sub-suite BBB Spec two
                       Expected 1 to be 0.
                       Stack trace (replaced lines):
                         at my-project-folder/test/spec/myTest.js:10:8

    Pending  -   3/4 - Suite one Sub-suite BBB Spec three
    Disabled -   4/4 - Suite one Sub-suite CCC Spec four
    ```

### `grunt` + `protractor`

If you are using `grunt`, this configuration will allow you to specify the `protractor` flag from the `grunt` command line.

You must modify the `protractor` configuration in your `Gruntfile.js` as: 
```js
    protractor: {
        options: {
            args: {
                params: {
                    // Map the `grunt` command line argument:
                    //     --linePerSpecReporter=true
                    // to the `protractor` boolean property:
                    //     browser.params.linePerSpecReporter
                    linePerSpecReporter: grunt.option('linePerSpecReporter')
                }
            }
        }
    }
```

### `grunt` + regular `jasmine`

TODO

## Usage

### `protractor`

Run your usual `protractor` command with the extra flag:

```sh
--params.linePerSpecReporter=true
```

e.g.:

```sh
protractor --params.linePerSpecReporter=true
```

### `grunt`

Run your usual `grunt` command with the extra flag:

```sh
--linePerSpecReporter=true
```

e.g.:

```sh
grunt test --linePerSpecReporter=true
```

## TODO

- **Needs documentation** --
Until documented here, see
`defaultConfig` in [`dist/jasmine-line-per-spec-reporter.js`](dist/jasmine-line-per-spec-reporter.js)
for properties that can be set using `optionalConfig` as:

    ```js
            jasmine.getEnv().addReporter(new JasmineLinePerSpecReporter(jasmine, optionalConfig));
    ```

- **Feature** --
Optional time prefixes:

    - Delta -- time between each spec as `SS.mmm`, e.g.:

        ```sh
        00.000 Passed   -   1/4 - Suite one Sub-suite AAA Spec one
        00.250 FAILED   -   2/4 - Suite one Sub-suite BBB Spec two
                                  Expected 1 to be 0.

        00.133 Pending  -   3/4 - Suite one Sub-suite BBB Spec three
        00.088 Disabled -   4/4 - Suite one Sub-suite CCC Spec four
        ```

    - Relative -- time since first spec `MM:SS.mmm`, e.g.:

        ```sh
        00:00.000 Passed   -   1/4 - Suite one Sub-suite AAA Spec one
        00:00.133 FAILED   -   2/4 - Suite one Sub-suite BBB Spec two
                                     Expected 1 to be 0.

        00:00.250 Pending  -   3/4 - Suite one Sub-suite BBB Spec three
        00:00.250 Disabled -   4/4 - Suite one Sub-suite CCC Spec four
        ```

    - Current -- current time as `YYYY-MM-DD HH:MM:SS.mmm`, e.g.:

        ```sh
        2016-04-19 16:00:00.000 Passed   -   1/4 - Suite one Sub-suite AAA Spec one
        2016-04-19 16:00:00.133 FAILED   -   2/4 - Suite one Sub-suite BBB Spec two
                                                   Expected 1 to be 0.

        2016-04-19 16:00:00.250 Pending  -   3/4 - Suite one Sub-suite BBB Spec three
        2016-04-19 16:00:00.250 Disabled -   4/4 - Suite one Sub-suite CCC Spec four
        ```

## Changelog / Release History

See [CHANGELOG.md](CHANGELOG.md).
