var ENCOG = require('../constants');

RadialMexicanHat = function () {
    'use strict';
};

RadialMexicanHat.prototype = {

    /**
     * The name of this object.
     * @property NAME
     * @type String
     * @final
     */
    NAME : "RadialMexicanHat",

    /**
     * The encog type of this object.
     * @property encogType
     * @type String
     * @final
     */
    encogType : ENCOG.ENCOG_TYPE_RBF,
    center : [],
    width : [],
    peak : 1,

    /**
     * Calculate the activation function for the specified value.
     * @method calculate
     * @param x An array to calculate the values for.
     */
    calculate : function (x) {
        'use strict';

        // calculate the "norm", but don't take square root
        // don't square because we are just going to square it
        var norm = 0, i;
        for (i = 0; i < this.center.length; i += 1) {
            norm += Math.pow(x[i] - this.center[i], 2);
        }

        // calculate the value

        return this.peak * (1 - norm) * Math.exp(-norm / 2);
    }
};

/**
 * Create a Mexican Hat RBF.
 * @method create
 * @return {RadialMexicanHat} The newly created activation function.
 */
RadialMexicanHat.create = function (thePeak, theCenters, theWidth) {
    'use strict';
    var result = new RadialMexicanHat();
    result.peak = thePeak || 1;
    result.centers = theCenters;
    result.width = theWidth || 1;
    return result;
};

module.exports = RadialMexicanHat;