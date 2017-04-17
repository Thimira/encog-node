# Encog-Node

Encog-Node is a Node.js port of the popular Encog Machine Learning Framework by Jeff Heaton.

All credits of the framework should go to Jeff Heaton - http://www.heatonresearch.com/encog/

Currently based on the encog-javascript v1.0 - https://github.com/encog/encog-javascript

## Installation

    npm install encog-node

## Usage

Just require the library and all of ENCOG namespace will be available to you,

```js
var ENCOG = require('encog-node');
```

### Example

The example code below will build a simple XOR Neural Network, the code is included in `examples\xor-network.js`

```js
var ENCOG = require('encog-node');

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
```

Will display,

    >node index.js
    Training Iteration #1, Error: 0.33306242864283925
    Training Iteration #2, Error: 0.30684930995968274
    Training Iteration #3, Error: 0.2816136873215376
    Training Iteration #4, Error: 0.2614275886340755
    ..........
    ..........
    ..........
    Training Iteration #44, Error: 0.010807377445510056
    Training Iteration #45, Error: 0.005187735146628829
    Testing neural network
    Input: 0 ; 0   Output: 0.000056493461985276595   Ideal: 0
    Input: 1 ; 0   Output: 0.9995493238264583   Ideal: 1
    Input: 0 ; 1   Output: 0.9987763730629743   Ideal: 1
    Input: 1 ; 1   Output: 0.08974271940228784   Ideal: 0

### Running included examples

The included XOR example can be simply run by,

```js
var ENCOG = require('encog-node');

ENCOG.examples.xor();
```

This will run the same XOR example mentioned above.

## Node.js version compatibility

Should work on all Node.js versions. Tested up to Node.js `v5.11.0`

## Credits

Credits should go to [Jeff Heaton](https://github.com/jeffheaton) for the original Encog Machine Learning Framework - http://www.heatonresearch.com/about/

The capabilities of the framework are explained here by the author : http://www.codeproject.com/Articles/477689/JavaScript-Machine-Learning-and-Neural-Networks-wi

### Contributors

Ported to Node.js by [Thimira Amaratunga](https://github.com/Thimira)
