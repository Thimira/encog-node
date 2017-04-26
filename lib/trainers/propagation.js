var MathUtils = require('../helpers/math');
var ArrayUtils = require('../helpers/array');

/**
 * Propagation training, includes RPROP and Back Propagation.
 *
 * @class PropagationTrainer
 * @constructor
 **/
PropagationTrainer = function () {
    'use strict';
};

PropagationTrainer.prototype = {
    /**
     * The name of this object.
     * @property NAME
     * @type String
     * @final
     */
    NAME: 'PropagationTrainer',
    /**
     * The POSITIVE ETA value. This is specified by the resilient propagation
     * algorithm. This is the percentage by which the deltas are increased by if
     * the partial derivative is greater than zero.
     */
    POSITIVE_ETA: 1.2,

    /**
     * The NEGATIVE ETA value. This is specified by the resilient propagation
     * algorithm. This is the percentage by which the deltas are increased by if
     * the partial derivative is less than zero.
     */
    NEGATIVE_ETA: 0.5,

    /**
     * The minimum delta value for a weight matrix value.
     */
    DELTA_MIN: 1e-6,

    /**
     * The maximum amount a delta can reach.
     */
    MAX_STEP: 50,

    /**
     * The network that is being trained.
     *
     * @property network
     * @type Object
     * @default null
     **/
    network: null,

    /**
     * The input training data.
     *
     * @property trainingInput
     * @type Array
     * @default null
     **/
    trainingInput: null,

    /**
     * The ideal results from training.
     *
     * @property trainingIdeal
     * @type Array
     * @default null
     **/
    trainingIdeal: null,

    /**
     * The type of training:
     *
     * "BPROP" - Backpropagation.
     * "RPROP" - Resilient propagation.
     *
     * @property type
     * @type String
     * @default null
     **/
    type: null,

    /**
     * The learning rate.
     *
     * @property learningRate
     * @type number
     * @default null
     **/
    learningRate: null,

    /**
     * The momentum.
     *
     * @property momentum
     * @type number
     * @default null
     **/
    momentum: null,

    /**
     * The layer detla's, these are used to calculate the gradients.
     *
     * @property layerDelta
     * @type Array
     * @default null
     **/
    layerDelta: null,

    /**
     * The gradients.
     *
     * @property gradients
     * @type Array
     * @default null
     **/
    gradients: null,

    /**
     * The last gradients.
     *
     * @property lastGradient
     * @type Array
     * @default null
     **/
    lastGradient: null,

    /**
     * The last weight deltas.
     *
     * @property lastDelta
     * @type Array
     * @default null
     **/
    lastDelta: null,

    /**
     * The actual output from the neural network.
     *
     * @property actual
     * @type number
     * @default null
     **/
    actual: null,

    /**
     * The flat spot adjustment.
     *
     * @property flatSpot
     * @type number
     * @default null
     **/
    flatSpot: null,

    /**
     * The error function.
     *
     * @property errorFunction
     * @type Function
     * @default null
     **/
    errorFunction: null,

    /**
     * The weight update values.
     *
     * @property updateValues
     * @type number
     * @default null
     **/
    updateValues: null,

    processLevel: function (currentLevel) {
        'use strict';
        var toLayerIndex, fromLayerIndex, index, fromLayerSize, toLayerSize, activation,
            currentFlatSpot, yi, output, sum, xi, wi, y, x;

        fromLayerIndex = this.network.layerIndex[currentLevel + 1];
        toLayerIndex = this.network.layerIndex[currentLevel];
        fromLayerSize = this.network.layerCounts[currentLevel + 1];
        toLayerSize = this.network.layerFeedCounts[currentLevel];

        index = this.network.weightIndex[currentLevel];
        activation = this.network.activationFunctions[currentLevel + 1];
        currentFlatSpot = this.flatSpot[currentLevel + 1];

        // handle weights
        yi = fromLayerIndex;
        for (y = 0; y < fromLayerSize; y += 1) {
            output = this.network.layerOutput[yi];
            sum = 0;
            xi = toLayerIndex;
            wi = index + y;
            for (x = 0; x < toLayerSize; x += 1) {
                this.gradients[wi] += output * this.layerDelta[xi];
                sum += this.network.weights[wi] * this.layerDelta[xi];
                wi += fromLayerSize;
                xi += 1;
            }

            this.layerDelta[yi] = sum
                * (activation.derivativeFunction(this.network.layerSums[yi], this.network.layerOutput[yi]) + currentFlatSpot);
            yi += 1;
        }
    },

    learnBPROP: function () {
        'use strict';
        var i, delta;

        for (i = 0; i < this.network.weights.length; i += 1) {
            delta = (this.gradients[i] * this.learningRate) + (this.lastDelta[i] * this.momentum);
            this.lastDelta[i] = delta;
            this.network.weights[i] += delta;
        }
    },

    learnRPROP: function () {
        'use strict';
        var delta, change, weightChange, i;

        for (i = 0; i < this.network.weights.length; i += 1) {
            // multiply the current and previous gradient, and take the
            // sign. We want to see if the gradient has changed its sign.
            change = MathUtils.sign(this.gradients[i] * this.lastGradient[i]);
            weightChange = 0;

            // if the gradient has retained its sign, then we increase the
            // delta so that it will converge faster
            if (change > 0) {
                delta = this.updateValues[i]
                    * this.POSITIVE_ETA;
                delta = Math.min(delta, this.MAX_STEP);
                weightChange = MathUtils.sign(this.gradients[i]) * delta;
                this.updateValues[i] = delta;
                this.lastGradient[i] = this.gradients[i];
            } else if (change < 0) {
                // if change<0, then the sign has changed, and the last
                // delta was too big
                delta = this.updateValues[i]
                    * this.NEGATIVE_ETA;
                delta = Math.max(delta, this.DELTA_MIN);
                this.updateValues[i] = delta;
                weightChange = -this.lastDelta[i];
                // set the previous gradient to zero so that there will be no
                // adjustment the next iteration
                this.lastGradient[i] = 0;
            } else if (change === 0) {
                // if change==0 then there is no change to the delta
                delta = this.updateValues[i];
                weightChange = MathUtils.sign(this.gradients[i]) * delta;
                this.lastGradient[i] = this.gradients[i];
            }

            this.network.weights[i] += weightChange;
        }
    },


    process: function (input, ideal, s) {
        'use strict';
        var i, j, delta;

        this.actual = this.network.compute(input);

        for (j = 0; j < ideal.length; j += 1) {
            delta = this.actual[j] - ideal[j];
            this.globalError = this.globalError + (delta * delta);
            this.setSize += 1;
        }

        this.errorFunction.calculateError(ideal, this.actual, this.layerDelta);

        for (i = 0; i < this.actual.length; i += 1) {
            this.layerDelta[i] = ((this.network.activationFunctions[0]
                    .derivativeFunction(this.network.layerSums[i], this.network.layerOutput[i]) + this.flatSpot[0]))
                * (this.layerDelta[i] * s);
        }

        for (i = this.network.beginTraining; i < this.network.endTraining; i += 1) {
            this.processLevel(i);
        }
    },

    iteration: function () {
        'use strict';
        var i;
        this.globalError = 0;
        this.setSize = 0;
        this.actual = [];

        ArrayUtils.fillArray(this.gradients, 0, this.gradients.length, 0);
        ArrayUtils.fillArray(this.lastDelta, 0, this.lastDelta.length, 0);

        for (i = 0; i < this.trainingInput.length; i += 1) {
            this.process(this.trainingInput[i], this.trainingIdeal[i], 1.0);
        }

        if (this.type === "BPROP") {
            this.learnBPROP();
        } else if (this.type === "RPROP") {
            this.learnRPROP();
        }

        this.error = this.globalError / this.setSize;
    }

};

PropagationTrainer.create = function (network, errorFunction, input, ideal, type, learningRate, momentum) {
    'use strict';
    var result = new PropagationTrainer();
    result.network = network;
    result.errorFunction = errorFunction;
    result.trainingInput = input;
    result.trainingIdeal = ideal;
    result.type = type;
    result.learningRate = learningRate;
    result.momentum = momentum;

    result.layerDelta = ArrayUtils.newFloatArray(network.layerOutput.length);
    result.gradients = ArrayUtils.newFloatArray(network.weights.length);
    result.lastGradient = ArrayUtils.newFloatArray(network.weights.length);
    result.lastDelta = ArrayUtils.newFloatArray(network.weights.length);
    result.actual = ArrayUtils.newFloatArray(network.outputCount);
    result.flatSpot = ArrayUtils.newFloatArray(network.layerOutput.length);

    result.updateValues = ArrayUtils.newFloatArray(network.weights.length);

    ArrayUtils.fillArray(result.lastGradient, 0, result.lastGradient.length, 0);
    ArrayUtils.fillArray(result.updateValues, 0, result.updateValues.length, 0.1);
    ArrayUtils.fillArray(result.flatSpot, 0, network.weights.length, 0);

    return result;
};

module.exports = PropagationTrainer;