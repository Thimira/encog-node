var _ = require('lodash');

/**
 * The Encog array utilities.
 * @class ArrayUtil
 * @constructor
 */
ArrayUtil = function () {
    'use strict';
};

/**
 * Fill an array with a specific value.
 * @method fillArray
 * @param arr The array to fill.
 * @param start The starting index.
 * @param stop The stopping index.
 * @param v The value to fill.
 */
ArrayUtil.fillArray = function (arr, start, stop, v) {
    'use strict';
    _.fill(arr, v, start, stop);
};

/**
 * Create a new floating point array.
 * @param sz The size of the array to create.
 * @method newFloatArray
 * @return {Array}
 */
ArrayUtil.newFloatArray = function (sz) {
    'use strict';
    var result;
    result = [];
    while (sz > 0) {
        result.push(0.0);
        sz -= 1;
    }
    return result;
};

/**
 * Create a new int array.
 * @param sz The size of the array to create.
 * @method newIntArray
 * @return {Array}
 */
ArrayUtil.newIntArray = function (sz) {
    'use strict';
    var result;
    result = [];
    while ((sz -= 1) > 0) {
        result.push(0);
    }
    return result;
};

/**
 * Fill a 2D array.
 * @param arr The size of the array to create.
 * @param v The value to fill the array with.
 * @method fillArray2D
 */
ArrayUtil.fillArray2D = function (arr, v) {
    'use strict';
    var i, j, row;

    for (i = 0; i < arr.length; i += 1) {
        row = arr[i];
        for (j = 0; j < row.length; j += 1) {
            row[j] = v;
        }
    }
};


/**
 * Randomize an array.
 * @param arr The array to randomize.
 * @param start The starting index in the array.
 * @param stop The stopping index in the array.
 * @param low The low-end of the random range.
 * @param high The high-end of the random range.
 * @method randomizeArray
 */
ArrayUtil.randomizeArray = function (arr, start, stop, low, high) {
    'use strict';
    var i;

    for (i = start; i < stop; i += 1) {
        arr[i] = _.random(low, high, true);
    }
};

/**
 * Randomize a 2D array.
 * @param arr The array to randomize.
 * @param low The low-end of the random range.
 * @param high The high-end of the random range.
 * @method randomizeArray2D
 */
ArrayUtil.randomizeArray2D = function (arr, low, high) {
    'use strict';
    var i, j, row;

    for (i = 0; i < arr.length; i += 1) {
        row = arr[i];
        for (j = 0; j < row.length; j += 1) {
            row[j] = _.random(low, high, true);
        }
    }
};

/**
 * Allocate an array of zeros of the specified size.
 * @method allocate1D
 * @param x The size of the array.
 */
ArrayUtil.allocate1D = function (x) {
    'use strict';
    return _.fill(new Array(x), 0);
};

/**
 * Allocate a 2D array of booleans.
 * @param rows The number of rows.
 * @param cols The number of columns.
 * @return {Array} The allocated array.
 */
ArrayUtil.allocateBoolean2D = function (rows, cols) {
    'use strict';
    var result, row, col;

    result = [
        []
    ];

    for (row = 0; row < rows; row += 1) {
        result[row] = _.fill(new Array(cols), false);
    }

    return result;
};

/**
 * Copy an array.
 * @method arrayCopy
 * @param source The source array.
 * @param sourceStart The index to start at in the source.
 * @param target The target array.
 * @param targetStart The target starting index.
 * @param count The count of values to copy.
 */
ArrayUtil.arrayCopy = function (source, sourceStart, target, targetStart, count) {
    'use strict';
    var i;

    for (i = 0; i < count; i += 1) {
        target[i + targetStart] = source[i + sourceStart];
    }
};

/**
 * Generate benchmark data.  This is a random training set.
 * @method generateBenchmarkData
 * @param rowCount The number of rows to generate.
 * @param colCount The number of columns to generate.
 * @return {Array} The resulting array.
 */
ArrayUtil.generateBenchmarkData = function (rowCount, colCount) {
    'use strict';
    var result, item, row, col;

    result = [
        []
    ];

    for (row = 0; row < rowCount; row += 1) {
        item = [];
        for (col = 0; col < colCount; col += 1) {
            item[col] = (Math.random() * 2) - 1;
        }
        result[row] = item;
    }

    return result;
};

/**
 * Calculate the mean of one dimension in the 2D array a1.
 * @method arrayMean
 * @param a1 A 2D array.
 * @param idx The second dimension in a1 to calculate the mean of.
 * @return {Number} The mean of each idx element of a1.
 */
ArrayUtil.arrayMean = function (a1, idx) {
    'use strict';
    var result, i;

    result = 0;
    for (i = 0; i < a1.length; i += 1) {
        result += a1[i][idx];
    }
    result /= a1.length;
    return result;
};

/**
 * Determine the index of the minimum value in an array.
 * @method arrayMinIndex
 * @param a1 A 1D array.
 * @return {Number} Index of the minimum value in the array.
 */
ArrayUtil.arrayMinIndex = function (a1) {
    'use strict';
    var result, resultIndex, i;

    result = 10000000000000;
    resultIndex = -1;

    for (i = 0; i < a1.length; i += 1) {
        if (a1[i] < result) {
            result = a1[i];
            resultIndex = i;
        }
    }
    return resultIndex;
};

/**
 * Determine the index of the maximum value in an array.
 * @method arrayMinIndex
 * @param a1 A 1D array.
 * @return {Number} Index of the maximum value in the array.
 */
ArrayUtil.arrayMaxIndex = function (a1) {
    'use strict';
    var result, resultIndex, i;

    result = -100000000000;
    resultIndex = -1;

    for (i = 0; i < a1.length; i += 1) {
        if (a1[i] > result) {
            result = a1[i];
            resultIndex = i;
        }
    }
    return resultIndex;
};

module.exports = ArrayUtil;