package com.example.starter;

import io.improbable.keanu.algorithms.NetworkSamples;
import io.improbable.keanu.algorithms.mcmc.MetropolisHastings;
import io.improbable.keanu.network.BayesianNetwork;
import io.improbable.keanu.vertices.bool.BooleanVertex;
import io.improbable.keanu.vertices.bool.nonprobabilistic.BooleanIfVertex;
import io.improbable.keanu.vertices.bool.nonprobabilistic.operators.binary.compare.GreaterThanOrEqualVertex;
import io.improbable.keanu.vertices.bool.nonprobabilistic.operators.binary.compare.LessThanVertex;
import io.improbable.keanu.vertices.bool.probabilistic.BernoulliVertex;
import io.improbable.keanu.vertices.dbl.DoubleVertex;
import io.improbable.keanu.vertices.dbl.nonprobabilistic.ConstantDoubleVertex;
import io.improbable.keanu.vertices.dbl.nonprobabilistic.DoubleIfVertex;
import io.improbable.keanu.vertices.dbl.probabilistic.GaussianVertex;
import io.improbable.keanu.vertices.dbl.probabilistic.UniformVertex;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.DoubleStream;
import java.util.stream.IntStream;

import static org.apache.commons.math3.util.CombinatoricsUtils.binomialCoefficient;
import static org.apache.commons.math3.util.CombinatoricsUtils.binomialCoefficientDouble;


public class Model {
    public Model(List<Integer> ships, ArrayList<Integer> hits, ArrayList<Integer> misses) {
        this.ships = ships;
        this.hits = hits;
        this.misses = misses;
    }

    List<Integer> ships;
    ArrayList<Integer> hits;
    ArrayList<Integer> misses;

    double[] run() {
        //int[] ships = {2, 3, 3, 4, 5};
        int sum_ships = ships.stream().mapToInt(Integer::intValue).sum();

        //int[] hits = {70, 71, 59, 69};
        int num_hits = hits.size();
        //int[] misses = {51, 32, 63, 45, 46, 57, 77};
        int num_misses = misses.size();

        double[] probs = new double[100];
        int[] hit_miss_array = new int[100];
        for (int h : hits) {
            hit_miss_array[h] = 1;
        }
        for (int m : misses) {
            hit_miss_array[m] = -1;
        }

        for (int s : ships) {
            for (int x = 0; x < 10; ++x) {
                for (int y = 0; y < 10; ++y) {
                    for (int d = 0; d < 2; ++d) {
                        if (s == 1 && d == 1) continue;// only one orientation for length one ships
                        int d_x, d_y;
                        if (d == 0) {
                            d_x = 1;
                            d_y = 0;
                        } else {
                            d_x = 0;
                            d_y = 1;
                        }
                        if (x + (s - 1) * d_x >= 10 || y + (s - 1) * d_y >= 10) {
                            continue;
                        }

                        int hs = 0;
                        int ms = 0;
                        for (int i = 0; i < s; ++i) {
                            int v = hit_miss_array[(y + i * d_y) * 10 + (x + i * d_x)];
                            if (v == 1) {
                                hs += 1;
                            } else if (v == -1) {
                                ms += 1;
                            }
                        }
                        if (ms > 0) {
                            continue;
                        } else {
                            int h = num_hits - hs;
                            int m = num_misses - ms;
                            // Suppose there is a ship length s, at position (x, y)
                            // Then the other ships must fit h hits and m misses
                            // If there are K configurations of other ships (ignoring hits and misses)
                            // then each configuration fits (sum_ships-s C h)*(100-(sum_ships-s) C m)
                            // sets of hits and misses.
                            // There are (100 C h+m) * (h+m C m) possible sets of hits and misses.
                            // So assuming each set of hits and misses is associated
                            // with roughly the same number of configurations of other ships, there are
                            // K*(sum_ships-s C h)*(100-(sum_ships-s) C m) / ((100 C h+m) * (h+m C m))
                            // configurations of other ships that fit the hits and misses.
                            // To get the probability of a configuration with ship s at (x, y) and the other ships
                            // fitting the hits and misses, we need to multiply by the number of configurations
                            // with a ship at (x, y), and divide by the total number of configurations of all ships.
                            // This has the effect of (roughly) just cancelling off the K term.
                            if (sum_ships-s < h || 100-(sum_ships-s) < m) {// positioning is impossible
                                continue;
                            }
                            double p = binomialCoefficientDouble(sum_ships - s, h) * binomialCoefficientDouble(100 - (sum_ships - s), m) /
                                    (binomialCoefficientDouble(100, h + m) * binomialCoefficientDouble(h + m, m));
                            for (int i = 0; i < s; ++i) {
                                probs[(y + i * d_y) * 10 + (x + i * d_x)] += p;
                            }
                        }
                    }
                }
            }
        }

        // probabilities are not conditional on the ships fitting hits/misses, so need to renormalise
        double total_p = DoubleStream.of(probs).sum();
        for (int i = 0; i < 100; ++i) {
            probs[i] *= sum_ships / total_p;
        }

        for (int y = 0; y < 10; ++y) {
            for (int x = 0; x < 10; ++x) {
                System.out.printf("%.3f ", probs[y * 10 + x]);
            }
            System.out.print("\n");
        }

        return probs;
    }

