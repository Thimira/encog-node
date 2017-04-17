// https://en.wikipedia.org/wiki/Iris_flower_data_set
var irisDataset = require('ml-dataset-iris').getDataset();
var _ = require('lodash');
var ENCOG = require('../index');

module.exports = function () {
    irisDataset = _.shuffle(irisDataset);

    var input = [];
    var output = [];
    //split the dataset in input and output
    irisDataset.map(function (val) {
        input.push(val.slice(0, -1));
        //convert the output column in to 3 independent columns
        switch (val[val.length - 1]) {
            case 'setosa':
                output.push([0, 0, 1]);
                break;
            case 'versicolor':
                output.push([0, 1, 0]);
                break;
            case 'virginica':
                output.push([1, 0, 0]);
                break;
        }
    });

    //split the input and output in train and test dataset, following the 80%/20% ratio
    var trainDatasetInput = input.slice(0, input.length * 0.8);
    var trainDatasetOutput = output.slice(0, output.length * 0.8);
    var testDatasetInput = input.slice(-input.length * 0.2);
    var testDatasetOutput = output.slice(-output.length * 0.2);

    var network = ENCOG.networks.basic.create([
        ENCOG.layers.basic.create(ENCOG.activationFunctions.sigmoid.create(), 4, 1),
        ENCOG.layers.basic.create(ENCOG.activationFunctions.sigmoid.create(), 10, 1),
        ENCOG.layers.basic.create(ENCOG.activationFunctions.sigmoid.create(), 5, 1),
        ENCOG.layers.basic.create(ENCOG.activationFunctions.sigmoid.create(), 3, 0)
    ]);

    network.randomize();

    var propagationTrainer = ENCOG.trainers.propagation.create(network, ENCOG.errorFunctions.linear.create(), trainDatasetInput, trainDatasetOutput, "RPROP", 0, 0);

    var iteration = 1;

    do {
        propagationTrainer.iteration();
        var trainResultString = "Training Iteration #" + iteration + ", Error: " + propagationTrainer.error;
        console.log(trainResultString);
        iteration++;
    } while (iteration < 1000 && propagationTrainer.error > 0.01);

    var _output;
    var accuratePredictions = 0;
    for (var i = 0; i < testDatasetInput.length; i++) {
        _output = network.compute(testDatasetInput[i]);
        _output = _output.map(Math.round);

        if (_.isEqual(_output, testDatasetOutput[i])) {
            accuratePredictions++;
        }
    }

    console.log('Total tests: ', testDatasetInput.length);
    console.log('Accuracy: ', accuratePredictions / testDatasetInput.length * 100 + '%');
};
