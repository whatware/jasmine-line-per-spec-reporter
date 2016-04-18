'use strict';

/*
 * Purpose:
 * Always report one line per spec, regardless of spec status
 *
 * Usage:
 *   const JasmineLinePerSpecReporter = require('jasmine-line-per-spec-reporter');
 *   ... somewhere the `jasmine` global is now set:
 *   jasmine.getEnv().addReporter(new JasmineLinePerSpecReporter(jasmine));
 */

const _ = require('lodash');

module.exports = () => {
    const defaultConfig = {
        failureExpectationMessagePrefixLine: null,
        failureExpectationMessageSuffixLine: null,
        failurePrefixLine: null,
        failureSuffixLine: '',

        // TODO:
        hideDisabledSpecs: false,
        indentExpectation: true,
        log: console.log,
        maxDigitPlaces: 3,
        messagePrefixIndentStr: '',
        separator: ' - ',
        showExpectation: true,
        statusDisplay: {
            disabled: 'Disabled',
            failed: 'FAILED',
            passed: 'Passed',
            pending: 'Pending'
        },
        statusDisplayPadded: {},
        statusPortionIndentStr: '',
        statusPrefixPad: 0,
    };

    class JasmineLinePerSpecReporter {
        constructor(instanceJasmine, optionalConfigInit) {
            // store our controls in a property that should not collide with standard reporter methods
            this.jasmineLinePerSpecReporter = _.merge(
                {
                    jasmine: instanceJasmine,
                    config: defaultConfig,
                    data: {
                        curSpecCount: 0,
                        totalSpecsDefined: 0
                    }
                },
                {
                    config: optionalConfigInit
                }
            );

            const config = this.jasmineLinePerSpecReporter.config;
            const maxValueLen = Object.keys(config.statusDisplay)
                .reduce((currentLen, key) => config.statusDisplay[key].length > currentLen ? config.statusDisplay[key].length : currentLen, 0);

            config.statusPortionIndentStr = ' '.repeat(maxValueLen);

            Object.keys(config.statusDisplay)
                .forEach((key) => {
                    config.statusDisplayPadded[key] = rightPad(config.statusDisplay[key], config.statusPortionIndentStr);
                });
        }

        // standard jasmine reporter methods

        /*
         * Jasmine calls this method once all describes/its have been "initialized"
         */
        jasmineStarted(summary) {
            const config = this.jasmineLinePerSpecReporter.config;
            const data = this.jasmineLinePerSpecReporter.data;

            data.curSpecCount = 0;
            data.totalSpecsDefined = summary.totalSpecsDefined;

            const nOfMLength = String(data.totalSpecsDefined).length * 2 + 1;
            const nOfMPortionPrefixIndentStr = ' '.repeat(nOfMLength);
            const separatorPortionIndentStr = ' '.repeat(config.separator.length);

            config.messagePrefixIndentStr = `${config.statusPortionIndentStr}${separatorPortionIndentStr}${nOfMPortionPrefixIndentStr}${separatorPortionIndentStr}`;
        }

        /*
         * Called every time a spec is done
         */
        specDone(result) {
            const config = this.jasmineLinePerSpecReporter.config;
            const data = this.jasmineLinePerSpecReporter.data;

            ++data.curSpecCount;
            const curSpecCountStr = rightJustify(data.curSpecCount, config.maxDigitPlaces);
            const description = `${config.separator}${curSpecCountStr}/${data.totalSpecsDefined}${config.separator}${result.fullName}`;
            if (result.status === "failed") {
                const log = config.log;
                const indent = config.indentExpectation;
                const indentStr = config.messagePrefixIndentStr;

                logPossiblyIndentedIfString(log, indent, indentStr, config.failurePrefixLine);

                config.log(`${config.statusDisplayPadded[result.status]}${description}`);

                if (config.showExpectation === true) {
                    result.failedExpectations.forEach((failedExpectation) => {
                        if (!failedExpectation.passed) {
                            logPossiblyIndentedIfString(log, indent, indentStr, config.failureExpectationMessagePrefixLine);
                            logPossiblyIndentedIfString(log, indent, indentStr, failedExpectation.message);
                            logPossiblyIndentedIfString(log, indent, indentStr, config.failureExpectationMessageSuffixLine);
                        }
                    });
                }

                logPossiblyIndentedIfString(log, indent, indentStr, config.failureSuffixLine);
            } else if (Object.keys(config.statusDisplayPadded).indexOf(result.status) >= 0) {
                config.log(`${config.statusDisplayPadded[result.status]}${description}`);
            } else {
                config.log(`${result.status} ${description}`);
            }
        }
    }

    // private methods

    /*
     * Add leading spaces for right justifying the x of "x/yyy".
     * e.g., "  1/100", "100/100"
     */
    function logPossiblyIndentedIfString(log, indent, indentStr, message) {
        if (_.isString(message)) {
            if (indent) {
                const msg = message.replace(/\n/g, `\n${indentStr}`);
                log(`${indentStr}${msg}`);
            } else {
                log(msg);
            }
        }
    }

    /*
     * Add leading spaces for right justifying the x of "x/yyy".
     * e.g., "  1/100", "100/100"
     */
    function rightJustify(num, maxDigitPlaces) {
        const maxDigitPrefix = ' '.repeat(maxDigitPlaces);
        const str = String(num);
        return `${maxDigitPrefix}${str}`.slice(-maxDigitPlaces);
    }

    /*
     * Add trailings spaces for right pad
     */
    function rightPad(value, padStr) {
        return `${value}${padStr}`.substring(0, padStr.length);
    }

    return JasmineLinePerSpecReporter;
}();