    class Ship {
        BooleanVertex isH;
        DoubleVertex x;
        DoubleVertex y;
        int length;

        Ship(int len) {
            isH = new BernoulliVertex(0.5);
            x = new UniformVertex(0, new DoubleIfVertex(isH,
                    new ConstantDoubleVertex(11.0 - len),
                    new ConstantDoubleVertex(10.0)));
            y = new UniformVertex(0, new DoubleIfVertex(isH,
                    new ConstantDoubleVertex(10.0),
                    new ConstantDoubleVertex(11.0 - len)));
            length = len;
        }
    }

    private BooleanVertex shipAtCoordHelper(ConstantDoubleVertex x, ConstantDoubleVertex y, Ship ship) {
        BooleanVertex hasShip = new GreaterThanOrEqualVertex(ship.x, x).and(
                new LessThanVertex(ship.x, x.plus(1.0))).and(
                new GreaterThanOrEqualVertex(ship.y, y)).and(
                new LessThanVertex(ship.y, y.plus(1)));
        return hasShip;
    }

    private BooleanVertex shipAtCoord(double x, double y, Ship ship) {
        BooleanVertex horizontal_region = shipAtCoordHelper(new ConstantDoubleVertex(x), new ConstantDoubleVertex(y), ship);
        for (int i = 1; i < ship.length; i++) {
            horizontal_region = horizontal_region.or(shipAtCoordHelper(new ConstantDoubleVertex(x - i), new ConstantDoubleVertex(y), ship));
        }
        BooleanVertex vertical_region = shipAtCoordHelper(new ConstantDoubleVertex(x), new ConstantDoubleVertex(y), ship);
        for (int i = 1; i < ship.length; i++) {
            vertical_region = vertical_region.or(shipAtCoordHelper(new ConstantDoubleVertex(x), new ConstantDoubleVertex(y - i), ship));
        }
        BooleanVertex hasShip = new BooleanIfVertex(ship.isH, horizontal_region, vertical_region);
        return hasShip;
    }

    private void observeGroup(BooleanVertex[] cells, int sum) {
        DoubleVertex hits = new ConstantDoubleVertex(0);
        for (int i = 0; i < cells.length; i++) {
            hits = hits.plus(new DoubleIfVertex(cells[i], new ConstantDoubleVertex(1), new ConstantDoubleVertex(0)));
        }
        GaussianVertex prob_hits = new GaussianVertex(hits, 0.1);
        prob_hits.observe(sum);
    }

    double[] runKeanu() {
        Ship[] ships = new Ship[this.ships.size()];
        for (int i=0; i<this.ships.size(); ++i) {
            ships[i] = new Ship(this.ships.get(i));
        }

        BooleanVertex[] cells = new BooleanVertex[100];
        for (int x = 0; x < 10; x++) {
            for (int y = 0; y < 10; y++) {
                BooleanVertex shipCount = shipAtCoord(x, y, ships[0]);
                for (int i = 1; i < ships.length; i++) {
                    shipCount = shipCount.or(shipAtCoord(x, y, ships[i]));
                }

                cells[y * 10 + x] = shipCount;
            }
        }

        BooleanVertex[] groupHits = new BooleanVertex[this.hits.size()];
        for (int i=0; i<this.hits.size(); ++i) {
            groupHits[i] = cells[this.hits.get(i)];
        }
        observeGroup(groupHits, groupHits.length);

        BooleanVertex[] groupMisses = new BooleanVertex[this.misses.size()];
        for (int i=0; i<this.misses.size(); ++i) {
            groupMisses[i] = cells[this.misses.get(i)];
        }
        observeGroup(groupMisses, 0);

        BayesianNetwork net = new BayesianNetwork(cells[0].getConnectedGraph());
        net.probeForNonZeroProbability(2000);
        NetworkSamples posteriorSamples = MetropolisHastings.withDefaultConfig().getPosteriorSamples(
                net,
                Arrays.asList(cells), 10000).drop(200);

        double[] p = new double[100];
        System.out.print("[ ");
        for (int c = 0; c < 100; c++) {
            p[c] = posteriorSamples.get(cells[c]).probability(val -> val.scalar());
            System.out.printf("%.3f", p[c]);
            System.out.print(", ");
            if (c % 10 == 9) {
                System.out.print("]\n[ ");
            }
        }

        return p;
    }
}
