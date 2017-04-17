var ENCOG = require('../constants');

/**
 * The math utilities for Encog.
 * @class MathUtil
 * @constructor
 */
MathUtil = function () {
    'use strict';
};

/**
 * Calculate the hyperbolic tangent.
 * Unfortunately, Javascript does not have this built in.
 * @method tanh
 * @param x The value to calculate for.
 * @return {Number} The result from the calculation.
 */
MathUtil.tanh = function (x) {
    'use strict';
    var pos, neg;

    pos = Math.exp(x);
    neg = Math.exp(-x);

    return (pos - neg) / (pos + neg);

};

/**
 * Calculate the sign of a number, return 0 for zero,
 * 1 for positive, -1 for negative.
 * @method sign
 * @param x The value to calculate for.
 * @return {Number} The result.
 */
MathUtil.sign = function (x) {
    'use strict';
    if (Math.abs(x) < ENCOG.precision) {
        return 0;
    } else if (x > 0) {
        return 1;
    } else {
        return -1;
    }
};

/**
 * Calculate the euclidean distance between a1 and a2.  Use the specified starting index and length.
 * @param a1 The first array to consider.
 * @param a2 The second array to consider.
 * @param startIndex The starting index.
 * @param len The length.
 * @method euclideanDistance
 * @return {Number}
 */
MathUtil.euclideanDistance = function (a1, a2, startIndex, len) {
    'use strict';

    var result = 0, i, diff;
    for (i = startIndex; i < (startIndex + len); i += 1) {
        diff = a1[i] - a2[i];
        result += diff * diff;
    }
    return Math.sqrt(result);
};

/**
 * Determine which multi-dimensional array element, from lst, is the nearest to a1.
 * @param a1 A single-dimension array that is searched for in lst.
 * @param lst A 2d array that contains arrays with the same length of a1.
 * @param k The number of neighbors to find.
 * @param maxDist The maximum distance to consider.
 * @param startIndex The starting index.
 * @param len The length.
 * @return {Array} The k elements from lst that were the closest to a1.
 */
MathUtil.kNearest = function (a1, lst, k, maxDist, startIndex, len) {
    'use strict';
    var result = [], tempDist = [], idx = 0, worstIdx = -1, dist, agent;

    while (idx < lst.length) {
        agent = lst[idx];
        if (a1 !== agent) {
            dist = MathUtil.euclideanDistance(a1, agent, startIndex, len);

            if (dist < maxDist) {
                if (result.length < k) {
                    result.push(agent);
                    tempDist.push(dist);
                    worstIdx = ENCOG.ArrayUtil.arrayMaxIndex(tempDist);
                } else {
                    if (dist < tempDist[worstIdx]) {
                        tempDist[worstIdx] = dist;
                        result[worstIdx] = agent;
                        worstIdx = ENCOG.ArrayUtil.arrayMaxIndex(tempDist);
                    }
                }
            }
        }

        idx += 1;
    }

    return result;
};

/**
 * Generate a random floating point number.
 * @param low The first array to consider.
 * @param high The second array to consider.
 * @method randomFloat
 * @return {Number}
 */
MathUtil.randomFloat = function (low, high) {
    'use strict';
    return (Math.random * (high - low)) + low;
};

module.exports = MathUtil;