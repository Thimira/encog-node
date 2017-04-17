/**
 * The Linear Error function is used to calculate the value that propagation
 * training seeks to minimize. The linear function simply subtracts
 * desired from actual values.
 * @class LinearErrorFunction
 * @constructor
 */
LinearErrorFunction = function () {
    'use strict';
};

LinearErrorFunction.prototype = {
    /**
     * Calculate the error value for the ideal and actual results.
     * @method calculateError
     * @param ideal The ideal output.
     * @param actual The actual output.
     * @param error The resulting error.
     */
    calculateError : function (ideal, actual, error) {
        'use strict';
        var i;
        for (i = 0; i < actual.length; i += 1) {
            error[i] = ideal[i] - actual[i];
        }

    }
};

/**
 * Create the linear error function.
 * @return {LinearErrorFunction}
 */
LinearErrorFunction.create = function () {
    'use strict';
    return new LinearErrorFunction();
};

module.exports = LinearErrorFunction;