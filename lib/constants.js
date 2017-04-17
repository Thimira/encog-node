module.exports = {
    /**
     * The version of Encog that this is.
     * @property property
     * @type String
     * @final
     */
    VERSION : '1.0',

    /**
     * The Encog platform being used.
     * @property property
     * @type String
     * @final
     */
    PLATFORM : 'javascript',

    /**
     * The precision that Encog uses.
     * @property precision
     * @type String
     * @final
     */
    precision : 1e-10,

    /**
     * A newline character.
     * @property property
     * @type String
     * @final
     */
    NEWLINE : '\n',

    /**
     * The Encog type for activation functions.
     * @property ENCOG_TYPE_ACTIVATION
     * @type String
     * @final
     */
    ENCOG_TYPE_ACTIVATION : 'ActivationFunction',

    /**
     * The Encog type for RBF functions.
     * @property ENCOG_TYPE_ACTIVATION
     * @type String
     * @final
     */
    ENCOG_TYPE_RBF : 'RBF',
    /**
     * Default point at which two doubles are equal.
     */
    DEFAULT_DOUBLE_EQUAL : 0.0000000000001
};