/**
 * XOR Neural Network Example from Encog
 * @author Jeff Heaton
 * @source http://www.codeproject.com/Articles/477689/JavaScript-Machine-Learning-and-Neural-Networks-wi
 */
var ENCOG = require('../index');

module.exports = function () {
    var XOR_INPUT = [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1]
    ];

    var XOR_IDEAL = [
        [0],
        [1],
        [1],
        [0]
    ];

    var network = ENCOG.networks.basic.create([
        ENCOG.layers.basic.create(ENCOG.activationFunctions.sigmoid.create(), 2, 1),
        ENCOG.layers.basic.create(ENCOG.activationFunctions.sigmoid.create(), 3, 1),
        ENCOG.layers.basic.create(ENCOG.activationFunctions.sigmoid.create(), 1, 0)
    ]);

    network.randomize();

    var train = ENCOG.trainers.propagation.create(network, ENCOG.errorFunctions.linear.create(), XOR_INPUT, XOR_IDEAL, "RPROP", 0, 0);

    var iteration = 1;

    do {
        train.iteration();
        var trainResultString = "Training Iteration #" + iteration + ", Error: " + train.error;
        console.log(trainResultString + "\n");
        iteration++;
    } while (iteration < 1000 && train.error > 0.01);

    var input = [0, 0];
    var output = [];

    console.log("Testing neural network: \n");

    for (var i = 0; i < XOR_INPUT.length; i++) {
        output = network.compute(XOR_INPUT[i]);
        var testResultString = "Input: " + String(XOR_INPUT[i][0]) +
            " ; " + String(XOR_INPUT[i][1]) +
            "   Output: " + String(output[0]) +
            "   Ideal: " + String(XOR_IDEAL[i][0]);
        console.log(testResultString + "\n");
    }
};

