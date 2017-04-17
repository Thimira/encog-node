var ENCOG = require('../constants');

/**
 * The Linear layer is really not an activation function at all. The input is
 * simply passed on, unmodified, to the output. This activation function is
 * primarily theoretical and of little actual use. Usually an activation
 * function that scales between 0 and 1 or -1 and 1 should be used.
 * @constructor
 * @class ActivationLinear
 */
ActivationLinear = function () {
    'use strict';
};
ActivationLinear.prototype = {

    /**
     * The name of this object.
     * @property NAME
     * @type String
     * @final
     */
    NAME: "ActivationLinear",

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
     */
    activationFunction: function () {
        'use strict';
    },

    /**
     * Calculate the derivative. For efficiency both the before and after
     * activation values are passed in.  Many activation derivatives can
     * be more efficiently calculated using the value after the regular
     * activation is calculated.
     * @return {Number} The result.
     */
    derivativeFunction: function () {
        'use strict';
        return 1.0;
    }
};

/**
 * Create a Linear activation function.
 * @method create
 * @return {ActivationLinear} The newly created activation function.
 */
ActivationLinear.create = function () {
    'use strict';
    return new ActivationLinear();
};

module.exports = ActivationLinear;