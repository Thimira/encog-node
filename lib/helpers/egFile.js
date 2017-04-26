var requireDir = require('require-dir')
var ENCOG = require('../constants');
var readCsv = require('../helpers/readCsv');
var arrayUtils = require('../helpers/array');
var activationFunctions = requireDir('../activationFunctions');
var networks = requireDir('../networks');
var _ = require('lodash');

/**
 * Read data stored in the Encog EG format.
 *
 * @class EGFILE
 * @constructor
 **/
EGFILE = function () {
    'use strict';
};


EGFILE.save = function (obj) {
    'use strict';
    var result = "", now, i, af;

    now = (new Date()).getTime();

    result += 'encog,BasicNetwork,' + ENCOG.PLATFORM + ',3.1.0,1,' + now + ENCOG.NEWLINE;
    result += '[BASIC]' + ENCOG.NEWLINE;
    result += '[BASIC:PARAMS]' + ENCOG.NEWLINE;
    result += '[BASIC:NETWORK]' + ENCOG.NEWLINE;
    result += 'beginTraining=' + obj.beginTraining + ENCOG.NEWLINE;
    result += 'connectionLimit=' + obj.connectionLimit + ENCOG.NEWLINE;
    result += 'contextTargetOffset=' + readCsv.toCommaList(obj.contextTargetOffset) + ENCOG.NEWLINE;
    result += 'contextTargetSize=' + readCsv.toCommaList(obj.contextTargetSize) + ENCOG.NEWLINE;
    result += 'endTraining=' + obj.endTraining + ENCOG.NEWLINE;
    result += 'hasContext=' + (obj.hasContext ? 't' : 'f') + ENCOG.NEWLINE;
    result += 'inputCount=' + obj.inputCount + ENCOG.NEWLINE;
    result += 'layerCounts=' + readCsv.toCommaList(obj.layerCounts) + ENCOG.NEWLINE;
    result += 'layerFeedCounts=' + readCsv.toCommaList(obj.layerFeedCounts) + ENCOG.NEWLINE;
    result += 'layerContextCount=' + readCsv.toCommaList(obj.layerContextCount) + ENCOG.NEWLINE;
    result += 'layerIndex=' + readCsv.toCommaList(obj.layerIndex) + ENCOG.NEWLINE;
    result += 'output=' + readCsv.toCommaList(obj.layerOutput) + ENCOG.NEWLINE;
    result += 'outputCount=' + obj.outputCount + ENCOG.NEWLINE;
    result += 'weightIndex=' + readCsv.toCommaList(obj.weightIndex) + ENCOG.NEWLINE;
    result += 'weights=' + readCsv.toCommaList(obj.weights) + ENCOG.NEWLINE;
    result += 'biasActivation=' + readCsv.toCommaList(obj.biasActivation) + ENCOG.NEWLINE;
    result += '[BASIC:ACTIVATION]' + ENCOG.NEWLINE;
    for (i = 0; i < obj.activationFunctions.length; i += 1) {
        af = obj.activationFunctions[i];
        result += '\"';
        result += af.NAME;
        result += '\"' + ENCOG.NEWLINE;
    }
    return result;
};

EGFILE.load = function (str) {
    'use strict';
    var lines, currentLine, parts;

    currentLine = 0;

    lines = str.match(/^.*([\n\r]+|$)/gm);

    while (lines[currentLine].trim().length === 0) {
        currentLine += 1;
    }

    parts = lines[currentLine].trim().split(',');

    if (parts[0] !== 'encog') {
        throw new Error("Not a valid Encog EG file.");
    }

    if (parts[1] === 'BasicNetwork') {
        return EGFILE.loadBasicNetwork(str);
    } else {
        throw new Error("Encog Javascript does not support: " + parts[1]);
    }
};

