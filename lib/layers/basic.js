var ENCOG = require('../constants');

/**
 * The BasicLayer class is used to specify neural networks.  Once
 * the neural network is created, this class is no longer used.
 * @class BasicLayer
 * @constructor
 */
BasicLayer = function () {
    'use strict';
};

BasicLayer.prototype = {

    /**
     * The name of this object.
     * @property NAME
     * @type String
     * @final
     */
    NAME : 'BasicLayer',

    /**
     * The activation function to use for this layer.
     * @property activation
     * @type {Object}
     */
    activation : null,

    /**
     * The neuron count for this layer.
     * @property count The neuron count.
     * @type {number}
     */
    count : null,

    /**
     * The activation level for the bias neuron.  Typically 1
     * if there are bias neurons, or zero if none.
     * @property biasActivation
     * @type {number}
     */
    biasActivation : null,

    /**
     * If this layer has context fed by other layers, this
     * property points to those other layers.
     * @property contextFedBy
     * @type {number}
     */
    contextFedBy : null,

    /**
     * Calculate the total count, including bias, of neurons.
     * @method calcTotalCount
     * @return {*}
     */
    calcTotalCount : function () {
        'use strict';
        if (this.contextFedBy === null) {
            return this.count + (this.hasBias() ? 1 : 0);
        } else {
            return this.count + (this.hasBias() ? 1 : 0)
                + this.contextFedBy.count;
        }
    },

    /**
     * Determine if this layer has bias.
     * @return {Boolean} True, if this layer has bias.
     */
    hasBias : function () {
        'use strict';
        return Math.abs(this.biasActivation) > ENCOG.precision;
    },

    /**
     * Calculate the count of context neurons.
     * @return {*} The count of context neurons.
     */
    calcContextCount : function () {
        'use strict';
        if (this.contextFedBy === null) {
            return 0;
        } else {
            return this.contextFedBy.count;
        }
    }
};

/**
 * Create a BasicLayer.
 * @param activation The activation function used by this layer.
 * @param count The neuron count for this layer.
 * @param biasActivation The bias activation for this layer, specify
 * 1 (or desired activation) to have a bias neuron, or 0 for none.
 * @return {BasicLayer} The newly created layer.
 */
BasicLayer.create = function (activation, count, biasActivation) {
    'use strict';
    var result;

    if (activation.encogType !== ENCOG.ENCOG_TYPE_ACTIVATION) {
        throw new Error("Invalid activation function.");
    }
    result = new BasicLayer();
    result.activation = activation;
    result.count = count;
    result.biasActivation = biasActivation;
    result.contextFedBy = null;
    return result;
};

module.exports = BasicLayer;