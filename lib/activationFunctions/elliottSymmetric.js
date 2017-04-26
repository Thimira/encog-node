
var ENCOG = require('../constants');

/**
 * Computationally efficient alternative to ActivationTANH.
 * Its output is in the range [-1, 1], and it is derivable.
 *
 * It will approach the -1 and 1 more slowly than Tanh so it
 * might be more suitable to classification tasks than predictions tasks.
 *
 * Elliott, D.L. "A better activation function for artificial neural networks", 1993
 * http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.46.7204&rep=rep1&type=pdf
 * @constructor
 * @class ActivationElliottSymmetric
 */
ActivationElliottSymmetric = function () {
    'use strict';
};

ActivationElliottSymmetric.prototype = {

    /**
     * The name of this object.
     * @property NAME
     * @type String
     * @final
     */
    NAME: "ActivationElliottSymmetric",

    /**
     * The encog type of this object.
     * @property encogType
     * @type String
     * @final
     */
    encogType: ENCOG.ENCOG_TYPE_ACTIVATION,
    slope: 1,

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
            x[i] = (x[i] * this.slope) / (1 + Math.abs(x[i] * this.slope));
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
        var d = (1.0 + Math.abs(b * this.slope));
        return this.slope / (d * d);
    }
};

/**
 * Create Elliott Symmetric activation function.
 * @method create
 * @return {ActivationElliottSymmetric} The newly created activation function.
 */
ActivationElliottSymmetric.create = function (s) {
    'use strict';
    var result = new ActivationElliottSymmetric();
    result.slope = s || 1;
    return result;
};

module.exports = ActivationElliottSymmetric;