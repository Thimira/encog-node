var ENCOG = require('../constants');

/**
 * The sigmoid activation function takes on a sigmoidal shape. Only positive
 * numbers are generated. Do not use this activation function if negative number
 * output is desired.
 * @constructor
 * @class ActivationSigmoid
 */
ActivationSigmoid = function () {
    'use strict';
};
ActivationSigmoid.prototype = {
    /**
     * The name of this object.
     * @property NAME
     * @type String
     * @final
     */
    NAME: "ActivationSigmoid",

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

        for (i = start; i < start + size; i += 1) {
            x[i] = 1.0 / (1.0 + Math.exp(-1 * x[i]));
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
        return a * (1.0 - a);
    }
};

/**
 * Create a Sigmoid activation function.
 * @method create
 * @return {ActivationSigmoid} The newly created activation function.
 */
ActivationSigmoid.create = function () {
    'use strict';
    return new ActivationSigmoid();
};

module.exports = ActivationSigmoid;