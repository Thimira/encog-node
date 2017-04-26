var ENCOG = require('../constants');
var MathUtils = require('../helpers/math');
var ArrayUtils = require('../helpers/array');

/**
 * A self organizing map (SOM).
 *
 * @class SOM
 * @constructor
 **/
SOM = function () {
    'use strict';
};

SOM.prototype = {

    /**
     * The name of this object.
     * @property NAME
     * @type String
     * @final
     */
    NAME : "SOM",

    /**
     * Holds the weights for the SOM.
     *
     * @property weights
     * @type Array
     * @default null
     **/
    weights : null,

    /**
     * The input neuron count for the SOM
     *
     * @property inputCount
     * @type int
     * @default 0
     **/
    inputCount : 0,

    /**
     * The output neuron count for the SOM
     *
     * @property outputCount
     * @type int
     * @default 0
     **/
    outputCount : 0,

    /**
     * Determine which output neuron the input matches with best.
     * @method classify
     * @param inputData The input data.
     */
    classify : function (inputData) {
        'use strict';

        var minDist, result, i, dist;

        if (inputData.length > this.inputCount) {
            throw new Error(
                "Can't classify SOM with input size of " + this.inputCount
                + " with input data of count " + inputData.length);
        }

        minDist = Number.POSITIVE_INFINITY;
        result = -1;

        for (i = 0; i < this.outputCount; i += 1) {
            dist = MathUtils.euclideanDistance(inputData, this.weights[i], 0, this.inputCount);
            if (dist < minDist) {
                minDist = dist;
                result = i;
            }
        }

        return result;
    }
};

/**
 * Create a SOM network.
 * @method create
 * @return {SOM} The newly created activation function.
 */
SOM.create = function (theInputCount, theOutputCount) {
    'use strict';
    var result = new SOM();
    result.inputCount = theInputCount;
    result.outputCount = theOutputCount;
    result.weights = ArrayUtils.allocateBoolean2D(theOutputCount, theInputCount);
    return result;
};

module.exports = SOM;
