var ENCOG = require('../constants');

/**
 * The hyperbolic tangent activation function takes the curved shape of the
 * hyperbolic tangent. This activation function produces both positive and
 * negative output. Use this activation function if both negative and positive
 * output is desired.
 * @constructor
 * @class ActivationTANH
 */
ActivationTANH = function () {
    'use strict';
};

ActivationTANH.prototype = {
    /**
     * The name of this object.
     * @property NAME
     * @type String
     * @final
     */
    NAME: "ActivationTANH",

    /**
     * The encog type of this object.
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
            x[i] = MathUtil.tanh(x[i]);
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
        return (1.0 - a * a);
    }
};

/**
 * Create a TANH activation function.
 * @method create
 * @return {ActivationTANH} The newly created activation function.
 */
ActivationTANH.create = function () {
    'use strict';
    return new ActivationTANH();
};

module.exports = ActivationTANH;