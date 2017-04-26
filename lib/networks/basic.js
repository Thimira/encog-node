var ENCOG = require('../constants');
var ArrayUtils = require('../helpers/array');

/**
 * Basic Network, provides neural network functionality.
 *
 * @class BasicNetwork
 * @constructor
 **/
BasicNetwork = function () {
    'use strict';
};
BasicNetwork.prototype = {
    /**
     * The name of this object.
     * @property NAME
     * @type String
     * @final
     */
    NAME: 'BasicNetwork',

    /**
     * The input neuron count.
     * @property inputCount
     * @type number
     */
    inputCount: null,

    /**
     * The output neuron count.
     * @property outputCount
     * @type number
     */
    outputCount: null,

    /**
     * The individual layer neuron counts.
     * @property layerCounts
     * @type Array
     */
    layerCounts: null,

    /**
     * The individual layer neuron context counts.
     * @property layerContextCount
     * @type Array
     */
    layerContextCount: null,

    /**
     * The weight indexes.
     * @property weightIndex
     * @type Array
     */
    weightIndex: null,

    /**
     * The individual layer indexes.
     * @property layerIndex
     * @type Array
     */
    layerIndex: null,

    /**
     * The activation functions.
     * @property activationFunctions
     * @type Array
     */
    activationFunctions: null,

    /**
     * The layer feed counts.  These are neurons that are actually fed from
     * the previous layer (i.e. not bias or context).
     * @property layerFeedCounts
     * @type Array
     */
    layerFeedCounts: null,

    /**
     * The context target feed counts.
     * @property contextTargetSize
     * @type Array
     */
    contextTargetOffset: null,

    /**
     * The context target sizes.
     * @property contextTargetSize
     * @type Array
     */
    contextTargetSize: null,

    /**
     * The activation level for bias neurons on this layer.
     * @property biasActivation
     * @type Array
     */
    biasActivation: null,

    /**
     * The layer to begin training at.
     * @property beginTraining
     * @type Number
     */
    beginTraining: null,

    /**
     * The layer to end training at.
     * @property endTraining
     * @type Number
     */
    endTraining: null,

    /**
     * The weights of the neural network.
     * @property weights
     * @type Array
     */
    weights: null,

    /**
     * The layer outputs.
     * @property layerOutput
     * @type Array
     */
    layerOutput: null,

    /**
     * The layer sums.
     * @property layerOutput
     * @type Array
     */
    layerSums: null,

    /**
     * The connection limit.
     * @property layerOutput
     * @type Number
     */
    connectionLimit: ENCOG.precision,

    clearContext: function () {
        'use strict';
        var index, i, hasBias;

        index = 0;
        for (i = 0; i < this.layerIndex.length; i += 1) {

            hasBias = (this.layerContextCount[i] + this.layerFeedCounts[i]) !== this.layerCounts[i];

            // fill in regular neurons
            ArrayUtils.fillArray(this.layerOutput, index, index + this.layerFeedCounts[i], 0);
            index += this.layerFeedCounts[i];

            // fill in the bias
            if (hasBias) {
                this.layerOutput[index] = this.biasActivation[i];
                index += 1;
            }

            // fill in context
            ArrayUtils.fillArray(this.layerOutput, index, index + this.layerContextCount[i], 0);
            index += this.layerContextCount[i];
        }
    },

    randomize: function () {
        'use strict';
        var i;
        for (i = 0; i < this.weights.length; i += 1) {
            this.weights[i] = (Math.random() * 2.0) - 1.0;
        }
    },

    computeLayer: function (currentLayer) {
        'use strict';
        var inputIndex, outputIndex, inputSize, outputSize, index, limitX, limitY,
            x, sum, offset, y;

        inputIndex = this.layerIndex[currentLayer];
        outputIndex = this.layerIndex[currentLayer - 1];
        inputSize = this.layerCounts[currentLayer];
        outputSize = this.layerFeedCounts[currentLayer - 1];

        index = this.weightIndex[currentLayer - 1];

        limitX = outputIndex + outputSize;
        limitY = inputIndex + inputSize;

        // weight values
        for (x = outputIndex; x < limitX; x += 1) {
            sum = 0;
            for (y = inputIndex; y < limitY; y += 1) {
                sum += this.weights[index] * this.layerOutput[y];
                index += 1;
            }
            this.layerSums[x] = sum;
            this.layerOutput[x] = sum;
        }

        this.activationFunctions[currentLayer - 1].activationFunction(
            this.layerOutput,
            outputIndex,
            outputSize
        );

        // update context values
        offset = this.contextTargetOffset[currentLayer];

        ArrayUtils.arrayCopy(this.layerOutput, outputIndex,
            this.layerOutput, offset, this.contextTargetSize[currentLayer]);
    },

    compute: function (input) {
        'use strict';
        var sourceIndex, i, offset;
        var output = [];

        sourceIndex = this.layerOutput.length
            - this.layerCounts[this.layerCounts.length - 1];

        ArrayUtils.arrayCopy(input, 0, this.layerOutput, sourceIndex,
            this.inputCount);

        for (i = this.layerIndex.length - 1; i > 0; i -= 1) {
            this.computeLayer(i);
        }

        // update context values
        offset = this.contextTargetOffset[0];

        ArrayUtils.arrayCopy(this.layerOutput, 0, this.layerOutput,
            offset, this.contextTargetSize[0]);

        ArrayUtils.arrayCopy(this.layerOutput, 0, output, 0, this.outputCount);

        return output;
    },
    evaluate: function (inputData, idealData) {
        'use strict';
        var i, j, input, ideal, output, diff, globalError, setSize;

        output;
        globalError = 0;
        setSize = 0;

        for (i = 0; i < inputData.length; i += 1) {
            input = inputData[i];
            ideal = idealData[i];
            output = this.compute(input, output);
            for (j = 0; j < ideal.length; j += 1) {
                diff = ideal[j] - output[j];
                globalError += diff * diff;
                setSize += 1;
            }
        }

        return globalError / setSize;
    }


};


