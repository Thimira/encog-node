var ENCOG = require('../constants');

/**
 * The softmax activation function.
 * @constructor
 * @class ActivationSoftmax
 */
ActivationSoftmax = function () {
    'use strict';
};
ActivationSoftmax.prototype = {
    /**
     * The name of this object.
     * @property NAME
     * @type String
     * @final
     */
    NAME: "ActivationSoftmax",

    /**
     * The Encog Type of this object.
     * @property encogType
     * @type String
     * @final
     */
    encogType: ENCOG.ENCOG_TYPE_ACTIVATION,

    /**
     * Calculate the activation function for the specified value.
     * @method activationFunction
     * @param x An array to calculate the values for.
     * @param start The starting point in the array to calculate.
     * @param size The size to calculate.
     */
    activationFunction: function (x, start, size) {
        'use strict';
        var i;
        var sum = 0;

        for (i = start; i < start + size; i++) {
            x[i] = Math.exp(x[i]);
            sum += x[i];
        }
        if (isNaN(sum) || sum < ENCOG.DEFAULT_DOUBLE_EQUAL) {
            for (i = start; i < start + size; i++) {
                x[i] = 1.0 / size;
            }
        } else {
            for (i = start; i < start + size; i++) {
                x[i] = x[i] / sum;
            }
        }
    },

    /**
     * Calculate the derivative. For efficiency both the before and after
     * activation values are passed in.  Many activation derivatives can
     * be more efficiently calculated using the value after the regular
     * activation is calculated.
     * @param b The value before the regular activation was calculated.
     * @param a The value after the regular activation was calculated.
     * @return {Number} The result.
     */
    derivativeFunction: function (b, a) {
        'use strict';
        return 1;
    }
};

/**
 * Create a Softmax activation function.
 * @method create
 * @return {ActivationSoftmax} The newly created activation function.
 */
ActivationSoftmax.create = function () {
    'use strict';
    return new ActivationSoftmax();
};

module.exports = ActivationSoftmax;