EGFILE._loadNetwork = function (lines, currentLine, result) {
    var idx, line, name, value;

    while (currentLine < lines.length) {
        line = lines[currentLine].trim();

        if (line[0] == '[') {
            break;
        }

        currentLine++;
        idx = line.indexOf('=');

        if (idx == -1) {
            throw new Error("Invalid line in BasicNetwork file: " + line);
        }

        name = line.substr(0, idx).trim().toLowerCase();
        value = line.substr(idx + 1).trim();

        if (name == 'begintraining') {
            result.beginTraining = parseInt(value);
        }
        else if (name == 'connectionlimit') {
            result.connectionLimit = parseFloat(value);
        }
        else if (name == 'contexttargetoffset') {
            result.contextTargetOffset = readCsv.fromCommaListInt(value);
        }
        else if (name == 'contexttargetsize') {
            result.contextTargetSize = readCsv.fromCommaListInt(value);
        }
        else if (name == 'endtraining') {
            result.endTraining = parseInt(value);
        }
        else if (name == 'hascontext') {
            result.hasContext = (value.toLowerCase() == 'f');
        }
        else if (name == 'inputcount') {
            result.inputCount = parseInt(value);
        }
        else if (name == 'layercounts') {
            result.layerCounts = readCsv.fromCommaListInt(value);
        }
        else if (name == 'layerfeedcounts') {
            result.layerFeedCounts = readCsv.fromCommaListInt(value);
        }
        else if (name == 'layercontextcount') {
            result.layerContextCount = readCsv.fromCommaListInt(value);
        }
        else if (name == 'layerindex') {
            result.layerIndex = readCsv.fromCommaListInt(value);
        }
        else if (name == 'output') {
            result.layerOutput = readCsv.fromCommaListFloat(value);
        }
        else if (name == 'outputcount') {
            result.outputCount = parseInt(value);
        }
        else if (name == 'weightindex') {
            result.weightIndex = readCsv.fromCommaListInt(value);
        }
        else if (name == 'weights') {
            result.weights = readCsv.fromCommaListFloat(value);
        }
        else if (name == 'biasactivation') {
            result.biasActivation = readCsv.fromCommaListFloat(value);
        }
    }

    result.layerSums = [];
    arrayUtils.fillArray(result.layerSums, 0, result.layerSums, 0);

    return currentLine;
};

EGFILE._loadActivation = function (lines, currentLine, result) {
    var i, line;

    result.activationFunctions = [];

    i = 0;
    while (currentLine < lines.length) {

        line = lines[currentLine++].trim();

        if (line[0] == '[') {
            break;
        }

        line = _.trim(line, '"');

        if (line == 'ActivationLinear') {
            result.activationFunctions[i] = activationFunctions.linear.create();
        } else if (line == 'ActivationSigmoid') {
            result.activationFunctions[i] = activationFunctions.sigmoid.create();
        } else if (line == 'ActivationTANH') {
            result.activationFunctions[i] = activationFunctions.tanh.create();
        } else if (line == 'ActivationElliott') {
            result.activationFunctions[i] = activationFunctions.elliott.create();
        } else if (line == 'ActivationElliottSymmetric') {
            result.activationFunctions[i] = activationFunctions.elliottSymmetric.create();
        }else if (line == 'ActivationSoftmax') {
            result.activationFunctions[i] = activationFunctions.softmax.create();
        }

        i += 1;
    }

    return currentLine;
};

EGFILE.loadBasicNetwork = function (str) {
    var lines, currentLine, line, parts, result;

    currentLine = 0;

    lines = str.match(/^.*([\n\r]+|$)/gm);

    while (lines[currentLine].trim().length == 0) {
        currentLine++;
    }

    parts = lines[currentLine++].trim().split(',');

    if (parts[0] != 'encog') {
        throw new Error("Not a valid Encog EG file.");
    }

    if (parts[1] != 'BasicNetwork') {
        throw new Error("Not a BasicNetwork EG file.");
    }

    result = new networks.basic();

    while (currentLine < lines.length) {
        line = lines[currentLine++].trim();

        if (line == '[BASIC:NETWORK]') {
            currentLine = this._loadNetwork(lines, currentLine, result);
        } else if (line == '[BASIC:ACTIVATION]') {
            currentLine = this._loadActivation(lines, currentLine, result);
        }
    }

    return result;
};

module.exports = EGFILE;