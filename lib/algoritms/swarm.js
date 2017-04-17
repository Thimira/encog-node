/**
 * Swarm algorithm.
 *
 * @class Swarm
 * @constructor
 **/
ENCOG.Swarm = function () {
    'use strict';
};


ENCOG.Swarm.prototype = {
    /**
     * The name of this object.
     * @property NAME
     * @type String
     * @final
     */
    NAME : 'Swarm',

    /**
     * An array of agents.
     * @property agents
     * @type Array
     */
    agents : null,

    /**
     * A call back that is called with the neighbors of each agent.
     * Format: callbackNeighbors(currentIndex,neighbors).
     * @property NAME
     * @type function
     * @final
     */
    callbackNeighbors : null,

    /**
     * The degree to which cohesion is applied to steering the agent.
     * Cohesion is the desire to move towards groups of other agents.
     * @property constCohesion
     * @type number
     */
    constCohesion : 0.01,

    /**
     * The degree to which alignment is applied to steering the agent.
     * Alignment is the desire to keep all particles moving in the same direction.
     * @property constAlignment
     * @type number
     */
    constAlignment : 0.5,

    /**
     * The degree to which separation is applied to steering the agent.
     * Separation is the desire to not be too close to another particle.
     * @property constSeparation
     * @type number
     */
    constSeparation : 0.25,

    iteration : function () {
        'use strict';
        var i, neighbors, meanX, meanY, dx, dy, targetAngle, nearest, separation, alignment, cohesion, turnAmount;

        // loop over all particles.
        for (i = 0; i < this.agents.length; i += 1) {
            ///////////////////////////////////////////////////////////////
            // Begin implementation of three very basic laws of flocking.
            ///////////////////////////////////////////////////////////////
            targetAngle = 0;

            neighbors = ENCOG.MathUtil.kNearest(this.agents[i], this.agents, 5, Number.MAX_VALUE, 0, 2);
            nearest = ENCOG.MathUtil.kNearest(this.agents[i], this.agents, 5, 10, 0, 2);

            // 1. Separation - avoid crowding neighbors (short range repulsion)
            separation = 0;
            if (nearest.length > 0) {
                meanX = ENCOG.ArrayUtil.arrayMean(nearest, 0);
                meanY = ENCOG.ArrayUtil.arrayMean(nearest, 1);
                dx = meanX - this.agents[i][0];
                dy = meanY - this.agents[i][1];
                separation = (Math.atan2(dx, dy) * 180 / Math.PI) - this.agents[i][2];
                separation += 180;
            }

            // 2. Alignment - steer towards average heading of neighbors
            alignment = 0;

            if (neighbors.length > 0) {
                alignment = ENCOG.ArrayUtil.arrayMean(neighbors, 2) - this.agents[i][2];
            }

            if (this.callbackNeighbors !== null) {
                this.callbackNeighbors(i, neighbors);
            }

            // 3. Cohesion - steer towards average position of neighbors (long range attraction)
            cohesion = 0;

            if (neighbors.length > 0) {
                meanX = ENCOG.ArrayUtil.arrayMean(this.agents, 0);
                meanY = ENCOG.ArrayUtil.arrayMean(this.agents, 1);
                dx = meanX - this.agents[i][0];
                dy = meanY - this.agents[i][1];
                cohesion = (Math.atan2(dx, dy) * 180 / Math.PI) - this.agents[i][2];
            }

            // perform the turn
            // The degree to which each of the three laws is applied is configurable.
            // The three default ratios that I provide work well.
            turnAmount = (cohesion * this.constCohesion) + (alignment * this.constAlignment) + (separation * this.constSeparation);

            this.agents[i][2] += turnAmount;

            ///////////////////////////////////////////////////////////////
            // End implementation of three very basic laws of flocking.
            ///////////////////////////////////////////////////////////////
        }
    }
};

ENCOG.Swarm.create = function (agents) {
    'use strict';
    var result = new ENCOG.Swarm();
    result.agents = agents;
    return result;
};