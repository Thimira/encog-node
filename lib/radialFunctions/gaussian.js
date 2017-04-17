var ENCOG = require('../constants');

RadialGaussian = function () {
    'use strict';
};

RadialGaussian.prototype = {

    /**
     * The name of this object.
     * @property NAME
     * @type String
     * @final
     */
    NAME: "RadialGaussian",

    /**
     * The encog type of this object.
     * @property encogType
     * @type String
     * @final
     */
    encogType: ENCOG.ENCOG_TYPE_RBF,
    center: [],
    width: 1,
    peak: 1,

    /**
     * Calculate the activation function for the specified value.
     * @method calculate
     * @param x An array to calculate the values for.
     */
    calculate: function (x) {
        'use strict';

        var value = 0, i;

        for (i = 0; i < this.center.length; i += 1) {
            value += Math.pow(x[i] - this.center[i], 2) / (2.0 * this.width * this.width);
        }
        return this.peak * Math.exp(-value);
    }
};

/**
 * Create a gaussian RBF.
 * @method create
 * @return {RadialGaussian} The newly created activation function.
 */
RadialGaussian.create = function (thePeak, theCenters, theWidth) {
    'use strict';
    var result = new RadialGaussian();
    result.peak = thePeak || 1;
    result.centers = theCenters;
    result.width = theWidth || 1;
    return result;
};

module.exports = RadialGaussian;