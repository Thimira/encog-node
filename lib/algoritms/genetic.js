/**
 * Genetic learning algorithm.
 *
 * @class Genetic
 * @constructor
 **/
ENCOG.Genetic = function () {
    'use strict';
};


ENCOG.Genetic.prototype = {
    /**
     * The name of this object.
     * @property NAME
     * @type String
     * @final
     */
    NAME : 'Genetic',

    /**
     * The current population.
     * @property solution
     * @type Array
     */
    population : null,

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
     * A function that will mutate the specified solution.  The mutation method must
     * access an array of doubles that will be mutated.
     *
     * @property mutate
     * @type Function
     * @default null
     **/
    mutate : null,

    /**
     * Perform a crossover and return two offspring.  crossover should be called as follows:
     *
     * crossover(mother,father,child1,child2);
     *
     * @property crossover
     * @type Function
     * @default null
     **/
    crossover : null,

    /**
     * The percent of offspring that will be mutated.
     * @property constMutationPercent
     * @type number
     * @default 0.1
     **/
    constMutationPercent : 0.1,

    /**
     * The percent of the population that will mate.
     * @property constMatePercent
     * @type number
     * @default 0.24
     **/
    constMatePercent : 0.24,

    /**
     * The percent of the population that can be chosen for mating.
     * @property constMatingPopulationPercent
     * @type number
     * @default 0.5
     **/
    constMatingPopulationPercent : 0.5,

    iteration : function () {
        'use strict';

        var countToMate, offspringCount, offspringIndex, matingPopulationSize, motherID, fatherID;

        countToMate = Math.floor(this.population.length * this.constMatePercent);
        offspringCount = countToMate * 2;
        offspringIndex = this.population.length - offspringCount;
        matingPopulationSize = Math.floor(this.population.length * this.constMatingPopulationPercent);

        // mate and form the next generation

        for (motherID = 0; motherID < countToMate; motherID++) {
            fatherID = Math.floor(Math.random() * matingPopulationSize);
            this.crossover(
                this.population[motherID].data,
                this.population[fatherID].data,
                this.population[offspringIndex].data,
                this.population[offspringIndex + 1].data);

            // mutate, if needed
            if (Math.random() > this.constMutationPercent) {
                this.mutate(this.population[offspringIndex].data);
            }

            if (Math.random() > this.constMutationPercent) {
                this.mutate(this.population[offspringIndex].data);
            }

            // score the two new offspring
            this.population[offspringIndex].score = this.scoreSolution(this.population[offspringIndex].data);
            this.population[offspringIndex + 1].score = this.scoreSolution(this.population[offspringIndex + 1].data);

            // move to the next one
            offspringIndex += 2;
        }

        this.sortPopulation();
    },
    createPopulation : function (size, generate) {
        'use strict';
        var i, d, l;

        this.population = [];
        for (i = 0; i < size; i++) {
            d = generate();
            l = this.scoreSolution(d);
            this.population[i] = {
                'data' : d,
                'score' : l
            };
        }

        this.sortPopulation();
    },
    getSolution : function () {
        return this.population[0].data;
    },
    sortPopulation : function () {
        this.population.sort(function (a, b) {
            return a.score - b.score
        });
    }
};


ENCOG.Genetic.create = function () {
    return new ENCOG.Genetic();
};