BasicNetwork.create = function (layers) {
    'use strict';
    var layerCount, result, index, neuronCount, weightCount, i, j, layer, nextLayer, neuronIndex;

    result = new BasicNetwork();

    if (layers != null) {
        layerCount = layers.length;

        result.inputCount = layers[0].count;
        result.outputCount = layers[layerCount - 1].count;

        result.layerCounts = ArrayUtils.allocate1D(layerCount);
        result.layerContextCount = ArrayUtils.allocate1D(layerCount);
        result.weightIndex = ArrayUtils.allocate1D(layerCount);
        result.layerIndex = ArrayUtils.allocate1D(layerCount);
        result.activationFunctions = ArrayUtils.allocate1D(layerCount);
        result.layerFeedCounts = ArrayUtils.allocate1D(layerCount);
        result.contextTargetOffset = ArrayUtils.allocate1D(layerCount);
        result.contextTargetSize = ArrayUtils.allocate1D(layerCount);
        result.biasActivation = ArrayUtils.allocate1D(layerCount);

        index = 0;
        neuronCount = 0;
        weightCount = 0;

        for (i = layers.length - 1; i >= 0; i -= 1) {
            layer = layers[i];
            nextLayer = null;

            if (i > 0) {
                nextLayer = layers[i - 1];
            }

            result.biasActivation[index] = layer.biasActivation;
            result.layerCounts[index] = layer.calcTotalCount();
            result.layerFeedCounts[index] = layer.count;
            result.layerContextCount[index] = layer.calcContextCount();
            result.activationFunctions[index] = layer.activation;

            neuronCount += layer.calcTotalCount();

            if (nextLayer !== null) {
                weightCount += layer.count * nextLayer.calcTotalCount();
            }

            if (index === 0) {
                result.weightIndex[index] = 0;
                result.layerIndex[index] = 0;
            } else {
                result.weightIndex[index] = result.weightIndex[index - 1]
                    + (result.layerCounts[index] * result.layerFeedCounts[index - 1]);
                result.layerIndex[index] = result.layerIndex[index - 1]
                    + result.layerCounts[index - 1];
            }

            neuronIndex = 0;
            for (j = layers.length - 1; j >= 0; j -= 1) {
                if (layers[j].contextFedBy === layer) {
                    result.hasContext = true;
                    result.contextTargetSize[index] = layers[j].calcContextCount();
                    result.contextTargetOffset[index] = neuronIndex
                        + (layers[j].calcTotalCount() - layers[j].calcContextCount());
                }
                neuronIndex += layers[j].calcTotalCount();
            }

            index += 1;
        }

        result.beginTraining = 0;
        result.endTraining = result.layerCounts.length - 1;

        result.weights = ArrayUtils.allocate1D(weightCount);
        result.layerOutput = ArrayUtils.allocate1D(neuronCount);
        result.layerSums = ArrayUtils.allocate1D(neuronCount);

        result.clearContext();
    }
    return result;
};

module.exports = BasicNetwork;