var ENCOG = require('../constants');
var MathUtils = require('../helpers/math');
var ArrayUtils = require('../helpers/array');

// train SOM
TrainSOM = function () {
    'use strict';
};

TrainSOM.prototype = {

    /**
     * The name of this object.
     * @property NAME
     * @type String
     * @final
     */
    NAME : "SOM",

    weights : null,
    som : null,
    learningRate : 0.5,
    correctionMatrix : null,
    trainingInput : null,
    worstDistance : 0,


    /**
     * Perform a training iteration.
     * @method iteration
     */
    iteration : function () {
        'use strict';

        var i, input, bmu;

        // Reset the correction matrix for this synapse and iteration.
        ArrayUtils.fillArray2D(this.correctionMatrix, 0);

        // Determine the BMU for each training element.
        for (i = 0; i < this.trainingInput.length; i++) {
            input = this.trainingInput[i];

            bmu = this.calculateBMU(input);

            this.train(bmu, input);

            this.applyCorrection();
        }

        // update the error
        //setError(this.bmuUtil.getWorstDistance() / 100.0);

    },
    reset : function () {
        MathUtils.randomizeArray2D(this.weights, -1, 1);
    },
    calculateBMU : function (input) {
        var result, lowestDistance, i, distance;

        result = 0;

        if (input.length > this.som.inputCount) {
            throw new Error(
                "Can't train SOM with input size of " + this.inputCount
                + " with input data of count " + input.length);
        }

        // Track the lowest distance so far.
        lowestDistance = Number.POSITIVE_INFINITY;

        for (i = 0; i < this.som.outputCount; i++) {
            distance = MathUtils.euclideanDistance(this.som.weights[i], input, 0, this.som.weights[i].length);

            // Track the lowest distance, this is the BMU.
            if (distance < lowestDistance) {
                lowestDistance = distance;
                result = i;
            }
        }

        // Track the worst distance, this is the error for the entire network.
        if (lowestDistance > this.worstDistance) {
            this.worstDistance = lowestDistance;
        }

        return result;
    },
    train : function (bmu, input) {

    },
    applyCorrection : function () {

    }
};

/**
 * Create trainer for a SOM.
 * @method create
 * @return {TrainSOM} The newly created activation function.
 */
TrainSOM.create = function (theSom, theLearningRate) {
    'use strict';
    var result = new TrainSOM();
    result.som = theSom;
    result.learningRate = theLearningRate;
    result.correctionMatrix = ArrayUtils.allocateBoolean2D(this.som.outputCount, this.som.inputCount);
    return result;
};

module.exports = TrainSOM;