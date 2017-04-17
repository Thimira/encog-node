var requireDir = require('require-dir');

var helpers = requireDir('./lib/helpers');
var constants = require('./lib/constants');
var activationFunctions = requireDir('./lib/activationFunctions');
var errorFunctions = requireDir('./lib/errorFunctions');
var layers = requireDir('./lib/layers');
var networks = requireDir('./lib/networks');
var trainers = requireDir('./lib/trainers');
var radialFunctions = requireDir('./lib/radialFunctions');
var examples = requireDir('./examples');

module.exports = {
    helpers: helpers,
    constants: constants,
    activationFunctions: activationFunctions,
    errorFunctions: errorFunctions,
    layers: layers,
    networks: networks,
    trainers: trainers,
    radialFunctions: radialFunctions,
    examples: examples
};