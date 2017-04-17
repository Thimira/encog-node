/**
 * Read data that is in CSV format.
 *
 * @class ReadCSV
 * @constructor
 **/
ReadCSV = function () {
    'use strict';
};

ReadCSV.prototype = {
    /**
     * Holds the regular expression for parsing.
     *
     * @property regStr
     * @type String
     * @default null
     **/
    regStr: null,

    /**
     * The input data parsed from the CSV.
     *
     * @property inputData
     * @type Array
     * @default null
     **/
    inputData: null,

    /**
     * Holds the ideal data parsed from the CSV.
     *
     * @property idealData
     * @type Array
     * @default null
     **/
    idealData: null,

    /**
     * Holds the number of columns that make up the input data.
     *
     * @property inputCount
     * @type int
     * @default null
     **/
    inputCount: 0,

    /**
     * Holds the number of columns that make up the ideal data.
     *
     * @property idealCount
     * @type int
     * @default null
     **/
    idealCount: 0,

    /**
     * Holds the regular expression for parsing
     * @property delimiter
     * @type String
     * @default ','
     **/
    delimiter: ',',

    readCSV: function (csv, theInputCount, theIdealCount) {
        var currentIndex, regex, matches, value, d;

        this.inputCount = theInputCount;
        this.idealCount = theIdealCount;

        regex = new RegExp(this.regStr, "gi");

        // allocate input and ideal arrays
        this.inputData = [
            []
        ];
        this.idealData = [
            []
        ];

        currentIndex = 0;

        while (matches = regex.exec(csv)) {
            // obtain delimiter
            d = matches[1];

            // new row
            if (d.length && (d != this.delimiter)) {
                this.inputData.push([]);
                this.idealData.push([]);
                currentIndex = 0;
            }

            // do we need to remove quotes from value?
            if (matches[2]) {
                value = matches[2].replace(
                    new RegExp("\"\"", "g"),
                    "\""
                );

            } else {
                value = matches[3];
            }

            // add value to either input or ideal
            if (currentIndex < this.inputCount) {
                this.inputData[this.inputData.length - 1].push(value);
            } else {
                this.idealData[this.idealData.length - 1].push(value);
            }
            currentIndex += 1;
        }
    }
};

ReadCSV.create = function (theDelimiter) {
    'use strict';
    var result = new ReadCSV();

    result.delimiter = (theDelimiter || ",");

    result.regStr =
        // Delimiters
        "(\\" + result.delimiter + "|\\r?\\n|\\r|^)" +
        // Quoted fields
        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
        // Standard fields
        "([^\"\\" + result.delimiter + "\\r\\n]*))";
    return result;
};

ReadCSV.fromCommaListInt = function (str) {
    'use strict';
    var result, parts, i;

    result = [];
    parts = str.split(',');

    for (i = 0; i < parts.length; i += 1) {
        result.push(parseInt(parts[i], 10));
    }


    return result;
};

ReadCSV.fromCommaListFloat = function (str) {
    'use strict';
    var result, parts, i;

    result = [];
    parts = str.split(',');

    for (i = 0; i < parts.length; i += 1) {
        result.push(parseFloat(parts[i]));
    }

    return result;
};

ReadCSV.toCommaList = function (arr) {
    'use strict';
    var result, i;

    result = '';

    for (i = 0; i < arr.length; i += 1) {
        if (i > 0) {
            result += ',';
        }
        result += arr[i];
    }

    return result;
};

module.exports = ReadCSV;