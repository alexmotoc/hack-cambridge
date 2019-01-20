package com.example.starter;

public class BoardResponseResource {
    private final double[] probs;

    public BoardResponseResource(double[] probs) {
        this.probs = probs;
    }

    public double[] getProbs() {
        return probs;
    }
}
