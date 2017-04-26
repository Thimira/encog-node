/**
 * Simulated Annealing algorithm.
 *
 * @class Anneal
 * @constructor
 **/
ENCOG.Anneal = function () {
    'use strict';
};


ENCOG.Anneal.prototype = {
    /**
     * The name of this object.
     * @property NAME
     * @type String
     * @final
     */
    NAME : 'Anneal',

    /**
     * The current solution.
     * @property solution
     * @type Array
     */
    solution : null,

    /**
     * A function that is used to score the potential solutions. The score function
     * must accept an array of doubles and return a score.
     *
     * @property scoreSolution
     * @type Function
     * @default null
     **/
    scoreSolution : null,

    /**
     * Randomize a solution according to the specified temperature.  The higher the
     * temperature the more randomness.
     *
     * @property scoreSolution
     * @type Function
     * @default null
     **/
    randomize : null,

    /**
     * The starting temperature for each iteration.
     *
     * @property constStartTemp
     * @type number
     * @default 10.0
     **/
    constStartTemp : 10.0,

    /**
     * The stopping temperature for each iteration.
     *
     * @property constStopTemp
     * @type number
     * @default 2.0
     **/
    constStopTemp : 2.0,

    /**
     * The number of cycles to go from the starting temperature to the stopping.
     *
     * @property constCycles
     * @type number
     * @default 10.0
     **/
    constCycles : 10,


    iteration : function () {
        'use strict';

        var bestArray, temperature, bestScore, curScore, i;

        bestArray = this.solution.slice();

        temperature = this.constStartTemp;
        bestScore = this.scoreSolution(this.solution);

        for (i = 0; i < this.constCycles; i += 1) {
            this.randomize(this.solution, temperature);
            curScore = this.scoreSolution(this.solution);

            if (curScore < bestScore) {
                bestArray = this.solution.slice();
                bestScore = curScore;
            }

            this.solution = bestArray.slice();

            temperature *= Math.exp(Math.log(this.constStopTemp
                    / this.constStartTemp)
                / (this.constCycles - 1));
        }
    }
};

ENCOG.Anneal.create = function (solution) {
    'use strict';
    var result = new ENCOG.Anneal();
    result.solution = solution;
    return result;
};